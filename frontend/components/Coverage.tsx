const features = [
  "Doorstep Pickup Available",
  "Nationwide Delivery Network",
  "Real-Time Tracking & Updates",
  "Secure COD Management",
  "Business Logistics Support",
];

// Pin tip positions inside the 640 x 250 map viewBox
const pins: [number, number][] = [
  [130, 62],
  [75, 108],
  [167, 126],
  [247, 88],
  [247, 168],
  [328, 118],
  [410, 136],
  [361, 180],
  [484, 168],
  [554, 198],
];

// Small grey district markers
const dots: [number, number][] = [
  [175, 70],
  [215, 112],
  [270, 128],
  [440, 160],
];

// Simplified Nepal outline (NW → SE)
const NEPAL =
  "M8 95 L40 60 L90 30 L130 8 L180 22 L230 45 L290 50 L340 72 L400 90 L450 100 L510 128 L560 150 L615 165 L632 185 L618 215 L580 222 L520 208 L460 196 L400 185 L340 172 L280 160 L220 150 L160 138 L100 128 L50 118 L8 108 Z";

// Faint internal region borders
const REGIONS =
  "M90 30 L110 120 M180 22 L200 145 M230 45 L260 158 M290 50 L320 170 M340 72 L370 178 M400 90 L430 190 M450 100 L480 198 M510 128 L530 210 M560 150 L575 218 M50 60 L220 100 L400 120 L560 170";

function Pin({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-7" y="3" width="14" height="2.5" rx="1.25" fill="#FAC53A" />
      <path
        d="M0 0 C-4 -8 -14 -14 -14 -24 a14 14 0 0 1 28 0 c0 10 -10 16 -14 24 Z"
        fill="#FBB501"
      />
      <circle cx="0" cy="-24" r="5" fill="none" stroke="#0A0E12" strokeWidth="3.5" />
    </g>
  );
}

function Check() {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary">
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m5 12.5 4.5 4.5L19 7.5" />
      </svg>
    </span>
  );
}

export default function Coverage() {
  return (
    <section
      id="coverage"
      aria-labelledby="coverage-heading"
      className="bg-app px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[340px_1fr_300px] lg:gap-8">
        {/* Left: copy */}
        <div>
          <p className="text-sm font-semibold tracking-wide text-primary">
            NATIONWIDE COVERAGE
          </p>
          <h2
            id="coverage-heading"
            className="mt-2 text-3xl font-extrabold leading-tight text-fg sm:text-4xl"
          >
            Delivering Across Every Corner of Nepal
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            With a strong network of branches and delivery partners, we ensure
            your parcels reach safely anywhere you need.
          </p>
          <a
            href="/branches"
            className="mt-6 inline-flex items-center gap-3 rounded-lg border border-primary bg-white-soft px-5 py-3 text-sm font-semibold text-dark-1 transition-colors hover:bg-primary dark:bg-transparent dark:text-fg dark:hover:text-dark-1"
          >
            View Our Branches
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>

        {/* Middle: map */}
        <div>
          <svg
            viewBox="0 0 640 250"
            className="h-auto w-full drop-shadow-xl"
            role="img"
            aria-label="Map of Nepal showing delivery branch locations"
          >
            <path
              d={NEPAL}
              strokeLinejoin="round"
              strokeWidth="2"
              className="fill-cream stroke-primary/25 dark:fill-dark-2"
            />
            <path
              d={REGIONS}
              fill="none"
              strokeWidth="1"
              className="stroke-primary/20"
            />
            {dots.map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="3" className="fill-text-grey" />
            ))}
            {pins.map(([x, y]) => (
              <Pin key={`${x}-${y}`} x={x} y={y} />
            ))}
          </svg>
        </div>

        {/* Right: checklist */}
        <ul className="space-y-4 border-primary/30 lg:border-l lg:pl-10">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-3 text-sm font-medium text-fg">
              <Check />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}