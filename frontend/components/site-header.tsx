
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
    label: "Domestic Courier",
    href: "/services/domestic-courier",
  },
  {
    label: "Pickup Service",
    href: "/services/pickup-service",
  },
  {
    label: "Cash on Delivery",
    href: "/services/cash-on-delivery",
  },
  {
    label: "Document Delivery",
    href: "/services/document-delivery",
  },
  {
    label: "International Courier",
    href: "/services/international-courier",
  },
];

const LINKS: NavLink[] = [
  { label: "Home", href: "/" },
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
            pr-14
            xl:pr-24
            2xl:pr-32
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
            gap-5
            xl:flex
            2xl:gap-7
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
                      onClick={() =>
                        setServicesOpen((value) => !value)
                      }
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
                            shadow-[0_0_8px_rgba(1,196,90,0.45)]
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
                            w-[270px]
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
                            <li
                              key={service.href}
                              role="none"
                            >
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
                        shadow-[0_0_8px_rgba(1,196,90,0.45)]
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
            pl-8
            xl:flex
            2xl:gap-3.5
            2xl:pl-12
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
              BOOK PICKUP
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
              shadow-[0_8px_22px_rgba(1,196,90,0.20)]
              transition-all
              duration-200
              hover:-translate-y-[1px]
              hover:bg-primary-light
              hover:shadow-[0_10px_28px_rgba(1,196,90,0.28)]
              2xl:h-[46px]
              2xl:px-5.5
              2xl:text-[14px]
            "
          >
            <Bike
              size={19}
              strokeWidth={1.8}
              aria-hidden="true"
              className="
                transition-transform
                duration-200
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
                  <li
                    key={link.label}
                    className="border-b border-white/5"
                  >
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
                        ${
                          active
                            ? "text-primary"
                            : "text-white"
                        }
                      `}
                    >
                      {link.label}

                      <ChevronDown
                        size={17}
                        aria-hidden="true"
                        className={`
                          transition-transform
                          duration-200
                          ${
                            mobileServicesOpen
                              ? "rotate-180"
                              : ""
                          }
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
                <li
                  key={link.label}
                  className="border-b border-white/5"
                >
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

            <li
              className="
                flex
                flex-col
                gap-3
                pb-5
                pt-5
                sm:flex-row
              "
            >
              {/* Vendor Login */}

              <Link
                href="/vendor/login"
                className="
                  inline-flex
                  h-[48px]
                  flex-1
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
                <User
                  size={18}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />

                Vendor Login
              </Link>

              {/* Book Pickup */}

              <Link
                href="/book-pickup"
                className="
                  inline-flex
                  h-[48px]
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-primary
                  text-[14px]
                  font-bold
                  text-dark-1
                  shadow-[0_8px_20px_rgba(1,196,90,0.18)]
                  transition-all
                  hover:bg-primary-light
                "
              >
                <Bike
                  size={20}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />

                Book a Pickup
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

