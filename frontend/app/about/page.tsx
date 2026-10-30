"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  Eye,
  Globe2,
  Handshake,
  Mail,
  MapPin,
  MapPinned,
  MessageCircle,
  Package,
  PackageCheck,
  Phone,
  RefreshCw,
  Route,
  ShieldCheck,
  ShoppingBag,
  Target,
  Truck,
  Undo2,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";

/* Headline font. If you prefer your site's default font, delete this and `display.className` below. */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type AboutData = {
  title?: string;
  name?: string;
  description?: string;
  purpose?: string;
  mission?: string;
  vision?: string;
  founderPhilosophy?: string;
  address?: string;
  phone?: string | string[];
  email?: string;
  services?: string[];
};

const CONTENT: AboutData = {
  name: "Aarambha Courier and Transport Service Pvt. Ltd.",
  description:
    "A delivery is more than a parcel in transit. It is an order a seller is counting on and a promise to a customer. We make that journey more organized, dependable, and straightforward.",
  purpose:
    "Businesses should focus on serving customers and growing, not on delivery headaches. We provide practical courier and transport support that helps sellers manage shipments, communicate clearly, and serve customers with confidence.",
  mission:
    "To provide dependable courier and transport services through organized operations, responsible parcel handling, and clear, customer-focused communication.",
  vision:
    "To become a trusted logistics partner for businesses across Nepal, with delivery services that are accessible, organized, and responsive.",
  founderPhilosophy:
    "A logistics company earns trust through everyday actions, not promises. Every booking matters, every parcel deserves careful handling, and every customer deserves honest communication.",
  services: [
    "E-commerce Logistics",
    "Domestic Courier",
    "COD Support",
    "Pickup Services",
    "Exchange and Return Support",
    "International Courier",
    "Shipment Tracking",
  ],
};

const JOURNEY = [
  { icon: Package, title: "Booking", detail: "We capture shipment details and requirements." },
  { icon: Truck, title: "Pickup", detail: "We collect and prepare your parcel." },
  { icon: Route, title: "On the way", detail: "You get relevant shipment updates." },
  { icon: CheckCircle2, title: "Delivered", detail: "We complete delivery, COD, and returns." },
];

const PRINCIPLES = [
  { icon: Users, title: "Business first", text: "Delivery support built around how sellers actually work." },
  { icon: Workflow, title: "Clear processes", text: "Defined steps for pickup, delivery, COD, and returns." },
  { icon: MessageCircle, title: "Honest updates", text: "Realistic expectations and timely communication." },
  { icon: ShieldCheck, title: "Accountability", text: "Careful handling of parcels, data, and payments." },
];

const BARCODE = [2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 3, 2, 1, 2, 4, 1, 2, 1, 3];

/** Picks a fitting icon for a service name, so API-provided services still get icons. */
function serviceIcon(name: string): LucideIcon {
  const n = name.toLowerCase();
  if (n.includes("commerce")) return ShoppingBag;
  if (n.includes("cod") || n.includes("cash")) return Banknote;
  if (n.includes("international")) return Globe2;
  if (n.includes("pickup")) return PackageCheck;
  if (n.includes("return") || n.includes("exchange")) return Undo2;
  if (n.includes("track")) return MapPinned;
  if (n.includes("domestic") || n.includes("courier")) return Truck;
  return Package;
}

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FBB501]";

export default function AboutPage() {
  const [about, setAbout] = useState<AboutData>(CONTENT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchAbout() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/about`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (!response.ok) throw new Error("Unable to refresh company information.");

      const result = await response.json();
      const data = result.data ?? result.about ?? result;

      if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new Error("Invalid About API response.");
      }

      setAbout({ ...CONTENT, ...data });
    } catch {
      setAbout(CONTENT);
      setError("Showing standard content. Live company details could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchAbout();
  }, []);

  const services = about.services?.length ? about.services : CONTENT.services!;
  const phones = Array.isArray(about.phone) ? about.phone : about.phone ? [about.phone] : [];

  return (
    <main className="min-h-screen bg-[#FEF8EB] text-[#0A0E12]">
      <style>{`
        @keyframes aarambha-step {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: no-preference) {
          .aarambha-step { animation: aarambha-step .5s ease-out both; animation-delay: calc(var(--i) * .6s + .3s); }
        }
      `}</style>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0A0E12] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-[#FBB501]/15 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:py-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#FBB501]/40 bg-[#FBB501]/10 px-4 py-1.5 text-sm font-semibold text-[#FBB501]">
              <Truck className="h-4 w-4" />
              About Aarambha
            </p>

            <h1
              className={`${display.className} mt-6 text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl`}
            >
              We move parcels.
              <br />
              We help businesses move forward.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-white/70">{about.description}</p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#FBB501] px-7 py-3.5 font-bold text-[#0A0E12] transition hover:bg-[#FFD052] ${focusRing}`}
              >
                Start a conversation
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/services"
                className={`inline-flex items-center justify-center rounded-full border border-white/25 px-7 py-3.5 font-bold transition hover:border-[#FBB501] hover:text-[#FBB501] ${focusRing}`}
              >
                Explore services
              </Link>
            </div>
          </div>

          {/* Parcel label: the memorable element */}
          <div className="relative mx-auto w-full max-w-md lg:mr-0">
            <div
              aria-hidden="true"
              className="absolute inset-0 translate-x-3 translate-y-4 rotate-3 rounded-3xl bg-[#FBB501]"
            />

            <div className="relative -rotate-1 overflow-hidden rounded-3xl bg-[#FFFDF7] text-[#0A0E12] shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between bg-[#141B22] px-6 py-4 text-white">
                <span className="flex items-center gap-2 font-bold">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FBB501] text-[#0A0E12]">
                    <Truck className="h-4 w-4" />
                  </span>
                  Aarambha
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                  Parcel
                </span>
              </div>

              <div className="px-6 pb-2 pt-6">
                <p className="text-sm font-semibold text-gray-600">
                  How every shipment travels with us
                </p>

                <ol className="relative mt-6 space-y-6">
                  <span
                    aria-hidden="true"
                    className="absolute bottom-3 left-[19px] top-3 border-l-2 border-dashed border-[#E3C97A]"
                  />
                  {JOURNEY.map((step, i) => {
                    const Icon = step.icon;
                    const last = i === JOURNEY.length - 1;
                    return (
                      <li
                        key={step.title}
                        className="aarambha-step relative flex gap-4"
                        style={{ ["--i" as string]: i }}
                      >
                        <span
                          className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${
                            last
                              ? "border-[#0A0E12] bg-[#0A0E12] text-[#FBB501]"
                              : "border-[#FBB501] bg-[#FFF3C4] text-[#795000]"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <h3 className="font-extrabold">{step.title}</h3>
                          <p className="mt-0.5 text-sm leading-6 text-gray-600">{step.detail}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* Perforation + barcode */}
              <div className="relative mt-5 border-t-2 border-dashed border-[#D9CBAE] px-6 pb-6 pt-5">
                <span
                  aria-hidden="true"
                  className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-[#0A0E12]"
                />
                <span
                  aria-hidden="true"
                  className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-[#0A0E12]"
                />
                <div aria-hidden="true" className="flex h-12 items-stretch justify-center gap-[2px]">
                  {BARCODE.map((w, i) => (
                    <span key={i} className="bg-[#0A0E12]" style={{ width: w * 2 }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATUS */}
      {loading && (
        <div className="bg-white px-5 py-2.5 text-center text-xs text-gray-600" role="status">
          <RefreshCw className="mr-2 inline h-3.5 w-3.5 animate-spin" />
          Refreshing company information...
        </div>
      )}
      {!loading && error && (
        <div className="flex flex-wrap items-center justify-center gap-2 bg-white px-5 py-2.5 text-center text-xs text-gray-600">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => void fetchAbout()}
            className="inline-flex items-center gap-1 font-bold text-[#795000] underline underline-offset-4"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </button>
        </div>
      )}

      {/* PURPOSE + MISSION + VISION */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-16">
          <h2
            className={`${display.className} text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl`}
          >
            Logistics should support growth, not add complexity.
          </h2>
          <p className="text-lg leading-8 text-gray-700">{about.purpose}</p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <article className="relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-[#E9DFC9] sm:p-10">
            <Target
              aria-hidden="true"
              className="absolute -bottom-8 -right-8 h-48 w-48 text-[#FBB501]/15"
              strokeWidth={1.2}
            />
            <div className="relative">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FBB501] text-[#0A0E12]">
                <Target className="h-7 w-7" />
              </span>
              <h3 className={`${display.className} mt-6 text-2xl font-extrabold`}>Our mission</h3>
              <p className="mt-3 max-w-md text-lg leading-8 text-gray-700">{about.mission}</p>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-[2rem] bg-[#0A0E12] p-8 text-white sm:p-10">
            <Eye
              aria-hidden="true"
              className="absolute -bottom-8 -right-8 h-48 w-48 text-white/[0.06]"
              strokeWidth={1.2}
            />
            <div className="relative">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#FBB501]">
                <Eye className="h-7 w-7" />
              </span>
              <h3 className={`${display.className} mt-6 text-2xl font-extrabold`}>Our vision</h3>
              <p className="mt-3 max-w-md text-lg leading-8 text-white/75">{about.vision}</p>
            </div>
          </article>
        </div>
      </section>

      {/* PHILOSOPHY + PRINCIPLES */}
      <section className="relative overflow-hidden bg-[#FBB501]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border-[40px] border-[#0A0E12]/[0.06]"
        />

        <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0A0E12] text-[#FBB501]">
            <Handshake className="h-7 w-7" />
          </span>

          <h2
            className={`${display.className} mt-6 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl`}
          >
            Trust is built through what we do every day.
          </h2>

          <p className="mt-6 max-w-3xl border-l-4 border-[#0A0E12] pl-6 text-xl font-semibold leading-9 text-[#30260E] sm:text-2xl sm:leading-10">
            {about.founderPhilosophy}
          </p>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p) => {
              const Icon = p.icon;
              return (
                <article key={p.title} className="rounded-3xl bg-[#0A0E12] p-6 text-white">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FBB501] text-[#0A0E12]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-extrabold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">{p.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICES + CONTACT */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <div>
            <h2
              className={`${display.className} text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl`}
            >
              Practical support for everyday deliveries.
            </h2>

            <ul className="mt-9 grid gap-3 sm:grid-cols-2">
              {services.map((service, i) => {
                const Icon = serviceIcon(service);
                return (
                  <li
                    key={`${service}-${i}`}
                    className="group flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-[#E9DFC9] transition hover:bg-[#0A0E12] hover:text-white hover:ring-[#0A0E12] sm:[&:last-child:nth-child(odd)]:col-span-2"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FEF2CD] text-[#795000] transition group-hover:bg-[#FBB501] group-hover:text-[#0A0E12]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-bold">{service}</span>
                  </li>
                );
              })}
            </ul>

            <Link
              href="/services"
              className={`mt-8 inline-flex items-center gap-2 rounded-md font-bold text-[#795000] hover:text-black ${focusRing}`}
            >
              See all services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative self-start overflow-hidden rounded-[2rem] bg-[#0A0E12] p-8 text-white sm:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#FBB501]/15 blur-2xl"
            />
            <div className="relative">
              <h3 className={`${display.className} text-2xl font-extrabold leading-snug`}>
                Tell us what you need to ship.
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/60">{about.name || CONTENT.name}</p>

              <div className="mt-7 space-y-4 text-sm">
                {about.address && (
                  <div className="flex gap-3 text-white/80">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#FBB501]" />
                    <span>{about.address}</span>
                  </div>
                )}
                {phones.map((phone) => (
                  <div key={phone} className="flex gap-3">
                    <Phone className="h-5 w-5 shrink-0 text-[#FBB501]" />
                    <a
                      href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                      className="break-all text-white/80 hover:text-[#FBB501]"
                    >
                      {phone}
                    </a>
                  </div>
                ))}
                {about.email && (
                  <div className="flex gap-3">
                    <Mail className="h-5 w-5 shrink-0 text-[#FBB501]" />
                    <a
                      href={`mailto:${about.email}`}
                      className="break-all text-white/80 hover:text-[#FBB501]"
                    >
                      {about.email}
                    </a>
                  </div>
                )}
              </div>

              <Link
                href="/contact"
                className={`mt-9 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#FBB501] px-6 py-4 font-bold text-[#0A0E12] transition hover:bg-[#FFD052] ${focusRing}`}
              >
                Contact Aarambha
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}