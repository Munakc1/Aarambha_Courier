
import Link from "next/link";

const stats = [
  { label: "Total Shipments", value: "1,245" },
  { label: "In Transit", value: "842" },
  { label: "Delivered", value: "986" },
  { label: "COD Collected", value: "Rs. 2,45,600" },
];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const line =
  "0,92 14,80 26,84 38,66 50,70 62,50 74,58 86,38 98,52 110,30 122,46 134,24 146,40 158,22 170,34 182,14 194,26 206,6";

const recent = [
  { id: "AAR10098789", route: "Kathmandu → Pokhara" },
  { id: "Birtamod → Chitwan", route: "Delivered" },
  { id: "Bhaktapur → Kathmandu", route: "In Transit" },
  { id: "Nepalgunj → Bara", route: "Pending" },
];

function Logo({ small = false }: { small?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <svg
        width={small ? 14 : 18}
        height={small ? 14 : 18}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path
          d="M12 2 3 22h5l4-9 4 9h5L12 2Z"
          fill="var(--primary)"
        />
        <circle
          cx="12"
          cy="17"
          r="2"
          fill="var(--dark-1)"
        />
      </svg>

      <div className="leading-none">
        <div className="text-[9px] font-extrabold tracking-tight text-dark-1">
          AARAMBHA
        </div>
        <div className="text-[6px] font-semibold tracking-widest text-dark-1/70">
          COURIER
        </div>
      </div>
    </div>
  );
}

function Laptop() {
  const nav = [
    "Dashboard",
    "Shipments",
    "Orders",
    "COD",
    "Reports",
    "Branches",
    "Users",
    "Settings",
  ];

  return (
    <div className="relative w-full">
      {/* Screen */}
      <div className="overflow-hidden rounded-t-2xl border-[6px] border-[#2a3038] bg-white-soft shadow-lg">
        <div className="flex h-[250px] text-dark-1">
          {/* Sidebar */}
          <aside className="w-[110px] shrink-0 border-r border-black/5 p-3">
            <Logo small />

            <ul className="mt-4 space-y-1">
              {nav.map((n, i) => (
                <li
                  key={n}
                  className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[8px] font-medium ${
                    i === 0
                      ? "bg-primary/20 text-dark-1"
                      : "text-text-grey"
                  }`}
                >
                  <span className="h-2 w-2 rounded-sm border border-current" />
                  {n}
                </li>
              ))}
            </ul>
          </aside>

          {/* Main */}
          <div className="flex-1 bg-grey-light p-3">
            <div className="grid grid-cols-4 gap-2">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg bg-white-soft p-2 shadow-sm"
                >
                  <div className="text-[7px] text-text-grey">
                    {s.label}
                  </div>

                  <div className="mt-0.5 text-[11px] font-bold">
                    {s.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-2 rounded-lg bg-white-soft p-3 shadow-sm">
              <div className="flex justify-between text-[8px] font-bold">
                <span>Shipment Overview</span>
                <span className="font-normal text-text-grey">
                  This Year
                </span>
              </div>

              <svg
                viewBox="0 0 206 100"
                className="mt-2 h-[110px] w-full"
                preserveAspectRatio="none"
                aria-hidden
              >
                {[20, 40, 60, 80].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    x2="206"
                    y1={y}
                    y2={y}
                    stroke="#00000010"
                    strokeWidth="0.5"
                  />
                ))}

                <polygon
                  points={`0,100 ${line} 206,100`}
                  fill="var(--primary)"
                  opacity="0.12"
                />

                <polyline
                  points={line}
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="flex justify-between text-[6px] text-text-grey">
                {months.map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Laptop Base */}
      <div className="mx-[-4%] h-3 rounded-b-3xl bg-gradient-to-b from-[#c9ccd1] to-[#7d828a]" />
    </div>
  );
}

function Phone() {
  return (
    <div className="absolute -right-2 -top-3 w-[150px] rounded-[26px] border-[5px] border-[#1d232b] bg-white-soft p-3 text-dark-1 shadow-lg">
      <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-black/20" />

      <div className="flex items-center gap-1.5 text-[9px] font-bold">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            d="M12 2 3 22h5l4-9 4 9h5L12 2Z"
            fill="var(--primary)"
          />
        </svg>

        Dashboard
      </div>

      <div className="mt-2 text-[8px] font-bold">
        Overview
      </div>

      <div className="mt-1 space-y-1">
        {[
          ["Total Shipments", "1,245"],
          ["In Transit", "842"],
        ].map(([l, v]) => (
          <div
            key={l}
            className="flex items-center gap-2 rounded-md bg-grey-light p-1.5"
          >
            <span className="h-4 w-4 rounded bg-dark-1" />

            <div>
              <div className="text-[6px] text-text-grey">
                {l}
              </div>

              <div className="text-[9px] font-bold">
                {v}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 flex justify-between text-[8px] font-bold">
        Recent Shipments
        <span className="font-normal text-text-grey">
          All
        </span>
      </div>

      <ul className="mt-1 space-y-1">
        {recent.map((r) => (
          <li
            key={r.id}
            className="flex items-center gap-1.5"
          >
            <span className="h-5 w-5 rounded bg-primary/70" />

            <div className="min-w-0">
              <div className="truncate text-[6px] font-semibold">
                {r.id}
              </div>

              <div className="truncate text-[5px] text-text-grey">
                {r.route}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function VendorBanner() {
  return (
    <section
      aria-labelledby="vendor-banner-title"
      className="
        relative
        mx-auto
        w-full
        max-w-[1280px]
        overflow-hidden
        rounded-3xl
        bg-dark-1
        text-white
      "
    >
      {/* =====================================================
          BACKGROUND DOT PATTERN
      ====================================================== */}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(rgb(255 255 255 / 0.25) 1.2px, transparent 1.2px)",
          backgroundSize: "9px 9px",
          WebkitMaskImage:
            "radial-gradient(ellipse 50% 60% at 62% 45%, #000 30%, transparent 75%)",
          maskImage:
            "radial-gradient(ellipse 50% 60% at 62% 45%, #000 30%, transparent 75%)",
        }}
      />

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div
        className="
          relative
          grid
          items-center
          gap-8
          px-6
          py-9
          sm:px-8
          lg:grid-cols-[0.95fr_1.05fr]
          lg:px-10
          lg:py-10
        "
      >
        {/* ===================================================
            LEFT CONTENT
        ==================================================== */}

        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            Vendor Portal &amp; Logistics Management
          </p>

          <h2
            id="vendor-banner-title"
            className="
              mt-3
              text-3xl
              font-extrabold
              leading-[1.08]
              tracking-tight
              sm:text-4xl
            "
          >
            Manage Your Shipments in One Dashboard
          </h2>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
            Register as a vendor and manage shipments, COD tracking,
            reports and more with our advanced logistics system.
          </p>

          {/* Buttons */}

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/vendor/register"
              className="
                inline-flex
                items-center
                gap-2
                rounded-lg
                bg-primary
                px-5
                py-3
                text-sm
                font-semibold
                text-dark-1
                transition
                hover:bg-primary-light
              "
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <circle cx="9" cy="8" r="4" />
                <path d="M2 21v-1a6 6 0 0 1 6-6h2" />
                <path d="M18 14v6M15 17h6" />
              </svg>

              Register as Vendor
            </Link>

            <Link
              href="/vendor/login"
              className="
                inline-flex
                items-center
                gap-2
                rounded-lg
                border
                border-white/40
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:border-primary
                hover:text-primary
              "
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
                <path d="M3 12h11M10 8l4 4-4 4" />
              </svg>

              Vendor Login
            </Link>
          </div>
        </div>

        {/* ===================================================
            DASHBOARD MOCKUP
        ==================================================== */}

        <div className="relative mx-auto w-full max-w-[540px] pr-8 lg:mr-0">
          <Laptop />
          <Phone />
        </div>
      </div>
    </section>
  );
}
