
"use client";

import { useAnnouncement } from "@/lib/store";
import { useIsMounted } from "@lacspace/hooks";
import { Clock, Mail, MapPin, Phone, X } from "lucide-react";

const INFO = [
  {
    icon: MapPin,
    text: "Kapanthole, Lalitpur, Nepal",
    href: "https://maps.google.com/?q=Kapanthole,Lalitpur,Nepal",
  },
  {
    icon: Clock,
    text: "Mon - Sat: 9:00 AM - 6:00 PM",
  },
  {
    icon: Phone,
    text: "9801234567 / 9801236780",
    href: "tel:+9779801234567",
  },
  {
    icon: Mail,
    text: "info@aarambhacourier.com",
    href: "mailto:info@aarambhacourier.com",
  },
];

const SOCIALS = [
  { label: "Facebook", icon: FacebookIcon, href: "#" },
  { label: "Instagram", icon: InstagramIcon, href: "#" },
  { label: "LinkedIn", icon: LinkedinIcon, href: "#" },
];

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.5v3h2.6v8h3.4Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M17 7h.01" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M6.94 8.5H4.06V20h2.88V8.5ZM5.5 7.25a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4ZM20 13.6c0-2.9-1.55-4.25-3.77-4.25a3.26 3.26 0 0 0-2.95 1.62V8.5H10.4V20h2.88v-5.7c0-1.5.28-2.96 2.14-2.96 1.83 0 1.86 1.72 1.86 3.06V20H20v-6.4Z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  );
}

export function AnnouncementBar() {
  const dismissed = useAnnouncement((s) => s.dismissed);
  const dismiss = useAnnouncement((s) => s.dismiss);
  const mounted = useIsMounted();

  // Persisted state is client-only — wait for mount to avoid a hydration flash.
  if (!mounted() || dismissed) return null;

  return (
    <div className="relative bg-[#FFB800] px-4 py-2 text-xs font-medium text-black sm:px-6 sm:text-[13px]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 pr-8">
        {/* LEFT — Contact information */}
        <ul className="flex min-w-0 flex-1 flex-wrap items-center justify-start gap-x-6 gap-y-1">
          {INFO.map(({ icon: Icon, text, href }) => (
            <li key={text} className="flex items-center gap-2 whitespace-nowrap">
              <Icon
                className="h-4 w-4 shrink-0"
                aria-hidden="true"
              />

              {href ? (
                <a
                  href={href}
                  className="hover:underline underline-offset-2"
                >
                  {text}
                </a>
              ) : (
                <span>{text}</span>
              )}
            </li>
          ))}
        </ul>

        {/* RIGHT — Social icons */}
        <ul className="flex shrink-0 items-center gap-4">
          {SOCIALS.map(({ label, icon: Icon, href }) => (
            <li key={label}>
              <a
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-90 transition-opacity hover:opacity-100"
              >
                <Icon className="h-4 w-4" />
              </a>
            </li>
          ))}

          <li>
            <a
              href="https://wa.me/9779801234567"
              aria-label="WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-90 transition-opacity hover:opacity-100"
            >
              <WhatsAppIcon className="h-4 w-4" />
            </a>
          </li>
        </ul>
      </div>

      {/* Dismiss */}
      <button
        type="button"
        aria-label="Dismiss"
        onClick={dismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-black/60 transition-colors hover:text-black"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}