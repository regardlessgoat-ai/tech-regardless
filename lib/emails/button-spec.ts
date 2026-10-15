/**
 * Labels, sizes and URLs of the image buttons (lib/emails/images.tsx renders
 * them). Kept apart from the renderer so templates can lay a button out
 * without loading next/og.
 */
import { SITE } from "@/lib/utils";

export const BUTTON = { height: 46, padX: 24, fontSize: 15 } as const;

/** solid: near-black with white text. outline: white with a grey border. */
export type ButtonVariant = "solid" | "outline";

// Only these labels render, each in one variant, so the route cannot be used
// to put arbitrary text on an image under this domain. "Reply to <name>" is
// no longer sent but stays so operator emails already delivered keep their
// button.
const SOLID = /^(See recent work|Call|Text|Reply to [\p{L}' .-]{1,24})$/u;
const OUTLINE = /^Email$/;
export function isButtonLabel(label: string, variant: ButtonVariant = "solid"): boolean {
  return (variant === "outline" ? OUTLINE : SOLID).test(label);
}

// The operator email's Call / Text / Email row: equal widths so the three
// sit as one block, and three fit across a 390px phone.
const FIXED_WIDTH: Record<string, number> = { Call: 92, Text: 92, Email: 92 };

/** Display width in CSS px. Geist Medium averages ~0.56em per character. */
export function buttonWidth(label: string): number {
  return FIXED_WIDTH[label] ?? Math.ceil(label.length * BUTTON.fontSize * 0.56 + BUTTON.padX * 2);
}

export function buttonSrc(label: string, variant: ButtonVariant = "solid"): string {
  const v = variant === "outline" ? "&v=outline" : "";
  return `${SITE.url}/api/email/button?label=${encodeURIComponent(label)}${v}`;
}
