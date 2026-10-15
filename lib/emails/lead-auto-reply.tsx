/**
 * The confirmation the person who filled the form receives.
 *
 * Card frame shared with the operator email (lib/emails/shell.tsx), but kept
 * deliberately plain so Gmail files it as a personal reply, not marketing:
 * sent from Ali, no images (the wordmark is text, the call to action a text
 * link), exactly two links, no hidden preview padding.
 *
 * `intro` is the only part that changes between the static confirmation and
 * the AI front desk's first message; everything around it is fixed.
 */
import * as React from "react";
import { Column, Hr, Link, Row, Section, Text, render } from "@react-email/components";
import { SITE } from "@/lib/utils";
import { EmailShell, MultilineText, fonts, styles, tokens } from "./shell";

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

const s = {
  h1: { ...styles.h1, margin: "26px 0 12px", fontSize: "26px" },
  stepNum: {
    width: "22px",
    height: "22px",
    borderRadius: "11px",
    backgroundColor: tokens.bar,
    color: tokens.text,
    fontSize: "12px",
    fontWeight: 600,
    lineHeight: "22px",
    textAlign: "center" as const,
    fontFamily: fonts.sans,
  },
  stepText: { margin: 0, fontSize: "15px", lineHeight: "22px", color: tokens.text },
  sigName: { margin: 0, fontSize: "15px", lineHeight: "1.5", fontWeight: 600, color: tokens.text },
  sigLine: { margin: 0, fontSize: "14px", lineHeight: "1.5", color: tokens.muted },
  wordmark: { margin: 0, fontFamily: fonts.mono, fontSize: "16px", fontWeight: 500, letterSpacing: "-0.01em", color: tokens.text },
  textLink: { color: tokens.text, fontSize: "15px", fontWeight: 500, textDecoration: "underline" },
} as const;

/** The display name and address the confirmation comes from, and replies go to. */
export const AUTO_REPLY_FROM = `Ali <${SITE.email}>`;

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <Row style={{ marginBottom: "10px" }}>
      <Column style={{ width: "34px", verticalAlign: "top" }}>
        <div style={s.stepNum}>{n}</div>
      </Column>
      <Column style={{ verticalAlign: "top" }}>
        <Text style={s.stepText}>{children}</Text>
      </Column>
    </Row>
  );
}

export function LeadAutoReply(p: LeadAutoReplyProps) {
  const sig = p.signature ?? HUMAN_SIGNATURE;
  // Two links in the whole email: recent work and the privacy policy. The
  // domain is plain text.
  const footer = (
    <>
      {SITE_HOST}
      {" · "}
      <Link href={`${SITE.url}/privacy`} style={styles.footerLink}>
        Privacy policy
      </Link>
    </>
  );

  return (
    <EmailShell footer={footer}>
      <Text style={s.wordmark}>
        Tech<span style={{ color: tokens.bar }}>.</span>Regardless
      </Text>

      <Text style={s.h1}>Got it, {p.firstName}.</Text>
      {p.intro.map((para, i) => (
        <Text key={i} style={styles.p}>
          {para}
        </Text>
      ))}

      <Text style={styles.h2}>What happens next</Text>
      {NEXT_STEPS.map((step, i) => (
        <Step key={i} n={i + 1}>
          {step}
        </Step>
      ))}

      <Text style={styles.h2}>What you sent</Text>
      <Section style={styles.card}>
        <Text style={{ ...styles.cardText, marginBottom: "10px" }}>
          {p.projectTypeLabel} · {p.budgetLabel}
        </Text>
        <MultilineText text={p.message} style={{ fontSize: "15px", color: tokens.text }} />
      </Section>

      <Text style={{ ...styles.p, margin: "24px 0 0" }}>
        <Link href={`${SITE.url}/work`} style={s.textLink}>
          See recent work
        </Link>
      </Text>

      <Hr style={{ borderColor: tokens.border, borderTopWidth: "1px", margin: "28px 0 20px" }} />
      <Text style={s.sigName}>{sig.name}</Text>
      {sig.title ? <Text style={s.sigLine}>{sig.title}</Text> : null}
      <Text style={{ ...s.sigLine, marginTop: "8px" }}>{sig.note}</Text>
    </EmailShell>
  );
}

export function renderLeadAutoReply(p: LeadAutoReplyProps): Promise<string> {
  return render(<LeadAutoReply {...p} />);
}
