import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { Aurora } from "@/components/aurora";
import { Section, Pill, StatCard, FeatureCard, Testimonial, Steps, CTABand, Bento, AreaChart, Newsletter, Badge, Callout, Accordion, FAQ, Tabs, Timeline, PricingTable, LogoCloud, StatBand, TeamGrid, FeatureSplit, Gallery, Rating, Progress, Breadcrumbs, Avatar, AvatarGroup } from "@/components/ui";

export const metadata: Metadata = site.meta({ title: "Careers", path: "/careers", description: "Join the team building LSFolio." });

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Aurora />
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <Pill>Careers</Pill>
        <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Join the <span className="gradient-text">team</span></h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted">We're a small team doing our best work. If that sounds like you, say hello.</p>
      </section>
      <Section className="pt-0">
        <FeatureSplit eyebrow="Why us" title="A place to do your best work" desc="Small team, big ownership, and the support to grow." bullets={["Remote-first and async-friendly","Real ownership from day one","Learning budget and great gear"]} media={<div className="grid h-52 place-items-center text-7xl">🚀</div>} />
      </Section>
      <Section className="pt-0"><StatBand stats={[{"value":"10k+","label":"Monthly visitors"},{"value":"99.9%","label":"Uptime"},{"value":"4.9★","label":"Average rating"},{"value":"<1s","label":"Load time"}]} /></Section>
      <Section eyebrow="Highlights" title="What you get" className="pt-0">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[{"icon":"🌍","title":"Remote-first","desc":"Work from anywhere, on your schedule."},{"icon":"📈","title":"Grow fast","desc":"Mentorship and a budget to level up."},{"icon":"🤝","title":"Real ownership","desc":"Ship things that matter, end to end."},{"icon":"🏖️","title":"Time to recharge","desc":"Generous, actually-used time off."},{"icon":"💙","title":"Great people","desc":"Kind, sharp teammates who have your back."},{"icon":"💸","title":"Fair pay","desc":"Transparent, competitive compensation."}].map((f) => <FeatureCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} />)}
        </div>
      </Section>
      <Section eyebrow="Open roles" title="We're hiring" className="pt-0">
        <div className="mx-auto grid max-w-3xl gap-4">
          {[
            { role: "Senior Frontend Engineer", team: "Engineering", type: "Full-time · Remote" },
            { role: "Product Designer", team: "Design", type: "Full-time · Remote" },
            { role: "Developer Advocate", team: "Growth", type: "Full-time · Remote" },
          ].map((j) => (
            <div key={j.role} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-hairline bg-surface p-5">
              <div><h3 className="font-semibold">{j.role}</h3><p className="text-sm text-muted">{j.team}</p></div>
              <div className="flex items-center gap-3"><Badge>{j.type}</Badge><Link href="/contact" className="rounded-full gradient-bg px-4 py-2 text-sm font-semibold on-accent">Apply</Link></div>
            </div>
          ))}
        </div>
      </Section>
      <CTABand title="Don't see your role?" subtitle="We're always keen to meet great people." ctaLabel="Send an intro" ctaHref="/contact" />
    </main>
  );
}
