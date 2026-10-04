import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { Aurora } from "@/components/aurora";
import { Section, Pill, StatCard, FeatureCard, Testimonial, Steps, CTABand, Bento, AreaChart, Newsletter, Badge, Callout, Accordion, FAQ, Tabs, Timeline, PricingTable, LogoCloud, StatBand, TeamGrid, FeatureSplit, Gallery, Rating, Progress, Breadcrumbs, Avatar, AvatarGroup } from "@/components/ui";

export const metadata: Metadata = site.meta({ title: "About", path: "/about", description: "The story, the team and the values behind LSFolio." });

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Aurora />
      <section className="mx-auto max-w-3xl px-6 py-24">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
        <h1 className="mt-6 text-4xl font-bold sm:text-5xl">About <span className="gradient-text">LSFolio</span></h1>
        <p className="mt-4 text-lg text-muted">LSFolio exists to help you ship something you're proud of — faster, and with less fuss. Here's who we are and what we believe.</p>
      </section>
      <Section className="pt-0"><StatBand stats={[{"value":"10k+","label":"Monthly visitors"},{"value":"99.9%","label":"Uptime"},{"value":"4.9★","label":"Average rating"},{"value":"<1s","label":"Load time"}]} /></Section>
      <Section eyebrow="Our story" title="How we got here" className="pt-0">
        <div className="mx-auto max-w-2xl"><Timeline items={[{"date":"Then","title":"Discover","desc":"We learn what LSFolio needs and map the fastest path to value."},{"date":"Next","title":"Design","desc":"We shape the experience and validate it early with real content."},{"date":"Now","title":"Build","desc":"We ship in weekly increments you can see and steer."},{"date":"Ahead","title":"Launch","desc":"We go live, measure, and keep improving together."}]} /></div>
      </Section>
      <Section eyebrow="What we value" title="Principles we won't compromise" className="pt-0">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[{"title":"Craft","desc":"We care about the details others skip."},{"title":"Speed","desc":"We ship early and iterate in the open."},{"title":"Honesty","desc":"Clear pricing, clear timelines, no surprises."},{"title":"Partnership","desc":"Your goals are our goals."}].map((v) => <FeatureCard key={v.title} title={v.title} desc={v.desc} />)}
        </div>
      </Section>
      <Section eyebrow="The team" title="The people behind LSFolio" className="pt-0">
        <TeamGrid members={[{"name":"Alex Morgan","role":"Founder & CEO","bio":"Sets the vision and keeps us honest."},{"name":"Riya Sharma","role":"Head of Design","bio":"Makes every pixel earn its place."},{"name":"Chris Doyle","role":"Lead Engineer","bio":"Ships fast without breaking things."}]} />
      </Section>
      <Section title="Frequently asked" className="pt-0"><FAQ items={[{"q":"Is LSFolio really production-ready?","a":"Yes — every LSFolio page is server-rendered, SEO-optimized and ships with sensible security headers out of the box."},{"q":"How do I get started?","a":"Clone the project, run npm install and npm run dev — you'll have a live site in under a minute."},{"q":"Can I customize the design?","a":"Completely. Colours, fonts and layout are token-driven, so a few edits reskin the whole site."},{"q":"Is it accessible and fast?","a":"Built mobile-first with semantic HTML, keyboard support and a strong Lighthouse baseline."}]} /></Section>
      <CTABand title="Let's build something together" subtitle="We'd love to hear what you're working on." ctaLabel="Get in touch" ctaHref="/contact" />
    </main>
  );
}
