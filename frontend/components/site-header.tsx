
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Bike,
  ChevronDown,
  ChevronRight,
  Globe,
  Menu,
  PackageCheck,
  Repeat,
  ShoppingBag,
  Truck,
  User,
  Wallet,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavLink = {
  label: string;
  href: string;
  dropdown?: boolean;
};

const SERVICES: {
  label: string;
  href: string;
  icon: LucideIcon;
}[] = [
  {
    label: "E-commerce Logistics",
    href: "/services/ecommerce-logistics",
    icon: ShoppingBag,
  },
  {
    label: "Domestic Courier",
    href: "/services/domestic-courier",
    icon: Truck,
  },
  {
    label: "COD Support",
    href: "/services/cash-on-delivery",
    icon: Wallet,
  },
  {
    label: "Pickup Service",
    href: "/services/pickup-service",
    icon: PackageCheck,
  },
  {
    label: "Exchange & Return",
    href: "/services/exchange-return",
    icon: Repeat,
  },
  {
    label: "International Courier",
    href: "/services/international-courier",
    icon: Globe,
  },
];

const LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services", dropdown: true },
  { label: "Track Shipment", href: "/track" },
  { label: "Calculator", href: "/calculator" },
  { label: "Blog / News", href: "/blog" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const WHATSAPP_NUMBER = "9779801255799";

const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hello Aarambha Courier, I would like to know more about your courier and logistics services."
);

const WHATSAPP_URL =
  `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
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

export default function SideHeader() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const servicesRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  // Match the homepage exactly and nested routes by their section.
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  // Close menus after navigation.
  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  // Close dropdowns on outside click and Escape.
  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (
        servicesRef.current &&
        !servicesRef.current.contains(event.target as Node)
      ) {
        setServicesOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setServicesOpen(false);
        setMobileServicesOpen(false);

        if (mobileOpen) {
          setMobileOpen(false);
          mobileMenuButtonRef.current?.focus();
        }
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  // Prevent background scrolling while the mobile menu is open.
  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const linkClass = (active: boolean) =>
    `relative inline-flex items-center gap-1.5 whitespace-nowrap py-2 text-[14px] font-medium tracking-[-0.01em] transition-colors duration-200 ${
      active ? "text-primary" : "text-white/90 hover:text-primary"
    }`;

  const underlineClass =
    "absolute -bottom-[17px] left-0 h-[2px] w-full rounded-full bg-primary";

  return (
    <header className="sticky top-0 z-50 border-t border-primary/20 bg-dark-1 text-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-[76px] w-full max-w-[1600px] items-center px-5 sm:px-8 xl:h-[86px] xl:px-10 2xl:px-16"
      >
        {/* Official company logo */}
        <Link
          href="/"
          aria-label="Aarambha Courier home"
          className="flex shrink-0 items-center pr-6 sm:pr-10 xl:pr-12 2xl:pr-16"
        >
          <Image
            src="/images/logo.png"
            alt="Aarambha Courier and Transport Service"
            width={200}
            height={50}
            priority
            className="h-[40px] w-auto object-contain sm:h-[43px] xl:h-[50px]"
          />
        </Link>

        {/* Desktop navigation */}
        <ul className="hidden items-center gap-3 xl:flex 2xl:gap-5">
          {LINKS.map((link) => {
            const active = isActive(link.href);

            if (link.dropdown) {
              return (
                <li key={link.label}>
                  <div
                    ref={servicesRef}
                    className="relative"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <button
                      type="button"
                      aria-haspopup="true"
                      aria-expanded={servicesOpen}
                      onClick={() =>
                        setServicesOpen((value) => !value)
                      }
                      onFocus={() => {}}
                      className={linkClass(active)}
                    >
                      {link.label}

                      <ChevronDown
                        size={14}
                        aria-hidden="true"
                        className={`transition-transform duration-200 ${
                          servicesOpen ? "rotate-180" : ""
                        }`}
                      />

                      {active && (
                        <span
                          aria-hidden="true"
                          className={underlineClass}
                        />
                      )}
                    </button>

                    {servicesOpen && (
                      <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4">
                        <div className="relative w-[330px] overflow-hidden rounded-2xl border border-primary/20 bg-dark-2 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
                          <span
                            aria-hidden="true"
                            className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
                          />

                          <ul className="flex flex-col gap-1 p-2 pt-3">
                            {SERVICES.map((service) => {
                              const Icon = service.icon;
                              const serviceActive = isActive(service.href);

                              return (
                                <li key={service.href}>
                                  <Link
                                    href={service.href}
                                    onClick={() => setServicesOpen(false)}
                                    className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors hover:bg-white/[0.06] ${
                                      serviceActive
                                        ? "bg-white/[0.06] text-primary"
                                        : "text-white/80 hover:text-white"
                                    }`}
                                  >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-dark-1">
                                      <Icon
                                        size={17}
                                        aria-hidden="true"
                                      />
                                    </span>

                                    <span className="flex-1">
                                      {service.label}
                                    </span>

                                    <ChevronRight
                                      size={16}
                                      aria-hidden="true"
                                      className="text-primary opacity-0 transition-opacity group-hover:opacity-100"
                                    />
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>

                          <div className="border-t border-white/10 p-2">
                            <Link
                              href="/services"
                              onClick={() => setServicesOpen(false)}
                              className="block rounded-lg px-3 py-2 text-center text-sm font-semibold text-primary hover:bg-white/[0.05]"
                            >
                              Explore All Services
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              );
            }

            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={linkClass(active)}
                >
                  {link.label}

                  {active && (
                    <span
                      aria-hidden="true"
                      className={underlineClass}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop actions */}
        <div className="ml-auto hidden shrink-0 items-center gap-3 pl-5 xl:flex 2xl:gap-3.5">
          <Link
            href="/vendor/login"
            className="inline-flex h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-white/40 bg-white/[0.03] px-3 text-[13px] font-semibold text-white transition-colors hover:border-primary hover:text-primary 2xl:px-4"
          >
            <User size={17} aria-hidden="true" />
            Vendor Login
          </Link>

          {/* Primary CTA from the client brief */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-4 text-[13px] font-bold text-dark-1 shadow-[0_6px_18px_-4px_rgba(251,181,1,0.35)] transition-colors hover:bg-primary-light 2xl:px-5 2xl:text-sm"
          >
            <WhatsAppIcon className="h-[18px] w-[18px]" />
            Talk to Us
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          ref={mobileMenuButtonRef}
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((value) => !value)}
          className="ml-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/[0.03] transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary xl:hidden"
        >
          {mobileOpen ? (
            <X size={22} aria-hidden="true" />
          ) : (
            <Menu size={22} aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* Mobile and tablet menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="max-h-[calc(100dvh-76px)] overflow-y-auto border-t border-white/10 bg-dark-1 shadow-2xl xl:hidden"
        >
          <ul className="mx-auto flex max-w-[1440px] flex-col px-5 py-2 sm:px-8">
            {LINKS.map((link) => {
              const active = isActive(link.href);

              if (link.dropdown) {
                return (
                  <li
                    key={link.label}
                    className="border-b border-white/5"
                  >
                    <div className="flex items-center">
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex-1 py-4 text-[15px] font-semibold ${
                          active ? "text-primary" : "text-white"
                        }`}
                      >
                        Services
                      </Link>

                      <button
                        type="button"
                        aria-label={
                          mobileServicesOpen
                            ? "Collapse services"
                            : "Expand services"
                        }
                        aria-expanded={mobileServicesOpen}
                        onClick={() =>
                          setMobileServicesOpen((value) => !value)
                        }
                        className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-white/5 hover:text-primary"
                      >
                        <ChevronDown
                          size={18}
                          aria-hidden="true"
                          className={`transition-transform ${
                            mobileServicesOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {mobileServicesOpen && (
                      <ul className="mb-3 flex flex-col gap-1 rounded-xl border border-primary/20 bg-dark-2 p-2">
                        {SERVICES.map((service) => {
                          const Icon = service.icon;
                          const serviceActive = isActive(service.href);

                          return (
                            <li key={service.href}>
                              <Link
                                href={service.href}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-white/[0.06] ${
                                  serviceActive
                                    ? "text-primary"
                                    : "text-white/80 hover:text-primary"
                                }`}
                              >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                  <Icon size={16} aria-hidden="true" />
                                </span>
                                {service.label}
                              </Link>
                            </li>
                          );
                        })}

                        <li>
                          <Link
                            href="/services"
                            className="block rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-white/[0.05]"
                          >
                            Explore All Services
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                );
              }

              return (
                <li
                  key={link.label}
                  className="border-b border-white/5"
                >
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`block py-4 text-[15px] font-semibold transition-colors ${
                      active
                        ? "text-primary"
                        : "text-white hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}

            {/* Mobile actions */}
            <li className="flex flex-col gap-3 pb-5 pt-5">
              <Link
                href="/contact"
                className="inline-flex h-[48px] w-full items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/[0.03] text-sm font-semibold text-white transition-colors hover:border-primary hover:text-primary"
              >
                <Bike size={19} aria-hidden="true" />
                Request a Pickup
              </Link>

              <Link
                href="/vendor/login"
                className="inline-flex h-[48px] w-full items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/[0.03] text-sm font-semibold text-white transition-colors hover:border-primary hover:text-primary"
              >
                <User size={18} aria-hidden="true" />
                Vendor Login
              </Link>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-bold text-dark-1 transition-colors hover:bg-primary-light"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Talk to Us on WhatsApp
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
