import { ImageResponse } from "next/og";

// ✨ Auto-generated favicon — a branded icon from your accent, no design file.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #6366f1, #a855f7)", color: "white", fontSize: 40, fontWeight: 800, fontFamily: "sans-serif", borderRadius: 14 }}>
        L
      </div>
    ),
    { ...size },
  );
}
