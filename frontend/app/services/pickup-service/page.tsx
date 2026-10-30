"use client";

import { FormEvent, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Send,
  Truck,
  User,
  X,
} from "lucide-react";

const WHATSAPP_NUMBER = "9801255799";

function openWhatsApp(message: string) {
  const url = `https://wa.me/977${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  light?: boolean;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p
        className={`mb-3 text-xs font-bold uppercase tracking-[0.2em] ${
          light ? "text-primary" : "text-text-grey"
        }`}
      >
        {eyebrow}
      </p>

      <h2
        className={`text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl ${
          light ? "text-white" : "text-fg"
        }`}
      >
        {title}
      </h2>

      <p
        className={`mx-auto mt-5 max-w-2xl text-base leading-7 sm:text-lg ${
          light ? "text-white/65" : "text-muted"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

function WorkflowStep({
  number,
  icon: Icon,
  title,
  description,
}: {
  number: string;
  icon: typeof Package;
  title: string;
  description: string;
}) {
  return (
    <div className="relative">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-black text-dark-1">
          {number}
        </div>

        <div className="h-px flex-1 bg-white/10 last:hidden" />
      </div>

      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>

      <h3 className="text-lg font-bold text-white">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-white/55">{description}</p>
    </div>
  );
}

function SupportCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Package;
  title: string;
  description: string;
}) {
  return (
    <div className="card group h-full p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-7">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="text-lg font-bold text-fg">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}

function FormInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-fg">
        {label}
        {required && <span className="ml-1 text-primary">*</span>}
      </span>

      <input
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-hairline bg-surface px-4 py-3.5 text-sm text-fg outline-none transition placeholder:text-faint focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

export default function PickupServicePage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    businessName: "",
    pickupLocation: "",
    parcels: "",
    preferredTime: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = [
      "Hello Aarambha Courier, I would like to request a pickup.",
      "",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Business / Vendor: ${form.businessName || "Not provided"}`,
      `Pickup Location: ${form.pickupLocation}`,
      `Number of Parcels: ${form.parcels}`,
      `Preferred Pickup Time: ${form.preferredTime || "Flexible"}`,
      `Message: ${form.message || "No additional message"}`,
    ].join("\n");

    setSubmitted(true);
    openWhatsApp(message);
  }

  function handleDirectWhatsApp() {
    openWhatsApp(
      "Hello Aarambha Courier, I would like to know more about your pickup service."
    );
  }

  return (
    <main className="bg-app">
      {/* HERO */}
      <section className="relative overflow-hidden bg-dark-1">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute -right-32 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Truck className="h-4 w-4" />
              Pickup Service
            </div>

            <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              We Pick Up.
              <span className="block text-primary">You Keep Selling.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
              Convenient pickup support for online sellers, vendors,
              businesses, and individuals sending parcels through Aarambha
              Courier.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#pickup-request"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-dark-1 transition hover:bg-primary-light"
              >
                Request a Pickup
                <ArrowRight className="h-4 w-4" />
              </a>

              <button
                type="button"
                onClick={handleDirectWhatsApp}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" />
                Talk to Us on WhatsApp
              </button>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                "Pickup Request",
                "Parcel Handover",
                "Shipment Entry",
                "Tracking",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
                >
                  <CheckCircle2 className="mb-2 h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold leading-5 text-white/65">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-dark-2 p-5 shadow-2xl sm:p-7">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />

              <div className="relative mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
                    Pickup in progress
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-white">
                    Seller → Aarambha
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-dark-1">
                  <Truck className="h-5 w-5" />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-dark-1 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15">
                    <Package className="h-7 w-7 text-primary" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white">
                      Parcel Collection
                    </p>
                    <p className="mt-1 text-xs text-white/45">
                      Business / Online Seller
                    </p>
                  </div>
                </div>

                <div className="my-6 flex items-center gap-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <div className="h-px flex-1 border-t border-dashed border-white/20" />
                  <Truck className="h-5 w-5 text-primary" />
                  <div className="h-px flex-1 border-t border-dashed border-white/20" />
                  <div className="h-2.5 w-2.5 rounded-full bg-white/30" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/5 p-3">
                    <MapPin className="mb-2 h-4 w-4 text-primary" />
                    <p className="text-[11px] text-white/40">Pickup</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      Seller Location
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/5 p-3">
                    <Package className="mb-2 h-4 w-4 text-primary" />
                    <p className="text-[11px] text-white/40">Status</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      Ready for Pickup
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-xl bg-primary/10 p-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                <p className="text-xs leading-5 text-white/65">
                  After handover, the shipment moves into the delivery
                  processing and tracking workflow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="bg-dark-2 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Simple Pickup Workflow"
            title="From Pickup Request to Shipment"
            description="A straightforward process helps sellers and parcel senders hand over packages and move them into the delivery workflow."
            light
          />

          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            <WorkflowStep
              number="01"
              icon={Send}
              title="Request Pickup"
              description="Share your pickup details and preferred time so the collection can be coordinated."
            />

            <WorkflowStep
              number="02"
              icon={Package}
              title="Prepare Parcel"
              description="Keep your parcel properly packed and ready for handover when the rider arrives."
            />

            <WorkflowStep
              number="03"
              icon={Truck}
              title="Rider Pickup"
              description="The courier rider collects the parcel from the provided pickup location."
            />

            <WorkflowStep
              number="04"
              icon={CheckCircle2}
              title="Shipment Starts"
              description="The parcel enters shipment processing and can move through the tracking workflow."
            />
          </div>
        </div>
      </section>

      {/* SUPPORT */}
      <section className="bg-surface py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Pickup Support"
            title="More Than Just Parcel Collection"
            description="Pickup is the first step in a wider delivery workflow. Aarambha helps keep the handover and shipment process organized."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <SupportCard
              icon={Send}
              title="Pickup Request"
              description="Send your pickup details so the collection requirement can be communicated clearly."
            />

            <SupportCard
              icon={Package}
              title="Package Handover"
              description="Your prepared parcels are handed over to the courier rider for shipment processing."
            />

            <SupportCard
              icon={CheckCircle2}
              title="Shipment Entry"
              description="After collection, shipment information can move into the delivery workflow."
            />

            <SupportCard
              icon={MapPin}
              title="Tracking Support"
              description="Once your shipment is in the system, tracking information helps you follow its progress."
            />
          </div>
        </div>
      </section>

      {/* WHO IS IT FOR */}
      <section className="bg-cream py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-grey">
                Designed for Daily Business
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-fg sm:text-4xl">
                Keep your selling routine moving.
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-muted">
                For online sellers and businesses, arranging individual parcel
                drop-offs can interrupt the workday. Pickup support gives you a
                practical way to hand parcels over without making every
                shipment a separate trip.
              </p>

              <button
                type="button"
                onClick={handleDirectWhatsApp}
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-dark-1 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-dark-2"
              >
                Ask About Pickup
                <ArrowRight className="h-4 w-4 text-primary" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-hairline bg-white-soft p-6">
                <User className="mb-5 h-6 w-6 text-primary" />
                <h3 className="font-bold text-fg">Online Sellers</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Useful for sellers handling multiple customer orders and
                  regular parcel handovers.
                </p>
              </div>

              <div className="rounded-2xl border border-hairline bg-white-soft p-6">
                <Package className="mb-5 h-6 w-6 text-primary" />
                <h3 className="font-bold text-fg">Vendors</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Coordinate parcel collection as part of a recurring vendor
                  delivery workflow.
                </p>
              </div>

              <div className="rounded-2xl border border-hairline bg-white-soft p-6">
                <Truck className="mb-5 h-6 w-6 text-primary" />
                <h3 className="font-bold text-fg">Businesses</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Arrange collection for documents, parcels, and other
                  shipments that need courier handling.
                </p>
              </div>

              <div className="rounded-2xl border border-hairline bg-white-soft p-6">
                <Clock3 className="mb-5 h-6 w-6 text-primary" />
                <h3 className="font-bold text-fg">Regular Senders</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  A practical option when you regularly need to send parcels
                  without visiting a branch for every shipment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REQUEST FORM */}
      <section
        id="pickup-request"
        className="bg-app py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-grey">
                Pickup Request
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-fg sm:text-4xl">
                Tell us where to pick up.
              </h2>

              <p className="mt-5 leading-7 text-muted">
                Share your basic pickup requirements. When you submit the
                form, your request will be prepared in WhatsApp so you can
                communicate directly with Aarambha.
              </p>

              <div className="mt-7 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-fg">Pickup Location</p>
                    <p className="mt-1 text-sm text-muted">
                      Provide the area or location where the parcel is ready.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                    <Clock3 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-fg">
                      Preferred Time
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      Let the team know when pickup would be convenient.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                    <MessageCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-fg">
                      Direct Communication
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      Your request opens directly in WhatsApp for follow-up.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-hairline bg-panel p-5 shadow-sm sm:p-7 lg:p-8">
              {submitted && (
                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-bold text-fg">
                      Pickup request prepared.
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      WhatsApp should have opened with your pickup details.
                      Send the message to continue the conversation.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="ml-auto rounded-lg p-1 text-muted hover:bg-black/5"
                    aria-label="Dismiss message"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="mb-7">
                <h3 className="text-xl font-black text-fg">
                  Request a Pickup
                </h3>
                <p className="mt-2 text-sm text-muted">
                  Fill in the details below and continue through WhatsApp.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormInput
                    label="Name"
                    name="name"
                    value={form.name}
                    onChange={(value) => updateField("name", value)}
                    placeholder="Your full name"
                    required
                  />

                  <FormInput
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(value) => updateField("phone", value)}
                    placeholder="98XXXXXXXX"
                    required
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormInput
                    label="Business / Vendor Name"
                    name="businessName"
                    value={form.businessName}
                    onChange={(value) => updateField("businessName", value)}
                    placeholder="Business name (optional)"
                  />

                  <FormInput
                    label="Number of Parcels"
                    name="parcels"
                    type="number"
                    value={form.parcels}
                    onChange={(value) => updateField("parcels", value)}
                    placeholder="e.g. 5"
                    required
                  />
                </div>

                <FormInput
                  label="Pickup Location"
                  name="pickupLocation"
                  value={form.pickupLocation}
                  onChange={(value) => updateField("pickupLocation", value)}
                  placeholder="Area, street, landmark..."
                  required
                />

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-fg">
                    Preferred Pickup Time
                  </span>

                  <select
                    name="preferredTime"
                    value={form.preferredTime}
                    onChange={(event) =>
                      updateField("preferredTime", event.target.value)
                    }
                    className="w-full appearance-none rounded-xl border border-hairline bg-surface px-4 py-3.5 text-sm text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select preferred time</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-fg">
                    Message
                  </span>

                  <textarea
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={(event) =>
                      updateField("message", event.target.value)
                    }
                    placeholder="Tell us anything important about the pickup..."
                    className="w-full resize-none rounded-xl border border-hairline bg-surface px-4 py-3.5 text-sm text-fg outline-none transition placeholder:text-faint focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-4 text-sm font-black text-dark-1 transition hover:bg-primary-light"
                >
                  <Send className="h-4 w-4" />
                  Request a Pickup
                </button>

                <p className="text-center text-xs leading-5 text-faint">
                  Your request details will be opened in WhatsApp for direct
                  communication with Aarambha Courier.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-dark-1 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
            <Truck className="h-7 w-7 text-primary" />
          </div>

          <h2 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Ready to arrange a pickup?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/55">
            Send us your pickup details and start the conversation with
            Aarambha Courier.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="#pickup-request"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-black text-dark-1 transition hover:bg-primary-light"
            >
              Request a Pickup
              <ArrowRight className="h-4 w-4" />
            </a>

            <button
              type="button"
              onClick={handleDirectWhatsApp}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              <MessageCircle className="h-4 w-4 text-primary" />
              Talk to Us on WhatsApp
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs text-white/40">
            <span className="inline-flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" />
              9801255799
            </span>

            <span className="inline-flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" />
              Kupondole, Lalitpur
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}