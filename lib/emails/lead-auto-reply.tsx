/**
 * The confirmation the person who filled the form receives.
 * `greeting` is the only part that changes between the static confirmation
 * and the AI front desk's first message; everything around it is fixed.
 */
import * as React from "react";
import { Link, Section, Text, render } from "@react-email/components";
import { SITE } from "@/lib/utils";
import { EmailShell, Eyebrow, MultilineText, PrimaryButton, styles, tokens } from "./shell";

/** Same wording as components/services-section.tsx on the live site. */
export const SERVICE_LINES = [
  {
    title: "Custom Websites",
    description:
      "Designed for your brand, built to turn visitors into calls, fast on a phone. You own the code on day one.",
  },
  {
    title: "AI Front Desk",
    description:
      "Texts back every call you miss, books the job over SMS, and asks happy customers for a review. Ongoing website updates are part of the same monthly plan.",
  },
  {
    title: "Business Automation",
    description:
      "Intake, follow-ups, invoicing, reporting and dashboards wired together so the business keeps moving while you're on a job.",
  },
] as const;

/** The human-written confirmation. Used verbatim in the plain-text part too. */
/** The sign-off under the static confirmation, HTML and plain text alike. */
export const STATIC_SIGNATURE = `Ali, ${SITE.name}`;

export const STATIC_GREETING = [
  "Your message reached me. This confirmation is automatic. It fires the moment the form submits, so you're not left wondering whether it went through. The actual reply is written by a human, and that's me.",
  "I respond within 24 hours. If you left something out, just reply to this email. It comes straight to my inbox.",
] as const;

export interface LeadAutoReplyProps {
  /** Already capitalised, first name only. */
  firstName: string;
  /** Paragraphs. Static copy, or the front desk's reply. */
  greeting: readonly string[];
  /** Sign-off lines under the greeting, e.g. ["Ali, Tech.Regardless"]. */
  signature: readonly string[];
  projectTypeLabel: string;
  budgetLabel: string;
  message: string;
}

export function LeadAutoReply(p: LeadAutoReplyProps) {
  return (
    <EmailShell preview="Your message reached me. A real reply follows within 24 hours.">
      <Eyebrow>Message received</Eyebrow>
      <Text style={{ ...styles.h1, marginBottom: "18px" }}>Hi {p.firstName},</Text>
      {p.greeting.map((para, i) => (
        <Text key={i} style={styles.p}>
          {para}
        </Text>
      ))}
      {p.signature.map((line, i) => (
        <Text key={`s${i}`} style={{ ...styles.pMuted, margin: 0 }}>
          {line}
        </Text>
      ))}

      <Text style={styles.h2}>What we do</Text>
      {SERVICE_LINES.map((s) => (
        <Section key={s.title} style={{ ...styles.card, marginBottom: "8px" }}>
          <Text style={styles.cardTitle}>{s.title}</Text>
          <Text style={styles.cardText}>{s.description}</Text>
        </Section>
      ))}

      <Text style={styles.h2}>What came through</Text>
      <Section style={styles.card}>
        <Text style={{ ...styles.cardText, marginBottom: "10px" }}>
          {p.projectTypeLabel} · {p.budgetLabel}
        </Text>
        <MultilineText text={p.message} style={{ fontSize: "15px", color: tokens.text }} />
      </Section>

      <Section style={{ marginTop: "26px" }}>
        <PrimaryButton href={`${SITE.url}/work`} label="See recent work" alt="See recent work on the Tech.Regardless site" />
      </Section>
      <Text style={{ ...styles.pMuted, margin: "18px 0 0", fontSize: "13px" }}>
        Replies to this email come straight to{" "}
        <Link href={`mailto:${SITE.email}`} style={styles.link}>
          {SITE.email}
        </Link>
        .
      </Text>
    </EmailShell>
  );
}

export function renderLeadAutoReply(p: LeadAutoReplyProps): Promise<string> {
  return render(<LeadAutoReply {...p} />);
}
