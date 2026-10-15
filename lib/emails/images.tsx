/**
 * The two pieces of the emails that are pictures, not HTML: the logo badge and
 * the call-to-action buttons. Gmail iOS repaints colours and forces button text
 * white in dark mode; it never recolours an image, so these read the same in
 * every client and theme. Both render at 2x and are shown at half size.
 *
 * The badge is static (public/brand/email-badge.png, written by
 * scripts/email-assets.tsx). Buttons are served by app/api/email/button so the
 * operator's "Reply to <name>" can carry the lead's name.
 */
import * as React from "react";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { BUTTON, buttonWidth, type ButtonVariant } from "./button-spec";

// Vendored from node_modules/geist so the route bundle can trace them
// (next.config.mjs outputFileTracingIncludes).
const ASSETS = join(process.cwd(), "lib/emails/assets");
const fontCache: Record<string, Promise<Buffer>> = {};
function font(file: string) {
  return (fontCache[file] ??= readFile(join(ASSETS, file)));
}

const INK = "#0a0a0a";
const WHITE = "#ffffff";
const GREEN = "#00ff88";
const OUTLINE_BORDER = "#d4d4d8";

// ── Badge ────────────────────────────────────────────────────────────────────
export const BADGE = { width: 172, height: 40 } as const;

export async function renderBadge(): Promise<ImageResponse> {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: INK,
          borderRadius: 9999,
          color: WHITE,
          fontFamily: "Geist Mono",
          fontSize: 30,
          letterSpacing: "-0.01em",
        }}
      >
        Tech<span style={{ color: GREEN }}>.</span>Regardless
      </div>
    ),
    {
      width: BADGE.width * 2,
      height: BADGE.height * 2,
      fonts: [{ name: "Geist Mono", data: await font("GeistMono-Medium.ttf"), weight: 500 }],
    }
  );
}

// ── Buttons ──────────────────────────────────────────────────────────────────
export async function renderButton(label: string, variant: ButtonVariant = "solid"): Promise<ImageResponse> {
  const width = buttonWidth(label);
  const outline = variant === "outline";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: outline ? WHITE : INK,
          // 2px at 2x = a 1px border on screen
          border: outline ? `2px solid ${OUTLINE_BORDER}` : "none",
          borderRadius: 16,
          color: outline ? INK : WHITE,
          fontFamily: "Geist",
          fontSize: BUTTON.fontSize * 2,
          letterSpacing: "-0.01em",
        }}
      >
        {label}
      </div>
    ),
    {
      width: width * 2,
      height: BUTTON.height * 2,
      fonts: [{ name: "Geist", data: await font("Geist-Medium.ttf"), weight: 500 }],
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    }
  );
}
