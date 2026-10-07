import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | Aarambha Courier and Transport Service Pvt. Ltd.",
  description:
    "Aarambha exists to bring a more systematic, transparent and responsible way of working to parcel delivery in Nepal.",
};

/* ------------------------------------------------------------------ */
/* Photos: drop real images into /public/images/about/ using these     */
/* file names. Until then the slot shows a neutral panel (no broken    */
/* image icon). Use your own Nepal photos: parcels being sorted,       */
/* a rider loading a bike or van, a Kathmandu street, a vendor handover.*/
/* ------------------------------------------------------------------ */
type PhotoProps = { src: string; alt: string; className?: string };

function Photo({ src, alt, className = "" }: PhotoProps) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative overflow-hidden rounded-[var(--radius-lg)] border border-hairline bg-panel bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url(${src})` }}
    />
  );
}

const pillars = [
  {
    title: "Purpose",
    body: "Deliveries are promises made to someone waiting. Aarambha exists so that those promises are handled with order, care and honest communication, not just speed.",
  },
  {
    title: "Mission",
    body: "To give vendors and customers a courier service that runs on clear process: every parcel recorded, every handover accounted for, every update shared in plain words.",
  },
  {
    title: "Vision",
    body: "A Nepal where sending a parcel feels dependable, and where growing businesses can rely on logistics that is organised enough to grow with them.",
  },
];

const practices = [
  {
    title: "Business-first logistics",
    body: "We start from how a vendor actually sells: their orders, their customers, their cash flow. Delivery is planned around the business, not the other way around.",
    img: "/images/about/vendor-handover.jpg",
    alt: "A vendor handing packed parcels to a courier rider at a shop front in Nepal",
  },
  {
    title: "Systematic operations",
    body: "Parcels are received, sorted, assigned and delivered through a defined workflow. When each step has an owner, problems are found early and fixed quietly.",
    img: "/images/about/parcel-sorting.jpg",
    alt: "Parcels sorted by destination on shelves in a courier dispatch room",
  },
  {
    title: "Vendor relationships",
    body: "Vendors are partners, not pickup addresses. We keep a direct line open, listen to what slows them down, and adjust how we work with them.",
    img: "/images/about/vendor-support.jpg",
    alt: "A courier coordinator talking with a local online seller about an order",
  },
  {
    title: "Responsible parcel handling",
    body: "Someone's stock, gift or documents is inside every box. Parcels are handled gently, kept dry, kept labelled, and never treated as just weight.",
    img: "/images/about/careful-handling.jpg",
    alt: "A rider securing a wrapped parcel on a motorbike carrier on a Kathmandu street",
  },
];

const reasons = [
  {
    title: "Reliability",
    body: "Consistent process means consistent results. Vendors should not have to wonder how a parcel will be handled.",
  },
  {
    title: "Communication",
    body: "You hear from us before you have to ask. Clear updates, plain language, and a person to talk to.",
  },
  {
    title: "Transparency",
    body: "If something changes or goes wrong, we say so early and explain what we are doing about it.",
  },
  {
    title: "Systematic workflow",
    body: "Every parcel follows the same tracked path, so nothing depends on memory or luck.",
  },
  {
    title: "Vendor support",
    body: "We help sellers fit delivery into daily operations, from pickups to handovers to follow-ups.",
  },
  {
    title: "Practical logistics",
    body: "Solutions built for real Nepali streets, roads and routines, not for a diagram.",
  },
];

export default function AboutPage() {
  return (
    <main id="main" tabIndex={-1} className="bg-app text-fg">
      {/* ───────────── Hero ───────────── */}
      <section className="relative overflow-hidden">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-28 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pb-28 lg:pt-36">
          <div>
            <h1 className="text-display max-w-3xl">
              Building a More Systematic Way to Move Deliveries.
            </h1>
            <p className="lead mt-6 max-w-xl">
              Aarambha Courier and Transport Service Pvt. Ltd. exists for a simple reason: sending a
              parcel should not feel uncertain. Behind every package is a seller, a buyer and a
              promise, and each deserves a process that respects them.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="bg-brand accent-glow inline-flex items-center rounded-full px-6 py-3 font-semibold transition-transform hover:-translate-y-0.5"
              >
                Talk to Aarambha
              </Link>
              <Link
                href="#why-aarambha"
                className="inline-flex items-center rounded-full border border-hairline px-6 py-3 font-semibold text-fg transition-colors hover:bg-panel"
              >
                Why Aarambha?
              </Link>
            </div>
          </div>

          <Photo
            src="/images/about/hero-kathmandu-dispatch.jpg"
            alt="A courier rider loading parcels onto a motorbike in a Kathmandu street"
            className="aspect-[4/5] w-full shadow-[var(--shadow-lg)]"
          />
        </div>
      </section>

      {/* ───────────── Beyond parcels ───────────── */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <h2 className="text-hero">More than moving boxes from A to B.</h2>
          <div className="space-y-5">
            <p className="lead">
              A parcel is rarely just a parcel. It is a small business keeping its word to a
              customer. It is a family member receiving something they have been waiting for. When
              delivery is disorganised, people lose time, trust and sales.
            </p>
            <p className="lead">
              Aarambha was built around the belief that courier work can be calmer and more
              dependable when it is run with structure: clear steps, clear ownership and clear
              communication from pickup to handover.
            </p>
          </div>
        </div>

        <div className="mt-16 grid divide-y divide-hairline border-y border-hairline md:grid-cols-3 md:divide-x md:divide-y-0">
          {pillars.map((p) => (
            <div key={p.title} className="py-8 md:px-8 md:first:pl-0 md:last:pr-0">
              <h3 className="text-2xl font-bold">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────── Founder philosophy ───────────── */}
      <section className="bg-dark-section">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:py-28">
          <Photo
            src="/images/about/founder-philosophy-street.jpg"
            alt="A busy Nepali market street where small shops and couriers work side by side"
            className="aspect-[4/3] w-full border-white/10"
          />
          <div>
            <h2 className="text-hero">Founder philosophy</h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
              Good logistics is not a matter of working harder. It is a matter of working in order.
              Aarambha is guided by the idea that a business grows steadier when its deliveries are
              organised, and that trust is earned through small, repeated acts of doing things the
              right way.
            </p>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/75">
              That means putting the vendor&apos;s real needs first, keeping the process simple
              enough to follow, and being honest when something needs attention.
            </p>
          </div>
        </div>
      </section>

      {/* ───────────── How we work ───────────── */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <h2 className="text-hero max-w-3xl">How Aarambha works, day to day.</h2>

        <div className="mt-14 space-y-16 lg:space-y-24">
          {practices.map((item, i) => (
            <article
              key={item.title}
              className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
            >
              <Photo
                src={item.img}
                alt={item.alt}
                className={`aspect-[3/2] w-full ${i % 2 === 1 ? "lg:order-2" : ""}`}
              />
              <div>
                <h3 className="text-3xl font-bold tracking-tight">{item.title}</h3>
                <p className="lead mt-4 max-w-lg">{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ───────────── Why Aarambha ───────────── */}
      <section id="why-aarambha" className="bg-cream scroll-mt-24">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <h2 className="text-hero max-w-2xl !text-dark-1">Why Aarambha?</h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-dark-1/70">
            Six things we hold ourselves to when we take on your parcels.
          </p>

          <dl className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((r) => (
              <div key={r.title} className="border-t-2 border-primary pt-5">
                <dt className="text-xl font-bold text-dark-1">{r.title}</dt>
                <dd className="mt-2 leading-relaxed text-dark-1/70">{r.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ───────────── Closing CTA ───────────── */}
      <section className="bg-footer">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 lg:py-28">
          <h2 className="text-hero text-white">
            Let&apos;s Build a Better Delivery Workflow Together.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/70">
            Tell us how your deliveries run today. We will talk through what could be more
            organised, more visible and easier to manage.
          </p>
          <Link
            href="/contact"
            className="bg-brand accent-glow shimmer mt-9 inline-flex items-center rounded-full px-8 py-4 text-lg font-semibold"
          >
            Talk to Aarambha
          </Link>
        </div>
      </section>
    </main>
  );
}