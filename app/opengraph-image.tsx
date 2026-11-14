import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "DIWAN — Coffee for Every Culture | قهوة لكل ثقافة";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0E3A33",
          fontFamily: "serif",
        }}
      >
        {/* Decorative top line */}
        <div
          style={{
            width: 80,
            height: 3,
            backgroundColor: "#A8432C",
            marginBottom: 32,
            borderRadius: 2,
          }}
        />

        {/* Brand name */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: "#F4ECDC",
            letterSpacing: "0.12em",
            marginBottom: 8,
          }}
        >
          DIWAN
        </div>

        {/* Arabic brand name */}
        <div
          style={{
            fontSize: 42,
            color: "#F4ECDC",
            opacity: 0.7,
            marginBottom: 40,
          }}
        >
          ديوان
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 24,
            color: "#F4ECDC",
            opacity: 0.85,
            letterSpacing: "0.08em",
          }}
        >
          Coffee for Every Culture
        </div>

        {/* Arabic tagline */}
        <div
          style={{
            fontSize: 22,
            color: "#F4ECDC",
            opacity: 0.6,
            marginTop: 12,
          }}
        >
          قهوة لكل ثقافة
        </div>

        {/* Decorative bottom line */}
        <div
          style={{
            width: 80,
            height: 3,
            backgroundColor: "#A8432C",
            marginTop: 32,
            borderRadius: 2,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
