import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { Aurora } from "@/components/aurora";
import { Section, Pill, StatCard, FeatureCard, Testimonial, Steps, CTABand, Bento, AreaChart, Newsletter, Badge, Callout, Accordion, FAQ, Tabs, Timeline, PricingTable, LogoCloud, StatBand, TeamGrid, FeatureSplit, Gallery, Rating, Progress, Breadcrumbs, Avatar, AvatarGroup } from "@/components/ui";

export const metadata: Metadata = site.meta({ title: "Work", path: "/work", description: "Selected projects by LSFolio." });

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Aurora />
      <section className="mx-auto max-w-3xl px-6 py-24">
        <Pill>Work</Pill>
        <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Selected <span className="gradient-text">work</span></h1>
        <p className="mt-4 text-lg text-muted">A few things I've designed and built recently.</p>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Aurora", tag: "Product design", year: "2026" },
            { title: "Northwind", tag: "Web app", year: "2025" },
            { title: "Lumen", tag: "Branding", year: "2025" },
            { title: "Harbor", tag: "Mobile app", year: "2024" },
            { title: "Cadence", tag: "Design system", year: "2024" },
            { title: "Meadow", tag: "Marketing site", year: "2023" },
          ].map((p) => (
            <div key={p.title} className="group rounded-2xl border border-hairline bg-surface p-6 transition hover:-translate-y-1">
              <div className="mb-4 aspect-video rounded-xl gradient-bg opacity-80 transition group-hover:opacity-100" />
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{p.title}</h3>
                <span className="text-xs text-faint">{p.year}</span>
              </div>
              <p className="mt-1 text-sm text-muted">{p.tag}</p>
            </div>
          ))}
        </div>
      </section>
      <CTABand title="Have something in mind?" subtitle="I'm currently open to new projects." ctaLabel="Get in touch" ctaHref="/contact" />
    </main>
  );
}
