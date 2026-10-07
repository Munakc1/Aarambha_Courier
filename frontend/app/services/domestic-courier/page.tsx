"use client";

import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  MapPin,
  Package,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";

const journey = [
  {
    number: "01",
    title: "Send",
    description:
      "Share the pickup, delivery and parcel details needed to arrange your shipment.",
    icon: Send,
  },
  {
    number: "02",
    title: "Pickup",
    description:
      "The shipment is collected from the agreed pickup location where the service is available.",
    icon: Truck,
  },
  {
    number: "03",
    title: "Processing",
    description:
      "The parcel or document enters the courier handling and shipment process.",
    icon: Package,
  },
  {
    number: "04",
    title: "Transit",
    description:
      "The shipment moves through the relevant delivery route toward its destination.",
    icon: MapPin,
  },
  {
    number: "05",
    title: "Delivery",
    description:
      "The shipment is delivered through the selected delivery arrangement.",
    icon: CheckCircle2,
  },
];

const deliveryOptions = [
  {
    title: "Inside Valley Delivery",
    description:
      "Courier support for shipments moving within the Kathmandu Valley, subject to the available service area.",
    icon: MapPin,
  },
  {
    title: "Outside Valley Delivery",
    description:
      "Support for shipments moving from the Valley to other locations where Aarambha's current operations provide service.",
    icon: Truck,
  },
  {
    title: "Door-to-Door",
    description:
      "Pickup and delivery to agreed addresses where door-to-door service is available.",
    icon: UserRound,
  },
  {
    title: "Door-to-Branch",
    description:
      "A branch-based option where the sender or receiver can use the relevant Aarambha branch arrangement.",
    icon: MapPin,
  },
];

const shipmentTypes = [
  {
    title: "Parcel Delivery",
    description:
      "Send everyday packages through a practical courier delivery process.",
    icon: Package,
  },
  {
    title: "Document Delivery",
    description:
      "Courier support for documents and other lightweight items that need delivery.",
    icon: FileText,
  },
  {
    title: "Shipment Tracking",
    description:
      "Check shipment progress and get support when you need help understanding a status.",
    icon: Search,
  },
  {
    title: "Customer Support",
    description:
      "Get assistance with shipment-related questions, delivery coordination and issues.",
    icon: ShieldCheck,
  },
];

const scenarios = [
  {
    title: "For Individuals",
    description:
      "Sending documents, personal packages or items to family, friends and other recipients.",
    icon: UserRound,
  },
  {
    title: "For Businesses",
    description:
      "Sending documents, customer orders, samples and business parcels through a structured courier process.",
    icon: Package,
  },
  {
    title: "For Online Sellers",
    description:
      "Moving customer orders through pickup, transit, delivery, COD and return workflows.",
    icon: Truck,
  },
];

export default function DomesticCourierPage() {
  const [showInquiry, setShowInquiry] = useState(false);

  const handleWhatsApp = () => {
    const message =
      "Hello Aarambha Courier, I would like to send a parcel/document within Nepal. Please provide information about the available service, delivery option and estimated charge.";

    window.open(
      `https://wa.me/9779801255799?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <main id="main" tabIndex={-1} className="bg-app overflow-hidden">
      {/* ================================================================ */}
      {/* HERO                                                            */}
      {/* ================================================================ */}

      <section className="relative isolate">
        <div className="absolute inset-0 -z-10 grid-bg opacity-50" />

        <div className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.95fr] lg:gap-16">
            {/* Hero copy */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-4 py-2 text-sm font-medium text-fg">
                <span className="h-2 w-2 rounded-full bg-brand" />
                Domestic Courier Service
              </div>

              <h1 className="text-hero max-w-4xl text-fg">
                Domestic Courier Service
                <span className="block gradient-text">
                  Across Nepal
                </span>
              </h1>

              <p className="lead mt-7 max-w-2xl">
                Practical parcel and document delivery support for individuals,
                businesses and online sellers, with service options based on
                pickup location, destination and current Aarambha operations.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowInquiry(true)}
                  className="shimmer inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 font-semibold on-accent shadow-lg transition hover:-translate-y-0.5"
                >
                  Send Parcel Inquiry
                  <ArrowRight size={18} />
                </button>

                <a
                  href="/track"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-hairline bg-surface px-6 py-3.5 font-semibold text-fg transition hover:border-primary hover:bg-panel"
                >
                  Track Shipment
                  <Search size={18} />
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-primary" />
                  Parcel & document delivery
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-primary" />
                  Tracking support
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-primary" />
                  Flexible delivery options
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* VISUAL                                                        */}
            {/* ============================================================ */}

            <div className="relative">
              <div className="absolute -right-12 -top-12 h-52 w-52 rounded-full bg-primary/20 blur-3xl" />

              <div className="absolute -bottom-12 -left-12 h-52 w-52 rounded-full bg-accent-orange/15 blur-3xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-hairline bg-dark-1 p-5 shadow-lg sm:p-7">
                <div className="absolute inset-0 opacity-20 dot-bg" />

                <div className="relative">
                  {/* Heading */}
                  <div className="mb-7 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/45">
                        Domestic Delivery
                      </p>

                      <h2 className="mt-1 text-xl font-bold text-white">
                        Shipment Journey
                      </h2>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand on-accent">
                      <Truck size={21} />
                    </div>
                  </div>

                  {/* Kathmandu */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand on-accent">
                        <MapPin size={21} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-white">
                          Pickup Location
                        </p>

                        <p className="mt-1 text-xs text-white/50">
                          Kathmandu / Valley
                        </p>
                      </div>

                      <div className="ml-auto rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">
                        Pickup
                      </div>
                    </div>
                  </div>

                  {/* Connector */}
                  <div className="mx-auto h-8 w-px bg-primary/60" />

                  {/* Parcel */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-primary">
                        <Package size={21} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-white">
                          Parcel Processing
                        </p>

                        <p className="mt-1 text-xs text-white/50">
                          Shipment enters the courier workflow
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Connector */}
                  <div className="mx-auto h-8 w-px bg-primary/60" />

                  {/* Destination */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-orange/20 text-primary">
                        <Truck size={21} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-white">
                          Destination
                        </p>

                        <p className="mt-1 text-xs text-white/50">
                          Delivery based on available service
                        </p>
                      </div>

                      <CheckCircle2
                        size={20}
                        className="ml-auto text-primary"
                      />
                    </div>
                  </div>

                  {/* Bottom info */}
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <VisualStat
                      icon={Search}
                      label="Tracking"
                      value="Supported"
                    />

                    <VisualStat
                      icon={ShieldCheck}
                      label="Support"
                      value="Available"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SERVICE OPTIONS                                                   */}
      {/* ================================================================ */}

      <section className="border-y border-hairline bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Delivery Options"
            title="Choose the Delivery Arrangement That Fits the Shipment"
            description="Available options depend on the pickup location, destination and Aarambha's current service coverage."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {deliveryOptions.map((option) => {
              const Icon = option.icon;

              return (
                <div key={option.title} className="card group p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/15 text-primary transition group-hover:bg-brand group-hover:on-accent">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-fg">
                    {option.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted">
                    {option.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* WHO WE SERVE                                                      */}
      {/* ================================================================ */}

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="For Individuals & Businesses"
            title="Courier Support for Everyday Shipments"
            description="Whether you are sending one important document or handling regular business shipments, the delivery process can be organized around your actual requirements."
          />

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {scenarios.map((scenario) => {
              const Icon = scenario.icon;

              return (
                <div
                  key={scenario.title}
                  className="card gradient-border p-7"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-dark-1">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-7 text-xl font-bold text-fg">
                    {scenario.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-muted">
                    {scenario.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary">
                    Delivery support
                    <ChevronRight size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SHIPMENT TYPES                                                    */}
      {/* ================================================================ */}

      <section className="bg-dark-section py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                What You Can Send
              </p>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Simple courier support for the things that need to move.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-white/65">
                Aarambha's domestic courier service can support parcels,
                documents and business shipments according to the applicable
                service and operating conditions.
              </p>

              <div className="mt-8">
                <a
                  href="/calculator"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 font-semibold on-accent transition hover:-translate-y-0.5"
                >
                  Estimate Delivery Charge
                  <ArrowRight size={17} />
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {shipmentTypes.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.05] p-6"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-primary">
                      <Icon size={20} />
                    </div>

                    <h3 className="mt-5 font-bold text-white">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-white/55">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* JOURNEY                                                           */}
      {/* ================================================================ */}

      <section className="bg-cream py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Shipment Journey"
            title="Send → Pickup → Processing → Transit → Delivery"
            description="A clear shipment journey helps senders understand what happens after a parcel or document is handed over."
            dark
          />

          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {journey.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="relative rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-accent-orange">
                      {step.number}
                    </span>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-dark-1">
                      <Icon size={20} />
                    </div>
                  </div>

                  <h3 className="mt-6 font-bold text-dark-1">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-black/60">
                    {step.description}
                  </p>

                  {index < journey.length - 1 && (
                    <ChevronRight
                      size={18}
                      className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-accent-orange lg:block"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* PRACTICAL INFORMATION                                             */}
      {/* ================================================================ */}

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-hairline bg-surface p-7 sm:p-10 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-dark-1">
                  <ShieldCheck size={25} />
                </div>

                <h2 className="mt-6 text-3xl font-extrabold text-fg sm:text-4xl">
                  Delivery depends on the shipment.
                </h2>

                <p className="mt-5 text-base leading-7 text-muted">
                  The applicable delivery arrangement, charge and service
                  availability can vary based on the pickup point,
                  destination, parcel details and selected service.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoItem
                  icon={MapPin}
                  title="Pickup & Destination"
                  description="Service availability is based on the relevant locations."
                />

                <InfoItem
                  icon={Package}
                  title="Parcel Details"
                  description="Weight, size and type can affect the applicable charge."
                />

                <InfoItem
                  icon={Clock3}
                  title="Delivery Timing"
                  description="Timing depends on the route and service arrangement."
                />

                <InfoItem
                  icon={Search}
                  title="Tracking"
                  description="Shipment progress can be checked through the available tracking process."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FINAL CTA                                                         */}
      {/* ================================================================ */}

      <section className="relative overflow-hidden bg-dark-1 py-20 sm:py-24">
        <div className="absolute inset-0 grid-bg opacity-20" />

        <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Ready to Send?
          </p>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Need to send a parcel or document?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/60">
            Tell Aarambha where the shipment is going and what you need to
            send. The team can help you understand the available delivery
            option and next steps.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setShowInquiry(true)}
              className="shimmer inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-7 py-3.5 font-semibold on-accent shadow-lg transition hover:-translate-y-0.5"
            >
              Send Parcel Inquiry
              <ArrowRight size={18} />
            </button>

            <a
              href="/track"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-7 py-3.5 font-semibold text-white transition hover:border-primary hover:bg-white/[0.08]"
            >
              Track Shipment
              <Search size={18} />
            </a>
          </div>

          <div className="mt-7">
            <a
              href="/calculator"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/65 transition hover:text-primary"
            >
              Estimate your delivery charge
              <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* INQUIRY MODAL                                                     */}
      {/* ================================================================ */}

      {showInquiry && (
        <ParcelInquiryModal
          onClose={() => setShowInquiry(false)}
          onWhatsApp={handleWhatsApp}
        />
      )}
    </main>
  );
}

/* ========================================================================== */
/* SECTION HEADING                                                            */
/* ========================================================================== */

function SectionHeading({
  eyebrow,
  title,
  description,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  dark?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-orange">
        {eyebrow}
      </p>

      <h2
        className={`mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl ${
          dark ? "text-dark-1" : "text-fg"
        }`}
      >
        {title}
      </h2>

      <p
        className={`mt-5 text-base leading-7 ${
          dark ? "text-black/60" : "text-muted"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

/* ========================================================================== */
/* VISUAL STAT                                                                */
/* ========================================================================== */

function VisualStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Search;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3">
      <Icon size={16} className="text-primary" />

      <p className="mt-2 text-[11px] text-white/40">{label}</p>

      <p className="mt-0.5 text-xs font-semibold text-white/80">{value}</p>
    </div>
  );
}

/* ========================================================================== */
/* INFO ITEM                                                                  */
/* ========================================================================== */

function InfoItem({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof MapPin;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-hairline bg-app p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-primary">
          <Icon size={17} />
        </div>

        <div>
          <h3 className="text-sm font-bold text-fg">{title}</h3>

          <p className="mt-1 text-xs leading-5 text-muted">{description}</p>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* PARCEL INQUIRY MODAL                                                      */
/* ========================================================================== */

function ParcelInquiryModal({
  onClose,
  onWhatsApp,
}: {
  onClose: () => void;
  onWhatsApp: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [parcelType, setParcelType] = useState("Parcel");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (
      !name.trim() ||
      !phone.trim() ||
      !pickup.trim() ||
      !destination.trim()
    ) {
      setError(
        "Please enter your name, phone number, pickup location and destination."
      );
      return;
    }

    const whatsappMessage = `Hello Aarambha Courier,

I would like to send a ${parcelType.toLowerCase()}.

Name: ${name}
Phone: ${phone}
Pickup Location: ${pickup}
Destination: ${destination}

Additional Details:
${message || "Not provided"}

Please let me know the available service option and estimated delivery charge.`;

    window.open(
      `https://wa.me/9779801255799?text=${encodeURIComponent(
        whatsappMessage
      )}`,
      "_blank",
      "noopener,noreferrer"
    );

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="parcel-inquiry-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-lg rounded-3xl border border-hairline bg-app p-6 shadow-lg sm:p-8">
        {/* Modal header */}
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-accent-orange">
              Parcel Inquiry
            </p>

            <h2
              id="parcel-inquiry-title"
              className="mt-2 text-2xl font-bold text-fg"
            >
              Tell us about your shipment
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close parcel inquiry"
            className="rounded-lg p-2 text-muted transition hover:bg-panel hover:text-fg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="mt-7 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Your Name"
              value={name}
              onChange={setName}
              placeholder="Full name"
              required
            />

            <InputField
              label="Phone Number"
              value={phone}
              onChange={setPhone}
              placeholder="98XXXXXXXX"
              type="tel"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Pickup Location"
              value={pickup}
              onChange={setPickup}
              placeholder="Pickup area"
              required
            />

            <InputField
              label="Destination"
              value={destination}
              onChange={setDestination}
              placeholder="Delivery area"
              required
            />
          </div>

          <div>
            <label
              htmlFor="parcel-type"
              className="mb-2 block text-sm font-semibold text-fg"
            >
              Shipment Type
            </label>

            <select
              id="parcel-type"
              value={parcelType}
              onChange={(event) => setParcelType(event.target.value)}
              className="w-full rounded-xl border border-hairline bg-surface px-4 py-3 text-sm text-fg outline-none focus:border-primary"
            >
              <option value="Parcel">Parcel</option>
              <option value="Document">Document</option>
              <option value="Business Shipment">Business Shipment</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="parcel-message"
              className="mb-2 block text-sm font-semibold text-fg"
            >
              Additional Details
            </label>

            <textarea
              id="parcel-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Weight, number of packages, preferred delivery arrangement, or anything else we should know..."
              rows={4}
              className="w-full resize-none rounded-xl border border-hairline bg-surface px-4 py-3 text-sm text-fg outline-none placeholder:text-faint focus:border-primary"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
            >
              {error}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-hairline px-5 py-3 text-sm font-semibold text-fg transition hover:bg-panel"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold on-accent transition hover:-translate-y-0.5"
          >
            Send on WhatsApp
            <Send size={17} />
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-muted">
          Your inquiry will open in WhatsApp for direct communication with
          Aarambha Courier.
        </p>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* INPUT FIELD                                                                */
/* ========================================================================== */

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  const inputId = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-2 block text-sm font-semibold text-fg"
      >
        {label}{" "}
        {required && <span className="text-accent-orange">*</span>}
      </label>

      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-hairline bg-surface px-4 py-3 text-sm text-fg outline-none placeholder:text-faint focus:border-primary"
      />
    </div>
  );
}