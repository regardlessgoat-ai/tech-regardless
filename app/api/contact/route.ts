import { NextResponse } from "next/server";
import { z } from "zod";
import {
  PROJECT_TYPES,
  PROJECT_TYPE_VALUES,
  BUDGETS,
  BUDGET_VALUES,
  RESEARCH_QUESTIONS,
  researchSchema,
  describeResearch,
  type ResearchAnswers,
} from "@/lib/contact-questions";
import { sendSms, formatLeadSms } from "@/lib/sms";
import { techRegardless } from "@/lib/frontdesk/config";
import { nextMessage } from "@/lib/frontdesk/brain";
import { createThread, saveThread, isStoreConfigured } from "@/lib/frontdesk/store";
import { sendAssistantEmail } from "@/lib/frontdesk/email";
import { SITE } from "@/lib/utils";
import { renderOperatorNotification, operatorSubject } from "@/lib/emails/operator-notification";
import { renderLeadAutoReply, STATIC_GREETING, SERVICE_LINES } from "@/lib/emails/lead-auto-reply";
import { firstNameOf } from "@/lib/emails/shell";

// The front desk's first message is a model call; give it room.
export const maxDuration = 60;

// Hard caps on every field. These are not UX constraints — the browser already
// validates shape before submitting. They exist because this endpoint is public
// and a scripted POST must not be able to stuff megabytes into an email body, a
// Telegram message, or a log line.
const MAX = {
  name: 120,
  email: 254, // RFC 5321 practical maximum
  company: 160,
  phone: 40,
  goal: 300,
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
  company: z.string().trim().min(2).max(MAX.company),
  phone: z
    .string()
    .trim()
    .max(MAX.phone)
    .transform((v) => v.replace(/[^\d+]/g, ""))
    .refine((v) => v.replace(/\D/g, "").length >= 10),
  goal: z.string().trim().min(3).max(MAX.goal),
  projectType: z.enum(PROJECT_TYPE_VALUES),
  budget: z.enum(BUDGET_VALUES),
  message: z.string().trim().min(10).max(MAX.message),
  research: researchSchema,
  utmSource: utmField,
  utmMedium: utmField,
  utmCampaign: utmField,
});

const labels = {
  projectType: Object.fromEntries(PROJECT_TYPES.map((p) => [p.value, p.label])) as Record<
    (typeof PROJECT_TYPES)[number]["value"],
    string
  >,
  budget: Object.fromEntries(BUDGETS.map((b) => [b.value, b.label])) as Record<
    (typeof BUDGETS)[number]["value"],
    string
  >,
} as const;

type LeadRecord = {
  receivedAt: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  goal: string;
  research: ResearchAnswers;
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
    research: record.research,
    present: {
      name: true,
      email: true,
      company: Boolean(record.company),
      phone: Boolean(record.phone),
      goal: true,
      message: true,
    },
    lengths: {
      name: record.name.length,
      email: record.email.length,
      company: record.company ? record.company.length : 0,
      goal: record.goal.length,
      message: record.message.length,
    },
    ...extra,
  });
}

// The confirmation the submitter receives: a branded HTML part (lib/emails)
// plus this plain-text part for clients that do not render HTML. It states up
// front that it is automatic — pretending a human typed it in four seconds is
// the fastest way to lose trust with someone who found this site through a
// cold email. No hard wraps: the client decides where lines break.
function autoReplyBody(record: LeadRecord) {
  return [
    `Hi ${firstNameOf(record.name)},`,
    "",
    ...STATIC_GREETING.flatMap((p) => [p, ""]),
    "What we do:",
    ...SERVICE_LINES.map((s) => `- ${s.title}: ${s.description}`),
    "",
    "What came through:",
    `${record.projectTypeLabel} · ${record.budgetLabel}`,
    record.message,
    "",
    `Recent work: ${SITE.url}/work`,
    "",
    `— ${SITE.name}`,
    `${SITE.email} · Kissimmee, FL · ${SITE.url}/privacy`,
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
    phone: data.phone || null,
    goal: data.goal,
    research: data.research,
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

  const subject = operatorSubject(record);
  const text = [
    `Name: ${record.name}`,
    `Email: ${record.email}`,
    record.company ? `Business: ${record.company}` : null,
    record.phone ? `Phone: ${record.phone}` : null,
    `Project type: ${record.projectTypeLabel}`,
    `Budget: ${record.budgetLabel}`,
    `Win looks like: ${record.goal}`,
    `Received: ${new Date(record.receivedAt).toLocaleString("en-US", { timeZone: "America/New_York" })} ET`,
    "",
    "Message:",
    record.message,
    "",
    "Five quick questions:",
    ...describeResearch(record.research).map((line) => `  ${line}`),
    "",
    `utm_source ${record.utm.source} · utm_medium ${record.utm.medium} · utm_campaign ${record.utm.campaign}`,
  ]
    .filter(Boolean)
    .join("\n");
  const html = await renderOperatorNotification({
    ...record,
    research: RESEARCH_QUESTIONS.map((q) => [q.question, q.options[record.research[q.id]]] as const),
  });

  // The text to the operator goes first, on purpose. Twilio is a different
  // provider on a different network path, so it is the channel most likely to
  // still be up when Resend is not — sending it before the email means an email
  // failure still puts the lead in front of a human within seconds. It never
  // throws and never blocks the response.
  const sms = await sendSms(
    process.env[techRegardless.env.operatorPhone],
    formatLeadSms({
      name: record.name,
      company: record.company,
      projectTypeLabel: record.projectTypeLabel,
      budgetLabel: record.budgetLabel,
      message: record.message,
      source: record.utm.source,
    })
  );
  const smsStatus = sms.ok ? "sent" : sms.skipped ? "skipped" : "failed";

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
    logUnsentLead(record, "resend-not-configured", { sms: smsStatus });
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
      sms: smsStatus,
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
      html,
    });
    if (result.error) {
      logUnsentLead(record, "resend-rejected-notification", {
        sms: smsStatus,
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
      sms: smsStatus,
      error: String(err),
    });
    return NextResponse.json(
      { error: "Couldn't deliver — try emailing me directly." },
      { status: 502 }
    );
  }

  // ── 2. First contact from the front desk. Best effort, never fatal. ──────
  // The operator already has the lead by this point, so anything that fails
  // from here on is a courtesy failure, not a submission failure. Returning
  // an error would make the visitor submit the form again for no reason.
  //
  // Preferred: the assistant writes a reply that reacts to what they said and
  // asks the questions Ali needs before a call. Fallback: the plain
  // confirmation below, which promises nothing the AI would have.
  let firstContact: "ai" | "static" | "failed" = "failed";
  let threadId: string | null = null;

  const thread = await createThread({
    businessId: techRegardless.id,
    lead: {
      name: record.name,
      email: record.email,
      phone: record.phone,
      company: record.company,
      projectType: record.projectTypeLabel,
      budget: record.budgetLabel,
      goal: record.goal,
      research: describeResearch(record.research),
      message: record.message,
    },
    subject: `Your message to ${SITE.name}`,
    messages: [],
  });
  threadId = thread.id;

  const brain = await nextMessage(techRegardless, thread);
  if (brain.ok && brain.output.reply.trim()) {
    const sent = await sendAssistantEmail(resend, techRegardless, thread, brain.output.reply, {
      from: autoReplyFrom,
    });
    if (sent.ok) {
      firstContact = "ai";
      thread.messages.push({
        role: "assistant",
        text: brain.output.reply.trim(),
        at: new Date().toISOString(),
        messageId: sent.messageId ?? undefined,
      });
      if (brain.output.handoff) {
        thread.status = "handed_off";
        thread.handoffReason = brain.output.handoff_reason || "one-shot";
        thread.summary = brain.output.lead_summary;
      }
      await saveThread(thread);
    } else {
      console.error(`[contact] AI FIRST CONTACT SEND FAILED ${sent.error}`);
    }
  } else if (!brain.ok) {
    console.warn(`[contact] front desk unavailable (${brain.reason}) — static confirmation`, brain.detail ?? "");
  }

  if (firstContact !== "ai") {
    try {
      const result = await resend.emails.send({
        from: autoReplyFrom,
        to: record.email,
        // Replies land on the operator, not in a no-reply void. The body
        // promises this works, so it has to.
        replyTo: to,
        subject: `Got it, ${firstNameOf(record.name)}. Talk soon.`,
        text: autoReplyBody(record),
        html: await renderLeadAutoReply({
          firstName: firstNameOf(record.name),
          greeting: STATIC_GREETING,
          signature: [`— ${SITE.name}`],
          projectTypeLabel: record.projectTypeLabel,
          budgetLabel: record.budgetLabel,
          message: record.message,
        }),
      });
      if (result.error) {
        throw new Error(result.error.message || "Resend rejected the auto-reply.");
      }
      firstContact = "static";
    } catch (err) {
      // A failure path, so the full record is fair game under the privacy
      // rule above — and the address is the only way to send the confirmation
      // by hand. The lead itself is safe in the operator's inbox.
      console.error(
        `[contact] AUTOREPLY FAILED ${JSON.stringify({
          reason: String(err),
          lead: record,
        })}`
      );
    }
  }

  console.log(
    `[contact] LEAD DELIVERED ${breadcrumb(record, {
      sms: smsStatus,
      firstContact,
      threadId,
      threadStored: isStoreConfigured(),
    })}`
  );

  return NextResponse.json({ ok: true });
}
