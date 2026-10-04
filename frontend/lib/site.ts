import { defineSite } from "@lacspace/seo";

/** Your site's SEO configuration — set once, used everywhere. */
export const site = defineSite({
  name: "LSFolio",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  description: "Developer, designer & maker. Selected work and writing.",
  // twitter: "yourhandle",
  ogImage: "/og", // ✨ auto social-share images — see app/og/route.tsx
});
