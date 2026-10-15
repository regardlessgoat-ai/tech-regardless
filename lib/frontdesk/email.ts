import type { Resend } from "resend";
import type { BusinessConfig } from "./config";
import type { Thread } from "./store";
import { renderLeadAutoReply, signatureLines, type Signature } from "@/lib/emails/lead-auto-reply";
import { firstNameOf, paragraphsOf } from "@/lib/emails/shell";

/**
 * Sends the assistant's messages and makes sure replies come back to us.
 *
 * Reply-To is a plus-addressed inbox on the receiving subdomain, e.g.
 * frontdesk+<threadId>@reply.techregardless.com, so the inbound webhook can
 * find the thread without parsing quoted text. In-Reply-To/References keep
 * the lead's mail client threading the conversation.
 */

export function replyAddressFor(config: BusinessConfig, threadId: string) {
  const base = process.env[config.env.replyAddress];
  if (!base) return null;
  const [local, domain] = base.split("@");
  if (!local || !domain) return null;
  return `${local}+${threadId}@${domain}`;
}

/** Pull the thread id back out of a plus-addressed recipient. */
export function threadIdFromAddress(config: BusinessConfig, addresses: string[]) {
  const base = process.env[config.env.replyAddress];
  if (!base) return null;
  const [local, domain] = base.toLowerCase().split("@");
  for (const raw of addresses) {
    const addr = raw.toLowerCase().replace(/^.*<([^>]+)>.*$/, "$1").trim();
    const m = addr.match(/^([^+@]+)\+([^@]+)@(.+)$/);
    if (m && m[1] === local && m[3] === domain) return m[2];
  }
  return null;
}

/** Every assistant email is signed as the operator's assistant, never as the operator. */
function signature(config: BusinessConfig): Signature {
  return {
    name: `${config.operatorName}'s assistant, ${config.name}`,
    note: `Reply to this email, it comes straight to ${config.operatorName}.`,
  };
}

export async function sendAssistantEmail(
  resend: Resend,
  config: BusinessConfig,
  thread: Thread,
  text: string,
  opts: { from: string; inReplyTo?: string }
): Promise<{ ok: true; messageId: string | null } | { ok: false; error: string }> {
  const replyTo = replyAddressFor(config, thread.id) ?? process.env[config.env.operatorEmail];
  const headers: Record<string, string> = {};
  if (opts.inReplyTo) {
    headers["In-Reply-To"] = opts.inReplyTo;
    headers["References"] = opts.inReplyTo;
  }

  const isFirst = thread.messages.length === 0;
  const subject = isFirst ? thread.subject : `Re: ${thread.subject}`;

  // The first message gets the branded template with the assistant's words as
  // the greeting; later replies stay plain text so they thread like a
  // conversation rather than a newsletter.
  const html = isFirst
    ? await renderLeadAutoReply({
        firstName: firstNameOf(thread.lead.name),
        intro: paragraphsOf(text),
        signature: signature(config),
        projectTypeLabel: thread.lead.projectType,
        budgetLabel: thread.lead.budget,
        message: thread.lead.message,
      })
    : undefined;

  try {
    const result = await resend.emails.send({
      from: opts.from,
      to: thread.lead.email,
      replyTo,
      subject,
      text: [text.trim(), "", ...signatureLines(signature(config))].join("\n"),
      ...(html ? { html } : {}),
      headers,
    });
    if (result.error) return { ok: false, error: result.error.message };
    return { ok: true, messageId: result.data?.id ?? null };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

/**
 * Strip quoted history from a reply so the model sees only the new words.
 * Conservative: cuts at the first obvious quote marker; if nothing matches
 * the whole text passes through.
 */
export function stripQuotedReply(text: string) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith(">")) break;
    if (/^On .+ wrote:$/.test(t)) break;
    if (/^-{2,}\s*Original Message\s*-{2,}$/i.test(t)) break;
    if (/^From: .+$/.test(t) && out.length > 0) break;
    out.push(line);
  }
  return out.join("\n").trim();
}
