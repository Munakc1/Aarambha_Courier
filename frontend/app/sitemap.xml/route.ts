import { sitemapForSite } from "@lacspace/sitemap";
import { site } from "@/lib/site";

export function GET() {
  const xml = sitemapForSite(site.config, ["/", "/about", "/contact"]);
  return new Response(xml, { headers: { "content-type": "application/xml" } });
}
