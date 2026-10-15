/**
 * The confirmation the person who filled the form receives.
 *
 * Its own layout, not EmailShell: the badge sits inside the card under the
 * green bar, and the footer is just the site and the privacy policy. Tokens,
 * the badge PNG and the image button are shared with the operator email.
 *
 * `intro` is the only part that changes between the static confirmation and
 * the AI front desk's first message; everything around it is fixed.
 */
import * as React from "react";
import { Body, Column, Container, Head, Hr, Html, Img, Link, Preview, Row, Section, Text, render } from "@react-email/components";
import { SITE } from "@/lib/utils";
import { BADGE_URL, MultilineText, PrimaryButton, fonts, styles, tokens } from "./shell";

/** The line under the headline. Used verbatim in the plain-text part too. */
export const STATIC_INTRO = [
  "I read every request myself. You'll hear back within one business day, usually the same day.",
] as const;

export const NEXT_STEPS = [
  "I look over what you sent.",
  "I reply with a plan or a few quick questions.",
  "If it's a fit, a free 15 minute call.",
] as const;

export const SIGNATURE = {
  name: "Ali",
  title: `Founder, ${SITE.name}`,
  note: "Reply to this email, it comes straight to me.",
} as const;

/** "https://techregardless.com" → "techregardless.com" for the footer. */
export const SITE_HOST = SITE.url.replace(/^https?:\/\//, "").replace(/\/$/, "");

// Slightly deeper than the site accent so the bar and the step circles hold
// up on white.
const GREEN = "#00d673";

export interface LeadAutoReplyProps {
  /** Already capitalised, first name only. */
  firstName: string;
  /** Paragraphs under the headline. STATIC_INTRO, or the front desk's reply. */
  intro: readonly string[];
  projectTypeLabel: string;
  budgetLabel: string;
  message: string;
}

const s = {
  card: {
    backgroundColor: tokens.card,
    border: `1px solid ${tokens.border}`,
    borderTop: `3px solid ${GREEN}`,
    borderRadius: tokens.radius,
    padding: "28px 28px 30px",
  },
  h1: { ...styles.h1, margin: "26px 0 12px", fontSize: "26px" },
  stepNum: {
    width: "22px",
    height: "22px",
    borderRadius: "11px",
    backgroundColor: GREEN,
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
  footer: { ...styles.footerText, margin: 0 },
} as const;

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
  return (
    <Html lang="en">
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </Head>
      <Preview>{STATIC_INTRO[0]}</Preview>
      <Body style={styles.body}>
        <Section style={styles.outer}>
          <Container style={styles.container}>
            <Section style={s.card}>
              <Link href={SITE.url}>
                <Img src={BADGE_URL} alt={SITE.name} width="172" height="40" style={{ display: "block", border: 0 }} />
              </Link>

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

              <Section style={{ marginTop: "26px" }}>
                <PrimaryButton href={`${SITE.url}/work`} label="See recent work" alt="See recent work on the Tech.Regardless site" />
              </Section>

              <Hr style={{ borderColor: tokens.border, borderTopWidth: "1px", margin: "28px 0 20px" }} />
              <Text style={s.sigName}>{SIGNATURE.name}</Text>
              <Text style={s.sigLine}>{SIGNATURE.title}</Text>
              <Text style={{ ...s.sigLine, marginTop: "8px" }}>{SIGNATURE.note}</Text>
            </Section>

            <Section style={styles.footer}>
              <Text style={s.footer}>
                <Link href={SITE.url} style={styles.footerLink}>
                  {SITE_HOST}
                </Link>
                {" · "}
                <Link href={`${SITE.url}/privacy`} style={styles.footerLink}>
                  Privacy policy
                </Link>
              </Text>
            </Section>
          </Container>
        </Section>
      </Body>
    </Html>
  );
}

export function renderLeadAutoReply(p: LeadAutoReplyProps): Promise<string> {
  return render(<LeadAutoReply {...p} />);
}
