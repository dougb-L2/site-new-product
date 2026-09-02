import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site-config";

// Generated at build time, so every site created from this template gets a
// correct Open Graph image from its own site-config — no binary asset to
// remember to replace, and no blank social preview if someone forgets.
// Next emits og:image and twitter:image from this file automatically.
export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#1a1a2e",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            fontSize: 30,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#F48B00",
            marginBottom: 32,
          }}
        >
          Learn2
        </div>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>
          {SITE_NAME}
        </div>
        <div
          style={{
            fontSize: 32,
            lineHeight: 1.4,
            marginTop: 28,
            color: "#c9c9d4",
            maxWidth: 900,
          }}
        >
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    size
  );
}
