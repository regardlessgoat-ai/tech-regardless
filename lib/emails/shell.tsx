/**
 * Shared shell for every email the site sends. The tokens mirror the site's
 * dark theme in app/globals.css (.dark: near-black page, #121212 cards,
 * electric green accent) so a message reads as the same brand as the page it
 * came from.
 *
 * Email constraints, all deliberate:
 * - inline styles only (no <style> block, no media queries)
 * - one dark theme, declared as such in the color-scheme metas, with an
 *   explicit background and text colour on every container, so clients that
 *   auto-darken (Gmail iOS) have nothing light left to half-invert
 * - the wordmark is a hosted PNG (SVG is stripped by Gmail) with the header
 *   colour baked in, not transparent: on a transparent PNG Gmail's inversion
 *   put the white letters on a light box
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
  // app/globals.css .dark
  bg: "#0a0a0a",
  card: "#121212",
  inset: "#171717",
  border: "#262626",
  text: "#fafafa",
  muted: "#a1a1aa",
  accent: "#00ff88",
  onAccent: "#0a0a0a",
  radius: "4px",
} as const;

export const fonts = {
  sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  mono: '"SF Mono", SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
} as const;

// public/brand/wordmark-dark.png: wordmark.png flattened onto tokens.bg.
export const LOGO_URL = `${SITE.url}/brand/wordmark-dark.png`;
export const LOCATION = "Kissimmee, FL";

export const styles = {
  body: { margin: 0, padding: 0, backgroundColor: tokens.bg, fontFamily: fonts.sans, color: tokens.text },
  outer: { backgroundColor: tokens.bg, padding: "24px 12px" },
  container: { backgroundColor: tokens.bg, maxWidth: "600px", width: "100%", margin: "0 auto" },
  header: { backgroundColor: tokens.bg, padding: "8px 4px 24px" },
  tagline: {
    margin: "14px 0 0",
    fontFamily: fonts.mono,
    fontSize: "11px",
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: tokens.muted,
  },
  content: {
    backgroundColor: tokens.card,
    border: `1px solid ${tokens.border}`,
    borderRadius: tokens.radius,
    padding: "28px 28px 32px",
  },
  eyebrow: {
    margin: "0 0 10px",
    fontFamily: fonts.mono,
    fontSize: "11px",
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: tokens.accent,
  },
  h1: { margin: 0, fontSize: "24px", lineHeight: "1.25", fontWeight: 500, letterSpacing: "-0.01em", color: tokens.text },
  p: { margin: "0 0 14px", fontSize: "16px", lineHeight: "1.55", color: tokens.text },
  pMuted: { margin: "0 0 14px", fontSize: "14px", lineHeight: "1.55", color: tokens.muted },
  h2: { margin: "28px 0 10px", fontSize: "13px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: tokens.muted, fontFamily: fonts.mono },
  card: { backgroundColor: tokens.inset, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, padding: "16px 18px" },
  cardTitle: { margin: "0 0 2px", fontSize: "15px", fontWeight: 600, color: tokens.text },
  cardText: { margin: 0, fontSize: "14px", lineHeight: "1.5", color: tokens.muted },
  button: {
    backgroundColor: tokens.accent,
    // Gmail's dark mode recolours background-color but leaves background-image
    // alone, so the gradient keeps the fill the real brand green.
    backgroundImage: `linear-gradient(${tokens.accent}, ${tokens.accent})`,
    color: tokens.onAccent,
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: "-0.01em",
    borderRadius: tokens.radius,
    padding: "12px 20px",
    textDecoration: "none",
    display: "inline-block",
  },
  footer: { backgroundColor: tokens.bg, padding: "22px 4px 0" },
  footerText: { margin: "0 0 6px", fontFamily: fonts.mono, fontSize: "12px", lineHeight: "1.6", color: tokens.muted },
  footerLink: { color: tokens.muted, textDecoration: "underline" },
  link: { color: tokens.text, textDecoration: "underline" },
} as const;

/** Header, content card, footer, all on the dark page. `children` is the card body. */
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
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Section style={styles.outer}>
          <Container style={styles.container}>
            <Section style={styles.header}>
              <Link href={SITE.url}>
                <Img src={LOGO_URL} alt={SITE.name} width="200" height="28" style={{ display: "block", border: 0, backgroundColor: tokens.bg }} />
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
