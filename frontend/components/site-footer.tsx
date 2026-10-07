
"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode, type SVGProps } from "react";
import { Globe, Mail, MapPin, Phone } from "lucide-react";

/* ───────────────────────── data ───────────────────────── */

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/track", label: "Track Shipment" },
  { href: "/calculator", label: "Calculator" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const SERVICES = [
  {
    href: "/services/ecommerce-logistics",
    label: "E-commerce Logistics",
  },
  {
    href: "/services/domestic-courier",
    label: "Domestic Courier",
  },
  {
    href: "/services/cash-on-delivery",
    label: "Cash on Delivery",
  },
  {
    href: "/services/pickup-service",
    label: "Pickup Service",
  },
  {
    href: "/services/exchange-return",
    label: "Exchange & Return",
  },
  {
    href: "/services/international-courier",
    label: "International Courier",
  },
];

const SOCIALS = [
  {
    href: "https://facebook.com/aarambhacourier",
    label: "Facebook",
    Icon: FacebookIcon,
  },
  {
    href: "https://instagram.com/aarambhacourier",
    label: "Instagram",
    Icon: InstagramIcon,
  },
  {
    href: "https://linkedin.com/company/aarambhacourier",
    label: "LinkedIn",
    Icon: LinkedinIcon,
  },
  {
    href: "https://youtube.com/@aarambhacourier",
    label: "YouTube",
    Icon: YoutubeIcon,
  },
];

const PHONES = [
  {
    display: "9801255799",
    tel: "+9779801255799",
  },
  {
    display: "9801255790",
    tel: "+9779801255790",
  },
];

const WHATSAPP_URL = "https://wa.me/9779801255799";

/* ───────────────────────── component ───────────────────────── */

export function SiteFooter() {
  return (
    <footer className="relative bg-[#12191F] text-white">
      {/* Main footer */}
      <div className="mx-auto w-full max-w-7xl px-5 pt-14 sm:px-8 lg:pt-16">
        <div className="grid gap-12 pb-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* ───────────── Brand ───────────── */}
          <div>
            <Link
              href="/"
              aria-label="Aarambha Courier — home"
              className="inline-block"
            >
              <Image
                src="/images/logo.png"
                alt="Aarambha Courier"
                width={200}
                height={50}
                className="h-12 w-auto object-contain"
              />
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-white/75">
              Aarambha Courier and Transport Service Pvt. Ltd. provides
              practical, organised and responsible delivery services for
              businesses and customers across Nepal.
            </p>

            {/* Social links */}
            <ul className="mt-6 flex items-center gap-3">
              {SOCIALS.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/75 transition-all duration-200 hover:border-[#F4C542] hover:text-[#F4C542]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>

            {/* WhatsApp CTA */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#F4C542] px-5 py-2.5 text-sm font-bold text-[#12191F] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ffd75f]"
            >
              <WhatsappIcon className="h-4 w-4" />
              Talk to Us on WhatsApp
            </a>
          </div>

          {/* ───────────── Quick Links ───────────── */}
          <Column title="Quick Links">
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href}>
                    {link.label}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </Column>

          {/* ───────────── Services ───────────── */}
          <Column title="Our Services">
            <ul className="space-y-2.5">
              {SERVICES.map((service) => (
                <li key={service.label}>
                  <FooterLink href={service.href}>
                    {service.label}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </Column>

          {/* ───────────── Contact ───────────── */}
          <Column title="Contact Us">
            <ul className="space-y-4 text-sm text-white/80">
              {/* Address */}
              <li className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-[#F4C542]"
                  aria-hidden="true"
                />

                <span>Kupondole, Lalitpur, Nepal</span>
              </li>

              {/* Phone */}
              <li className="flex items-start gap-3">
                <Phone
                  size={18}
                  className="mt-0.5 shrink-0 text-[#F4C542]"
                  aria-hidden="true"
                />

                <span>
                  {PHONES.map((phone, index) => (
                    <span key={phone.tel}>
                      {index > 0 && " / "}
                      <a
                        href={`tel:${phone.tel}`}
                        className="transition-colors hover:text-[#F4C542]"
                      >
                        {phone.display}
                      </a>
                    </span>
                  ))}
                </span>
              </li>

              {/* Email */}
              <li className="flex items-start gap-3">
                <Mail
                  size={18}
                  className="mt-0.5 shrink-0 text-[#F4C542]"
                  aria-hidden="true"
                />

                <a
                  href="mailto:aarambhatransport@gmail.com"
                  className="break-all transition-colors hover:text-[#F4C542]"
                >
                  aarambhatransport@gmail.com
                </a>
              </li>

              {/* Website */}
              <li className="flex items-start gap-3">
                <Globe
                  size={18}
                  className="mt-0.5 shrink-0 text-[#F4C542]"
                  aria-hidden="true"
                />

                <Link
                  href="/"
                  className="transition-colors hover:text-[#F4C542]"
                >
                  Aarambha Courier
                </Link>
              </li>
            </ul>
          </Column>
        </div>
      </div>

      {/* ───────────── Bottom bar ───────────── */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} Aarambha Courier and Transport
            Service Pvt. Ltd. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            <Link
              href="/terms"
              className="transition-colors hover:text-[#F4C542]"
            >
              Terms &amp; Conditions
            </Link>

            <span
              aria-hidden="true"
              className="h-3 w-px bg-white/20"
            />

            <Link
              href="/privacy"
              className="transition-colors hover:text-[#F4C542]"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      {/* ───────────── Floating WhatsApp ───────────── */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Aarambha Courier on WhatsApp"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_-6px_rgba(0,0,0,0.6)] ring-1 ring-white/10 transition-transform hover:scale-105 focus-visible:scale-105 sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
      >
        <WhatsappIcon className="h-8 w-8 sm:h-9 sm:w-9" />
      </a>
    </footer>
  );
}

/* ───────────────────────── pieces ───────────────────────── */

function Column({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="border-white/10 lg:border-l lg:pl-8">
      <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-[#F4C542]">
        {title}
      </h3>

      {children}
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm leading-5 text-white/75 transition-colors duration-200 hover:text-[#F4C542]"
    >
      {children}
    </Link>
  );
}

/* ───────────────────────── social icons ───────────────────────── */

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
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        ry="5"
      />
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
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"
      />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function WhatsappIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export default SiteFooter;
