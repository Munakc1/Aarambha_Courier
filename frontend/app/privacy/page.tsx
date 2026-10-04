import type { Metadata } from "next";
import { site } from "@/lib/site";
import { UnderDevelopment } from "@/components/under-development";

export const metadata: Metadata = site.meta({ title: "Privacy", path: "/privacy", description: "Privacy — coming soon. We're building this page." });

export default function Page() {
  return (
    <main className="min-h-screen">
      <UnderDevelopment title={"Privacy"} path={"/privacy"} />
    </main>
  );
}
