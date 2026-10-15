/**
 * The lead notification to the operator. Everything the form captured, laid
 * out so it can be acted on from a phone: tap the number, tap the email,
 * tap Reply.
 */
import * as React from "react";
import { Column, Link, Row, Section, Text, render } from "@react-email/components";
import { SITE } from "@/lib/utils";
import { EmailShell, MultilineText, PrimaryButton, firstNameOf, styles, tokens } from "./shell";

export interface OperatorNotificationProps {
  receivedAt: string; // ISO
  name: string;
  email: string;
  phone: string | null; // digits, maybe leading +
  company: string | null;
  projectTypeLabel: string;
  budgetLabel: string;
  goal: string;
  /** [question, answer] pairs, in form order. */
  research: ReadonlyArray<readonly [string, string]>;
  message: string;
  utm: { source: string; medium: string; campaign: string };
}

export function operatorSubject(p: Pick<OperatorNotificationProps, "name" | "projectTypeLabel" | "budgetLabel">) {
  return `New lead: ${p.name} · ${p.projectTypeLabel} · ${p.budgetLabel}`;
}

export function formatEastern(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

/** 4075550100 → (407) 555-0100 for display; the tel: link keeps the raw digits. */
export function prettyPhone(raw: string): string {
  const d = raw.replace(/\D/g, "");
  const m = /^1?(\d{3})(\d{3})(\d{4})$/.exec(d);
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : raw;
}

function telHref(raw: string): string {
  const d = raw.replace(/\D/g, "");
  return `tel:${d.length === 10 ? `+1${d}` : `+${d}`}`;
}

const label = {
  ...styles.cardText,
  fontFamily: "inherit",
  fontSize: "11px",
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  padding: "7px 12px 7px 0",
  verticalAlign: "top",
  width: "112px",
} as const;
const value = { ...styles.p, margin: 0, fontSize: "15px", padding: "7px 0", verticalAlign: "top" } as const;

function Field({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <Row>
      <Column style={label}>{name}</Column>
      <Column style={value}>{children}</Column>
    </Row>
  );
}

export function OperatorNotification(p: OperatorNotificationProps) {
  const first = firstNameOf(p.name);
  const replyHref = `mailto:${p.email}?subject=${encodeURIComponent(`Re: your message to ${SITE.name}`)}`;
  const preview = `${p.name} · ${p.projectTypeLabel} · ${p.budgetLabel}: ${p.message.slice(0, 90)}`;
  const utmLine = `utm_source ${p.utm.source} · utm_medium ${p.utm.medium} · utm_campaign ${p.utm.campaign}`;

  return (
    <EmailShell preview={preview} footerNote={<Text style={styles.footerText}>{utmLine}</Text>}>
      <Text style={styles.eyebrow}>New lead</Text>
      <Text style={styles.h1}>{p.name}</Text>
      <Text style={{ ...styles.pMuted, margin: "6px 0 0" }}>
        {p.company ? `${p.company} · ` : ""}
        {formatEastern(p.receivedAt)}
      </Text>

      <Section style={{ ...styles.card, marginTop: "20px", padding: "8px 18px" }}>
        <Field name="Email">
          <Link href={`mailto:${p.email}`} style={styles.link}>
            {p.email}
          </Link>
        </Field>
        {p.phone ? (
          <Field name="Phone">
            <Link href={telHref(p.phone)} style={styles.link}>
              {prettyPhone(p.phone)}
            </Link>
          </Field>
        ) : null}
        {p.company ? <Field name="Company">{p.company}</Field> : null}
        <Field name="Project">{p.projectTypeLabel}</Field>
        <Field name="Budget">{p.budgetLabel}</Field>
        <Field name="Win looks like">{p.goal}</Field>
      </Section>

      <Text style={styles.h2}>Message</Text>
      <Section style={styles.card}>
        <MultilineText text={p.message} style={{ fontSize: "15px" }} />
      </Section>

      <Text style={styles.h2}>Five quick questions</Text>
      <Section style={{ ...styles.card, padding: "6px 18px" }}>
        {p.research.map(([q, a]) => (
          <Section key={q} style={{ padding: "8px 0" }}>
            <Text style={{ ...styles.cardText, fontSize: "13px", margin: 0 }}>{q}</Text>
            <Text style={{ ...styles.cardTitle, fontSize: "15px", fontWeight: 500, margin: "2px 0 0", color: tokens.text }}>{a}</Text>
          </Section>
        ))}
      </Section>

      <Section style={{ marginTop: "26px" }}>
        <PrimaryButton href={replyHref}>Reply to {first}</PrimaryButton>
      </Section>
    </EmailShell>
  );
}

export function renderOperatorNotification(p: OperatorNotificationProps): Promise<string> {
  return render(<OperatorNotification {...p} />);
}
