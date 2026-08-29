import { NextResponse } from "next/server";
import { z } from "zod";
import { sendTelegramMessage, formatContactNotification } from "@/lib/telegram";
import { SITE } from "@/lib/utils";

// Hard caps on every field. These are not UX constraints — the browser already
// validates shape before submitting. They exist because this endpoint is public
// and a scripted POST must not be able to stuff megabytes into an email body, a
// Telegram message, or a log line.
const MAX = {
  name: 120,
  email: 254, // RFC 5321 practical maximum
  company: 160,
  message: 5000,
  utm: 120,
  // Values between `utm` and this ceiling are TRUNCATED, not rejected. Only a
  // payload above it is refused outright — at that size it is a script, not a
  // campaign tag.
  utmHardCeiling: 2000,
} as const;

// UTM values are attacker-controlled text that ends up in an email body, a
// Telegram message and a log line. Keep the characters real campaigns use and
// drop everything else — newlines especially, which could forge a log entry or
// inject a mail header.
//
// Length is TRUNCATED here, not rejected. Rejecting would fail the entire
// submission over an optional tracking parameter — discarding a real sales lead
// to protect an analytics field, which is exactly the wrong way round. The lead
// is the asset; the tag is a nice-to-have. (zod runs .max() before .transform(),
// so capping with .max(MAX.utm) would have 422'd the lead and never reached the
// slice below.)
const utmField = z
  .string()
  .max(MAX.utmHardCeiling)
  .transform((v) => v.trim().replace(/[^\w.\-+% ]/g, "").slice(0, MAX.utm))
  .optional();

const schema = z.object({
  name: z.string().trim().min(2).max(MAX.name),
  email: z.string().trim().email().max(MAX.email),
  company: z.string().trim().max(MAX.company).optional(),
  projectType: z.enum([
    "new-website",
    "redesign",
    "automation",
    "ongoing-support",
    "exploring",
  ]),
  budget: z.enum([
    "under-500",
    "under-1k",
    "under-2k",
    "2k-5k",
    "5k-10k",
    "10k-plus",
  ]),
  message: z.string().trim().min(10).max(MAX.message),
  utmSource: utmField,
  utmMedium: utmField,
  utmCampaign: utmField,
});

const labels = {
  projectType: {
    "new-website": "New website",
    redesign: "Redesign",
    automation: "Automation",
    "ongoing-support": "Ongoing support",
    exploring: "Just exploring",
  },
  budget: {
    "under-500": "Under $500",
    "under-1k": "Under $1k",
    "under-2k": "Under $2k",
    "2k-5k": "$2k – $5k",
    "5k-10k": "$5k – $10k",
    "10k-plus": "$10k+",
  },
} as const;

type LeadRecord = {
  receivedAt: string;
  name: string;
  email: string;
  company: string | null;
  projectType: string;
  projectTypeLabel: string;
  budget: string;
  budgetLabel: string;
  message: string;
  utm: { source: string; medium: string; campaign: string };
};

// An untagged visitor is still attribution data — "direct" is a real answer.
// Omitting the field would make an untagged lead indistinguishable from a bug
// in the capture code, which is exactly the question the operator will be
// asking once the cold-email campaigns are running.
function utmOrDirect(value: string | undefined) {
  const v = (value ?? "").trim();
  return v.length > 0 ? v : "direct";
}

// ---------------------------------------------------------------------------
// Recovery net — NOT a database.
//
// Be honest about what this is. It is a greppable copy of the lead written to
// stdout. Vercel retains runtime logs for a limited window (hours to days on
// Hobby), there is no query interface, no retention guarantee, no alerting, and
// nobody is watching it. If every send fails, the lead is recoverable only by a
// human searching the logs for the marker below, and only while those logs
// still exist.
//
// It is worth having anyway: it turns a Resend outage from "that lead is gone
// forever" into "copy it out of the log". When there is revenue to justify it,
// this should become a real store (Postgres/KV) with an alert attached.
// ---------------------------------------------------------------------------
function logUnsentLead(
  record: LeadRecord,
  reason: string,
  extra: Record<string, unknown> = {}
) {
  console.error(
    `[contact] UNSENT LEAD ${JSON.stringify({ reason, ...extra, lead: record })}`
  );
}

// ---------------------------------------------------------------------------
// Success breadcrumb — deliberately non-identifying.
//
// This site sells "privacy-friendly analytics". Dumping a stranger's name,
// email address and message into a log on every successful submission would
// contradict that, so the happy path logs only what is needed to answer
// operational questions: did submissions work, and which campaign produced
// them. Field *lengths* prove the data arrived intact without reproducing it.
// projectType and budget are included because they are fixed enums (5 and 6
// possible values) — funnel data, not personal data.
//
// The full payload is logged ONLY on failure paths, where the privacy cost buys
// back a lead that would otherwise be lost.
// ---------------------------------------------------------------------------
function breadcrumb(record: LeadRecord, extra: Record<string, unknown> = {}) {
  return JSON.stringify({
    receivedAt: record.receivedAt,
    projectType: record.projectType,
    budget: record.budget,
    utm: record.utm,
    present: {
      name: true,
      email: true,
      company: Boolean(record.company),
      message: true,
    },
    lengths: {
      name: record.name.length,
      email: record.email.length,
      company: record.company ? record.company.length : 0,
      message: record.message.length,
    },
    ...extra,
  });
}

// The confirmation the submitter receives. Plain text on purpose: it delivers
// better than HTML and reads like a person wrote it, which is the register the
// rest of the site uses. It states up front that it is automatic — pretending a
// human typed it in four seconds is the fastest way to lose trust with someone
// who found this site through a cold email.
function autoReplyBody(record: LeadRecord) {
  const firstName = record.name.split(/\s+/)[0] || record.name;
  return [
    `Hi ${firstName},`,
    "",
    "Your message reached me. This confirmation is automatic — it fires the",
    "moment the form submits, so you're not left wondering whether it went",
    "through. The actual reply is written by a human, and that's me.",
    "",
    "Here's what came through:",
    "",
    `  Project type   ${record.projectTypeLabel}`,
    `  Budget         ${record.budgetLabel}`,
    "",
    "I respond within 24 hours, usually faster. If you left something out,",
    "just reply to this email — it comes straight to my inbox.",
    "",
    `— ${SITE.name}`,
    SITE.url,
  ].join("\n");
}

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid form submission", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // Assemble the complete lead BEFORE anything is sent. Everything downstream —
  // both emails, the Telegram ping, every log line — reads from this one object,
  // so the recovery log can never disagree with what was actually sent.
  const record: LeadRecord = {
    receivedAt: new Date().toISOString(),
    name: data.name,
    email: data.email,
    company: data.company || null,
    projectType: data.projectType,
    projectTypeLabel: labels.projectType[data.projectType],
    budget: data.budget,
    budgetLabel: labels.budget[data.budget],
    message: data.message,
    utm: {
      source: utmOrDirect(data.utmSource),
      medium: utmOrDirect(data.utmMedium),
      campaign: utmOrDirect(data.utmCampaign),
    },
  };

  // Emitted before the first send is attempted. If this function is killed
  // mid-send (timeout, OOM — nothing a catch block can see), this line is still
  // proof that a real submission existed at this timestamp from this campaign,
  // which is where a manual recovery starts. Non-identifying by design; the full
  // payload follows on any failure path below.
  console.log(`[contact] LEAD RECEIVED ${breadcrumb(record)}`);

  const subject = `New project inquiry — ${record.name}${record.company ? ` (${record.company})` : ""}`;
  const text = [
    `Name: ${record.name}`,
    `Email: ${record.email}`,
    record.company ? `Company: ${record.company}` : null,
    `Project type: ${record.projectTypeLabel}`,
    `Budget: ${record.budgetLabel}`,
    "",
    `utm_source: ${record.utm.source}`,
    `utm_medium: ${record.utm.medium}`,
    `utm_campaign: ${record.utm.campaign}`,
    "",
    "Message:",
    record.message,
  ]
    .filter(Boolean)
    .join("\n");

  // Telegram goes first, on purpose. It is a different provider on a different
  // network path, so it is the channel most likely to still be up when Resend
  // is not — pinging it before the email means an email failure still puts the
  // lead in front of a human within seconds. It never throws and never blocks
  // the response.
  const telegram = await sendTelegramMessage(
    formatContactNotification({
      name: record.name,
      email: record.email,
      company: record.company || undefined,
      projectTypeLabel: record.projectTypeLabel,
      budgetLabel: record.budgetLabel,
      message: record.message,
      utm: record.utm,
    })
  );
  const telegramStatus = telegram.ok
    ? "sent"
    : telegram.skipped
      ? "skipped"
      : "failed";

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  // Optional. Lets the confirmation come from a friendlier address than the
  // internal notification. Falls back to the notification sender.
  const autoReplyFrom = process.env.CONTACT_AUTOREPLY_FROM_EMAIL || from;

  // Resend setup, if you are wiring this up fresh:
  //   1. Verify your sending domain at https://resend.com/domains
  //   2. Set RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL in .env.local
  if (!apiKey || !to || !from || !autoReplyFrom) {
    // Nothing was emailed to anyone. Locally that is expected and the form
    // should still work, so we log the whole lead and return success.
    //
    // In production it means the env vars are missing on the deployment, the
    // operator received no email, and telling the visitor "got it, talk soon"
    // would be a lie that costs a real lead. Fail loudly instead.
    logUnsentLead(record, "resend-not-configured", { telegram: telegramStatus });
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Couldn't deliver — try emailing me directly." },
        { status: 502 }
      );
    }
    console.log(
      "[contact] (dev) Resend not configured — returning success locally."
    );
    return NextResponse.json({ ok: true });
  }

  let resend: import("resend").Resend | null = null;
  try {
    const { Resend } = await import("resend");
    resend = new Resend(apiKey);
  } catch (err) {
    logUnsentLead(record, "resend-init-failed", {
      telegram: telegramStatus,
      error: String(err),
    });
  }
  if (!resend) {
    return NextResponse.json(
      { error: "Couldn't deliver — try emailing me directly." },
      { status: 502 }
    );
  }

  // ── 1. Notification to the operator. This one is load-bearing. ────────────
  // If this fails the operator has no lead, so the visitor must not be told it
  // worked — they would walk away believing someone is about to call them.
  try {
    const result = await resend.emails.send({
      from,
      to,
      replyTo: record.email,
      subject,
      text,
    });
    if (result.error) {
      logUnsentLead(record, "resend-rejected-notification", {
        telegram: telegramStatus,
        error: result.error.message,
      });
      return NextResponse.json(
        { error: result.error.message || "Resend rejected the message." },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("[contact] Resend error", err);
    logUnsentLead(record, "resend-threw-on-notification", {
      telegram: telegramStatus,
      error: String(err),
    });
    return NextResponse.json(
      { error: "Couldn't deliver — try emailing me directly." },
      { status: 502 }
    );
  }

  // ── 2. Confirmation to the submitter. Best effort, never fatal. ───────────
  // The operator already has the lead by this point, so a bounced confirmation
  // is a courtesy failure, not a submission failure. Returning an error here
  // would make the visitor submit the form again for no reason and would put a
  // duplicate in the inbox. Log it and carry on.
  let autoReply: "sent" | "failed" = "sent";
  try {
    const result = await resend.emails.send({
      from: autoReplyFrom,
      to: record.email,
      // Replies land on the operator, not in a no-reply void. The body promises
      // this works, so it has to.
      replyTo: to,
      subject: `Got it, ${record.name.split(/\s+/)[0] || record.name}. Talk soon.`,
      text: autoReplyBody(record),
    });
    if (result.error) {
      throw new Error(result.error.message || "Resend rejected the auto-reply.");
    }
  } catch (err) {
    autoReply = "failed";
    // A failure path, so the full record is fair game under the privacy rule
    // above — and the address is the only way to send the confirmation by hand.
    // The lead itself is safe in the operator's inbox; this is not UNSENT LEAD.
    console.error(
      `[contact] AUTOREPLY FAILED ${JSON.stringify({
        reason: String(err),
        lead: record,
      })}`
    );
  }

  console.log(
    `[contact] LEAD DELIVERED ${breadcrumb(record, {
      telegram: telegramStatus,
      autoReply,
    })}`
  );

  return NextResponse.json({ ok: true });
}
