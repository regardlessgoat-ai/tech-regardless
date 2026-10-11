import { createHash, randomBytes } from "node:crypto";
import { Redis } from "@upstash/redis";

/**
 * Thread store. Upstash Redis over REST, which is what the Vercel marketplace
 * provisions. When the env vars are missing every call is a no-op that
 * returns null, so the contact form keeps working without the store — the AI
 * first message still sends, it just cannot continue the conversation.
 */

export type ThreadMessage = {
  role: "lead" | "assistant";
  text: string;
  at: string;
  /** RFC 5322 Message-ID of the email that carried it, when known. */
  messageId?: string;
};

export type Lead = {
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  projectType: string;
  budget: string;
  goal: string | null;
  message: string;
};

export type Thread = {
  id: string;
  businessId: string;
  lead: Lead;
  subject: string;
  messages: ThreadMessage[];
  assistantTurns: number;
  status: "active" | "handed_off" | "closed";
  handoffReason: string | null;
  summary: string | null;
  createdAt: string;
  updatedAt: string;
};

const TTL_SECONDS = 60 * 60 * 24 * 60; // 60 days

function client(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export function isStoreConfigured() {
  return client() !== null;
}

function emailKey(businessId: string, email: string) {
  const h = createHash("sha256")
    .update(email.trim().toLowerCase())
    .digest("hex")
    .slice(0, 32);
  return `fd:lead:${businessId}:${h}`;
}

function threadKey(id: string) {
  return `fd:thread:${id}`;
}

export function newThreadId() {
  // Lowercase hex on purpose: the id rides in an email local part
  // (frontdesk+<id>@...), and mail servers are free to lowercase that.
  return randomBytes(10).toString("hex");
}

export async function createThread(
  input: Omit<Thread, "id" | "createdAt" | "updatedAt" | "status" | "assistantTurns" | "handoffReason" | "summary">
): Promise<Thread> {
  const redis = client();
  const now = new Date().toISOString();
  const thread: Thread = {
    ...input,
    id: newThreadId(),
    status: "active",
    assistantTurns: input.messages.filter((m) => m.role === "assistant").length,
    handoffReason: null,
    summary: null,
    createdAt: now,
    updatedAt: now,
  };
  // No store: hand back the in-memory thread so the first message still goes
  // out. It just cannot be continued — the inbound route will not find it.
  if (!redis) return thread;
  await redis.set(threadKey(thread.id), thread, { ex: TTL_SECONDS });
  await redis.set(emailKey(thread.businessId, thread.lead.email), thread.id, {
    ex: TTL_SECONDS,
  });
  return thread;
}

export async function getThread(id: string): Promise<Thread | null> {
  const redis = client();
  if (!redis) return null;
  return (await redis.get<Thread>(threadKey(id))) ?? null;
}

export async function findThreadByEmail(
  businessId: string,
  email: string
): Promise<Thread | null> {
  const redis = client();
  if (!redis) return null;
  const id = await redis.get<string>(emailKey(businessId, email));
  return id ? getThread(id) : null;
}

export async function saveThread(thread: Thread): Promise<void> {
  const redis = client();
  if (!redis) return;
  thread.updatedAt = new Date().toISOString();
  thread.assistantTurns = thread.messages.filter(
    (m) => m.role === "assistant"
  ).length;
  await redis.set(threadKey(thread.id), thread, { ex: TTL_SECONDS });
}
