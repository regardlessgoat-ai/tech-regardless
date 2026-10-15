/**
 * The confirmation the person who filled the form receives.
 *
 * Plain on purpose so Gmail files it as a personal reply, not marketing: sent
 * from Ali, no shared card frame (lib/emails/shell.tsx is the operator email's),
 * no images, one link, no hidden preview text.
 *
 * `intro` is the only part that changes between the static confirmation and
 * the AI front desk's first message; everything around it is fixed.
 */
import * as React from "react";
import { Head, Html, Link, Text, render } from "@react-email/components";
import { SITE } from "@/lib/utils";
import { fonts, tokens } from "./shell";

/** The line under the headline. Used verbatim in the plain-text part too. */
export const STATIC_INTRO = [
  "I read every request myself. You'll hear back within one business day, usually the same day.",
] as const;

export const NEXT_STEPS = [
  "I look over what you sent.",
  "I reply with a plan or a few quick questions.",
  "If it's a fit, a free 15 minute call.",
] as const;

/** Bold name, optional title, then a grey note. */
export interface Signature {
  name: string;
  title?: string;
  note: string;
}

/** Ali signs the static confirmation. The front desk passes its own. */
export const HUMAN_SIGNATURE: Signature = {
  name: "Ali",
  title: `Founder, ${SITE.name}`,
  note: "Reply to this email, it comes straight to me.",
};

/** The signature as plain-text lines, for the text part of the email. */
export function signatureLines(sig: Signature): string[] {
  return [sig.name, ...(sig.title ? [sig.title] : []), sig.note];
}

/**
 * The footer shows the brand domain as text. Not derived from SITE.url: in
 * production that comes from NEXT_PUBLIC_SITE_URL, which is the vercel.app
 * host. The link itself still goes to SITE.url.
 */
export const SITE_HOST = "techregardless.com";

export interface LeadAutoReplyProps {
  /** Already capitalised, first name only. */
  firstName: string;
  /** Paragraphs under the headline. STATIC_INTRO, or the front desk's reply. */
  intro: readonly string[];
  /** Defaults to HUMAN_SIGNATURE. The front desk signs as Ali's assistant. */
  signature?: Signature;
  projectTypeLabel: string;
  budgetLabel: string;
  message: string;
}

const sans = fonts.sans;

const s = {
  body: { margin: 0, padding: "16px", backgroundColor: "#ffffff", color: "#111111", fontFamily: sans },
  wrap: { maxWidth: "560px" },
  p: { margin: "0 0 14px", fontSize: "15px", lineHeight: "1.5", color: "#111111", fontFamily: sans },
  h1: { margin: "16px 0 12px", fontSize: "20px", lineHeight: "1.3", fontWeight: 700, color: "#111111", fontFamily: sans },
  link: { color: "#1a0dab", textDecoration: "underline" },
} as const;

/** The display name and address the confirmation comes from, and replies go to. */
export const AUTO_REPLY_FROM = `Ali <${SITE.email}>`;

/**
 * Deliberately close to a hand written reply: white page, one column, normal
 * text, no card, no colored bar, no boxes, no label styling. The green dot in
 * the wordmark is the only color. Exactly one link.
 */
export function LeadAutoReply(p: LeadAutoReplyProps) {
  const sig = p.signature ?? HUMAN_SIGNATURE;
  const lines = p.message.replace(/\r\n/g, "\n").split("\n");

  return (
    <Html lang="en">
      <Head />
      {/* A bare <body>: React Email's Body wraps the content in a layout table. */}
      <body style={s.body}>
        <div style={s.wrap}>
          <Text style={{ ...s.p, fontWeight: 600 }}>
            Tech<span style={{ color: tokens.bar }}>.</span>Regardless
          </Text>

          <Text style={s.h1}>Got it, {p.firstName}.</Text>
          {p.intro.map((para, i) => (
            <Text key={i} style={s.p}>
              {para}
            </Text>
          ))}

          <Text style={s.p}>What happens next:</Text>
          <Text style={s.p}>
            {NEXT_STEPS.map((step, i) => (
              <span key={i}>
                {i + 1}. {step}
                {i < NEXT_STEPS.length - 1 ? <br /> : null}
              </span>
            ))}
          </Text>

          <Text style={s.p}>What you sent:</Text>
          <Text style={s.p}>
            {p.projectTypeLabel} · {p.budgetLabel}
            <br />
            {lines.map((line, i) => (
              <span key={i}>
                {line}
                {i < lines.length - 1 ? <br /> : null}
              </span>
            ))}
          </Text>

          <Text style={s.p}>
            <Link href={`${SITE.url}/work`} style={s.link}>
              See recent work
            </Link>
          </Text>

          <Text style={{ ...s.p, margin: "20px 0 0" }}>
            {sig.name}
            {sig.title ? (
              <>
                <br />
                {sig.title}
              </>
            ) : null}
            <br />
            {sig.note}
          </Text>
        </div>
      </body>
    </Html>
  );
}

export function renderLeadAutoReply(p: LeadAutoReplyProps): Promise<string> {
  return render(<LeadAutoReply {...p} />);
}
