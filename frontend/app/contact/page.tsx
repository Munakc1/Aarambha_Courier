"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  RefreshCw,
  Send,
  Store,
  Truck,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

const OFFICE_LOCATION =
  "Aarambha Courier and Transport Service Pvt. Ltd., Kupondole, Lalitpur, Nepal";

const DEFAULT_HOURS =
  "Please contact our team to confirm current office and service hours.";

type ContactDetails = {
  name?: string;
  address?: string;
  phone?: string | string[];
  email?: string;
  hours?: string;
};

type InquiryType = "general" | "vendor" | "international" | "shipment";

type ContactForm = {
  name: string;
  phone: string;
  email: string;
  inquiryType: InquiryType;
  businessName: string;
  businessType: string;
  monthlyShipments: string;
  origin: string;
  destination: string;
  parcelType: string;
  weight: string;
  trackingNumber: string;
  message: string;
};

const INITIAL_FORM: ContactForm = {
  name: "",
  phone: "",
  email: "",
  inquiryType: "general",
  businessName: "",
  businessType: "",
  monthlyShipments: "",
  origin: "",
  destination: "",
  parcelType: "",
  weight: "",
  trackingNumber: "",
  message: "",
};

const INQUIRY_OPTIONS: { value: InquiryType; label: string }[] = [
  { value: "general", label: "General Inquiry" },
  { value: "vendor", label: "Vendor / Business Partnership" },
  { value: "international", label: "International Courier" },
  { value: "shipment", label: "Shipment Support" },
];

const INQUIRY_CARDS = [
  {
    value: "general" as InquiryType,
    title: "General Inquiry",
    text: "Ask about services, coverage, pricing, or other questions.",
    icon: MessageCircle,
  },
  {
    value: "vendor" as InquiryType,
    title: "Vendor Partnership",
    text: "Discuss recurring shipments, pickups, COD, and returns.",
    icon: Store,
  },
  {
    value: "international" as InquiryType,
    title: "International Courier",
    text: "Ask about sending parcels across international borders.",
    icon: Globe2,
  },
  {
    value: "shipment" as InquiryType,
    title: "Shipment Support",
    text: "Ask for help with an existing shipment or tracking number.",
    icon: Package,
  },
];

const BUSINESS_TYPES = [
  "E-commerce / Online Seller",
  "Retail",
  "Wholesale",
  "Manufacturer",
  "Distributor",
  "Other",
];

const MESSAGE_LABELS: Record<InquiryType, string> = {
  general: "How can we help you?",
  vendor: "Tell us about your delivery requirements",
  international: "Shipment description or questions",
  shipment: "Describe the shipment issue",
};

const fieldClass =
  "w-full rounded-xl border border-[#DCD5C7] bg-[#FEF8EB] px-4 py-3 text-[#0A0E12] outline-none transition placeholder:text-gray-400 focus:border-[#A66D00] focus:ring-2 focus:ring-[#FBB501]/40";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FBB501]";

function cleanPhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

/** Turns a Nepali mobile number into WhatsApp format (977XXXXXXXXXX). */
function toWhatsAppDigits(raw: string) {
  const digits = raw.replace(/\D/g, "");
  return /^9[678]\d{8}$/.test(digits) ? `977${digits}` : digits;
}

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-bold">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function ContactPage() {
  const [contact, setContact] = useState<ContactDetails>({
    name: "Aarambha Courier and Transport Service Pvt. Ltd.",
    address: OFFICE_LOCATION,
  });
  const [form, setForm] = useState<ContactForm>(INITIAL_FORM);
  const [website, setWebsite] = useState(""); // honeypot, must stay empty
  const [loadingContact, setLoadingContact] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const statusRef = useRef<HTMLDivElement>(null);

  /* Load live contact details; keep fallback if the API is unavailable. */
  useEffect(() => {
    let active = true;

    async function loadContact() {
      try {
        const response = await fetch(`${API_URL}/api/about`, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Could not load contact information.");

        const result = await response.json();
        const data = result.data ?? result.about ?? result;

        if (active && data && typeof data === "object") {
          setContact((previous) => ({ ...previous, ...data }));
        }
      } catch {
        // Keep fallback information so the page stays usable.
      } finally {
        if (active) setLoadingContact(false);
      }
    }

    void loadContact();
    return () => {
      active = false;
    };
  }, []);

  /* Allow links like /contact?type=vendor to preselect the inquiry type. */
  useEffect(() => {
    const type = new URLSearchParams(window.location.search).get("type");
    if (INQUIRY_OPTIONS.some((option) => option.value === type)) {
      setForm((previous) => ({ ...previous, inquiryType: type as InquiryType }));
    }
  }, []);

  /* Bring the success or error message into view after submitting. */
  useEffect(() => {
    if (success || error) {
      statusRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [success, error]);

  function updateField<K extends keyof ContactForm>(field: K, value: ContactForm[K]) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setError("");
    setSuccess("");
  }

  function chooseVendorInquiry() {
    updateField("inquiryType", "vendor");
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setError("");
    setSuccess("");

    if (!/^9[678]\d{8}$/.test(form.phone.trim())) {
      setError(
        "Please enter a valid 10-digit Nepali mobile number starting with 96, 97, or 98."
      );
      return;
    }

    if (form.inquiryType === "vendor" && (!form.businessName.trim() || !form.businessType)) {
      setError("Please provide your business name and business type.");
      return;
    }

    if (
      form.inquiryType === "international" &&
      (!form.origin.trim() || !form.destination.trim())
    ) {
      setError("Please provide the shipment origin and destination country.");
      return;
    }

    // Bots fill hidden fields. Pretend it worked, but send nothing.
    if (website) {
      setSuccess("Your inquiry has been submitted.");
      setForm(INITIAL_FORM);
      return;
    }

    const type = form.inquiryType;

    // Only send the fields that belong to the chosen inquiry type.
    const payload: ContactForm = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      inquiryType: type,
      businessName: type === "vendor" ? form.businessName.trim() : "",
      businessType: type === "vendor" ? form.businessType : "",
      monthlyShipments: type === "vendor" ? form.monthlyShipments : "",
      origin: type === "international" ? form.origin.trim() : "",
      destination: type === "international" ? form.destination.trim() : "",
      parcelType: type === "international" ? form.parcelType : "",
      weight: type === "international" ? form.weight.trim() : "",
      trackingNumber: type === "shipment" ? form.trackingNumber.trim() : "",
      message: form.message.trim(),
    };

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Unable to submit your inquiry. Please try again.");
      }

      setSuccess(
        result.message ||
          "Your inquiry has been submitted. Our team can follow up using the contact details you provided."
      );
      setForm(INITIAL_FORM);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const phones = Array.isArray(contact.phone)
    ? contact.phone
    : contact.phone
      ? [contact.phone]
      : [];

  /* WhatsApp number: env variable first, otherwise the first Nepali mobile in your contact info. */
  const whatsappDigits = WHATSAPP_NUMBER
    ? toWhatsAppDigits(WHATSAPP_NUMBER)
    : (() => {
        const mobile = phones.find((p) =>
          /^(977)?9[678]\d{8}$/.test(p.replace(/\D/g, ""))
        );
        return mobile ? toWhatsAppDigits(mobile) : "";
      })();

  const whatsappLink = whatsappDigits
    ? `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
        "Hello Aarambha, I would like to inquire about your courier and logistics services."
      )}`
    : "";

  const address = contact.address || OFFICE_LOCATION;
  const mapsLink =
    "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(address);
  const mapEmbed =
    "https://maps.google.com/maps?q=" +
    encodeURIComponent(address) +
    "&t=&z=14&ie=UTF8&iwloc=&output=embed";

  return (
    <main className="min-h-screen scroll-smooth bg-[#FEF8EB] text-[#0A0E12]">
      <style>{`
        @keyframes aarambha-reveal {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: no-preference) {
          .aarambha-reveal { animation: aarambha-reveal .3s ease-out both; }
        }
      `}</style>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0A0E12] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[#FBB501]/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-10 top-20 hidden h-56 w-56 rounded-full border border-white/10 lg:block"
        />

        <div className="relative mx-auto max-w-7xl px-5 pb-32 pt-16 sm:px-8 sm:pt-20 lg:pt-24">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#FBB501]/40 px-4 py-1.5 text-sm font-semibold text-[#FBB501]">
              <MessageCircle className="h-4 w-4" />
              Contact Aarambha
            </p>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Let's talk about your delivery needs.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              Need a courier, looking for a logistics partner for your business, or planning
              an international shipment? Tell us what you need and we'll help you find the
              appropriate next step.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contact-form"
                className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#FBB501] px-7 py-3.5 font-bold text-[#0A0E12] transition hover:bg-[#FFD052] ${focusRing}`}
              >
                Send an Inquiry
                <ArrowRight className="h-4 w-4" />
              </a>

              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-3.5 font-bold transition hover:border-[#FBB501] hover:text-[#FBB501] ${focusRing}`}
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT CHANNELS (overlap the hero) */}
      <section className="relative z-10 mx-auto -mt-20 max-w-7xl px-5 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-2xl bg-white p-6 shadow-lg shadow-black/5 ring-1 ring-[#E9DFC9]">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FEF2CD] text-[#795000]">
              <Phone className="h-6 w-6" />
            </span>
            <h2 className="mt-4 font-extrabold">Call our team</h2>

            {phones.length > 0 ? (
              <div className="mt-3 space-y-2">
                {phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${cleanPhone(phone)}`}
                    className="block break-all text-sm text-gray-600 hover:text-[#795000] hover:underline"
                  >
                    {phone}
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Contact numbers will appear here once configured.
              </p>
            )}
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-lg shadow-black/5 ring-1 ring-[#E9DFC9]">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FEF2CD] text-[#795000]">
              <Mail className="h-6 w-6" />
            </span>
            <h2 className="mt-4 font-extrabold">Email us</h2>

            {contact.email ? (
              <a
                href={`mailto:${contact.email}`}
                className="mt-3 block break-all text-sm text-gray-600 hover:text-[#795000] hover:underline"
              >
                {contact.email}
              </a>
            ) : (
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Email details will appear here once configured.
              </p>
            )}
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-lg shadow-black/5 ring-1 ring-[#E9DFC9]">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FEF2CD] text-[#795000]">
              <MapPin className="h-6 w-6" />
            </span>
            <h2 className="mt-4 font-extrabold">Visit our office</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              {contact.address || "Kupondole, Lalitpur, Nepal"}
            </p>
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#795000] hover:underline"
            >
              Get directions
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-lg shadow-black/5 ring-1 ring-[#E9DFC9]">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FEF2CD] text-[#795000]">
              <Clock3 className="h-6 w-6" />
            </span>
            <h2 className="mt-4 font-extrabold">Business hours</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              {contact.hours || DEFAULT_HOURS}
            </p>
          </article>
        </div>

        {loadingContact && (
          <p className="mt-3 text-xs text-gray-600" role="status">
            <RefreshCw className="mr-1 inline h-3 w-3 animate-spin" />
            Loading contact details...
          </p>
        )}
      </section>

      {/* INQUIRY TYPE SELECTOR */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="mb-8 max-w-3xl">
          <p className="mb-2 text-sm font-semibold text-[#8A5B00]">How can we help?</p>
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Choose the right type of inquiry.
          </h2>
          <p className="mt-4 leading-7 text-gray-600">
            Select a category below. The form will adjust to collect the details relevant to
            your request.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INQUIRY_CARDS.map((item) => {
            const Icon = item.icon;
            const selected = form.inquiryType === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  updateField("inquiryType", item.value);
                  document
                    .getElementById("contact-form")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                aria-pressed={selected}
                className={`group relative rounded-2xl p-6 text-left transition ${focusRing} ${
                  selected
                    ? "bg-[#0A0E12] text-white shadow-xl shadow-black/15"
                    : "bg-white ring-1 ring-[#E9DFC9] hover:-translate-y-0.5 hover:ring-[#FBB501]"
                }`}
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    selected ? "bg-[#FBB501] text-[#0A0E12]" : "bg-[#FEF2CD] text-[#795000]"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </span>

                {selected && (
                  <CheckCircle2
                    aria-hidden="true"
                    className="absolute right-5 top-5 h-5 w-5 text-[#FBB501]"
                  />
                )}

                <h3 className="mt-5 font-extrabold">{item.title}</h3>
                <p
                  className={`mt-2 text-sm leading-6 ${
                    selected ? "text-white/70" : "text-gray-600"
                  }`}
                >
                  {item.text}
                </p>

                <span
                  className={`mt-4 inline-flex items-center gap-1 text-xs font-bold ${
                    selected ? "text-[#FBB501]" : "text-[#795000]"
                  }`}
                >
                  {selected ? "Selected" : "Choose inquiry"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* FORM AND MAP */}
      <section id="contact-form" className="scroll-mt-6 border-t border-[#E9DFC9] bg-[#FFFDF7]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:py-24">
          {/* INQUIRY FORM */}
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#E9DFC9] sm:p-10">
            <p className="mb-2 text-sm font-semibold text-[#8A5B00]">Send us a message</p>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Tell us what you need.</h2>
            <p className="mt-4 leading-7 text-gray-600">
              Provide a few details so our team can understand your request.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate={false}>
              {/* Honeypot: hidden from people, visible to bots */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="name" label="Full name *">
                  <input
                    id="name"
                    name="name"
                    autoComplete="name"
                    required
                    maxLength={100}
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Your full name"
                    className={fieldClass}
                  />
                </Field>

                <Field id="phone" label="Nepali mobile number *">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    required
                    maxLength={10}
                    pattern="9[678][0-9]{8}"
                    title="10-digit Nepali mobile number starting with 96, 97, or 98"
                    value={form.phone}
                    onChange={(e) =>
                      updateField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    placeholder="98XXXXXXXX"
                    className={fieldClass}
                  />
                </Field>
              </div>

              <Field id="email" label="Email address *">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="you@example.com"
                  className={fieldClass}
                />
              </Field>

              <Field id="inquiryType" label="Inquiry category *">
                <select
                  id="inquiryType"
                  name="inquiryType"
                  required
                  value={form.inquiryType}
                  onChange={(e) => updateField("inquiryType", e.target.value as InquiryType)}
                  className={fieldClass}
                >
                  {INQUIRY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>

              {/* VENDOR FIELDS */}
              {form.inquiryType === "vendor" && (
                <div className="aarambha-reveal space-y-5 rounded-2xl border border-[#FBB501]/50 bg-[#FFF9E6] p-5">
                  <h3 className="flex items-center gap-2 font-extrabold">
                    <Store className="h-5 w-5 text-[#795000]" />
                    Business details
                  </h3>

                  <Field id="businessName" label="Business name *">
                    <input
                      id="businessName"
                      required
                      maxLength={150}
                      value={form.businessName}
                      onChange={(e) => updateField("businessName", e.target.value)}
                      placeholder="Your business name"
                      className={fieldClass}
                    />
                  </Field>

                  <Field id="businessType" label="Business type *">
                    <select
                      id="businessType"
                      required
                      value={form.businessType}
                      onChange={(e) => updateField("businessType", e.target.value)}
                      className={fieldClass}
                    >
                      <option value="">Select business type</option>
                      {BUSINESS_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field id="monthlyShipments" label="Approximate monthly shipments">
                    <select
                      id="monthlyShipments"
                      value={form.monthlyShipments}
                      onChange={(e) => updateField("monthlyShipments", e.target.value)}
                      className={fieldClass}
                    >
                      <option value="">Select estimated volume</option>
                      <option value="1-20">1–20 shipments</option>
                      <option value="21-100">21–100 shipments</option>
                      <option value="101-500">101–500 shipments</option>
                      <option value="500+">500+ shipments</option>
                      <option value="Not sure">Not sure yet</option>
                    </select>
                  </Field>
                </div>
              )}

              {/* INTERNATIONAL FIELDS */}
              {form.inquiryType === "international" && (
                <div className="aarambha-reveal space-y-5 rounded-2xl border border-[#FBB501]/50 bg-[#FFF9E6] p-5">
                  <h3 className="flex items-center gap-2 font-extrabold">
                    <Globe2 className="h-5 w-5 text-[#795000]" />
                    International shipment details
                  </h3>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="origin" label="Origin *">
                      <input
                        id="origin"
                        required
                        maxLength={100}
                        value={form.origin}
                        onChange={(e) => updateField("origin", e.target.value)}
                        placeholder="City or country"
                        className={fieldClass}
                      />
                    </Field>

                    <Field id="destination" label="Destination country *">
                      <input
                        id="destination"
                        required
                        maxLength={100}
                        value={form.destination}
                        onChange={(e) => updateField("destination", e.target.value)}
                        placeholder="e.g. Australia"
                        className={fieldClass}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="parcelType" label="Parcel type">
                      <select
                        id="parcelType"
                        value={form.parcelType}
                        onChange={(e) => updateField("parcelType", e.target.value)}
                        className={fieldClass}
                      >
                        <option value="">Select parcel type</option>
                        <option value="Documents">Documents</option>
                        <option value="Personal parcel">Personal parcel</option>
                        <option value="Commercial goods">Commercial goods</option>
                        <option value="Other">Other</option>
                      </select>
                    </Field>

                    <Field id="weight" label="Approximate weight">
                      <input
                        id="weight"
                        maxLength={50}
                        value={form.weight}
                        onChange={(e) => updateField("weight", e.target.value)}
                        placeholder="e.g. 2 kg"
                        className={fieldClass}
                      />
                    </Field>
                  </div>

                  <p className="text-xs leading-6 text-gray-600">
                    Availability, destination restrictions, documentation, and pricing must be
                    confirmed by the courier team.
                  </p>
                </div>
              )}

              {/* EXISTING SHIPMENT */}
              {form.inquiryType === "shipment" && (
                <div className="aarambha-reveal rounded-2xl border border-[#FBB501]/50 bg-[#FFF9E6] p-5">
                  <Field id="trackingNumber" label="Tracking number, if available">
                    <input
                      id="trackingNumber"
                      maxLength={100}
                      value={form.trackingNumber}
                      onChange={(e) => updateField("trackingNumber", e.target.value)}
                      placeholder="Enter your tracking number"
                      className={fieldClass}
                    />
                  </Field>
                </div>
              )}

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-bold">
                  {MESSAGE_LABELS[form.inquiryType]} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  minLength={5}
                  maxLength={3000}
                  rows={5}
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  placeholder="Write your message here..."
                  className={`${fieldClass} resize-y leading-7`}
                />
                <p className="mt-1.5 text-right text-xs text-gray-600">
                  {form.message.length}/3000
                </p>
              </div>

              <div ref={statusRef} aria-live="polite">
                {error && (
                  <div
                    role="alert"
                    className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"
                  >
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    {error}
                  </div>
                )}

                {success && (
                  <div
                    role="status"
                    className="flex gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-800"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                    {success}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#FBB501] px-8 py-4 font-extrabold text-[#0A0E12] transition hover:bg-[#FFD052] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${focusRing}`}
              >
                {submitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Inquiry
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="text-xs leading-6 text-gray-600">
                Please do not include passwords, payment credentials, or other sensitive
                information in your message.
              </p>
            </form>
          </div>

          {/* MAP AND SUPPORT */}
          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <div>
              <p className="mb-2 text-sm font-semibold text-[#8A5B00]">Find our office</p>
              <h2 className="text-2xl font-extrabold">Visit or get directions.</h2>
              <p className="mt-3 text-sm leading-7 text-gray-600">{address}</p>
            </div>

            <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-[#E9DFC9]">
              <iframe
                title="Aarambha Courier office location on Google Maps"
                src={mapEmbed}
                width="100%"
                height="320"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block w-full"
              />

              <div className="border-t border-[#E9DFC9] p-4">
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#795000] hover:underline"
                >
                  <MapPin className="h-4 w-4" />
                  Open Google Maps
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 ring-1 ring-[#E9DFC9]">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FEF2CD] text-[#795000]">
                <Truck className="h-6 w-6" />
              </span>

              <h3 className="mt-4 text-lg font-extrabold">Looking for a logistics partner?</h3>

              <p className="mt-2 text-sm leading-7 text-gray-600">
                Tell us about your business, expected shipment volume, pickup requirements,
                COD needs, and return process.
              </p>

              <button
                type="button"
                onClick={chooseVendorInquiry}
                className={`mt-4 inline-flex items-center gap-2 rounded-md font-bold text-[#795000] hover:underline ${focusRing}`}
              >
                Make a vendor inquiry
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-4 rounded-3xl bg-[#0A0E12] p-5 text-white transition hover:bg-[#202830] ${focusRing}`}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FBB501] text-[#0A0E12]">
                  <MessageCircle className="h-6 w-6" />
                </span>

                <span className="flex-1">
                  <span className="block font-extrabold">Prefer WhatsApp?</span>
                  <span className="mt-1 block text-sm text-white/70">
                    Start a conversation with our team.
                  </span>
                </span>

                <ArrowRight className="h-5 w-5 text-[#FBB501]" />
              </a>
            )}
          </aside>
        </div>
      </section>

      {/* Floating WhatsApp button */}
      {whatsappLink && (
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="fixed bottom-5 right-5 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-[#FBB501] text-[#0A0E12] shadow-xl shadow-black/25 transition hover:scale-105 hover:bg-[#FFD052] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A0E12]"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
      )}
    </main>
  );
}