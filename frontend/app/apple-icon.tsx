import { ImageResponse } from "next/og";

// ✨ Auto-generated Apple touch icon.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #6366f1, #a855f7)", color: "white", fontSize: 104, fontWeight: 800, fontFamily: "sans-serif" }}>
        L
      </div>
    ),
    { ...size },
  );
}
