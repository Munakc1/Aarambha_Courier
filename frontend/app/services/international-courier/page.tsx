"use client";

import { FormEvent, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Plane,
  Send,
  ShieldCheck,
  Weight,
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

function InfoCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Globe2;
  title: string;
  description: string;
}) {
  return (
    <div className="card h-full p-6 transition-transform duration-300 hover:-translate-y-1">
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
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
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

export default function InternationalCourierPage() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    destination: "",
    pickupLocation: "",
    shipmentType: "",
    weight: "",
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
      "Hello Aarambha Courier, I would like to request an international courier quote.",
      "",
      `Full Name: ${form.fullName}`,
      `Phone: ${form.phone}`,
      `Email: ${form.email}`,
      `Destination Country: ${form.destination}`,
      `Pickup Location: ${form.pickupLocation}`,
      `Parcel / Document Type: ${form.shipmentType}`,
      `Approximate Weight: ${form.weight}`,
      `Message: ${form.message || "No additional message"}`,
    ].join("\n");

    setSubmitted(true);
    openWhatsApp(message);
  }

  function handleWhatsApp() {
    openWhatsApp(
      "Hello Aarambha Courier, I would like to ask about your international courier service."
    );
  }

  return (
    <main className="bg-app">
      {/* HERO */}
      <section className="relative overflow-hidden bg-dark-1">
        <div className="absolute inset-0 grid-bg opacity-25" />

        <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

        <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] text-primary">
              <Globe2 className="h-4 w-4" />
              International Courier
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              International Courier for
              <span className="block text-primary">
                Parcels &amp; Documents
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
              Planning to send a parcel or document internationally? Aarambha
              Courier can help you inquire about your shipment requirements
              from Nepal.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#international-quote"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-black text-dark-1 transition hover:bg-primary-light"
              >
                Get International Quote
                <ArrowRight className="h-4 w-4" />
              </a>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" />
                Ask on WhatsApp
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "Parcels",
                "Documents",
                "Destination Inquiry",
                "Quote Request",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-white/55"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="mx-auto w-full max-w-xl">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-dark-2 p-5 shadow-2xl sm:p-7">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />

              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">
                    Shipment Inquiry
                  </p>

                  <h2 className="mt-2 text-xl font-black text-white">
                    Nepal → International
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-dark-1">
                  <Globe2 className="h-6 w-6" />
                </div>
              </div>

              <div className="relative mt-7 rounded-2xl border border-white/10 bg-dark-1 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>

                  <div className="h-px flex-1 border-t border-dashed border-white/20" />

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
                    <Plane className="h-6 w-6 text-primary" />
                  </div>
                </div>

                <div className="mt-3 flex justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/35">
                      Origin
                    </p>
                    <p className="mt-1 text-sm font-bold text-white">
                      Nepal
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-white/35">
                      Destination
                    </p>
                    <p className="mt-1 text-sm font-bold text-white">
                      Your Country
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <FileText className="mb-3 h-5 w-5 text-primary" />
                  <p className="text-xs text-white/35">Shipment Type</p>
                  <p className="mt-1 text-sm font-bold text-white">
                    Document / Parcel
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <Weight className="mb-3 h-5 w-5 text-primary" />
                  <p className="text-xs text-white/35">Pricing</p>
                  <p className="mt-1 text-sm font-bold text-white">
                    Quote Based
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-3 rounded-xl bg-primary/10 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                <p className="text-xs leading-5 text-white/55">
                  Final pricing and shipment requirements depend on the
                  destination, weight, shipment type, and verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-surface py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="International Shipping Inquiry"
            title="Start With the Right Shipment Details"
            description="International courier requirements can vary depending on where the shipment is going and what is being sent. Share your details so the requirement can be reviewed before a quote is discussed."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard
              icon={Globe2}
              title="Destination"
              description="The destination country is an important part of determining the applicable courier requirement and pricing."
            />

            <InfoCard
              icon={Package}
              title="Shipment Type"
              description="Let us know whether you are sending documents, a parcel, or another shipment type."
            />

            <InfoCard
              icon={Weight}
              title="Approximate Weight"
              description="An approximate shipment weight helps provide the information needed for a quote inquiry."
            />

            <InfoCard
              icon={ShieldCheck}
              title="Verification"
              description="Final pricing and requirements are confirmed after the relevant shipment details are reviewed."
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-dark-2 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Simple Inquiry Process"
            title="Tell Us What You Need to Send"
            description="The inquiry process keeps the focus on the information required to understand your international shipment."
            light
          />

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-sm font-black text-dark-1">
                01
              </div>

              <h3 className="mt-6 text-xl font-black text-white">
                Share Shipment Details
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/50">
                Tell us your destination, pickup location, shipment type, and
                approximate weight.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-sm font-black text-dark-1">
                02
              </div>

              <h3 className="mt-6 text-xl font-black text-white">
                Review the Requirement
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/50">
                The relevant shipment details can be reviewed to understand
                the applicable international courier requirement.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-sm font-black text-dark-1">
                03
              </div>

              <h3 className="mt-6 text-xl font-black text-white">
                Discuss the Quote
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/50">
                Pricing and requirements can then be discussed based on the
                destination, weight, shipment type, and verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE FORM */}
      <section
        id="international-quote"
        className="bg-cream py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-grey">
                International Quote
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-fg sm:text-4xl">
                Need an International Courier Quote?
              </h2>

              <p className="mt-5 leading-7 text-muted">
                Give us the basic shipment information and continue the
                conversation through WhatsApp. The final quote depends on the
                details of your shipment.
              </p>

              <div className="mt-7 rounded-2xl border border-hairline bg-white-soft p-5">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                  <div>
                    <p className="text-sm font-bold text-fg">
                      Pricing depends on shipment details
                    </p>

                    <p className="mt-2 text-sm leading-6 text-muted">
                      Destination country, weight, shipment type, and required
                      verification can affect the final pricing and
                      requirements.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-dark-1 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-dark-2"
              >
                <MessageCircle className="h-4 w-4 text-primary" />
                Ask on WhatsApp
              </button>
            </div>

            <div className="rounded-3xl border border-hairline bg-panel p-5 shadow-sm sm:p-7 lg:p-8">
              {submitted && (
                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                  <div>
                    <p className="font-bold text-fg">
                      Quote inquiry prepared.
                    </p>

                    <p className="mt-1 text-sm leading-6 text-muted">
                      WhatsApp should have opened with your shipment details.
                      Send the message to continue.
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
                  International Courier Inquiry
                </h3>

                <p className="mt-2 text-sm text-muted">
                  Provide as much information as possible for a clearer quote
                  discussion.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormInput
                    label="Full Name"
                    value={form.fullName}
                    onChange={(value) => updateField("fullName", value)}
                    placeholder="Your full name"
                    required
                  />

                  <FormInput
                    label="Phone"
                    value={form.phone}
                    onChange={(value) => updateField("phone", value)}
                    placeholder="98XXXXXXXX"
                    type="tel"
                    required
                  />
                </div>

                <FormInput
                  label="Email"
                  value={form.email}
                  onChange={(value) => updateField("email", value)}
                  placeholder="you@example.com"
                  type="email"
                  required
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormInput
                    label="Destination Country"
                    value={form.destination}
                    onChange={(value) => updateField("destination", value)}
                    placeholder="e.g. Australia"
                    required
                  />

                  <FormInput
                    label="Pickup Location"
                    value={form.pickupLocation}
                    onChange={(value) =>
                      updateField("pickupLocation", value)
                    }
                    placeholder="Area / city in Nepal"
                    required
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-fg">
                      Parcel / Document Type
                      <span className="ml-1 text-primary">*</span>
                    </span>

                    <select
                      required
                      value={form.shipmentType}
                      onChange={(event) =>
                        updateField("shipmentType", event.target.value)
                      }
                      className="w-full appearance-none rounded-xl border border-hairline bg-surface px-4 py-3.5 text-sm text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Select shipment type</option>
                      <option value="Documents">Documents</option>
                      <option value="Parcel">Parcel</option>
                      <option value="Personal Items">Personal Items</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>

                  <FormInput
                    label="Approximate Weight"
                    value={form.weight}
                    onChange={(value) => updateField("weight", value)}
                    placeholder="e.g. 2 kg"
                    required
                  />
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-fg">
                    Message
                  </span>

                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(event) =>
                      updateField("message", event.target.value)
                    }
                    placeholder="Tell us anything important about your shipment..."
                    className="w-full resize-none rounded-xl border border-hairline bg-surface px-4 py-3.5 text-sm text-fg outline-none transition placeholder:text-faint focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-4 text-sm font-black text-dark-1 transition hover:bg-primary-light"
                >
                  <Send className="h-4 w-4" />
                  Get International Quote
                </button>

                <p className="text-center text-xs leading-5 text-faint">
                  Final pricing and requirements are subject to shipment
                  details and verification.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* IMPORTANT NOTE */}
      <section className="bg-surface py-14 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-3xl border border-hairline bg-panel p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                <FileText className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h2 className="text-lg font-black text-fg">
                  International shipment requirements can vary
                </h2>

                <p className="mt-3 text-sm leading-6 text-muted">
                  The applicable requirements and final price depend on the
                  destination country, shipment type, approximate weight, and
                  verification of the shipment details. Please contact
                  Aarambha for the specific requirements of your shipment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-dark-1 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
            <Globe2 className="h-7 w-7 text-primary" />
          </div>

          <h2 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Need an International Courier Quote?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/55">
            Share your destination and shipment details with Aarambha Courier
            to start your international courier inquiry.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="#international-quote"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-black text-dark-1 transition hover:bg-primary-light"
            >
              Get International Quote
              <ArrowRight className="h-4 w-4" />
            </a>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              <MessageCircle className="h-4 w-4 text-primary" />
              Ask on WhatsApp
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs text-white/40">
            <span className="inline-flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" />
              aarambhatransport@gmail.com
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