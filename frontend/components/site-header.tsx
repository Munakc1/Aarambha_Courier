"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bike, ChevronDown, Menu, User, X } from "lucide-react";

type NavLink = {
  label: string;
  href: string;
  dropdown?: boolean;
};

const SERVICES = [
  {
    label: "E-commerce Logistics",
    href: "/services/ecommerce-logistics",
  },
  {
    label: "Domestic Courier",
    href: "/services/domestic-courier",
  },
  {
    label: "COD Support",
    href: "/services/cod-support",
  },
  {
    label: "Pickup Service",
    href: "/services/pickup-service",
  },
  {
    label: "Exchange & Return",
    href: "/services/exchange-return",
  },
  {
    label: "International Courier",
    href: "/services/international-courier",
  },
];

const LINKS: NavLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Services",
    href: "/services",
    dropdown: true,
  },
  {
    label: "Track Shipment",
    href: "/track",
  },
  {
    label: "Calculator",
    href: "/calculator",
  },
  {
    label: "Branches",
    href: "/branches",
  },
  {
    label: "Blog / News",
    href: "/blog",
  },
  {
    label: "About Us",
    href: "/about",
  },
  {
    label: "Contact Us",
    href: "/contact",
  },
];

export default function SideHeader() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const servicesRef = useRef<HTMLDivElement>(null);

  /* =========================================================
     ACTIVE LINK
  ========================================================= */

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  /* =========================================================
     CLOSE MENUS WHEN ROUTE CHANGES
  ========================================================= */

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  /* =========================================================
     DESKTOP DROPDOWN
     Outside click + Escape
  ========================================================= */

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
        setMobileOpen(false);
        setMobileServicesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /* =========================================================
     PREVENT BACKGROUND SCROLL ON MOBILE
  ========================================================= */

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* =========================================================
     NAVIGATION LINK STYLE
  ========================================================= */

  const linkClass = (active: boolean) =>
    `relative inline-flex items-center gap-1.5 whitespace-nowrap py-2 text-[14px] font-medium tracking-[-0.01em] transition-all duration-200 ${
      active ? "text-primary" : "text-white/90 hover:text-primary"
    }`;

  /* =========================================================
     WHATSAPP CTA
  ========================================================= */

  const whatsappNumber = "9779801255799";

  const whatsappMessage = encodeURIComponent(
    "Hello Aarambha Courier, I would like to know more about your courier and logistics services."
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <header
      className="
        sticky
        top-0
        z-50
        border-t
        border-primary/20
        bg-dark-1
        text-white
        shadow-[0_8px_30px_rgba(0,0,0,0.12)]
      "
    >
      <nav
        aria-label="Main navigation"
        className="
          mx-auto
          flex
          h-[76px]
          w-full
          max-w-[1600px]
          items-center
          px-5
          sm:px-8
          xl:h-[86px]
          xl:px-10
          2xl:px-16
        "
      >
        {/* =====================================================
            LOGO
        ====================================================== */}

        <Link
          href="/"
          aria-label="Aarambha Courier — home"
          className="
            group
            flex
            shrink-0
            items-center
            pr-10
            xl:pr-16
            2xl:pr-20
          "
        >
          <Image
            src="/images/logo.png"
            alt="Aarambha Courier"
            width={200}
            height={50}
            priority
            className="
              h-[43px]
              w-auto
              transition-transform
              duration-300
              group-hover:scale-[1.02]
              xl:h-[50px]
            "
          />
        </Link>

        {/* =====================================================
            DESKTOP NAVIGATION
        ====================================================== */}

        <ul
          className="
            hidden
            items-center
            gap-4
            xl:flex
            2xl:gap-6
          "
        >
          {LINKS.map((link) => {
            const active = isActive(link.href);

            /* =================================================
               SERVICES DROPDOWN
            ================================================= */

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
                      aria-haspopup="menu"
                      aria-expanded={servicesOpen}
                      onClick={() => setServicesOpen((value) => !value)}
                      className={linkClass(active)}
                    >
                      {link.label}

                      <ChevronDown
                        size={14}
                        strokeWidth={2.25}
                        aria-hidden="true"
                        className={`
                          transition-transform
                          duration-200
                          ${servicesOpen ? "rotate-180" : ""}
                        `}
                      />

                      {active && (
                        <span
                          aria-hidden="true"
                          className="
                            absolute
                            -bottom-[17px]
                            left-0
                            h-[2px]
                            w-full
                            rounded-full
                            bg-primary
                            shadow-[0_0_8px_rgba(251,181,1,0.45)]
                          "
                        />
                      )}
                    </button>

                    {/* =================================================
                        DESKTOP SERVICES DROPDOWN
                    ================================================== */}

                    {servicesOpen && (
                      <div className="absolute left-1/2 top-full -translate-x-1/2 pt-4">
                        <ul
                          role="menu"
                          className="
                            w-[285px]
                            overflow-hidden
                            rounded-xl
                            border
                            border-white/10
                            bg-dark-2
                            py-2
                            shadow-[0_20px_50px_rgba(0,0,0,0.35)]
                          "
                        >
                          {SERVICES.map((service) => (
                            <li key={service.href} role="none">
                              <Link
                                role="menuitem"
                                href={service.href}
                                className="
                                  group
                                  flex
                                  items-center
                                  px-5
                                  py-3
                                  text-[14px]
                                  text-white/80
                                  transition-all
                                  duration-200
                                  hover:bg-primary/10
                                  hover:pl-6
                                  hover:text-primary
                                "
                              >
                                <span
                                  className="
                                    mr-3
                                    h-1.5
                                    w-1.5
                                    shrink-0
                                    rounded-full
                                    bg-primary/40
                                    transition-all
                                    group-hover:bg-primary
                                  "
                                />

                                {service.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </li>
              );
            }

            /* =================================================
               NORMAL NAVIGATION LINK
            ================================================== */

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
                      className="
                        absolute
                        -bottom-[17px]
                        left-0
                        h-[2px]
                        w-full
                        rounded-full
                        bg-primary
                        shadow-[0_0_8px_rgba(251,181,1,0.45)]
                      "
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* =====================================================
            DESKTOP ACTIONS
        ====================================================== */}

        <div
          className="
            ml-auto
            hidden
            shrink-0
            items-center
            gap-3
            pl-6
            xl:flex
            2xl:gap-3.5
            2xl:pl-8
          "
        >
          {/* =================================================
              VENDOR LOGIN
          ================================================== */}

          <Link
            href="/vendor/login"
            className="
              group
              inline-flex
              h-[44px]
              items-center
              justify-center
              gap-2
              whitespace-nowrap
              rounded-lg
              border
              border-white/25
              bg-white/[0.03]
              px-4
              text-[13px]
              font-semibold
              text-white
              shadow-sm
              transition-all
              duration-200
              hover:border-primary/60
              hover:bg-primary/10
              hover:text-primary
              2xl:h-[46px]
              2xl:px-5
              2xl:text-[14px]
            "
          >
            <User
              size={17}
              strokeWidth={1.8}
              aria-hidden="true"
              className="
                transition-transform
                duration-200
                group-hover:scale-105
              "
            />

            Vendor Login
          </Link>

          {/* =================================================
              BOOK A PICKUP (primary CTA)
          ================================================== */}

          <Link
            href="/book-pickup"
            className="
              group
              inline-flex
              h-[44px]
              items-center
              justify-center
              gap-2
              whitespace-nowrap
              rounded-lg
              bg-primary
              px-5
              text-[13px]
              font-bold
              text-dark-1
              shadow-[0_6px_18px_-4px_rgba(251,181,1,0.45)]
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-primary-light
              hover:shadow-[0_10px_24px_-4px_rgba(251,181,1,0.6)]
              active:translate-y-0
              active:scale-[0.98]
              2xl:h-[46px]
              2xl:px-6
              2xl:text-[14px]
            "
          >
            <Bike
              size={18}
              strokeWidth={2}
              aria-hidden="true"
              className="
                transition-transform
                duration-200
                group-hover:translate-x-0.5
                group-hover:-rotate-6
              "
            />

            Book a Pickup
          </Link>
        </div>

        {/* =====================================================
            MOBILE / TABLET MENU BUTTON
        ====================================================== */}

        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((value) => !value)}
          className="
            ml-auto
            inline-flex
            h-11
            w-11
            items-center
            justify-center
            rounded-lg
            border
            border-white/20
            bg-white/[0.03]
            transition-all
            duration-200
            hover:border-primary/50
            hover:bg-primary/10
            hover:text-primary
            xl:hidden
          "
        >
          {mobileOpen ? (
            <X size={22} strokeWidth={1.8} />
          ) : (
            <Menu size={22} strokeWidth={1.8} />
          )}
        </button>
      </nav>

      {/* =======================================================
          MOBILE / TABLET MENU
      ======================================================= */}

      {mobileOpen && (
        <div
          id="mobile-menu"
          className="
            max-h-[calc(100dvh-76px)]
            overflow-y-auto
            border-t
            border-white/10
            bg-dark-1
            shadow-2xl
            xl:hidden
          "
        >
          <ul
            className="
              mx-auto
              flex
              max-w-[1440px]
              flex-col
              px-5
              py-2
              sm:px-8
            "
          >
            {LINKS.map((link) => {
              const active = isActive(link.href);

              /* ===============================================
                 MOBILE SERVICES
              =============================================== */

              if (link.dropdown) {
                return (
                  <li key={link.label} className="border-b border-white/5">
                    <button
                      type="button"
                      aria-expanded={mobileServicesOpen}
                      onClick={() =>
                        setMobileServicesOpen((value) => !value)
                      }
                      className={`
                        flex
                        w-full
                        items-center
                        justify-between
                        py-4
                        text-[15px]
                        font-semibold
                        ${active ? "text-primary" : "text-white"}
                      `}
                    >
                      {link.label}

                      <ChevronDown
                        size={17}
                        aria-hidden="true"
                        className={`
                          transition-transform
                          duration-200
                          ${mobileServicesOpen ? "rotate-180" : ""}
                        `}
                      />
                    </button>

                    {mobileServicesOpen && (
                      <ul
                        className="
                          mb-3
                          flex
                          flex-col
                          rounded-lg
                          border-l-2
                          border-primary/40
                          bg-white/[0.02]
                          pl-4
                        "
                      >
                        {SERVICES.map((service) => (
                          <li key={service.href}>
                            <Link
                              href={service.href}
                              className="
                                block
                                py-3
                                text-[14px]
                                text-white/75
                                transition-colors
                                hover:text-primary
                              "
                            >
                              {service.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }

              /* ===============================================
                 NORMAL MOBILE LINK
              =============================================== */

              return (
                <li key={link.label} className="border-b border-white/5">
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`
                      block
                      py-4
                      text-[15px]
                      font-semibold
                      transition-colors
                      ${
                        active
                          ? "text-primary"
                          : "text-white hover:text-primary"
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}

            {/* =================================================
                MOBILE ACTIONS
            ================================================== */}

            <li className="flex flex-col gap-3 pb-6 pt-5">
              {/* Book a Pickup (main action, full width) */}
              <Link
                href="/book-pickup"
                className="
                  inline-flex
                  h-[52px]
                  w-full
                  items-center
                  justify-center
                  gap-2.5
                  rounded-lg
                  bg-primary
                  text-[15px]
                  font-bold
                  text-dark-1
                  shadow-[0_6px_18px_-4px_rgba(251,181,1,0.45)]
                  transition-all
                  hover:bg-primary-light
                  active:scale-[0.98]
                "
              >
                <Bike size={20} strokeWidth={2} aria-hidden="true" />
                Book a Pickup
              </Link>

              {/* Secondary actions */}
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/vendor/login"
                  className="
                    inline-flex
                    h-[48px]
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-white/25
                    bg-white/[0.03]
                    text-[14px]
                    font-semibold
                    transition-all
                    hover:border-primary
                    hover:text-primary
                  "
                >
                  <User size={18} strokeWidth={1.7} aria-hidden="true" />
                  Vendor Login
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Talk to us on WhatsApp"
                  className="
                    inline-flex
                    h-[48px]
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-white/25
                    bg-white/[0.03]
                    text-[14px]
                    font-semibold
                    transition-all
                    hover:border-whatsapp
                    hover:text-whatsapp
                  "
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="shrink-0 text-whatsapp"
                  >
                    <path
                      d="M20.52 3.48A11.82 11.82 0 0 0 12.09 0C5.55 0 .23 5.32.23 11.86c0 2.09.55 4.13 1.59 5.93L.13 24l6.36-1.67a11.86 11.86 0 0 0 5.6 1.42h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.14-3.44-8.41ZM12.1 21.74h-.01a9.84 9.84 0 0 1-5.02-1.37l-.36-.21-3.77.99 1.01-3.67-.23-.38a9.84 9.84 0 0 1-1.5-5.24C2.22 6.42 6.64 2 12.09 2a9.82 9.82 0 0 1 7 2.9 9.82 9.82 0 0 1 2.9 7c0 5.45-4.42 9.84-9.89 9.84Zm5.4-7.37c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.89-.79-1.49-1.76-1.67-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.13 4.54.72.31 1.28.49 1.72.63.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z"
                      fill="currentColor"
                    />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}