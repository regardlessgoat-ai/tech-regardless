/**
 * Shared shell for every email the site sends. The tokens mirror
 * app/globals.css (cream light theme, near-black header, electric green
 * accent) so a message reads as the same brand as the page it came from.
 *
 * Email constraints, all deliberate:
 * - inline styles only (no <style> block, no media queries)
 * - explicit background and text colours on every block so dark-mode clients
 *   do not invert half the layout
 * - the wordmark is a hosted PNG (SVG is stripped by Gmail), served from the
 *   live site, light-on-transparent so it sits on the dark header in any mode
 * - 600px max width, fluid below that
 */
import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";
import { SITE } from "@/lib/utils";

export const tokens = {
  // app/globals.css :root (light) + .dark header band
  bg: "#fafaf7",
  card: "#ffffff",
  border: "#e1e1e6",
  text: "#0a0a0a",
  muted: "#71717a",
  headerBg: "#0a0a0a",
  headerMuted: "#a1a1aa",
  accent: "#00ff88",
  onAccent: "#0a0a0a",
  radius: "4px",
} as const;

export const fonts = {
  sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  mono: '"SF Mono", SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
} as const;

export const LOGO_URL = `${SITE.url}/brand/wordmark.png`;
export const LOCATION = "Kissimmee, FL";

export const styles = {
  body: { margin: 0, padding: 0, backgroundColor: tokens.bg, fontFamily: fonts.sans, color: tokens.text },
  outer: { backgroundColor: tokens.bg, padding: "24px 12px" },
  container: { maxWidth: "600px", width: "100%", margin: "0 auto" },
  header: {
    backgroundColor: tokens.headerBg,
    borderRadius: `${tokens.radius} ${tokens.radius} 0 0`,
    padding: "28px 28px 24px",
  },
  tagline: {
    margin: "14px 0 0",
    fontFamily: fonts.mono,
    fontSize: "11px",
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: tokens.headerMuted,
  },
  content: {
    backgroundColor: tokens.card,
    border: `1px solid ${tokens.border}`,
    borderTop: 0,
    borderRadius: `0 0 ${tokens.radius} ${tokens.radius}`,
    padding: "28px 28px 32px",
  },
  eyebrow: {
    margin: "0 0 10px",
    fontFamily: fonts.mono,
    fontSize: "11px",
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    // Pure #00ff88 is unreadable on white; the darker green keeps the hue.
    // Buttons use the real accent as a fill with dark text.
    color: "#00a857",
  },
  h1: { margin: 0, fontSize: "24px", lineHeight: "1.25", fontWeight: 500, letterSpacing: "-0.01em", color: tokens.text },
  p: { margin: "0 0 14px", fontSize: "16px", lineHeight: "1.55", color: tokens.text },
  pMuted: { margin: "0 0 14px", fontSize: "14px", lineHeight: "1.55", color: tokens.muted },
  h2: { margin: "28px 0 10px", fontSize: "13px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: tokens.muted, fontFamily: fonts.mono },
  card: { backgroundColor: tokens.bg, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, padding: "16px 18px" },
  cardTitle: { margin: "0 0 2px", fontSize: "15px", fontWeight: 600, color: tokens.text },
  cardText: { margin: 0, fontSize: "14px", lineHeight: "1.5", color: tokens.muted },
  button: {
    backgroundColor: tokens.accent,
    color: tokens.onAccent,
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: "-0.01em",
    borderRadius: tokens.radius,
    padding: "12px 20px",
    textDecoration: "none",
    display: "inline-block",
  },
  footer: { padding: "22px 8px 0" },
  footerText: { margin: "0 0 6px", fontFamily: fonts.mono, fontSize: "12px", lineHeight: "1.6", color: tokens.muted },
  footerLink: { color: tokens.muted, textDecoration: "underline" },
  link: { color: tokens.text, textDecoration: "underline" },
} as const;

/** Header band, white content card, footer. `children` is the card body. */
export function EmailShell({
  preview,
  children,
  footerNote,
}: {
  preview: string;
  children: ReactNode;
  /** Optional extra line above the standard footer (e.g. campaign tags). */
  footerNote?: ReactNode;
}) {
  return (
    <Html lang="en">
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Section style={styles.outer}>
          <Container style={styles.container}>
            <Section style={styles.header}>
              <Link href={SITE.url}>
                <Img src={LOGO_URL} alt={SITE.name} width="200" height="28" style={{ display: "block", border: 0 }} />
              </Link>
              <Text style={styles.tagline}>{SITE.tagline}</Text>
            </Section>
            <Section style={styles.content}>{children}</Section>
            <Section style={styles.footer}>
              {footerNote}
              <Text style={styles.footerText}>
                <Link href={`mailto:${SITE.email}`} style={styles.footerLink}>
                  {SITE.email}
                </Link>
                {" · "}
                {LOCATION}
                {" · "}
                <Link href={`${SITE.url}/privacy`} style={styles.footerLink}>
                  Privacy Policy
                </Link>
              </Text>
            </Section>
          </Container>
        </Section>
      </Body>
    </Html>
  );
}

export function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Button href={href} style={styles.button}>
      {children}
    </Button>
  );
}

/** A lead's free text, keeping their own line breaks but letting clients wrap. */
export function MultilineText({ text, style }: { text: string; style?: React.CSSProperties }) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  return (
    <Text style={{ ...styles.p, margin: 0, ...style }}>
      {lines.map((line, i) => (
        <span key={i}>
          {line}
          {i < lines.length - 1 ? <br /> : null}
        </span>
      ))}
    </Text>
  );
}

/** "ali smith" → "Ali". First word only, first letter upper-cased, rest kept. */
export function firstNameOf(fullName: string): string {
  const first = fullName.trim().split(/\s+/)[0] || fullName.trim();
  return first.charAt(0).toUpperCase() + first.slice(1);
}

/** Split model or human text into paragraphs on blank lines. */
export function paragraphsOf(text: string): string[] {
  return text
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}
