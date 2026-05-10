import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Tech.Regardless — Websites that work. Regardless.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(ellipse at top, rgba(0, 255, 136, 0.18), transparent 60%), #0a0a0a",
          color: "#fafafa",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: 28,
            color: "#a1a1aa",
            display: "flex",
          }}
        >
          Tech<span style={{ color: "#00ff88" }}>.</span>Regardless
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 110,
              fontWeight: 500,
              lineHeight: 1.02,
              letterSpacing: "-0.04em",
            }}
          >
            Websites that work.
          </div>
          <div
            style={{
              fontSize: 110,
              fontWeight: 500,
              lineHeight: 1.02,
              letterSpacing: "-0.04em",
              color: "#a1a1aa",
            }}
          >
            Regardless.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "ui-monospace, monospace",
            fontSize: 22,
            color: "#a1a1aa",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
          }}
        >
          <span>Freelance · Web Design</span>
          <span style={{ color: "#00ff88" }}>● Available May 2026</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
