
"use client";

import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  Mail,
  MessageCircle,
  User,
  Phone,
  Building2,
  Truck,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000"
).replace(/\/+$/, "");

const EMAIL =
  "aarambhatransport@gmail.com";

const WHATSAPP =
  "9779801255799";

const inquiryTypes = [
  "General Courier",
  "Vendor Inquiry",
  "Domestic Courier",
  "International Courier",
  "Pickup Request",
  "COD",
  "Exchange/Return",
] as const;

type InquiryType =
  (typeof inquiryTypes)[number];

type Fields = {
  name: string;
  phone: string;
  email: string;
  type: string;
  business: string;
  message: string;
};

const empty: Fields = {
  name: "",
  phone: "",
  email: "",
  type: "",
  business: "",
  message: "",
};

const inputClass =
  "mt-2.5 h-[50px] w-full rounded-xl border border-hairline bg-surface px-4 text-[15px] text-fg outline-none transition-all placeholder:text-faint focus:border-accent focus:bg-app focus:ring-2 focus:ring-accent/10 disabled:cursor-not-allowed disabled:opacity-60";

const textareaClass =
  "mt-2.5 min-h-[125px] w-full resize-y rounded-xl border border-hairline bg-surface px-4 py-3.5 text-[15px] leading-6 text-fg outline-none transition-all placeholder:text-faint focus:border-accent focus:bg-app focus:ring-2 focus:ring-accent/10 disabled:cursor-not-allowed disabled:opacity-60";

export default function ContactForm() {
  const [f, setF] =
    useState<Fields>(empty);

  const [errors, setErrors] =
    useState<
      Partial<
        Record<keyof Fields, string>
      >
    >({});

  const [sent, setSent] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [serverMessage, setServerMessage] =
    useState("");

  // --------------------------------------------------
  // UPDATE FIELD
  // --------------------------------------------------

  const set =
    (key: keyof Fields) =>
    (
      event: ChangeEvent<
        HTMLInputElement |
          HTMLSelectElement |
          HTMLTextAreaElement
      >
    ) => {
      const value =
        event.target.value;

      setF((previous) => ({
        ...previous,
        [key]: value,
      }));

      if (errors[key]) {
        setErrors((previous) => ({
          ...previous,
          [key]: undefined,
        }));
      }

      if (sent) {
        setSent(false);
      }

      if (serverMessage) {
        setServerMessage("");
      }
    };

  // --------------------------------------------------
  // VALIDATION
  // --------------------------------------------------

  function validate() {
    const nextErrors: Partial<
      Record<keyof Fields, string>
    > = {};

    if (!f.name.trim()) {
      nextErrors.name =
        "Please enter your name.";
    }

    if (
      !/^[+\d][\d\s-]{6,}$/.test(
        f.phone.trim()
      )
    ) {
      nextErrors.phone =
        "Please enter a valid phone number.";
    }

    if (
      f.email.trim() &&
      !/^\S+@\S+\.\S+$/.test(
        f.email.trim()
      )
    ) {
      nextErrors.email =
        "Please enter a valid email address.";
    }

    if (!f.type) {
      nextErrors.type =
        "Please choose an inquiry type.";
    }

    if (!f.message.trim()) {
      nextErrors.message =
        "Please tell us what you need help with.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  }

  // --------------------------------------------------
  // SUBMIT TO BACKEND
  // --------------------------------------------------

 async function submitInquiry() {
  const response = await fetch(
    `${API_URL}/api/contact`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: f.name.trim(),
        phone: f.phone.trim(),
        email: f.email.trim() || undefined,
        type: f.type,
        business: f.business.trim() || undefined,
        message: f.message.trim(),
      }),
    }
  );

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(
      data.message || "Unable to submit your inquiry."
    );
  }

  return data;
}

  // --------------------------------------------------
  // EMAIL
  // --------------------------------------------------

  function buildText() {
    const lines = [
      `Inquiry type: ${f.type}`,
      `Name: ${f.name}`,
      `Phone: ${f.phone}`,
    ];

    if (f.email.trim()) {
      lines.push(
        `Email: ${f.email}`
      );
    }

    if (f.business.trim()) {
      lines.push(
        `Business/vendor: ${f.business}`
      );
    }

    lines.push(
      "",
      "Message:",
      f.message
    );

    return lines.join("\n");
  }

  async function sendEmail(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    setSent(false);
    setServerMessage("");

    try {
      await submitInquiry();

      const subject =
        encodeURIComponent(
          `${f.type} - ${f.name}`
        );

      const body =
        encodeURIComponent(
          buildText()
        );

      window.location.href =
        `mailto:${EMAIL}?subject=${subject}&body=${body}`;

      setSent(true);

      setServerMessage(
        "Your inquiry has been saved successfully."
      );
    } catch (error) {
      console.error(
        "Contact form error:",
        error
      );

      if (
        error instanceof TypeError
      ) {
        setServerMessage(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      } else {
        setServerMessage(
          error instanceof Error
            ? error.message
            : "Unable to submit your inquiry."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // WHATSAPP
  // --------------------------------------------------

  async function sendWhatsApp() {
    if (!validate()) {
      return;
    }

    setLoading(true);
    setSent(false);
    setServerMessage("");

    try {
      await submitInquiry();

      const url =
        `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
          buildText()
        )}`;

      window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );

      setSent(true);

      setServerMessage(
        "Your inquiry has been saved successfully."
      );
    } catch (error) {
      console.error(
        "WhatsApp contact error:",
        error
      );

      if (
        error instanceof TypeError
      ) {
        setServerMessage(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      } else {
        setServerMessage(
          error instanceof Error
            ? error.message
            : "Unable to submit your inquiry."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // ERROR MESSAGE
  // --------------------------------------------------

  const errorMessage = (
    key: keyof Fields
  ) => {
    if (!errors[key]) {
      return null;
    }

    return (
      <p
        id={`${key}-error`}
        role="alert"
        className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400"
      >
        {errors[key]}
      </p>
    );
  };

  // --------------------------------------------------
  // ARIA
  // --------------------------------------------------

  const ariaProps = (
    key: keyof Fields
  ) => ({
    "aria-invalid": errors[key]
      ? true
      : undefined,

    "aria-describedby":
      errors[key]
        ? `${key}-error`
        : undefined,
  });

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="mx-auto w-full max-w-[720px] pt-28 pb-16 sm:pt-32 sm:pb-24">

      <div className="rounded-3xl border border-hairline bg-panel p-5 shadow-[var(--shadow-lg)] sm:p-7 lg:p-8">

        {/* Header */}

        <div className="mb-7">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Truck className="h-5 w-5" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">
            Tell us how we can help
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted sm:text-[15px]">
            Share a few details about your
            delivery needs. Our team will
            get back to you with the right
            option.
          </p>
        </div>

        {/* Form */}

        <form
          onSubmit={sendEmail}
          noValidate
          className="space-y-5"
        >

          {/* Name + Phone */}

          <div className="grid gap-5 sm:grid-cols-2">

            <div>
              <label
                htmlFor="name"
                className="flex items-center gap-2 text-sm font-semibold text-fg"
              >
                <User className="h-4 w-4 text-muted" />
                Your name
              </label>

              <input
                id="name"
                name="name"
                autoComplete="name"
                value={f.name}
                onChange={set("name")}
                placeholder="Full name"
                disabled={loading}
                className={inputClass}
                {...ariaProps("name")}
              />

              {errorMessage("name")}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="flex items-center gap-2 text-sm font-semibold text-fg"
              >
                <Phone className="h-4 w-4 text-muted" />
                Phone number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={f.phone}
                onChange={set("phone")}
                placeholder="98XXXXXXXX"
                disabled={loading}
                className={inputClass}
                {...ariaProps("phone")}
              />

              {errorMessage("phone")}
            </div>
          </div>

          {/* Email + Inquiry */}

          <div className="grid gap-5 sm:grid-cols-2">

            <div>
              <label
                htmlFor="email"
                className="flex items-center gap-2 text-sm font-semibold text-fg"
              >
                <Mail className="h-4 w-4 text-muted" />
                Email
                <span className="font-normal text-faint">
                  Optional
                </span>
              </label>

              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={f.email}
                onChange={set("email")}
                placeholder="you@example.com"
                disabled={loading}
                className={inputClass}
                {...ariaProps("email")}
              />

              {errorMessage("email")}
            </div>

            <div>
              <label
                htmlFor="type"
                className="text-sm font-semibold text-fg"
              >
                What do you need?
              </label>

              <select
                id="type"
                name="type"
                value={f.type}
                onChange={set("type")}
                disabled={loading}
                className={`${inputClass} cursor-pointer`}
                {...ariaProps("type")}
              >
                <option value="">
                  Select an inquiry
                </option>

                {inquiryTypes.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  )
                )}
              </select>

              {errorMessage("type")}
            </div>
          </div>

          {/* Business */}

          <div>
            <label
              htmlFor="business"
              className="flex items-center gap-2 text-sm font-semibold text-fg"
            >
              <Building2 className="h-4 w-4 text-muted" />

              Business / vendor name

              <span className="font-normal text-faint">
                Optional
              </span>
            </label>

            <input
              id="business"
              name="business"
              autoComplete="organization"
              value={f.business}
              onChange={set("business")}
              placeholder="Shop, company or business name"
              disabled={loading}
              className={inputClass}
            />
          </div>

          {/* Message */}

          <div>
            <label
              htmlFor="message"
              className="text-sm font-semibold text-fg"
            >
              Tell us about your delivery
            </label>

            <textarea
              id="message"
              name="message"
              rows={5}
              value={f.message}
              onChange={set("message")}
              placeholder="For example: where should we pick up, where is it going, how many parcels do you have, and when do you need pickup?"
              disabled={loading}
              className={textareaClass}
              {...ariaProps("message")}
            />

            {errorMessage("message")}
          </div>

          {/* Actions */}

          <div className="border-t border-hairline pt-5">

            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
              Choose how you'd like to
              contact us
            </p>

            <div className="grid gap-3 sm:grid-cols-2">

              {/* Email */}

              <button
                type="submit"
                disabled={loading}
                className="bg-brand group inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-xl px-5 font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Mail className="h-[18px] w-[18px]" />

                {loading
                  ? "Submitting..."
                  : "Send by email"}
              </button>

              {/* WhatsApp */}

              <button
                type="button"
                onClick={sendWhatsApp}
                disabled={loading}
                className="group inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-xl border border-hairline bg-surface px-5 font-semibold text-fg transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary/5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <MessageCircle className="h-[18px] w-[18px] text-whatsapp" />

                {loading
                  ? "Submitting..."
                  : "Send on WhatsApp"}
              </button>
            </div>
          </div>

          {/* Status */}

          <div
            className={`rounded-xl px-4 py-3 text-sm leading-5 ${
              sent
                ? "bg-primary/10 text-fg"
                : "bg-surface text-muted"
            }`}
            role="status"
            aria-live="polite"
          >
            {serverMessage ? (
              <span>
                {serverMessage}
              </span>
            ) : (
              <span>
                We'll use your details
                only to respond to this
                inquiry.
              </span>
            )}
          </div>
        </form>
      </div>

      <p className="mt-4 text-center text-xs text-muted">
        Prefer a quick conversation?
        You can contact Aarambha
        directly on WhatsApp.
      </p>
    </div>
  );
}
