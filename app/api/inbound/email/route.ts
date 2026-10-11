import { NextResponse } from "next/server";
import { Resend } from "resend";
import { techRegardless } from "@/lib/frontdesk/config";
import { nextMessage } from "@/lib/frontdesk/brain";
import {
  findThreadByEmail,
  getThread,
  saveThread,
  type Thread,
} from "@/lib/frontdesk/store";
import {
  sendAssistantEmail,
  stripQuotedReply,
  threadIdFromAddress,
} from "@/lib/frontdesk/email";
import { sendSms } from "@/lib/sms";

// A model call can take longer than the 10s default.
export const maxDuration = 60;
export const runtime = "nodejs";

/**
 * Resend "email.received" webhook. A lead replied to one of the assistant's
 * emails; decide what happens next.
 *
 * Resend setup:
 *   1. Receiving domain: add Resend's MX record on a SUBDOMAIN (reply.<domain>),
 *      never the root — Google Workspace owns the root's MX.
 *   2. Webhook: <site>/api/inbound/email, event "email.received".
 *   3. Env: RESEND_WEBHOOK_SECRET (whsec_...), FRONTDESK_REPLY_ADDRESS
 *      (frontdesk@reply.<domain>).
 *
 * Every verified event returns 200, even when we choose to do nothing —
 * Resend retries non-2xx, and retrying "ignored" is noise.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  const apiKey = process.env.RESEND_API_KEY;
  if (!secret || !apiKey) {
    console.error("[inbound] RESEND_WEBHOOK_SECRET or RESEND_API_KEY missing");
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  const resend = new Resend(apiKey);
  let event: ReturnType<typeof resend.webhooks.verify>;
  try {
    event = resend.webhooks.verify({
      payload: raw,
      headers: {
        id: req.headers.get("svix-id") ?? "",
        timestamp: req.headers.get("svix-timestamp") ?? "",
        signature: req.headers.get("svix-signature") ?? "",
      },
      webhookSecret: secret,
    });
  } catch (err) {
    console.warn("[inbound] signature verification failed", String(err));
    return NextResponse.json({ error: "bad signature" }, { status: 400 });
  }

  if (event.type !== "email.received") {
    return NextResponse.json({ ok: true, ignored: event.type });
  }

  const data = event.data;
  const config = techRegardless; // one business today; route by received_for domain when there are two
  const operatorPhone = process.env[config.env.operatorPhone];
  const fromAddress = data.from.replace(/^.*<([^>]+)>.*$/, "$1").trim().toLowerCase();

  // Find the thread: plus-address first, sender lookup second.
  const threadId = threadIdFromAddress(config, [...data.to, ...data.received_for]);
  const thread: Thread | null = threadId
    ? await getThread(threadId)
    : await findThreadByEmail(config.id, fromAddress);

  if (!thread) {
    console.warn(`[inbound] no thread for ${data.email_id} (plus-id: ${threadId ?? "none"})`);
    await sendSms(
      operatorPhone,
      `Front desk: a reply came in from ${fromAddress} with no open thread ("${data.subject.slice(0, 60)}"). Check the Resend inbox.`
    );
    return NextResponse.json({ ok: true, ignored: "no-thread" });
  }

  // Resend retries; a lead's mail client can double-send. Same message, once.
  if (thread.messages.some((m) => m.messageId === data.message_id)) {
    return NextResponse.json({ ok: true, ignored: "duplicate" });
  }

  // The event is metadata only. The body is a second call.
  const full = await resend.emails.receiving.get(data.email_id);
  if (full.error || !full.data) {
    console.error("[inbound] could not fetch body", full.error?.message);
    // Not our bug to retry forever; tell the human and stop.
    await sendSms(
      operatorPhone,
      `Front desk: ${thread.lead.name} replied but the message could not be read. Check the inbox.`
    );
    return NextResponse.json({ ok: true, ignored: "no-body" });
  }
  const bodyText =
    full.data.text ??
    (full.data.html ? full.data.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ") : "");
  const leadText = stripQuotedReply(bodyText) || bodyText.trim();

  thread.messages.push({
    role: "lead",
    text: leadText,
    at: new Date().toISOString(),
    messageId: data.message_id,
  });

  // Already with a human: record it, nudge the human, do not talk.
  if (thread.status !== "active") {
    await saveThread(thread);
    await sendSms(
      operatorPhone,
      `${thread.lead.name} replied again (thread is yours): "${leadText.replace(/\s+/g, " ").slice(0, 140)}"`
    );
    return NextResponse.json({ ok: true, handedOff: true });
  }

  const brain = await nextMessage(config, thread);
  const from = process.env.CONTACT_AUTOREPLY_FROM_EMAIL || process.env.CONTACT_FROM_EMAIL;

  if (!brain.ok || !from) {
    thread.status = "handed_off";
    thread.handoffReason = brain.ok ? "no sender configured" : `ai ${brain.reason}`;
    await saveThread(thread);
    console.error(`[inbound] handing off without reply: ${thread.handoffReason}`, brain.ok ? "" : brain.detail);
    await sendSms(
      operatorPhone,
      `${thread.lead.name} replied and the front desk could not answer (${thread.handoffReason}). It's yours: "${leadText.replace(/\s+/g, " ").slice(0, 120)}"`
    );
    return NextResponse.json({ ok: true, handedOff: true });
  }

  const { output } = brain;

  if (output.reply.trim()) {
    const sent = await sendAssistantEmail(resend, config, thread, output.reply, {
      from,
      inReplyTo: data.message_id,
    });
    if (sent.ok) {
      thread.messages.push({
        role: "assistant",
        text: output.reply.trim(),
        at: new Date().toISOString(),
        messageId: sent.messageId ?? undefined,
      });
    } else {
      console.error("[inbound] reply send failed", sent.error);
      output.handoff = true;
      output.handoff_reason = `send failed: ${sent.error}`;
    }
  }

  if (output.handoff) {
    thread.status = "handed_off";
    thread.handoffReason = output.handoff_reason || "qualified";
    thread.summary = output.lead_summary;
    await sendSms(
      operatorPhone,
      `Ready for you — ${thread.lead.name}${thread.lead.company ? ` (${thread.lead.company})` : ""}: ${output.lead_summary}`
    );
  }

  await saveThread(thread);
  console.log(
    `[inbound] ${thread.id} turn ${thread.assistantTurns} status=${thread.status} tokens=${brain.usage.input}/${brain.usage.output}`
  );
  return NextResponse.json({ ok: true, status: thread.status });
}
