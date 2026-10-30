import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { Aurora } from "@/components/aurora";
import {
  Section,
  Pill,
  FeatureCard,
  CTABand,
  Badge,
  FeatureSplit,
} from "@/components/ui";

export const metadata: Metadata = site.meta({
  title: "Careers",
  path: "/careers",
  description:
    "Explore career opportunities at Aarambha Courier and Transport Service and join our growing logistics team in Nepal.",
});

type Job = {
  id: string;
  role: string;
  team: string;
  type: string;
  description: string;
};

const jobs: Job[] = [
  {
    id: "operations-logistics-assistant",
    role: "Operations & Logistics Assistant",
    team: "Operations",
    type: "Full-time",
    description:
      "Support daily courier operations, coordinate pickups, assist with shipment handling, and follow up on deliveries.",
  },
  {
    id: "customer-support-executive",
    role: "Customer Support Executive",
    team: "Customer Support",
    type: "Full-time",
    description:
      "Assist customers and business clients with shipment updates, pickup requests, delivery questions, and service-related support.",
  },
  {
    id: "business-development-executive",
    role: "Business Development Executive",
    team: "Business Development",
    type: "Full-time",
    description:
      "Build relationships with online sellers and businesses that need dependable courier and logistics services.",
  },
];

const benefits = [
  {
    icon: "📦",
    title: "Meaningful Work",
    desc: "Help businesses and customers move their shipments more efficiently across Nepal.",
  },
  {
    icon: "🤝",
    title: "Collaborative Team",
    desc: "Work with people who value teamwork, clear communication, and responsibility.",
  },
  {
    icon: "📈",
    title: "Learn and Grow",
    desc: "Develop practical skills in logistics, operations, customer service, and business.",
  },
  {
    icon: "🏢",
    title: "Business Experience",
    desc: "Work with online sellers, growing businesses, and customers from different industries.",
  },
  {
    icon: "🚚",
    title: "Real-World Experience",
    desc: "Gain hands-on experience in the day-to-day operations of a courier and logistics company.",
  },
  {
    icon: "💡",
    title: "Your Ideas Matter",
    desc: "Share practical ideas that can help improve our services and customer experience.",
  },
];

export default function CareersPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Aurora />

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <Pill>Careers at Aarambha</Pill>

        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Build your career with{" "}
          <span className="gradient-text">Aarambha</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted">
          Join Aarambha Courier and Transport Service and help us provide
          reliable courier and logistics support for businesses and customers
          across Nepal.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="#open-roles"
            className="rounded-full gradient-bg px-6 py-3 text-sm font-semibold on-accent transition hover:opacity-90"
          >
            View Open Positions
          </Link>

          <Link
            href="/contact"
            className="rounded-full border border-hairline bg-surface px-6 py-3 text-sm font-semibold transition hover:bg-surface/80"
          >
            Contact Us
          </Link>
        </div>
      </section>

      {/* Why Aarambha */}
      <Section className="pt-0">
        <FeatureSplit
          eyebrow="Why Aarambha"
          title="Do work that makes a difference"
          desc="Courier and logistics services are about more than moving parcels. They help businesses serve their customers and make everyday deliveries easier."
          bullets={[
            "Work with growing businesses and online sellers",
            "Gain practical experience in logistics and operations",
            "Take responsibility and contribute your ideas",
            "Grow with a developing logistics company in Nepal",
          ]}
          media={
            <div className="grid h-56 place-items-center rounded-2xl bg-brand/10 text-7xl">
              🚚
            </div>
          }
        />
      </Section>

      {/* Company Focus */}
      <Section className="pt-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-hairline bg-surface p-6">
            <p className="text-2xl font-bold">Nepal</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Focused on courier and logistics services across Nepal.
            </p>
          </div>

          <div className="rounded-2xl border border-hairline bg-surface p-6">
            <p className="text-2xl font-bold">Businesses</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Supporting online sellers and growing businesses.
            </p>
          </div>

          <div className="rounded-2xl border border-hairline bg-surface p-6">
            <p className="text-2xl font-bold">Customers</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Focused on dependable service and clear communication.
            </p>
          </div>

          <div className="rounded-2xl border border-hairline bg-surface p-6">
            <p className="text-2xl font-bold">Growth</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Opportunities to learn, contribute, and take responsibility.
            </p>
          </div>
        </div>
      </Section>

      {/* Benefits */}
      <Section
        eyebrow="Life at Aarambha"
        title="What you can expect"
        className="pt-0"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <FeatureCard
              key={benefit.title}
              icon={benefit.icon}
              title={benefit.title}
              desc={benefit.desc}
            />
          ))}
        </div>
      </Section>

      {/* Open Positions */}
      <Section
        eyebrow="Open positions"
        title="Join our team"
        className="pt-0"
      >
        <div id="open-roles" className="mx-auto grid max-w-4xl gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-2xl border border-hairline bg-surface p-6 transition hover:-translate-y-0.5"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold">{job.role}</h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge>{job.team}</Badge>
                    <Badge>{job.type}</Badge>
                  </div>

                  <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
                    {job.description}
                  </p>
                </div>

                <Link
                  href={`/contact?job=${encodeURIComponent(
                    job.role
                  )}&team=${encodeURIComponent(job.team)}`}
                  className="shrink-0 rounded-full gradient-bg px-5 py-2.5 text-sm font-semibold on-accent transition hover:opacity-90"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* General Application */}
        <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-hairline bg-surface p-7 text-center">
          <h3 className="text-xl font-semibold">
            Do not see a suitable position?
          </h3>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted">
            We are always interested in hearing from people who can bring
            useful skills, experience, and ideas to Aarambha.
          </p>

          <Link
            href="/contact?job=General%20Application"
            className="mt-5 inline-flex rounded-full gradient-bg px-5 py-2.5 text-sm font-semibold on-accent transition hover:opacity-90"
          >
            Send Your Introduction
          </Link>
        </div>
      </Section>

      {/* Hiring Process */}
      <Section
        eyebrow="Our hiring process"
        title="A simple way to get started"
        className="pt-0"
      >
        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-hairline bg-surface p-6">
            <span className="text-2xl font-bold">01</span>

            <h3 className="mt-4 font-semibold">Apply</h3>

            <p className="mt-2 text-sm leading-6 text-muted">
              Send us your details and let us know which position interests
              you.
            </p>
          </div>

          <div className="rounded-2xl border border-hairline bg-surface p-6">
            <span className="text-2xl font-bold">02</span>

            <h3 className="mt-4 font-semibold">Talk with us</h3>

            <p className="mt-2 text-sm leading-6 text-muted">
              We will learn about your experience, skills, and how you could
              contribute to the team.
            </p>
          </div>

          <div className="rounded-2xl border border-hairline bg-surface p-6">
            <span className="text-2xl font-bold">03</span>

            <h3 className="mt-4 font-semibold">Join Aarambha</h3>

            <p className="mt-2 text-sm leading-6 text-muted">
              If there is a good fit, we will discuss the next steps with you.
            </p>
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <CTABand
        title="Ready to join Aarambha?"
        subtitle="Tell us about yourself and how you would like to contribute to better courier and logistics services in Nepal."
        ctaLabel="Talk to Us"
        ctaHref="/contact"
      />
    </main>
  );
}