"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  Package,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  Store,
  Truck,
  Wallet,
  X,
} from "lucide-react";

const workflow = [
  {
    number: "01",
    title: "Order",
    description: "Customer places an order through your online store or sales channel.",
    icon: ClipboardList,
  },
  {
    number: "02",
    title: "Pickup",
    description: "Packages are collected from the vendor according to the agreed pickup process.",
    icon: Truck,
  },
  {
    number: "03",
    title: "Delivery",
    description: "Shipments move through the delivery process toward the customer.",
    icon: Package,
  },
  {
    number: "04",
    title: "COD",
    description: "Cash-on-delivery collection is recorded as part of the shipment workflow.",
    icon: Wallet,
  },
  {
    number: "05",
    title: "Tracking",
    description: "Shipment status can be checked and delivery progress can be followed.",
    icon: Search,
  },
  {
    number: "06",
    title: "Exchange / Return",
    description: "Return and exchange shipments can be coordinated when required.",
    icon: RotateCcw,
  },
];

const services = [
  {
    title: "Vendor Pickup",
    description:
      "Coordinate parcel collection from your business or agreed pickup location.",
    icon: Truck,
  },
  {
    title: "Delivery Coordination",
    description:
      "Keep customer deliveries organized across the normal shipment workflow.",
    icon: Package,
  },
  {
    title: "COD Management",
    description:
      "Maintain shipment-level COD information so vendors can keep track of collections.",
    icon: Wallet,
  },
  {
    title: "Same-Day COD Settlement",
    description:
      "Same-day COD settlement can be arranged on vendor request, subject to the agreed process.",
    icon: Clock3,
  },
  {
    title: "Shipment Tracking",
    description:
      "Get support checking shipment progress and resolving tracking-related questions.",
    icon: Search,
  },
  {
    title: "Exchange & Return Support",
    description:
      "Coordinate return or exchange parcels when customers need a different delivery outcome.",
    icon: RotateCcw,
  },
  {
    title: "Vendor Communication",
    description:
      "Keep communication clear around pickups, delivery issues, COD and returns.",
    icon: Send,
  },
  {
    title: "Systematic Shipment Workflow",
    description:
      "Use a structured process from package entry through delivery and settlement records.",
    icon: ShieldCheck,
  },
];

const challenges = [
  "Managing multiple orders every day",
  "Arranging regular parcel pickups",
  "Keeping track of COD amounts",
  "Following up on delivery status",
  "Handling customer returns and exchanges",
  "Keeping delivery charges organized",
  "Communicating shipment issues quickly",
  "Maintaining clear shipment records",
];

const vendorSystem = [
  {
    title: "Package Entry",
    description: "Record the shipment details when a package enters the delivery workflow.",
    icon: Package,
  },
  {
    title: "Shipment Status",
    description: "Keep track of the current stage of a shipment.",
    icon: Search,
  },
  {
    title: "COD Records",
    description: "Maintain COD-related shipment information for vendor reference.",
    icon: Wallet,
  },
  {
    title: "Delivery Charge Records",
    description: "Keep delivery charges associated with shipment records.",
    icon: ClipboardList,
  },
  {
    title: "Vendor Dashboard",
    description: "Give vendors a structured view of relevant shipment information.",
    icon: Store,
  },
  {
    title: "Tracking Support",
    description: "Provide support when vendors need help checking shipment progress.",
    icon: Truck,
  },
];

export default function EcommerceLogisticsPage() {
  const [showInquiry, setShowInquiry] = useState(false);

  const handleWhatsApp = () => {
    const message =
      "Hello Aarambha Courier, I am interested in e-commerce logistics support for my online business. I would like to discuss vendor pickup, delivery, COD, tracking and return/exchange support.";

    window.open(
      `https://wa.me/9779801255799?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <main id="main" tabIndex={-1} className="bg-app overflow-hidden">
      {/* Hero */}
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10 grid-bg opacity-50" />

        <div className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-4 py-2 text-sm font-medium text-fg">
                <span className="h-2 w-2 rounded-full bg-brand" />
                E-commerce Logistics
              </div>

              <h1 className="text-hero max-w-4xl text-fg">
                You Grow the Business.
                <span className="block gradient-text">
                  We Support the Delivery Side.
                </span>
              </h1>

              <p className="lead mt-7 max-w-2xl">
                Practical logistics support for online sellers, e-commerce
                businesses and growing vendors in Nepal—from parcel pickup and
                delivery coordination to COD, tracking and return support.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="shimmer inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 font-semibold on-accent shadow-lg transition hover:-translate-y-0.5"
                >
                  Talk to Us on WhatsApp
                  <ArrowRight size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => setShowInquiry(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-hairline bg-surface px-6 py-3.5 font-semibold text-fg transition hover:border-primary hover:bg-panel"
                >
                  Send Vendor Inquiry
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-primary" />
                  Vendor-focused workflow
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-primary" />
                  COD support
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-primary" />
                  Return coordination
                </div>
              </div>
            </div>

            {/* Logistics visual */}
            <div className="relative">
              <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-accent-orange/15 blur-3xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-hairline bg-dark-1 p-5 shadow-lg sm:p-7">
                <div className="absolute inset-0 opacity-20 dot-bg" />

                <div className="relative">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/45">
                        Vendor Logistics
                      </p>
                      <h2 className="mt-1 text-xl font-bold text-white">
                        Daily Shipment Flow
                      </h2>
                    </div>

                    <div className="rounded-xl bg-brand px-3 py-2 text-xs font-bold on-accent">
                      COD
                    </div>
                  </div>

                  {/* Seller */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand on-accent">
                        <Store size={22} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-white">
                          Online Seller
                        </p>
                        <p className="mt-1 text-xs text-white/50">
                          New customer orders
                        </p>
                      </div>

                      <div className="ml-auto rounded-full bg-white/10 px-3 py-1 text-xs text-white/65">
                        24 orders
                      </div>
                    </div>
                  </div>

                  <div className="mx-auto h-7 w-px bg-primary/60" />

                  {/* Parcel */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-primary">
                        <Package size={22} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-white">
                          Packed Parcels
                        </p>
                        <p className="mt-1 text-xs text-white/50">
                          Ready for pickup
                        </p>
                      </div>

                      <div className="ml-auto">
                        <div className="h-2 w-16 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full w-4/5 rounded-full bg-brand" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mx-auto h-7 w-px bg-primary/60" />

                  {/* Rider */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-orange/20 text-primary">
                        <Truck size={22} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-white">
                          Courier Rider
                        </p>
                        <p className="mt-1 text-xs text-white/50">
                          Pickup & delivery coordination
                        </p>
                      </div>

                      <div className="ml-auto h-2.5 w-2.5 rounded-full bg-primary" />
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <MiniStatus icon={Wallet} label="COD" value="Recorded" />
                    <MiniStatus
                      icon={Search}
                      label="Tracking"
                      value="Updated"
                    />
                    <MiniStatus
                      icon={RotateCcw}
                      label="Returns"
                      value="Supported"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="relative border-y border-hairline bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="One Connected Workflow"
            title="From Order to Exchange or Return"
            description="A practical shipment workflow helps online sellers manage the delivery side without losing sight of their customers."
          />

          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workflow.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="card group relative overflow-hidden p-6"
                >
                  <div className="mb-7 flex items-center justify-between">
                    <span className="text-sm font-bold text-primary">
                      {item.number}
                    </span>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-primary transition group-hover:bg-brand group-hover:on-accent">
                      <Icon size={20} />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-fg">{item.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-muted">
                    {item.description}
                  </p>

                  {index < workflow.length - 1 && (
                    <div className="mt-7 hidden text-primary lg:block">
                      <ChevronRight size={18} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core services */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Vendor Support"
            title="Logistics Support That Fits the Way You Sell"
            description="The delivery side of an online business involves more than moving a parcel. Aarambha supports the practical steps around pickup, delivery, COD, tracking and returns."
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <div key={service.title} className="card p-6">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/15 text-primary">
                    <Icon size={21} />
                  </div>

                  <h3 className="font-bold text-fg">{service.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-muted">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Daily reality */}
      <section className="bg-dark-section py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                For Online Sellers
              </p>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Built for the Daily Reality of Online Sellers
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-white/65">
                Growing an online business means dealing with orders, parcels,
                customers, COD, delivery updates and returns at the same time.
                A structured courier workflow can make the operational side
                easier to manage.
              </p>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 font-semibold on-accent transition hover:-translate-y-0.5"
                >
                  Discuss Your Vendor Needs
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {challenges.map((challenge) => (
                <div
                  key={challenge}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.05] p-4"
                >
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0 text-primary"
                  />
                  <span className="text-sm leading-6 text-white/75">
                    {challenge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vendor system */}
      <section className="bg-cream py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Current Vendor System"
            title="A More Structured Way to Handle Shipments"
            description="The vendor-side workflow focuses on the information businesses need to manage their day-to-day delivery operations."
            dark
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {vendorSystem.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-dark-1">
                      <Icon size={21} />
                    </div>

                    <span className="text-sm font-bold text-black/25">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-dark-1">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-black/60">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Additional support */}
          <div className="mt-12 rounded-2xl border border-black/10 bg-white/60 p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-accent-orange">
                  Additional Operational Support
                </p>

                <h3 className="mt-2 text-xl font-bold text-dark-1">
                  Packaging and limited warehousing
                </h3>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-black/60">
                  Packaging assistance and limited warehousing may be available
                  for selected vendors depending on their operational
                  requirements and the agreed arrangement. These are
                  additional support options, not the core courier service.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowInquiry(true)}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-dark-1 transition hover:border-primary"
              >
                Ask About Support
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why structure matters */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-orange">
            For Growing Vendors
          </p>

          <h2 className="mt-4 text-3xl font-extrabold text-fg sm:text-4xl lg:text-5xl">
            Your customers see the delivery.
            <span className="block gradient-text">
              Your business manages the workflow.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-muted">
            A dependable delivery process helps vendors spend less time
            manually coordinating individual shipments and more time focusing
            on their products, customers and business operations.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleWhatsApp}
              className="shimmer inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-7 py-3.5 font-semibold on-accent shadow-lg transition hover:-translate-y-0.5"
            >
              Talk to Us on WhatsApp
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={() => setShowInquiry(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-hairline bg-surface px-7 py-3.5 font-semibold text-fg transition hover:border-primary"
            >
              Send Vendor Inquiry
              <Send size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Inquiry modal */}
      {showInquiry && (
        <VendorInquiryModal
          onClose={() => setShowInquiry(false)}
          onWhatsApp={handleWhatsApp}
        />
      )}
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Reusable components                                                        */
/* -------------------------------------------------------------------------- */

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
      <p
        className={`text-sm font-semibold uppercase tracking-[0.18em] ${
          dark ? "text-accent-orange" : "text-accent-orange"
        }`}
      >
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

function MiniStatus({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Wallet;
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

function VendorInquiryModal({
  onClose,
  onWhatsApp,
}: {
  onClose: () => void;
  onWhatsApp: () => void;
}) {
  const [businessName, setBusinessName] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim() || !message.trim()) {
      setError("Please enter your name, phone number and inquiry.");
      return;
    }

    const whatsappMessage = `Hello Aarambha Courier,

I would like to send a vendor inquiry.

Business: ${businessName || "Not provided"}
Name: ${name}
Phone: ${phone}

Inquiry:
${message}`;

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
      aria-labelledby="vendor-inquiry-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-lg rounded-3xl border border-hairline bg-app p-6 shadow-lg sm:p-8">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-accent-orange">
              Vendor Inquiry
            </p>

            <h2
              id="vendor-inquiry-title"
              className="mt-2 text-2xl font-bold text-fg"
            >
              Tell us about your delivery needs
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close inquiry form"
            className="rounded-lg p-2 text-muted transition hover:bg-panel hover:text-fg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-7 space-y-4">
          <InputField
            label="Business Name"
            value={businessName}
            onChange={setBusinessName}
            placeholder="Your online business"
          />

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

          <div>
            <label
              htmlFor="vendor-message"
              className="mb-2 block text-sm font-semibold text-fg"
            >
              What do you need help with? *
            </label>

            <textarea
              id="vendor-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="For example: daily pickup, COD delivery, returns, tracking..."
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
  return (
    <div>
      <label
        htmlFor={label.toLowerCase().replace(/\s+/g, "-")}
        className="mb-2 block text-sm font-semibold text-fg"
      >
        {label} {required && <span className="text-accent-orange">*</span>}
      </label>

      <input
        id={label.toLowerCase().replace(/\s+/g, "-")}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-hairline bg-surface px-4 py-3 text-sm text-fg outline-none placeholder:text-faint focus:border-primary"
      />
    </div>
  );
}