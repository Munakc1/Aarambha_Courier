import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { Aurora } from "@/components/aurora";
import { Section, Pill, StatCard, FeatureCard, Testimonial, Steps, CTABand, Bento, AreaChart, Newsletter, Badge, Callout, Accordion, FAQ, Tabs, Timeline, PricingTable, LogoCloud, StatBand, TeamGrid, FeatureSplit, Gallery, Rating, Progress, Breadcrumbs, Avatar, AvatarGroup } from "@/components/ui";

export const metadata: Metadata = site.meta({ title: "Uses", path: "/uses", description: "The gear, apps and tools LSFolio uses every day." });

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Aurora />
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <Pill>Uses</Pill>
        <h1 className="mt-4 text-4xl font-bold sm:text-5xl">What I <span className="gradient-text">use</span></h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted">The gear and software behind the work.</p>
      </section>
      <Section title="Editor & tools" className="pt-0">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: "🖥️", title: "VS Code", desc: "My editor of choice, tuned to the bone." },
            { icon: "⚡", title: "Next.js", desc: "The React framework behind everything I ship." },
            { icon: "🎨", title: "Figma", desc: "Where every design starts." },
            { icon: "⌨️", title: "Raycast", desc: "Launcher, clipboard history and snippets." },
            { icon: "🧠", title: "Obsidian", desc: "Notes and a second brain." },
            { icon: "🎧", title: "Focus playlist", desc: "Lo-fi, always." },
          ].map((f) => <FeatureCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} />)}
        </div>
      </Section>

    </main>
  );
}
