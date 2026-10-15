/**
 * Shared shell for every email the site sends: an intentional light theme
 * (the site's :root tokens in app/globals.css), with the brand green as an
 * accent only: the thin bar on the card and the small step circles.
 *
 * Why light, and why images: Gmail iOS repaints dark emails light and forces
 * button text white in its dark mode, so a dark design can't survive it. A
 * light layout is what it expects, and the two things that must look exact,
 * the logo and the buttons, are PNGs (lib/emails/images.tsx), which no client
 * recolours.
 *
 * Email constraints, all deliberate:
 * - inline styles only (no <style> block, no media queries)
 * - color-scheme light only, explicit background and text colour on every
 *   container
 * - images are hosted on the live site and carry alt text and fixed sizes
 * - 600px max width, fluid below that
 */
import * as React from "react";
import { Body, Container, Head, Html, Img, Link, Preview, Section, Text } from "@react-email/components";
import type { ReactNode } from "react";
import { SITE } from "@/lib/utils";
import { BUTTON, buttonSrc, buttonWidth, type ButtonVariant } from "./button-spec";

export const tokens = {
  // app/globals.css :root
  bg: "#fafaf7",
  card: "#ffffff",
  inset: "#fafaf7",
  border: "#e1e1e6",
  text: "#0a0a0a",
  muted: "#71717a",
  // Slightly deeper than the site accent (#00ff88) so the bar and the step
  // circles hold up on white.
  bar: "#00d673",
  radius: "8px",
} as const;

export const fonts = {
  sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  mono: '"SF Mono", SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
} as const;

// public/brand/email-badge.png, transparent, 2x. scripts/email-assets.tsx.
export const BADGE_URL = `${SITE.url}/brand/email-badge.png`;

const label = {
  fontFamily: fonts.sans,
  fontSize: "11px",
  lineHeight: "16px",
  fontWeight: 400,
  letterSpacing: "0.14em",
  textTransform: "uppercase" as const,
  color: tokens.muted,
};

export const styles = {
  body: { margin: 0, padding: 0, backgroundColor: tokens.bg, fontFamily: fonts.sans, color: tokens.text },
  outer: { backgroundColor: tokens.bg, padding: "28px 12px" },
  container: { backgroundColor: tokens.bg, maxWidth: "600px", width: "100%", margin: "0 auto" },
  content: {
    backgroundColor: tokens.card,
    border: `1px solid ${tokens.border}`,
    borderTop: `3px solid ${tokens.bar}`,
    borderRadius: tokens.radius,
    padding: "28px 28px 30px",
  },
  label: { ...label, margin: 0 },
  h1: { margin: 0, fontSize: "24px", lineHeight: "1.25", fontWeight: 500, letterSpacing: "-0.01em", color: tokens.text },
  p: { margin: "0 0 14px", fontSize: "16px", lineHeight: "1.55", color: tokens.text },
  pMuted: { margin: "0 0 14px", fontSize: "14px", lineHeight: "1.55", color: tokens.muted },
  h2: { ...label, margin: "30px 0 10px" },
  card: { backgroundColor: tokens.inset, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, padding: "16px 18px" },
  cardText: { margin: 0, fontSize: "14px", lineHeight: "1.5", color: tokens.muted },
  footer: { backgroundColor: tokens.bg, padding: "18px 4px 0" },
  footerText: { margin: 0, fontFamily: fonts.sans, fontSize: "12px", lineHeight: "1.6", color: tokens.muted },
  footerLink: { color: tokens.muted, textDecoration: "underline" },
  link: { color: tokens.text, textDecoration: "underline" },
} as const;

/** The badge PNG, linked to the site. */
export function Badge() {
  return (
    <Link href={SITE.url}>
      <Img src={BADGE_URL} alt={SITE.name} width="172" height="40" style={{ display: "block", border: 0 }} />
    </Link>
  );
}

/**
 * The frame both emails share: off-white page, white card with the green bar
 * on top, a small grey footer under the card. `children` is the card body,
 * badge included, since each email lays its top row out differently.
 */
export function EmailShell({ preview, children, footer }: { preview: string; children: ReactNode; footer: ReactNode }) {
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
            <Section style={styles.content}>{children}</Section>
            <Section style={styles.footer}>
              <Text style={styles.footerText}>{footer}</Text>
            </Section>
          </Container>
        </Section>
      </Body>
    </Html>
  );
}

/**
 * A call to action drawn as an image (app/api/email/button), wrapped in the
 * link. `alt` says where it goes, for clients that block images.
 */
export function ImageButton({
  href,
  label,
  alt,
  variant = "solid",
}: {
  href: string;
  label: string;
  alt: string;
  variant?: ButtonVariant;
}) {
  return (
    <Link href={href} style={{ display: "inline-block", textDecoration: "none" }}>
      <Img
        src={buttonSrc(label, variant)}
        alt={alt}
        width={String(buttonWidth(label))}
        height={String(BUTTON.height)}
        style={{ display: "block", border: 0 }}
      />
    </Link>
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
