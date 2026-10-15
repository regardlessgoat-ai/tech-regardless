/**
 * Size and URL of the image buttons (lib/emails/images.tsx renders them).
 * Kept apart from the renderer so templates can lay a button out without
 * loading next/og.
 */
import { SITE } from "@/lib/utils";

export const BUTTON = { height: 46, padX: 24, fontSize: 15 } as const;

// Only these labels render, so the route cannot be used to put arbitrary text
// on an image under this domain.
const LABEL = /^(See recent work|Reply to [\p{L}' .-]{1,24})$/u;
export function isButtonLabel(label: string): boolean {
  return LABEL.test(label);
}

/** Display width in CSS px. Geist Medium averages ~0.56em per character. */
export function buttonWidth(label: string): number {
  return Math.ceil(label.length * BUTTON.fontSize * 0.56 + BUTTON.padX * 2);
}

export function buttonSrc(label: string): string {
  return `${SITE.url}/api/email/button?label=${encodeURIComponent(label)}`;
}
