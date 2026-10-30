
"use client";

import { useAnnouncement } from "@/lib/store";
import { useIsMounted } from "@lacspace/hooks";
import { Clock, Mail, MapPin, Phone, X } from "lucide-react";

const INFO = [
  {
    icon: MapPin,
    text: "Kupondole, Lalitpur, Nepal",
    href: "https://maps.google.com/?q=Kupondole,Lalitpur,Nepal",
  },
  {
    icon: Clock,
    text: "Mon - Sat: 9:00 AM - 6:00 PM",
  },
  {
    icon: Phone,
    text: "9801255799 / 9801255790",
    href: "tel:+9779801255799",
  },
  {
    icon: Mail,
    text: "aarambhatransport@gmail.com",
    href: "mailto:aarambhatransport@gmail.com",
  },
];

const WHATSAPP_NUMBER = "9779801255799";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20l1.2-5.4A8.4 8.4 0 1 1 21 11.5Z" />
      <path d="M9 9a.5.5 0 0 0-.8.4c0 2.2 2.2 4.4 4.4 4.4a.5.5 0 0 0 .4-.8l-.8-1a.5.5 0 0 0-.6-.1l-.7.4a5.4 5.4 0 0 1-1.2-1.2l.4-.7a.5.5 0 0 0-.1-.6L9 9Z" />
    </svg>
  );
}

export function AnnouncementBar() {
  const dismissed = useAnnouncement((s) => s.dismissed);
  const dismiss = useAnnouncement((s) => s.dismiss);
  const mounted = useIsMounted();

  // Wait for client mounting to avoid hydration mismatches.
  if (!mounted() || dismissed) return null;

  return (
    <div className="relative bg-[#FBB501] px-4 py-2 text-xs font-medium text-[#0A0E12] sm:px-6 sm:text-[13px]">
      <div className="mx-auto flex max-w-7xl items-center gap-4 pr-6">
        <ul className="flex min-w-0 flex-1 flex-wrap items-center justify-start gap-x-5 gap-y-2">
          {INFO.map(({ icon: Icon, text, href }) => (
            <li
              key={text}
              className="flex min-w-0 items-center gap-2"
            >
              <Icon
                className="h-4 w-4 shrink-0"
                aria-hidden="true"
              />

              {href ? (
                <a
                  href={href}
                  className="break-words underline-offset-2 hover:underline"
                  target={href.startsWith("https://") ? "_blank" : undefined}
                  rel={href.startsWith("https://") ? "noopener noreferrer" : undefined}
                >
                  {text}
                </a>
              ) : (
                <span>{text}</span>
              )}
            </li>
          ))}
        </ul>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
            "Hello Aarambha Courier, I would like to know more about your courier services."
          )}`}
          aria-label="Contact Aarambha Courier on WhatsApp"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden shrink-0 items-center gap-2 font-semibold hover:underline sm:flex"
        >
          <WhatsAppIcon className="h-4 w-4" />
          WhatsApp
        </a>
      </div>

      <button
        type="button"
        aria-label="Dismiss announcement bar"
        onClick={dismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-black/70 transition-colors hover:bg-black/10 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
