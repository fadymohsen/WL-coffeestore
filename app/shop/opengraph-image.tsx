import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Shop DIWAN Coffee | تسوّق قهوة ديوان";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  const products = [
    { name: "Uns", nameAr: "أُنس", type: "Blend", color: "#6B4226" },
    { name: "Majlis", nameAr: "مجلس", type: "Blend", color: "#8B6914" },
    { name: "Rihla", nameAr: "رحلة", type: "Specialty", color: "#2D5A27" },
    { name: "Sultan", nameAr: "سلطان", type: "Turkish", color: "#A8432C" },
  ];

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
        {/* Header */}
        <div
          style={{
            fontSize: 18,
            color: "#F4ECDC",
            opacity: 0.5,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          DIWAN Coffee Collection
        </div>

        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#F4ECDC",
            marginBottom: 12,
          }}
        >
          Shop Our Coffee
        </div>

        <div
          style={{
            fontSize: 32,
            color: "#F4ECDC",
            opacity: 0.6,
            marginBottom: 48,
          }}
        >
          تسوّق قهوتنا
        </div>

        {/* Product badges */}
        <div
          style={{
            display: "flex",
            gap: 24,
          }}
        >
          {products.map((p) => (
            <div
              key={p.name}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 100,
                  backgroundColor: p.color,
                  borderRadius: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <div style={{ fontSize: 10, color: "#F4ECDC", opacity: 0.7 }}>
                  DIWAN
                </div>
                <div
                  style={{
                    fontSize: 8,
                    color: "#F4ECDC",
                    opacity: 0.5,
                    marginTop: 4,
                  }}
                >
                  {p.type}
                </div>
              </div>
              <div style={{ fontSize: 16, color: "#F4ECDC", fontWeight: 600 }}>
                {p.name}
              </div>
              <div style={{ fontSize: 14, color: "#F4ECDC", opacity: 0.5 }}>
                {p.nameAr}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
