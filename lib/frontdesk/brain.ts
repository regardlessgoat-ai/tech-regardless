import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type { BusinessConfig } from "./config";
import type { Thread } from "./store";

/**
 * The part that talks. Given a business config and a thread, it returns the
 * next message to send and whether the thread should go to a human.
 *
 * It never sends anything itself and never touches storage — the routes do
 * that — so it can be unit-tested with a fake thread and swapped per channel
 * (email today, SMS when the carrier registration clears).
 */

const MODEL = "claude-opus-5-5";

export const BrainOutput = z.object({
  /** The message to send to the lead. Empty string means send nothing. */
  reply: z.string(),
  /** True when a human should take the thread from here. */
  handoff: z.boolean(),
  /** Why, in a few words. Shown to the operator, not the lead. */
  handoff_reason: z.string(),
  /** Two or three sentences for the operator: who, what, budget, next step. */
  lead_summary: z.string(),
});
export type BrainOutput = z.infer<typeof BrainOutput>;

// Hand-written JSON schema (the SDK's zod helper needs zod 4; this project is
// on zod 3). Keep it in lockstep with BrainOutput above — safeParse below is
// the check that it is.
const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    reply: { type: "string" },
    handoff: { type: "boolean" },
    handoff_reason: { type: "string" },
    lead_summary: { type: "string" },
  },
  required: ["reply", "handoff", "handoff_reason", "lead_summary"],
  additionalProperties: false,
} as const;

export type BrainResult =
  | { ok: true; output: BrainOutput; usage: { input: number; output: number } }
  | { ok: false; reason: "not-configured" | "refusal" | "error"; detail?: string };

function isConfigured() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

function systemPrompt(config: BusinessConfig) {
  return [
    `You are ${config.assistantName}, an automated assistant for ${config.name}, a one-person business in ${config.location} run by ${config.operatorName}.`,
    `A prospective customer filled out the contact form. Your job is to reply by email, react to what they actually wrote, and learn the few things ${config.operatorName} needs before a call. Then hand off.`,
    "",
    "What the business offers:",
    ...config.services.map((s) => `- ${s}`),
    "",
    "The only prices you may state:",
    ...config.publicPricing.map((p) => `- ${p}`),
    "",
    "What you are trying to learn (skip anything the lead already told you):",
    ...config.qualifyingGoals.map((g) => `- ${g}`),
    "",
    "Rules:",
    ...config.rules.map((r) => `- ${r}`),
    `- ${config.operatorName} reads every message in this thread and will take over. Say that once, in the first message.`,
    `- Mode: ${config.mode === "one-shot" ? "send exactly one message, then hand off." : `you may go back and forth, but hand off as soon as the goals are met or after ${config.maxAssistantTurns} messages.`}`,
    "",
    `Voice: ${config.voice}`,
    "",
    "Output: the reply text (plain, no signature block — the sender adds one), whether to hand off, a short handoff reason, and a lead summary for the operator.",
  ].join("\n");
}

function leadIntro(thread: Thread) {
  const l = thread.lead;
  return [
    "Contact form submission:",
    `Name: ${l.name}`,
    l.company ? `Business: ${l.company}` : null,
    `Email: ${l.email}`,
    l.phone ? `Phone: ${l.phone}` : null,
    `Project type: ${l.projectType}`,
    `Budget: ${l.budget}`,
    l.goal ? `What a win looks like: ${l.goal}` : null,
    "",
    "Their message:",
    l.message,
  ]
    .filter(Boolean)
    .join("\n");
}

/** Build the conversation as the API expects it: user = lead, assistant = us. */
function transcript(thread: Thread): Anthropic.Beta.BetaMessageParam[] {
  const turns: Anthropic.Beta.BetaMessageParam[] = [
    { role: "user", content: leadIntro(thread) },
  ];
  for (const m of thread.messages) {
    turns.push({
      role: m.role === "lead" ? "user" : "assistant",
      content: m.text,
    });
  }
  // The API needs the last turn to be the user's. If the assistant spoke last
  // (should not happen — the routes only call us after a lead message or on
  // creation) add a nudge rather than fail.
  if (turns[turns.length - 1].role === "assistant") {
    turns.push({ role: "user", content: "(no reply yet)" });
  }
  return turns;
}

export async function nextMessage(
  config: BusinessConfig,
  thread: Thread
): Promise<BrainResult> {
  if (!isConfigured()) return { ok: false, reason: "not-configured" };

  const client = new Anthropic();
  const isFirst = thread.messages.length === 0;

  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 2048,
      // Server-side fallback: if the model declines for a safety reason, the
      // API re-runs the request on a fallback model in the same call.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: [
        {
          type: "text",
          text: systemPrompt(config),
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: transcript(thread),
      output_config: {
        format: { type: "json_schema", schema: OUTPUT_SCHEMA },
        // The first message is a short, simple job. Replies need judgment
        // about when to stop.
        effort: isFirst ? "low" : "medium",
      },
    });

    if (response.stop_reason === "refusal") {
      return {
        ok: false,
        reason: "refusal",
        detail: response.stop_details?.explanation ?? "declined",
      };
    }

    const text = response.content
      .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return { ok: false, reason: "error", detail: `unparseable output: ${text.slice(0, 120)}` };
    }
    const checked = BrainOutput.safeParse(parsed);
    if (!checked.success) {
      return { ok: false, reason: "error", detail: `schema mismatch: ${checked.error.message.slice(0, 200)}` };
    }
    const output = checked.data;
    // Belt and braces on the hard stop, independent of what the model decided.
    if (thread.assistantTurns + 1 >= config.maxAssistantTurns || config.mode === "one-shot") {
      output.handoff = true;
      if (!output.handoff_reason) output.handoff_reason = "turn limit";
    }

    return {
      ok: true,
      output,
      usage: {
        input: response.usage.input_tokens,
        output: response.usage.output_tokens,
      },
    };
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      return { ok: false, reason: "not-configured", detail: "bad API key" };
    }
    if (err instanceof Anthropic.APIError) {
      return { ok: false, reason: "error", detail: `${err.status} ${err.message}` };
    }
    return { ok: false, reason: "error", detail: String(err) };
  }
}
