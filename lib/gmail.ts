import { randomBytes } from "node:crypto";

/**
 * Sends one email from ali@techregardless.com through the Gmail API, so the
 * customer auto-reply comes from the real Workspace mailbox instead of a new
 * sending domain. Plain fetch, no googleapis package.
 *
 * Auth is an OAuth refresh token for ali@ with the gmail.send scope only
 * (scripts/gmail-oauth.mjs creates it). All three values live in Vercel env:
 * GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN. Missing any of
 * them means Gmail is off and the caller falls back to Resend.
 */

export interface GmailMessage {
  /** e.g. `Ali <ali@techregardless.com>`. Must be the authorised mailbox. */
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
}

export type GmailResult = { ok: true; id: string } | { ok: false; error: string };

const TIMEOUT_MS = 8000;

function credentials() {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;
  return { clientId, clientSecret, refreshToken };
}

export function isGmailConfigured() {
  return credentials() !== null;
}

// Access tokens last an hour; a warm function instance reuses one.
let cached: { token: string; expiresAt: number } | null = null;

async function accessToken(): Promise<string> {
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token;
  const c = credentials();
  if (!c) throw new Error("Gmail is not configured");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: c.clientId,
      client_secret: c.clientSecret,
      refresh_token: c.refreshToken,
      grant_type: "refresh_token",
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const data = (await res.json().catch(() => ({}))) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
  };
  if (!res.ok || !data.access_token) {
    // Google's error code only ("invalid_grant" etc.), never the response body.
    throw new Error(`token refresh failed: ${res.status} ${data.error ?? ""}`.trim());
  }
  cached = { token: data.access_token, expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000 };
  return data.access_token;
}

/** Refuse anything that could smuggle an extra header into the message. */
function headerValue(v: string): string {
  if (/[\r\n]/.test(v)) throw new Error("header value contains a line break");
  return v;
}

/** RFC 2047, so names and subjects with accents survive. */
function encodeWord(v: string): string {
  return /^[\x20-\x7e]*$/.test(v) ? v : `=?UTF-8?B?${Buffer.from(v, "utf8").toString("base64")}?=`;
}

function base64Lines(v: string): string {
  return (Buffer.from(v, "utf8").toString("base64").match(/.{1,76}/g) ?? []).join("\r\n");
}

/** The raw RFC 5322 message: multipart/alternative, text first, then HTML. */
export function buildMime(m: GmailMessage): string {
  const boundary = `b_${randomBytes(12).toString("hex")}`;
  const headers = [
    `From: ${headerValue(m.from)}`,
    `To: ${headerValue(m.to)}`,
    ...(m.replyTo ? [`Reply-To: ${headerValue(m.replyTo)}`] : []),
    `Subject: ${encodeWord(headerValue(m.subject))}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
  ];
  const part = (type: string, body: string) =>
    [
      `--${boundary}`,
      `Content-Type: ${type}; charset=UTF-8`,
      "Content-Transfer-Encoding: base64",
      "",
      base64Lines(body),
    ].join("\r\n");
  return [...headers, "", part("text/plain", m.text), part("text/html", m.html), `--${boundary}--`, ""].join(
    "\r\n"
  );
}

export async function sendGmail(m: GmailMessage): Promise<GmailResult> {
  try {
    const token = await accessToken();
    const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ raw: Buffer.from(buildMime(m), "utf8").toString("base64url") }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const data = (await res.json().catch(() => ({}))) as { id?: string; error?: { status?: string } };
    if (!res.ok || !data.id) {
      if (res.status === 401) cached = null;
      return { ok: false, error: `send failed: ${res.status} ${data.error?.status ?? ""}`.trim() };
    }
    return { ok: true, id: data.id };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
