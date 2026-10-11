/**
 * Operator notifications over SMS (Twilio REST, no SDK — it is one POST).
 *
 * Never throws and never blocks the caller's success path. A missing config
 * returns { skipped: true } so local dev and a half-configured deploy both
 * keep working; the email path is still the load-bearing one.
 *
 * Env: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, and the
 * destination (OPERATOR_PHONE for tech.regardless). E.164 format: +14075551234.
 */

const MAX_SMS_CHARS = 600; // ~4 segments; anything longer is an email, not a text

export type SmsResult = { ok: boolean; skipped: boolean; error?: string };

export async function sendSms(to: string | undefined, body: string): Promise<SmsResult> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;

  if (!sid || !token || !from || !to) {
    console.log("[sms] skipped — Twilio or destination not configured");
    return { ok: false, skipped: true };
  }

  const text = body.length > MAX_SMS_CHARS ? `${body.slice(0, MAX_SMS_CHARS - 1)}…` : body;

  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ To: to, From: from, Body: text }),
      }
    );
    if (!res.ok) {
      const detail = await res.text();
      console.error(`[sms] ${res.status} ${detail.slice(0, 300)}`);
      return { ok: false, skipped: false, error: `twilio ${res.status}` };
    }
    return { ok: true, skipped: false };
  } catch (err) {
    console.error("[sms] send failed", err);
    return { ok: false, skipped: false, error: String(err) };
  }
}

/** The text the operator gets the moment a lead submits. */
export function formatLeadSms(input: {
  name: string;
  company: string | null;
  projectTypeLabel: string;
  budgetLabel: string;
  message: string;
  source: string;
}) {
  const who = input.company ? `${input.name} (${input.company})` : input.name;
  const snippet = input.message.replace(/\s+/g, " ").slice(0, 160);
  return [
    `New lead: ${who}`,
    `${input.projectTypeLabel} · ${input.budgetLabel} · via ${input.source}`,
    `"${snippet}${input.message.length > 160 ? "…" : ""}"`,
    "Front desk is emailing them now.",
  ].join("\n");
}
