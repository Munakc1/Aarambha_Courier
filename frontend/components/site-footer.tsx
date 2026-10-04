"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent, type ReactNode, type SVGProps } from "react";
import { Globe, Mail, MapPin, Phone } from "lucide-react";

/* ───────────────────────── data ───────────────────────── */

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/track", label: "Track Shipment" },
  { href: "/branches", label: "Branches" },
  { href: "/blog", label: "Blog / News" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

const SERVICES = [
  { href: "/services/domestic-courier", label: "Domestic Courier" },
  { href: "/services/pickup-service", label: "Pickup Service" },
  { href: "/services/cash-on-delivery", label: "Cash on Delivery" },
  { href: "/services/document-delivery", label: "Document Delivery" },
  { href: "/services/international-courier", label: "International Courier" },
  { href: "/services/ecommerce-logistics", label: "Ecommerce Logistics" },
];

const SOCIALS = [
  { href: "https://facebook.com/aarambhacourier", label: "Facebook", Icon: FacebookIcon },
  { href: "https://instagram.com/aarambhacourier", label: "Instagram", Icon: InstagramIcon },
  { href: "https://linkedin.com/company/aarambhacourier", label: "LinkedIn", Icon: LinkedinIcon },
  { href: "https://youtube.com/@aarambhacourier", label: "YouTube", Icon: YoutubeIcon },
];

const PHONES = [
  { display: "9801234567", tel: "+9779801234567" },
  { display: "9801236780", tel: "+9779801236780" },
];

const WHATSAPP_URL = "https://wa.me/9779801234567";

/* ───────────────────────── component ───────────────────────── */

export function SiteFooter() {
  return (
    <footer className="relative bg-footer text-white">
      <div className="mx-auto w-full max-w-360 px-5 pt-12 sm:px-8 xl:px-10 2xl:px-18">
        <div className="grid gap-10 pb-10 sm:grid-cols-2 xl:grid-cols-[1.3fr_0.85fr_0.95fr_1.25fr_1fr] xl:gap-x-10 xl:gap-y-0">
          {/* Brand */}
          <div>
            <Link href="/" aria-label="Aarambha Courier — home" className="inline-block">
              <Image
                src="/images/logo.png"
                alt="Aarambha Courier"
                width={200}
                height={50}
                className="h-12 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-72 text-[13px] leading-5 text-white/85">
              Delivering with Speed, Precision &amp; Care. Your trusted delivery partner in
              Nepal and around the world.
            </p>
            <ul className="mt-5 flex items-center gap-3">
              {SOCIALS.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:border-primary hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <Column title="Quick Links">
            <ul className="space-y-2">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <FooterLink href={l.href}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </Column>

          {/* Services */}
          <Column title="Our Services">
            <ul className="space-y-2">
              {SERVICES.map((l) => (
                <li key={l.label}>
                  <FooterLink href={l.href}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </Column>

          {/* Contact */}
          <Column title="Contact Us">
            <ul className="space-y-3.5 text-[13px] text-white/90">
              <li className="flex items-start gap-3">
                <MapPin size={17} className="mt-px shrink-0 text-primary" aria-hidden="true" />
                <span>Kapanthole, Lalitpur, Nepal</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={17} className="mt-px shrink-0 text-primary" aria-hidden="true" />
                <span>
                  {PHONES.map((p, i) => (
                    <span key={p.tel}>
                      {i > 0 && " / "}
                      <a href={`tel:${p.tel}`} className="transition-colors hover:text-primary">
                        {p.display}
                      </a>
                    </span>
                  ))}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={17} className="mt-px shrink-0 text-primary" aria-hidden="true" />
                <a
                  href="mailto:info@aarambhacourier.com"
                  className="break-all transition-colors hover:text-primary"
                >
                  info@aarambhacourier.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Globe size={17} className="mt-px shrink-0 text-primary" aria-hidden="true" />
                <a
                  href="https://www.aarambhacourier.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all transition-colors hover:text-primary"
                >
                  www.aarambhacourier.com
                </a>
              </li>
            </ul>
          </Column>

          {/* Newsletter */}
          <Column title="Newsletter">
            <p className="text-[13px] leading-5 text-white/85">
              Subscribe to get updates and special offers.
            </p>
            <NewsletterForm />
          </Column>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-360 flex-col gap-2 px-5 py-3.5 text-[12px] text-text-grey sm:flex-row sm:items-center sm:justify-between sm:px-8 xl:px-10 2xl:px-18">
          <p>
            © {new Date().getFullYear()} Aarambha Courier and Transport Services Pvt. Ltd. All
            rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <Link href="/terms" className="transition-colors hover:text-primary">
              Terms &amp; Conditions
            </Link>
            <span aria-hidden="true" className="h-3 w-px bg-white/30" />
            <Link href="/privacy" className="transition-colors hover:text-primary">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-[0_8px_24px_-6px_rgba(0,0,0,0.6)] ring-1 ring-white/10 transition-transform hover:scale-105 focus-visible:scale-105 sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
      >
        <WhatsappIcon className="h-8 w-8 sm:h-9 sm:w-9" />
      </a>
    </footer>
  );
}

export default SiteFooter;

/* ───────────────────────── pieces ───────────────────────── */

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="xl:border-l xl:border-white/15 xl:pl-10">
      <h3 className="mb-3.5 text-[13px] font-bold uppercase tracking-wide text-primary">
        {title}
      </h3>
      {children}
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="text-[13px] leading-5 text-white/90 transition-colors hover:text-primary"
    >
      {children}
    </Link>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    try {
      // TODO: connect to your newsletter endpoint, e.g.
      // await fetch("/api/newsletter", { method: "POST", body: JSON.stringify({ email: value }) });
      await new Promise((r) => setTimeout(r, 500));
      setStatus("success");
      setMessage("Thanks for subscribing!");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-3.5">
      <label htmlFor="footer-email" className="sr-only">
        Email address
      </label>
      <input
        id="footer-email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status !== "idle") setStatus("idle");
        }}
        aria-invalid={status === "error"}
        aria-describedby="footer-email-msg"
        className="h-10 w-full rounded-md border border-transparent bg-white px-3.5 text-[13px] text-dark-1 outline-none placeholder:text-text-grey focus-visible:border-primary"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-2.5 h-10 w-full rounded-md bg-primary text-[13px] font-bold text-dark-1 transition-colors hover:bg-primary-light disabled:opacity-70"
      >
        {status === "loading" ? "Subscribing…" : "Subscribe"}
      </button>
      <p
        id="footer-email-msg"
        role="status"
        aria-live="polite"
        className={`mt-2 min-h-4 text-[12px] ${
          status === "error" ? "text-red-400" : "text-primary"
        }`}
      >
        {status === "success" || status === "error" ? message : ""}
      </p>
    </form>
  );
}

/* ───────────────────────── brand icons (inline, no extra deps) ───────────────────────── */

type IconProps = SVGProps<SVGSVGElement>;

const stroke = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function FacebookIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function YoutubeIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function WhatsappIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}