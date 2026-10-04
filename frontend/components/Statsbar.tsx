import type { ReactNode } from "react";

type Stat = {
  value: string;
  label: string[];
  icon: ReactNode;
};

const base = {
  width: 44,
  height: 44,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
} as const;

const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const stats: Stat[] = [
  {
    value: "10,000+",
    label: ["Parcels Delivered", "Every Day"],
    icon: (
      <svg {...base} {...line}>
        <path d="M12 2.5 3.5 7v10l8.5 4.5 8.5-4.5V7L12 2.5Z" />
        <path d="M3.5 7 12 11.5 20.5 7M12 11.5v10M7.6 4.7l8.6 4.6v3.3" />
      </svg>
    ),
  },
  {
    value: "50,000+",
    label: ["Happy", "Customers"],
    icon: (
      <svg {...base} fill="currentColor">
        <circle cx="12" cy="6.5" r="3.4" />
        <path d="M5.5 21v-3.2a6.5 6.5 0 0 1 13 0V21z" />
        <circle cx="4.6" cy="9.6" r="2.3" />
        <circle cx="19.4" cy="9.6" r="2.3" />
        <path d="M0.8 18.5v-1.6a4 4 0 0 1 4-4c.7 0 1.3.1 1.9.4a8 8 0 0 0-1.9 5.2zM23.2 18.5v-1.6a4 4 0 0 0-4-4c-.7 0-1.3.1-1.9.4a8 8 0 0 1 1.9 5.2z" />
      </svg>
    ),
  },
  {
    value: "77+",
    label: ["Districts", "Covered"],
    icon: (
      <svg {...base} {...line}>
        <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
        <circle cx="12" cy="10" r="2.6" />
        <path d="M8 20.5c-2 .4-3.2 1-3.2 1.7 0 1 3.1 1.8 7.2 1.8s7.2-.8 7.2-1.8c0-.7-1.2-1.3-3.2-1.7" />
      </svg>
    ),
  },
  {
    value: "20+",
    label: ["Branches", "Across Nepal"],
    icon: (
      <svg {...base} fill="currentColor">
        <path d="M6 22V6.5L12 2l6 4.5V22h-4v-4h-4v4z" />
        <path d="M3 22v-9l3-1.5V22zM21 22v-9l-3-1.5V22z" />
        <g fill="var(--primary)">
          <rect x="8.6" y="7" width="2" height="2" />
          <rect x="13.4" y="7" width="2" height="2" />
          <rect x="8.6" y="11" width="2" height="2" />
          <rect x="13.4" y="11" width="2" height="2" />
        </g>
      </svg>
    ),
  },
  {
    value: "1000+",
    label: ["Business", "Clients"],
    icon: (
      <svg {...base} {...line}>
        <path d="M1.5 10.5 5 7l5 1.2 3-1.7 4.2 1.7L21 7l1.5 3.5" />
        <path d="M1.5 10.5 6 15l1.8 1.5M22.5 10.5 18 15l-3.2 3" />
        <path d="M7.8 16.5 10 18.5a1.5 1.5 0 0 0 2.2-2M10 18.5l1.4 1.3a1.5 1.5 0 0 0 2.2-2M13.6 17.8l.2.2a1.4 1.4 0 0 0 2-2l-4.8-4.3-2.6 2.2" />
      </svg>
    ),
  },
];

export default function StatsBar() {
  return (
    <div className="mx-auto mt-10 max-w-7xl rounded-2xl bg-primary px-4 py-6 text-dark-1 shadow-sm sm:px-6">
      <dl className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-y-0">
        {stats.map((s) => (
          <div
            key={s.value}
            className="flex items-center justify-center gap-4 lg:border-l lg:border-dark-1/30 lg:first:border-l-0"
          >
            {s.icon}
            <div>
              <dd className="text-2xl font-extrabold leading-none">{s.value}</dd>
              <dt className="mt-1 text-xs font-medium leading-tight text-dark-1/80">
                {s.label[0]}
                <br />
                {s.label[1]}
              </dt>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}