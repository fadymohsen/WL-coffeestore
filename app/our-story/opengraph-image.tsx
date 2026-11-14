import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Our Story — DIWAN Coffee | قصتنا — ديوان قهوة";
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
        {/* Decorative line */}
        <div
          style={{
            width: 80,
            height: 3,
            backgroundColor: "#A8432C",
            marginBottom: 32,
            borderRadius: 2,
          }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#F4ECDC",
            marginBottom: 8,
          }}
        >
          Our Story
        </div>

        <div
          style={{
            fontSize: 38,
            color: "#F4ECDC",
            opacity: 0.6,
            marginBottom: 40,
          }}
        >
          قصتنا
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 22,
            color: "#F4ECDC",
            opacity: 0.8,
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.6,
          }}
        >
          Rooted in Egyptian culture, crafted with purpose
        </div>

        <div
          style={{
            fontSize: 20,
            color: "#F4ECDC",
            opacity: 0.5,
            marginTop: 12,
            textAlign: "center",
          }}
        >
          متجذرة في الثقافة المصرية، مصنوعة بهدف
        </div>

        {/* Brand badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 48,
            opacity: 0.6,
          }}
        >
          <div
            style={{
              width: 40,
              height: 2,
              backgroundColor: "#F4ECDC",
              borderRadius: 1,
            }}
          />
          <div
            style={{
              fontSize: 16,
              color: "#F4ECDC",
              letterSpacing: "0.2em",
            }}
          >
            DIWAN
          </div>
          <div
            style={{
              width: 40,
              height: 2,
              backgroundColor: "#F4ECDC",
              borderRadius: 1,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
