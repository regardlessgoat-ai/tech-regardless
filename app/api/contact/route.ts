import { NextResponse } from "next/server";
import { z } from "zod";
import { sendTelegramMessage, formatContactNotification } from "@/lib/telegram";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
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
  message: z.string().min(10),
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
  const subject = `New project inquiry — ${data.name}${data.company ? ` (${data.company})` : ""}`;
  const text = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.company ? `Company: ${data.company}` : null,
    `Project type: ${labels.projectType[data.projectType]}`,
    `Budget: ${labels.budget[data.budget]}`,
    "",
    "Message:",
    data.message,
  ]
    .filter(Boolean)
    .join("\n");

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  // Wire up Resend when env vars are set. Without them, we log and 200 so
  // the form still works in local dev.
  // 1. `pnpm add resend` (already in package.json)
  // 2. Verify your sending domain at https://resend.com/domains
  // 3. Set RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL in .env.local
  if (apiKey && to && from) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      const result = await resend.emails.send({
        from,
        to,
        replyTo: data.email,
        subject,
        text,
      });
      if (result.error) {
        return NextResponse.json(
          { error: result.error.message || "Resend rejected the message." },
          { status: 502 }
        );
      }
    } catch (err) {
      console.error("[contact] Resend error", err);
      return NextResponse.json(
        { error: "Couldn't deliver — try emailing me directly." },
        { status: 502 }
      );
    }
  } else {
    console.log("[contact] (dev) inquiry received — wire up Resend to send email:");
    console.log(text);
  }

  await sendTelegramMessage(
    formatContactNotification({
      name: data.name,
      email: data.email,
      company: data.company,
      projectTypeLabel: labels.projectType[data.projectType],
      budgetLabel: labels.budget[data.budget],
      message: data.message,
    })
  );

  return NextResponse.json({ ok: true });
}
