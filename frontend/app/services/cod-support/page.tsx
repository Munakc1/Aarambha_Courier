"use client";

import { useState } from "react";
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  HandCoins,
  Package,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  Store,
  Truck,
  UserRound,
  Wallet,
  X,
} from "lucide-react";

const codFlow = [
  {
    number: "01",
    title: "Customer Orders",
    description:
      "Your customer places an order and selects cash on delivery where applicable.",
    icon: ClipboardList,
  },
  {
    number: "02",
    title: "Aarambha Pickup",
    description:
      "The prepared shipment is collected from the vendor through the agreed pickup process.",
    icon: Truck,
  },
  {
    number: "03",
    title: "Delivery",
    description:
      "The shipment moves through the delivery process toward the customer.",
    icon: Package,
  },
  {
    number: "04",
    title: "COD Collection",
    description:
      "The applicable COD amount is collected as part of the delivery process.",
    icon: HandCoins,
  },
  {
    number: "05",
    title: "Settlement",
    description:
      "COD settlement is coordinated with the vendor according to the agreed process.",
    icon: Wallet,
  },
];

const codServices = [
  {
    title: "COD Shipment Handling",
    description:
      "Support the operational process around cash-on-delivery shipments from pickup through delivery.",
    icon: Package,
  },
  {
    title: "Vendor Communication",
    description:
      "Keep vendors informed about relevant shipment, delivery and COD-related updates.",
    icon: Send,
  },
  {
    title: "COD Records",
    description:
      "Maintain shipment-level COD information so vendors can keep track of collections.",
    icon: ClipboardList,
  },
  {
    title: "Delivery Status",
    description:
      "Follow shipment progress and provide support when vendors need to understand delivery status.",
    icon: Search,
  },
  {
    title: "Settlement Coordination",
    description:
      "Coordinate collected COD amounts with vendors according to the agreed settlement process.",
    icon: Banknote,
  },
  {
    title: "Return & Exchange",
    description:
      "Support coordination when a customer needs to return or exchange an order.",
    icon: RotateCcw,
  },
];

const codReasons = [
  {
    title: "Clear COD Records",
    description:
      "Online sellers need an organized view of which shipments involve COD and what happened to them.",
    icon: ClipboardList,
  },
  {
    title: "Better Shipment Visibility",
    description:
      "Delivery status and COD information are connected to the shipment rather than handled separately.",
    icon: Search,
  },
  {
    title: "Simpler Vendor Follow-up",
    description:
      "A structured workflow makes it easier to communicate about deliveries, collections and exceptions.",
    icon: Send,
  },
  {
    title: "Return Awareness",
    description:
      "Returns and exchanges can affect the order lifecycle, so they need to be part of the workflow.",
    icon: RotateCcw,
  },
];

const vendorFeatures = [
  "COD shipment records",
  "Delivery status information",
  "Vendor communication",
  "Settlement coordination",
  "Return and exchange support",
  "Shipment tracking support",
];

export default function CODPage() {
  const [showVendorForm, setShowVendorForm] = useState(false);

  const handleCODWhatsApp = () => {
    const message =
      "Hello Aarambha Courier, I am interested in COD courier support for my online business. I would like to discuss COD shipment handling, delivery, records and settlement coordination.";

    window.open(
      `https://wa.me/9779801255799?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <main id="main" tabIndex={-1} className="bg-app overflow-hidden">
      {/* ================================================================= */}
      {/* HERO                                                              */}
      {/* ================================================================= */}

      <section className="relative isolate bg-dark-1">
        <div className="absolute inset-0 grid-bg opacity-20" />

        <div className="absolute -right-32 top-0 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />

        <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-accent-orange/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.95fr] lg:gap-16">
            {/* Hero copy */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white/80">
                <span className="h-2 w-2 rounded-full bg-brand" />
                Cash on Delivery Support
              </div>

              <h1 className="text-hero max-w-4xl text-white">
                COD Support That Keeps Your
                <span className="block gradient-text">
                  Delivery Workflow Moving
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
                Practical cash-on-delivery support for online sellers and
                vendors, covering shipment handling, delivery status, COD
                records, settlement coordination and return support.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleCODWhatsApp}
                  className="shimmer inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 font-semibold on-accent shadow-lg transition hover:-translate-y-0.5"
                >
                  Talk to Us About COD
                  <ArrowRight size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => setShowVendorForm(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-6 py-3.5 font-semibold text-white transition hover:border-primary hover:bg-white/[0.08]"
                >
                  Become a Vendor
                  <Store size={18} />
                </button>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/55">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-primary" />
                  COD shipment handling
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-primary" />
                  Settlement coordination
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-primary" />
                  Return support
                </div>
              </div>
            </div>

            {/* ============================================================= */}
            {/* COD VISUAL                                                     */}
            {/* ============================================================= */}

            <div className="relative">
              <div className="rounded-[2rem] border border-white/10 bg-dark-2 p-5 shadow-lg sm:p-7">
                {/* Visual header */}
                <div className="mb-7 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/40">
                      Vendor COD Flow
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-white">
                      Order to Settlement
                    </h2>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand on-accent">
                    <Wallet size={21} />
                  </div>
                </div>

                {/* Customer order */}
                <CODVisualStep
                  icon={UserRound}
                  title="Customer Orders"
                  description="COD order received"
                  badge="ORDER"
                />

                <FlowConnector />

                {/* Pickup */}
                <CODVisualStep
                  icon={Truck}
                  title="Aarambha Pickup"
                  description="Vendor parcel collected"
                  badge="PICKUP"
                />

                <FlowConnector />

                {/* Delivery */}
                <CODVisualStep
                  icon={Package}
                  title="Delivery"
                  description="Shipment reaches customer"
                  badge="DELIVERY"
                />

                <FlowConnector />

                {/* Collection */}
                <CODVisualStep
                  icon={HandCoins}
                  title="COD Collection"
                  description="Applicable amount collected"
                  badge="COD"
                  highlighted
                />

                <FlowConnector />

                {/* Settlement */}
                <CODVisualStep
                  icon={Wallet}
                  title="Settlement"
                  description="Coordinated with vendor"
                  badge="SETTLEMENT"
                  highlighted
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* INTRO                                                              */}
      {/* ================================================================= */}

      <section className="border-b border-hairline bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-orange">
            Built Around the Vendor
          </p>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
            COD is more than collecting cash at the door.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-muted">
            For online businesses, COD affects shipment records, delivery
            status, customer communication, returns and vendor settlement.
            Keeping these steps connected helps create a more organized
            delivery workflow.
          </p>
        </div>
      </section>

      {/* ================================================================= */}
      {/* COD SERVICES                                                       */}
      {/* ================================================================= */}

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="COD Support"
            title="Everything Around the COD Shipment"
            description="A practical COD workflow connects the shipment, delivery and vendor-side records instead of treating cash collection as an isolated step."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {codServices.map((service) => {
              const Icon = service.icon;

              return (
                <div key={service.title} className="card group p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/15 text-primary transition group-hover:bg-brand group-hover:on-accent">
                      <Icon size={21} />
                    </div>

                    <ChevronRight
                      size={18}
                      className="text-faint transition group-hover:text-primary"
                    />
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-fg">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SETTLEMENT NOTE                                                    */}
      {/* ================================================================= */}

      <section className="bg-cream py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white/70 shadow-sm">
            <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
              {/* Yellow panel */}
              <div className="relative overflow-hidden bg-brand p-8 sm:p-10">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/20 blur-3xl" />

                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-dark-1 text-primary">
                    <Clock3 size={25} />
                  </div>

                  <h2 className="mt-7 text-3xl font-extrabold text-dark-1">
                    Same-day COD settlement
                  </h2>

                  <p className="mt-5 text-sm leading-7 text-dark-1/70">
                    Same-day COD settlement can be arranged on vendor request,
                    subject to the agreed operational process and applicable
                    conditions.
                  </p>

                  <div className="mt-8 inline-flex items-center gap-2 rounded-xl bg-dark-1 px-4 py-3 text-sm font-semibold text-white">
                    <ShieldCheck size={17} className="text-primary" />
                    No unsupported guarantees
                  </div>
                </div>
              </div>

              {/* Explanation */}
              <div className="p-8 sm:p-10">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-orange">
                  Settlement Coordination
                </p>

                <h3 className="mt-3 text-2xl font-bold text-fg">
                  Clear expectations matter to online businesses.
                </h3>

                <p className="mt-4 text-sm leading-7 text-muted">
                  COD settlement depends on the shipment, collection and the
                  agreed vendor process. Aarambha can coordinate settlement
                  based on the operational arrangement with the vendor rather
                  than presenting an unqualified financial promise.
                </p>

                <div className="mt-7 space-y-3">
                  <Bullet text="COD amounts are associated with shipment records." />
                  <Bullet text="Vendors can communicate around settlement requirements." />
                  <Bullet text="Same-day settlement can be requested where the applicable process allows it." />
                  <Bullet text="Returns and delivery outcomes can affect the shipment lifecycle." />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* WHY SYSTEMATIC COD MATTERS                                        */}
      {/* ================================================================= */}

      <section className="bg-dark-section py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Vendor Operations
              </p>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Why Systematic COD Handling Matters
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-white/60">
                When order volume grows, manually following up on every
                shipment, COD amount and delivery outcome can become difficult.
                A structured process gives vendors clearer operational
                visibility.
              </p>

              <button
                type="button"
                onClick={() => setShowVendorForm(true)}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 font-semibold on-accent transition hover:-translate-y-0.5"
              >
                Become a Vendor
                <ArrowRight size={17} />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {codReasons.map((reason) => {
                const Icon = reason.icon;

                return (
                  <div
                    key={reason.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.05] p-6"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-primary">
                      <Icon size={20} />
                    </div>

                    <h3 className="mt-5 font-bold text-white">
                      {reason.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-white/55">
                      {reason.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* VENDOR SYSTEM                                                      */}
      {/* ================================================================= */}

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-hairline bg-surface p-7 sm:p-10 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-orange">
                  Vendor Workflow
                </p>

                <h2 className="mt-4 text-3xl font-extrabold text-fg sm:text-4xl">
                  Keep the important COD information connected.
                </h2>

                <p className="mt-5 text-base leading-7 text-muted">
                  A vendor-focused workflow helps connect shipment activity
                  with the information businesses need to follow their
                  customer orders.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {vendorFeatures.map((feature, index) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 rounded-xl border border-hairline bg-app p-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-primary">
                      <span className="text-xs font-bold">{index + 1}</span>
                    </div>

                    <span className="text-sm font-semibold text-fg">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* RETURN / EXCHANGE                                                  */}
      {/* ================================================================= */}

      <section className="border-y border-hairline bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-dark-1">
            <RotateCcw size={25} />
          </div>

          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-accent-orange">
            Beyond Delivery
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-fg sm:text-4xl">
            COD does not end when the customer receives the parcel.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-muted">
            Customer returns and exchanges can change the outcome of an order.
            Aarambha's workflow can include coordination for return or exchange
            shipments where the applicable service is available.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleCODWhatsApp}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 font-semibold on-accent transition hover:-translate-y-0.5"
            >
              Talk to Us About COD
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={() => setShowVendorForm(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-hairline bg-app px-6 py-3.5 font-semibold text-fg transition hover:border-primary"
            >
              Become a Vendor
              <Store size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* FINAL CTA                                                          */}
      {/* ================================================================= */}

      <section className="relative overflow-hidden bg-dark-1 py-20 sm:py-24">
        <div className="absolute inset-0 grid-bg opacity-20" />

        <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-dark-1 shadow-lg">
            <Wallet size={28} />
          </div>

          <h2 className="mt-7 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Looking for COD support for your online business?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/60">
            Tell us about your order volume, pickup requirements and COD
            workflow. Aarambha can discuss the available vendor arrangement
            with you.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleCODWhatsApp}
              className="shimmer inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-7 py-3.5 font-semibold on-accent shadow-lg transition hover:-translate-y-0.5"
            >
              Talk to Us About COD
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={() => setShowVendorForm(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-7 py-3.5 font-semibold text-white transition hover:border-primary hover:bg-white/[0.08]"
            >
              Become a Vendor
              <Store size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* VENDOR MODAL                                                      */}
      {/* ================================================================= */}

      {showVendorForm && (
        <VendorInquiryModal onClose={() => setShowVendorForm(false)} />
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
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-orange">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-fg sm:text-4xl lg:text-5xl">
        {title}
      </h2>

      <p className="mt-5 text-base leading-7 text-muted">{description}</p>
    </div>
  );
}

/* ========================================================================== */
/* COD VISUAL STEP                                                            */
/* ========================================================================== */

function CODVisualStep({
  icon: Icon,
  title,
  description,
  badge,
  highlighted = false,
}: {
  icon: typeof Wallet;
  title: string;
  description: string;
  badge: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        highlighted
          ? "border-primary/30 bg-primary/[0.08]"
          : "border-white/10 bg-white/[0.05]"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
            highlighted
              ? "bg-brand text-dark-1"
              : "bg-white/10 text-primary"
          }`}
        >
          <Icon size={21} />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">{title}</p>

          <p className="mt-1 text-xs text-white/45">{description}</p>
        </div>

        <span
          className={`ml-auto shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide ${
            highlighted
              ? "bg-brand text-dark-1"
              : "bg-white/10 text-white/50"
          }`}
        >
          {badge}
        </span>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* FLOW CONNECTOR                                                             */
/* ========================================================================== */

function FlowConnector() {
  return (
    <div className="flex h-7 items-center justify-center">
      <div className="h-full w-px bg-primary/50" />
    </div>
  );
}

/* ========================================================================== */
/* BULLET                                                                     */
/* ========================================================================== */

function Bullet({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />

      <p className="text-sm leading-6 text-muted">{text}</p>
    </div>
  );
}

/* ========================================================================== */
/* VENDOR INQUIRY MODAL                                                      */
/* ========================================================================== */

function VendorInquiryModal({ onClose }: { onClose: () => void }) {
  const [businessName, setBusinessName] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [monthlyOrders, setMonthlyOrders] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim() || !message.trim()) {
      setError(
        "Please enter your name, phone number and tell us about your COD requirements."
      );
      return;
    }

    const whatsappMessage = `Hello Aarambha Courier,

I am interested in becoming a vendor and would like to discuss COD courier support.

Business Name: ${businessName || "Not provided"}
Name: ${name}
Phone: ${phone}
Approximate Monthly Orders: ${monthlyOrders || "Not provided"}

COD Requirements:
${message}

Please let me know about the available vendor arrangement and next steps.`;

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
      aria-labelledby="vendor-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-lg rounded-3xl border border-hairline bg-app p-6 shadow-lg sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-accent-orange">
              Vendor Inquiry
            </p>

            <h2
              id="vendor-modal-title"
              className="mt-2 text-2xl font-bold text-fg"
            >
              Become an Aarambha Vendor
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted">
              Tell us a little about your business and COD requirements.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close vendor inquiry"
            className="rounded-lg p-2 text-muted transition hover:bg-panel hover:text-fg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Fields */}
        <div className="mt-7 space-y-4">
          <VendorInput
            label="Business Name"
            value={businessName}
            onChange={setBusinessName}
            placeholder="Your online business"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <VendorInput
              label="Your Name"
              value={name}
              onChange={setName}
              placeholder="Full name"
              required
            />

            <VendorInput
              label="Phone Number"
              value={phone}
              onChange={setPhone}
              placeholder="98XXXXXXXX"
              type="tel"
              required
            />
          </div>

          <div>
            <label
              htmlFor="monthly-orders"
              className="mb-2 block text-sm font-semibold text-fg"
            >
              Approximate Monthly Orders
            </label>

            <select
              id="monthly-orders"
              value={monthlyOrders}
              onChange={(event) => setMonthlyOrders(event.target.value)}
              className="w-full rounded-xl border border-hairline bg-surface px-4 py-3 text-sm text-fg outline-none focus:border-primary"
            >
              <option value="">Select if known</option>
              <option value="Below 50">Below 50</option>
              <option value="50–100">50–100</option>
              <option value="100–500">100–500</option>
              <option value="500–1000">500–1000</option>
              <option value="1000+">1000+</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="cod-requirements"
              className="mb-2 block text-sm font-semibold text-fg"
            >
              COD Requirements *
            </label>

            <textarea
              id="cod-requirements"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Tell us about pickup, COD, delivery, settlement or return requirements..."
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

        {/* Buttons */}
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
/* INPUT                                                                      */
/* ========================================================================== */

function VendorInput({
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