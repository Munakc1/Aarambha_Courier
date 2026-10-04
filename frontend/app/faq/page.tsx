import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { Aurora } from "@/components/aurora";
import { Section, Pill, StatCard, FeatureCard, Testimonial, Steps, CTABand, Bento, AreaChart, Newsletter, Badge, Callout, Accordion, FAQ, Tabs, Timeline, PricingTable, LogoCloud, StatBand, TeamGrid, FeatureSplit, Gallery, Rating, Progress, Breadcrumbs, Avatar, AvatarGroup } from "@/components/ui";

export const metadata: Metadata = site.meta({ title: "FAQ", path: "/faq", description: "Answers to common questions about LSFolio." });

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Aurora />
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <Pill>FAQ</Pill>
        <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Frequently asked <span className="gradient-text">questions</span></h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted">Everything you need to know about LSFolio. Can't find an answer? Get in touch.</p>
      </section>
      <Section className="pt-0"><FAQ items={[{"q":"Is LSFolio really production-ready?","a":"Yes — every LSFolio page is server-rendered, SEO-optimized and ships with sensible security headers out of the box."},{"q":"How do I get started?","a":"Clone the project, run npm install and npm run dev — you'll have a live site in under a minute."},{"q":"Can I customize the design?","a":"Completely. Colours, fonts and layout are token-driven, so a few edits reskin the whole site."},{"q":"Is it accessible and fast?","a":"Built mobile-first with semantic HTML, keyboard support and a strong Lighthouse baseline."},{"q":"Do you support dark mode?","a":"Yes — light, dark and system themes with a no-flash script, powered by @lacspace/theme."},{"q":"How do I deploy?","a":"Deploy to any Node host or Vercel in one click — sitemap, robots and OG images are all wired up."}]} /></Section>
      <CTABand title="Still have questions?" subtitle="We're happy to help — reach out any time." ctaLabel="Contact us" ctaHref="/contact" />
    </main>
  );
}
