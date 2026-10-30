"use client";

import { FormEvent, ReactNode, useState } from "react";
import {
  Boxes,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock,
  ClipboardList,
  Loader2,
  PhoneCall,
  Truck,
  MapPin,
  MessageSquare,
  Phone,
  User,
  type LucideIcon,
} from "lucide-react";

const timeSlots = [
  "Morning (9 AM - 12 PM)",
  "Afternoon (12 PM - 4 PM)",
  "Evening (4 PM - 7 PM)",
];

/* Shared control styles: same height, radius, border and focus ring everywhere */
const controlBase =
  "w-full rounded-xl border border-hairline bg-app text-sm text-fg outline-none transition " +
  "placeholder:text-muted/70 hover:border-muted/50 " +
  "focus:border-primary focus:ring-2 focus:ring-primary/20 " +
  "disabled:cursor-not-allowed disabled:opacity-60";
const inputClass = `${controlBase} h-11 pl-11 pr-4`;

type FieldProps = {
  id: string;
  label: string;
  icon: LucideIcon;
  optional?: boolean;
  alignTop?: boolean;
  children: ReactNode;
};

/* Label + icon + control. `group` lets the icon react to focus on the control. */
function Field({ id, label, icon: Icon, optional, alignTop, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-fg">
        {label}
        {optional && (
          <span className="ml-1 font-normal text-muted">(optional)</span>
        )}
      </label>
      <div className="group relative">
        <Icon
          size={18}
          aria-hidden="true"
          className={`pointer-events-none absolute left-4 text-muted transition-colors group-focus-within:text-primary ${
            alignTop ? "top-3.5" : "top-1/2 -translate-y-1/2"
          }`}
        />
        {children}
      </div>
    </div>
  );
}

function PickupForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setError("");

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      businessName: String(form.get("businessName") ?? "").trim(),
      pickupLocation: String(form.get("pickupLocation") ?? "").trim(),
      parcels: Math.max(1, Number(form.get("parcels")) || 1),
      pickupTime: String(form.get("pickupTime") ?? ""),
      message: String(form.get("message") ?? "").trim(),
    };

    setLoading(true);
    try {
      // TODO: connect to your backend
      // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pickups`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });
      // if (!res.ok) throw new Error("Could not send your request. Please try again.");
      console.log(payload);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div role="status" className="flex flex-col items-center py-8 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-dark-1">
          <CheckCircle2 size={32} aria-hidden="true" />
        </span>
        <h3 className="mt-5 text-2xl font-extrabold text-fg">Pickup requested</h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
          Our team will call you shortly to confirm the pickup time and location.
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-6 h-11 rounded-xl border border-hairline px-5 text-sm font-semibold text-fg transition hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          Request another pickup
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <fieldset disabled={loading} className="space-y-4 border-0 p-0">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="name" label="Your name" icon={User}>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Full name"
              required
              className={inputClass}
            />
          </Field>

          <Field id="phone" label="Phone number" icon={Phone}>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="98XXXXXXXX"
              pattern="[0-9+\s\-]{7,15}"
              title="Enter a valid phone number"
              required
              className={inputClass}
            />
          </Field>
        </div>

        <Field id="businessName" label="Business or vendor name" icon={Building2} optional>
          <input
            id="businessName"
            name="businessName"
            type="text"
            autoComplete="organization"
            placeholder="Shop or business name"
            className={inputClass}
          />
        </Field>

        <Field id="pickupLocation" label="Pickup location" icon={MapPin}>
          <input
            id="pickupLocation"
            name="pickupLocation"
            type="text"
            autoComplete="street-address"
            placeholder="Area, street, landmark"
            required
            className={inputClass}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="parcels" label="Number of parcels" icon={Boxes}>
            <input
              id="parcels"
              name="parcels"
              type="number"
              inputMode="numeric"
              min={1}
              max={999}
              step={1}
              defaultValue={1}
              required
              className={`${inputClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
            />
          </Field>

          <Field id="pickupTime" label="Preferred pickup time" icon={Clock}>
            <select
              id="pickupTime"
              name="pickupTime"
              required
              defaultValue=""
              className={`${inputClass} cursor-pointer appearance-none pr-10 invalid:text-muted/70`}
            >
              <option value="" disabled>
                Select a time
              </option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot} className="text-fg">
                  {slot}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
            />
          </Field>
        </div>

        <Field id="message" label="Message" icon={MessageSquare} optional alignTop>
          <textarea
            id="message"
            name="message"
            rows={3}
            maxLength={500}
            placeholder="Parcel size, fragile items, gate or floor details"
            className={`${controlBase} resize-none py-3 pl-11 pr-4`}
          />
        </Field>
      </fieldset>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-dark-1 transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
        {loading ? "Sending request..." : "Request a pickup"}
      </button>
    </form>
  );
}

const steps = [
  {
    icon: ClipboardList,
    title: "Send your request",
    text: "Tell us where the parcels are and when suits you.",
  },
  {
    icon: PhoneCall,
    title: "We call to confirm",
    text: "Our team confirms the time and exact location with you.",
  },
  {
    icon: Truck,
    title: "We collect your parcels",
    text: "A rider comes to your shop or door and picks them up.",
  },
];

export default function PickupSection() {
  return (
    <section className="w-full">
      {/* Max 1280px, centered. Small vertical padding so it sits close to navbar and footer */}
      <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 md:py-8 lg:px-8 lg:py-10">
        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left: short intro */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <h1 className="text-3xl font-extrabold leading-tight text-fg sm:text-4xl">
              Request a pickup
            </h1>
            <p className="mt-3 max-w-md text-base leading-7 text-muted">
              Selling online? Fill in the form and we will collect your parcels
              from your shop or home.
            </p>

            <ul className="mt-6 space-y-4">
              {steps.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-fg">{title}</p>
                    <p className="mt-0.5 text-sm leading-6 text-muted">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: form card */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-hairline bg-app p-5 shadow-sm sm:p-7">
              <PickupForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}