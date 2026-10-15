import { createHash } from "node:crypto";
import { client } from "@/lib/frontdesk/store";

/**
 * Limits on the customer auto-reply, so the form can't be used to make the
 * ali@ mailbox (or Resend) send hundreds of emails: at most 50 a day in
 * total, and one a day to any one address. A day is a calendar day in
 * Kissimmee time.
 *
 * Counts live in the Upstash store. If the store is missing or errors, the
 * reply is allowed: a real lead getting no confirmation is worse than a cap
 * that briefly can't count.
 */

export const DAILY_LIMIT = 50;

export type CapDecision =
  | { allowed: true; counted: boolean }
  | { allowed: false; reason: "address-already-replied-today" | "daily-limit-reached" };

const TWO_DAYS = 60 * 60 * 48;

function today(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());
}

function addressKey(day: string, email: string) {
  const hash = createHash("sha256").update(email.trim().toLowerCase()).digest("hex").slice(0, 32);
  return `autoreply:${day}:addr:${hash}`;
}

/** Claims today's reply slot for this address. Call once, right before sending. */
export async function claimAutoReply(email: string): Promise<CapDecision> {
  const redis = client();
  if (!redis) return { allowed: true, counted: false };
  try {
    const day = today();
    const first = await redis.set(addressKey(day, email), 1, { nx: true, ex: TWO_DAYS });
    if (first === null) return { allowed: false, reason: "address-already-replied-today" };
    const countKey = `autoreply:${day}:count`;
    const n = await redis.incr(countKey);
    if (n === 1) await redis.expire(countKey, TWO_DAYS);
    if (n > DAILY_LIMIT) return { allowed: false, reason: "daily-limit-reached" };
    return { allowed: true, counted: true };
  } catch (err) {
    console.warn("[contact] auto-reply cap unavailable, allowing", String(err));
    return { allowed: true, counted: false };
  }
}
