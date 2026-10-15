/**
 * The lead notification to the operator. Built to be acted on from a phone in
 * seconds: how hot the lead is, who they are, and Call / Text / Email buttons
 * before anything else. The full message and the five answers follow.
 */
import * as React from "react";
import { Column, Link, Row, Section, Text, render } from "@react-email/components";
import { RESEARCH_QUESTIONS, type ResearchAnswers, type ResearchId, type ResearchLetter } from "@/lib/contact-questions";
import { SITE } from "@/lib/utils";
import { Badge, EmailShell, ImageButton, MultilineText, styles, tokens } from "./shell";

export interface OperatorNotificationProps {
  receivedAt: string; // ISO
  name: string;
  email: string;
  phone: string | null; // digits, maybe leading +
  company: string | null;
  /** PROJECT_TYPES value, e.g. "free-audit". Drives the tag. */
  projectType: string;
  projectTypeLabel: string;
  /** BUDGETS value, e.g. "2k-5k". Drives the tag. */
  budget: string;
  budgetLabel: string;
  goal: string;
  research: ResearchAnswers;
  message: string;
  utm: { source: string; medium: string; campaign: string };
}

// ── Lead tag ─────────────────────────────────────────────────────────────────
export type LeadTag = "Hot" | "Warm" | "Cold";

const BIG_BUDGETS = new Set(["2k-5k", "5k-10k", "10k-plus"]);
const SOON: ReadonlySet<ResearchLetter> = new Set(["a", "b"]); // ASAP, within a month

/**
 * Hot: $2k+ budget AND wants it within a month. Warm: one of the two. Cold:
 * neither. A free audit request is never Cold: asking for one is interest, so
 * it is Warm unless budget and timeline make it Hot.
 */
export function leadTag(p: Pick<OperatorNotificationProps, "budget" | "research" | "projectType">): LeadTag {
  const score = Number(BIG_BUDGETS.has(p.budget)) + Number(SOON.has(p.research.timing));
  if (score === 2) return "Hot";
  return score === 1 || p.projectType === "free-audit" ? "Warm" : "Cold";
}

const TAG_STYLE: Record<LeadTag, { bg: string; fg: string }> = {
  Hot: { bg: "#fde8e8", fg: "#b42318" },
  Warm: { bg: "#fef3c7", fg: "#92400e" },
  Cold: { bg: "#f1f1f3", fg: "#52525b" },
};

export function operatorSubject(
  p: Pick<OperatorNotificationProps, "name" | "projectType" | "projectTypeLabel" | "budget" | "budgetLabel" | "research">
) {
  return `${leadTag(p)} lead: ${p.name} · ${p.projectTypeLabel} · ${p.budgetLabel}`;
}

// ── Answers ──────────────────────────────────────────────────────────────────
/** Short labels for the five answers, in form order. */
export const ANSWER_LABELS: Record<ResearchId, string> = {
  findYou: "Finds customers",
  missedCall: "Missed calls go to",
  booking: "Books jobs by",
  callVolume: "Calls a day",
  timing: "Wants it live",
};

export function answerRows(answers: ResearchAnswers): [string, string][] {
  return RESEARCH_QUESTIONS.map((q) => [ANSWER_LABELS[q.id], q.options[answers[q.id]]]);
}

export function timelineOf(answers: ResearchAnswers): string {
  return RESEARCH_QUESTIONS.find((q) => q.id === "timing")!.options[answers.timing];
}

/** utm tags for the footer; an untagged visit is just "direct". */
export function sourceLine(utm: OperatorNotificationProps["utm"]): string {
  const { source, medium, campaign } = utm;
  if ([source, medium, campaign].every((v) => v === "direct")) return "Source: direct";
  return `Source: utm_source ${source} · utm_medium ${medium} · utm_campaign ${campaign}`;
}

// ── Formatting ───────────────────────────────────────────────────────────────
function eastern(iso: string, opts: Intl.DateTimeFormatOptions): string {
  return new Date(iso).toLocaleString("en-US", { timeZone: "America/New_York", ...opts });
}

export function formatEastern(iso: string): string {
  return eastern(iso, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" });
}

/** 4075550100 → (407) 555-0100 for display; links keep the raw digits. */
export function prettyPhone(raw: string): string {
  const d = raw.replace(/\D/g, "");
  const m = /^1?(\d{3})(\d{3})(\d{4})$/.exec(d);
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : raw;
}

function e164(raw: string): string {
  const d = raw.replace(/\D/g, "");
  return d.length === 10 ? `+1${d}` : `+${d}`;
}

// ── Layout ───────────────────────────────────────────────────────────────────
const s = {
  time: { margin: 0, fontSize: "12px", lineHeight: "1.5", color: tokens.muted, textAlign: "right" as const },
  pill: {
    display: "inline-block",
    marginLeft: "8px",
    padding: "1px 8px",
    borderRadius: "999px",
    fontSize: "11px",
    lineHeight: "18px",
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    verticalAlign: "1px",
  },
  name: { ...styles.h1, margin: "8px 0 2px", fontSize: "26px" },
  company: { margin: 0, fontSize: "15px", lineHeight: "1.5", color: tokens.muted },
  summary: { margin: "10px 0 0", fontSize: "15px", lineHeight: "1.5", color: tokens.text },
  hint: { margin: "14px 0 0", fontSize: "13px", lineHeight: "1.5", color: tokens.muted },
  winLabel: { color: tokens.muted },
  answerLabel: { margin: 0, fontSize: "13px", lineHeight: "1.4", color: tokens.muted },
  answerValue: { margin: 0, fontSize: "15px", lineHeight: "1.4", color: tokens.text },
  contact: { margin: "24px 0 0", fontSize: "13px", lineHeight: "1.5", color: tokens.muted },
  contactLink: { color: tokens.muted, textDecoration: "underline" },
} as const;

export function OperatorNotification(p: OperatorNotificationProps) {
  const tag = leadTag(p);
  const timeline = timelineOf(p.research);
  const mailto = `mailto:${p.email}?subject=${encodeURIComponent(`Re: your message to ${SITE.name}`)}`;
  const preview = `${tag} lead · ${p.projectTypeLabel} · ${p.budgetLabel} · ${timeline}: ${p.message.slice(0, 90)}`;
  const buttons = [
    ...(p.phone
      ? [
          { label: "Call", href: `tel:${e164(p.phone)}`, alt: `Call ${p.name}`, variant: "solid" as const },
          { label: "Text", href: `sms:${e164(p.phone)}`, alt: `Text ${p.name}`, variant: "solid" as const },
        ]
      : []),
    { label: "Email", href: mailto, alt: `Email ${p.name}`, variant: "outline" as const },
  ];

  return (
    <EmailShell preview={preview} footer={sourceLine(p.utm)}>
      <Row>
        <Column style={{ verticalAlign: "middle" }}>
          <Badge />
        </Column>
        <Column style={{ verticalAlign: "middle", width: "120px" }}>
          <Text style={s.time}>{eastern(p.receivedAt, { weekday: "short", month: "short", day: "numeric" })}</Text>
          <Text style={s.time}>{eastern(p.receivedAt, { hour: "numeric", minute: "2-digit", timeZoneName: "short" })}</Text>
        </Column>
      </Row>

      <Text style={{ ...styles.label, marginTop: "26px" }}>
        New lead
        <span style={{ ...s.pill, backgroundColor: TAG_STYLE[tag].bg, color: TAG_STYLE[tag].fg }}>{tag}</span>
      </Text>
      <Text style={s.name}>{p.name}</Text>
      {p.company ? <Text style={s.company}>{p.company}</Text> : null}
      <Text style={s.summary}>
        {p.projectTypeLabel} · {p.budgetLabel} · {timeline}
      </Text>

      {/* A plain table, not Row: Row is 100% wide, and align="left" would
          float it and pull the next section up beside a lone Email button. */}
      <Section style={{ marginTop: "22px" }}>
        <table role="presentation" cellPadding={0} cellSpacing={0} border={0}>
          <tbody>
            <tr>
              {buttons.map((b, i) => (
                <td key={b.label} style={{ paddingRight: i < buttons.length - 1 ? "8px" : 0 }}>
                  <ImageButton href={b.href} label={b.label} alt={b.alt} variant={b.variant} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </Section>
      {p.phone ? <Text style={s.hint}>Call within 5 minutes. Fast replies close more.</Text> : null}

      <Text style={styles.h2}>Their message</Text>
      <Section style={styles.card}>
        <MultilineText text={p.message} style={{ fontSize: "15px" }} />
      </Section>
      <Text style={{ ...styles.p, margin: "14px 0 0", fontSize: "15px" }}>
        <span style={s.winLabel}>Win looks like: </span>
        {p.goal}
      </Text>

      <Text style={styles.h2}>Their answers</Text>
      {answerRows(p.research).map(([label, value], i) => (
        <Row key={label} style={{ borderTop: i === 0 ? "none" : `1px solid ${tokens.border}` }}>
          <Column style={{ width: "40%", padding: "10px 12px 10px 0", verticalAlign: "top" }}>
            <Text style={s.answerLabel}>{label}</Text>
          </Column>
          <Column style={{ padding: "10px 0", verticalAlign: "top" }}>
            <Text style={s.answerValue}>{value}</Text>
          </Column>
        </Row>
      ))}

      <Text style={s.contact}>
        {p.phone ? (
          <>
            <Link href={`tel:${e164(p.phone)}`} style={s.contactLink}>
              {prettyPhone(p.phone)}
            </Link>
            {" · "}
          </>
        ) : null}
        <Link href={`mailto:${p.email}`} style={s.contactLink}>
          {p.email}
        </Link>
      </Text>
    </EmailShell>
  );
}

export function renderOperatorNotification(p: OperatorNotificationProps): Promise<string> {
  return render(<OperatorNotification {...p} />);
}
