import { ImageResponse } from "next/og";
import { ogCard } from "@lacspace/og";
import { site } from "@/lib/site";

// ✨ Dynamic Open Graph images — every page gets a gorgeous, auto-fitting social
// card at /og?title=Your+Page+Title, designed by @lacspace/og. No design tool.
export const runtime = "edge";

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? site.config.name;
  const eyebrow = searchParams.get("eyebrow") ?? undefined;

  return new ImageResponse(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ogCard({
      title,
      eyebrow,
      subtitle: site.config.name,
      footer: site.config.url.replace(/^https?:\/\//, ""),
      logo: "L",
      from: "#6366f1",
      to: "#a855f7",
    }) as any,
    { width: 1200, height: 630 },
  );
}
