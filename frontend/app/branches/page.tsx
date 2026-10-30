"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ChevronDown,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Package,
  Phone,
  Search,
  Truck,
} from "lucide-react";

type Branch = {
  id: string;
  name: string;
  district: string;
  location: string;
  address: string;
  phone: string;
  email?: string;
  hours: string;
  services: string[];
  mapUrl?: string;
  featured?: boolean;
};

/*
 * IMPORTANT:
 * Add only branches confirmed by Aarambha Courier.
 *
 * The client scope currently confirms the Kupondole, Lalitpur
 * location and the company contact numbers.
 */
const branches: Branch[] = [
  {
    id: "kupondole",
    name: "Aarambha Courier & Transport Service",
    district: "Lalitpur",
    location: "Kupondole",
    address: "Kupondole, Lalitpur, Nepal",
    phone: "9801255799 / 9801255790",
    email: "aarambhatransport@gmail.com",
    hours: "Please contact Aarambha for current opening hours.",
    services: [
      "Domestic Courier",
      "Pickup Service",
      "COD Support",
      "Document Delivery",
    ],
    featured: true,
  },
];

const districts = [
  "All Districts",
  ...Array.from(new Set(branches.map((branch) => branch.district))),
];

function BranchCard({ branch }: { branch: Branch }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-hairline bg-white-soft p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/70 hover:shadow-md dark:bg-surface sm:p-6">
      {/* Card Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 size={21} strokeWidth={2} />
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-bold leading-6 text-fg sm:text-lg">
              {branch.name}
            </h3>

            <div className="mt-1 flex items-center gap-1.5 text-sm text-muted">
              <MapPin size={14} className="shrink-0 text-primary" />
              <span>
                {branch.location}, {branch.district}
              </span>
            </div>
          </div>
        </div>

        {branch.featured && (
          <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
            Main Location
          </span>
        )}
      </div>

      {/* Address */}
      <div className="mt-6 rounded-xl bg-grey-light p-4 dark:bg-dark-2">
        <div className="flex gap-3">
          <MapPin
            size={17}
            className="mt-0.5 shrink-0 text-primary"
            strokeWidth={2}
          />

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-faint">
              Address
            </p>
            <p className="mt-1 text-sm leading-6 text-fg">
              {branch.address}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mt-5 space-y-3">
        <div className="flex items-start gap-3">
          <Phone size={17} className="mt-0.5 shrink-0 text-primary" />

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-faint">
              Phone
            </p>

            <a
              href={`tel:${branch.phone.replace(/\s+/g, "")}`}
              className="mt-1 block text-sm font-medium text-fg transition-colors hover:text-primary"
            >
              {branch.phone}
            </a>
          </div>
        </div>

        {branch.email && (
          <div className="flex items-start gap-3">
            <Mail size={17} className="mt-0.5 shrink-0 text-primary" />

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-faint">
                Email
              </p>

              <a
                href={`mailto:${branch.email}`}
                className="mt-1 block break-all text-sm font-medium text-fg transition-colors hover:text-primary"
              >
                {branch.email}
              </a>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <Clock3 size={17} className="mt-0.5 shrink-0 text-primary" />

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-faint">
              Opening Hours
            </p>

            <p className="mt-1 text-sm leading-6 text-muted">
              {branch.hours}
            </p>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-faint">
          Available Services
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {branch.services.map((service) => (
            <span
              key={service}
              className="rounded-full border border-hairline bg-surface px-3 py-1.5 text-xs font-medium text-muted"
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto flex flex-col gap-2 pt-7 sm:flex-row">
        {branch.mapUrl ? (
          <a
            href={branch.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-dark-1 transition-transform hover:-translate-y-0.5"
          >
            <Navigation size={16} />
            Get Directions
          </a>
        ) : (
          <a
            href="https://www.google.com/maps/search/?api=1&query=Kupondole%2C%20Lalitpur%2C%20Nepal"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-dark-1 transition-transform hover:-translate-y-0.5"
          >
            <Navigation size={16} />
            Find on Map
          </a>
        )}

        <a
          href="https://wa.me/9779801255799"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-hairline bg-surface px-4 py-3 text-sm font-semibold text-fg transition-colors hover:border-primary hover:text-primary"
        >
          <MessageCircle size={16} />
          Contact
        </a>
      </div>
    </article>
  );
}

function ServiceCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Truck;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-hairline bg-white-soft p-5 dark:bg-surface">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon size={19} />
      </div>

      <h3 className="mt-4 font-bold text-fg">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}

export default function BranchesPage() {
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("All Districts");

  const filteredBranches = useMemo(() => {
    const query = search.trim().toLowerCase();

    return branches.filter((branch) => {
      const matchesDistrict =
        district === "All Districts" || branch.district === district;

      const matchesSearch =
        !query ||
        branch.name.toLowerCase().includes(query) ||
        branch.location.toLowerCase().includes(query) ||
        branch.district.toLowerCase().includes(query) ||
        branch.address.toLowerCase().includes(query);

      return matchesDistrict && matchesSearch;
    });
  }, [search, district]);

  return (
    <main className="bg-app text-fg">
      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="relative overflow-hidden bg-dark-1">
        <div className="absolute inset-0 grid-bg opacity-20" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Aarambha Courier
            </p>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Our Branches
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
              Find an Aarambha Courier location and get the contact
              information you need for your shipment.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="#branch-directory"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-dark-1 transition-transform hover:-translate-y-0.5"
              >
                <MapPin size={17} />
                Find a Branch
              </a>

              <a
                href="https://wa.me/9779801255799"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-primary hover:text-primary"
              >
                <MessageCircle size={17} />
                Talk to Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SEARCH / FILTER
      ========================================================== */}
      <section
        id="branch-directory"
        className="scroll-mt-24 border-b border-hairline bg-surface px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-hairline bg-white-soft p-4 shadow-sm dark:bg-surface sm:p-5">
            <div className="grid gap-4 md:grid-cols-[1fr_260px]">
              {/* Search */}
              <div>
                <label
                  htmlFor="branch-search"
                  className="mb-2 block text-sm font-semibold text-fg"
                >
                  Search Branch
                </label>

                <div className="relative">
                  <Search
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    id="branch-search"
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by branch, area or district..."
                    className="h-12 w-full rounded-xl border border-hairline bg-surface pl-11 pr-4 text-sm text-fg outline-none transition-colors placeholder:text-faint focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>

              {/* District */}
              <div>
                <label
                  htmlFor="district-filter"
                  className="mb-2 block text-sm font-semibold text-fg"
                >
                  District
                </label>

                <div className="relative">
                  <select
                    id="district-filter"
                    value={district}
                    onChange={(event) => setDistrict(event.target.value)}
                    className="h-12 w-full appearance-none rounded-xl border border-hairline bg-surface px-4 pr-10 text-sm text-fg outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                  >
                    {districts.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={17}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 text-xs text-muted">
              <span>
                Showing{" "}
                <strong className="text-fg">
                  {filteredBranches.length}
                </strong>{" "}
                {filteredBranches.length === 1 ? "location" : "locations"}
              </span>

              {(search || district !== "All Districts") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setDistrict("All Districts");
                  }}
                  className="font-semibold text-primary hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          BRANCH LIST
      ========================================================== */}
      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-primary">
              Branch Directory
            </p>

            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
              Find an Aarambha location
            </h2>

            <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
              View available location and contact details below. Branch
              services and availability may vary depending on operational
              requirements.
            </p>
          </div>

          {filteredBranches.length > 0 ? (
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {filteredBranches.map((branch) => (
                <BranchCard key={branch.id} branch={branch} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-dashed border-hairline bg-white-soft px-6 py-12 text-center dark:bg-surface">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Search size={20} />
              </div>

              <h3 className="mt-4 text-lg font-bold text-fg">
                No branch found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
                We could not find a location matching your search. Try
                another area or contact Aarambha for assistance.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setDistrict("All Districts");
                }}
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-dark-1"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          MAIN LOCATION / CONTACT
      ========================================================== */}
      <section className="border-y border-hairline bg-grey-light px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-stretch">
          {/* Location Details */}
          <div className="rounded-2xl border border-hairline bg-white-soft p-6 shadow-sm dark:bg-surface sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-primary">
              Visit Aarambha
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-fg">
              Our main location
            </h2>

            <p className="mt-4 text-sm leading-7 text-muted">
              For branch information, shipment support, or service
              inquiries, you can contact the Aarambha team directly.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin size={19} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-faint">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-semibold text-fg">
                    Kupondole, Lalitpur, Nepal
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Phone size={19} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-faint">
                    Phone
                  </p>

                  <p className="mt-1 text-sm font-semibold text-fg">
                    9801255799 / 9801255790
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Mail size={19} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide text-faint">
                    Email
                  </p>

                  <a
                    href="mailto:aarambhatransport@gmail.com"
                    className="mt-1 block break-all text-sm font-semibold text-fg hover:text-primary"
                  >
                    aarambhatransport@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Kupondole%2C%20Lalitpur%2C%20Nepal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-dark-1"
              >
                <Navigation size={17} />
                Get Directions
              </a>

              <a
                href="tel:9801255799"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-hairline bg-surface px-5 py-3 text-sm font-semibold text-fg transition-colors hover:border-primary hover:text-primary"
              >
                <Phone size={17} />
                Call Aarambha
              </a>
            </div>
          </div>

          {/* Map Placeholder / Map CTA */}
          <div className="relative min-h-[360px] overflow-hidden rounded-2xl bg-dark-2">
            <div className="absolute inset-0 dot-bg opacity-20" />

            <div className="relative flex h-full min-h-[360px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-dark-1 shadow-lg">
                <MapPin size={29} strokeWidth={2} />
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                Main Location
              </p>

              <h3 className="mt-2 text-2xl font-extrabold text-white">
                Kupondole, Lalitpur
              </h3>

              <p className="mt-3 max-w-sm text-sm leading-6 text-white/60">
                Open the map to view the location and plan your visit.
              </p>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Kupondole%2C%20Lalitpur%2C%20Nepal"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-dark-1 transition-transform hover:-translate-y-0.5"
              >
                <Navigation size={17} />
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          BRANCH SERVICES
      ========================================================== */}
      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-primary">
              Branch Support
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-fg sm:text-4xl">
              What can you get help with?
            </h2>

            <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
              Depending on the location and service requirements, Aarambha
              can assist with different courier and shipment needs.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ServiceCard
              icon={Package}
              title="Parcel Sending"
              description="Get assistance with preparing and sending eligible courier parcels."
            />

            <ServiceCard
              icon={Truck}
              title="Pickup Support"
              description="Ask about pickup arrangements for your parcels and business shipments."
            />

            <ServiceCard
              icon={Building2}
              title="COD Support"
              description="Get information about COD shipment handling and vendor processes."
            />

            <ServiceCard
              icon={Search}
              title="Shipment Support"
              description="Contact the team if you need help with shipment or tracking information."
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          HELPFUL LINKS
      ========================================================== */}
      <section className="border-y border-hairline bg-surface px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-primary">
              Quick Links
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-fg sm:text-4xl">
              Looking for something else?
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/track"
              className="group rounded-2xl border border-hairline bg-white-soft p-5 transition-all hover:-translate-y-1 hover:border-primary dark:bg-surface"
            >
              <Search size={21} className="text-primary" />

              <h3 className="mt-4 font-bold text-fg">Track Shipment</h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                Check the available status of your shipment.
              </p>

              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-fg">
                Track now
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>

            <Link
              href="/calculator"
              className="group rounded-2xl border border-hairline bg-white-soft p-5 transition-all hover:-translate-y-1 hover:border-primary dark:bg-surface"
            >
              <Truck size={21} className="text-primary" />

              <h3 className="mt-4 font-bold text-fg">
                Delivery Calculator
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                Estimate your courier delivery charge.
              </p>

              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-fg">
                Calculate
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>

            <Link
              href="/services/pickup-service"
              className="group rounded-2xl border border-hairline bg-white-soft p-5 transition-all hover:-translate-y-1 hover:border-primary dark:bg-surface"
            >
              <Truck size={21} className="text-primary" />

              <h3 className="mt-4 font-bold text-fg">Pickup Service</h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                Learn how to request a parcel pickup.
              </p>

              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-fg">
                Learn more
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>

            <Link
              href="/contact"
              className="group rounded-2xl border border-hairline bg-white-soft p-5 transition-all hover:-translate-y-1 hover:border-primary dark:bg-surface"
            >
              <MessageCircle size={21} className="text-primary" />

              <h3 className="mt-4 font-bold text-fg">Contact Us</h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                Need help? Get in touch with Aarambha.
              </p>

              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-fg">
                Contact
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================== */}
      <section className="bg-dark-1 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-dark-1">
            <MapPin size={25} />
          </div>

          <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">
            Need Help Finding a Branch?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
            Contact Aarambha and our team can help you with branch,
            shipment, pickup, and courier service information.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="https://wa.me/9779801255799"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-dark-1 transition-transform hover:-translate-y-0.5"
            >
              <MessageCircle size={18} />
              Talk to Us on WhatsApp
            </a>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-primary hover:text-primary"
            >
              Contact Aarambha
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}