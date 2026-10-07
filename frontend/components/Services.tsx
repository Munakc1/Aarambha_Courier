import type { ReactNode } from "react";
import StatsBar from "./Statsbar";

type Service = {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
};

const iconProps = {
  width: 30,
  height: 30,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
} as const;

const services: Service[] = [
  {
    title: "Domestic Courier",
    description:
      "Fast and reliable delivery to cities, towns, and rural areas across Nepal.",
    href: "/services/domestic-courier",
    icon: (
      <svg {...iconProps} fill="currentColor">
        <path d="M12 2 3 6.5v11L12 22l9-4.5v-11L12 2Z" />
        <path
          d="M3 6.5 12 11l9-4.5M12 11v11M7.5 4.3l9 4.5"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },

  {
    title: "Pickup Service",
    description:
      "We pick up parcels from your location and deliver them safely to the destination.",
    href: "/services/pickup-service",
    icon: (
      <svg {...iconProps} fill="currentColor">
        <rect x="8" y="2" width="8" height="9" rx="1.5" />
        <rect
          x="11"
          y="4"
          width="2"
          height="4"
          rx="1"
          fill="var(--primary)"
        />
        <path d="M2 15h4v6H2z" />
        <path d="M7 16.5 11 15h5.5a1.8 1.8 0 0 1 0 3.6H12l4.8-.2 4.2-2.2v1.6L15 21H7z" />
      </svg>
    ),
  },

  {
    title: "Cash on Delivery",
    description:
      "Collect payments from your customers with our secure COD delivery service.",
    href: "/services/cash-on-delivery",
    icon: (
      <span className="text-xl font-extrabold leading-none">
        COD
      </span>
    ),
  },

  {
    title: "Document Delivery",
    description:
      "Secure and timely delivery of important documents and official papers.",
    href: "/services/document-delivery",
    icon: (
      <svg {...iconProps} fill="currentColor">
        <path d="M6 2h8l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
        <path d="M14 2v5h5" fill="var(--primary)" opacity=".55" />
        <path
          d="M8 12h8M8 15.5h8M8 19h5"
          stroke="var(--primary)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },

  {
    title: "International Courier",
    description:
      "Worldwide delivery with customs support and international tracking.",
    href: "/services/international-courier",
    icon: (
      <svg
        {...iconProps}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="9.5" />
        <ellipse cx="12" cy="12" rx="4.2" ry="9.5" />
        <path d="M2.5 12h19M4 7h16M4 17h16M12 2.5v19" />
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="bg-app px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="text-center">
          <p className="text-sm font-semibold tracking-wide text-accent-orange">
            OUR SERVICES
          </p>

          <h2
            id="services-heading"
            className="mt-1 text-3xl font-extrabold text-fg sm:text-4xl"
          >
            Reliable Solutions for Every Delivery Need
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            From everyday parcels and documents to business deliveries and
            international shipments, we provide practical courier solutions
            for individuals and businesses.
          </p>
        </div>

        {/* Service cards */}
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {services.map((service) => (
            <li key={service.title}>
              <article className="card flex h-full flex-col items-center bg-white-soft px-6 py-7 text-center dark:bg-surface">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/40 text-dark-1">
                  {service.icon}
                </div>

                <h3 className="mt-4 text-base font-semibold text-fg">
                  {service.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {service.description}
                </p>

                <a
                  href={service.href}
                  className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-fg transition-colors hover:text-accent-orange"
                >
                  Learn More

                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </article>
            </li>
          ))}
        </ul>

        {/* Stats */}
        <StatsBar />
      </div>
    </section>
  );
}