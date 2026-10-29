
"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Calculator,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Download,
  LifeBuoy,
  MapPin,
  Package,
  Plus,
  Search,
  Truck,
  Wallet,
} from "lucide-react";

/* ----------------------------- Types ----------------------------- */

type Shipment = {
  _id?: string;
  id?: string;
  trackingNumber?: string;
  trackingId?: string;
  shipmentId?: string;
  status?: string;
  recipientName?: string;
  receiverName?: string;
  customerName?: string;
  recipientPhone?: string;
  receiverPhone?: string;
  destination?: string;
  deliveryAddress?: string;
  receiverAddress?: string;
  city?: string;
  codAmount?: number;
  totalAmount?: number;
  amount?: number;
  createdAt?: string;
};

/* ----------------------------- Config ----------------------------- */

const PAGE_SIZE = 8;

const GROUPS = {
  PENDING: {
    label: "Awaiting pickup",
    statuses: ["PENDING", "PENDING_PICKUP"],
    color: "#9C927D",
  },
  IN_TRANSIT: {
    label: "In transit",
    statuses: ["PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY"],
    color: "#FBB501",
  },
  DELIVERED: {
    label: "Delivered",
    statuses: ["DELIVERED"],
    color: "#3F9A5B",
  },
  ISSUES: {
    label: "Cancelled / returned",
    statuses: ["CANCELLED", "RETURNED", "FAILED"],
    color: "#D1523A",
  },
} as const;

type GroupKey = keyof typeof GROUPS;
const GROUP_KEYS = Object.keys(GROUPS) as GroupKey[];

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A0E12]";

/* ----------------------------- Helpers ----------------------------- */

const getTrackingNumber = (s: Shipment) =>
  s.trackingNumber || s.trackingId || s.shipmentId || s._id || s.id || "—";

const getRecipient = (s: Shipment) =>
  s.recipientName || s.receiverName || s.customerName || "Customer";

const getPhone = (s: Shipment) => s.recipientPhone || s.receiverPhone || "";

const getDestination = (s: Shipment) =>
  s.destination ||
  s.deliveryAddress ||
  s.receiverAddress ||
  s.city ||
  "Address not provided";

const getAmount = (s: Shipment) => {
  const n = Number(s.codAmount ?? s.totalAmount ?? s.amount ?? 0);
  return Number.isFinite(n) ? n : 0;
};

const normalizeStatus = (status?: string) =>
  (status || "PENDING").toUpperCase().replace(/[\s-]+/g, "_");

const formatStatus = (status?: string) =>
  normalizeStatus(status)
    .split("_")
    .map((p) => p.charAt(0) + p.slice(1).toLowerCase())
    .join(" ");

const groupOf = (status?: string): GroupKey => {
  const n = normalizeStatus(status);
  const found = GROUP_KEYS.find((k) =>
    (GROUPS[k].statuses as readonly string[]).includes(n),
  );
  return found ?? "PENDING";
};

function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

const formatNPR = (v: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(v);

/* ----------------------------- Page ----------------------------- */

export default function VendorDashboardPage() {
  // Frontend-only dashboard. No backend API calls.
  const [shipments] = useState<Shipment[]>([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"ALL" | GroupKey>("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [copied, setCopied] = useState("");
  const [page, setPage] = useState(1);
  const [today, setToday] = useState("");

  // Set on the client only to prevent server/browser date mismatches.
  useEffect(() => {
    setToday(
      new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()),
    );
  }, []);

  const stats = useMemo(() => {
    const counts: Record<GroupKey, number> = {
      PENDING: 0,
      IN_TRANSIT: 0,
      DELIVERED: 0,
      ISSUES: 0,
    };

    let cod = 0;

    for (const s of shipments) {
      const g = groupOf(s.status);
      counts[g] += 1;

      if (g !== "ISSUES") {
        cod += getAmount(s);
      }
    }

    return {
      total: shipments.length,
      counts,
      cod,
    };
  }, [shipments]);

  /** Parcels created per day for the last 7 days. */
  const week = useMemo(() => {
    const days: { key: string; label: string; count: number }[] = [];
    const base = new Date();
    base.setHours(0, 0, 0, 0);

    for (let i = 6; i >= 0; i--) {
      const d = new Date(base);
      d.setDate(base.getDate() - i);

      days.push({
        key: d.toDateString(),
        label: new Intl.DateTimeFormat("en-GB", {
          weekday: "short",
        }).format(d),
        count: 0,
      });
    }

    for (const s of shipments) {
      if (!s.createdAt) continue;

      const c = new Date(s.createdAt);
      if (Number.isNaN(c.getTime())) continue;

      const slot = days.find((d) => d.key === c.toDateString());
      if (slot) slot.count += 1;
    }

    const total = days.reduce((n, d) => n + d.count, 0);
    const max = Math.max(1, ...days.map((d) => d.count));

    return { days, total, max };
  }, [shipments]);

  /** Latest cancelled / returned / failed parcels. */
  const attention = useMemo(
    () =>
      shipments
        .filter((s) => groupOf(s.status) === "ISSUES")
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime(),
        )
        .slice(0, 4),
    [shipments],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const now = new Date();
    const day = 24 * 60 * 60 * 1000;

    return shipments.filter((s) => {
      if (tab !== "ALL" && groupOf(s.status) !== tab) {
        return false;
      }

      if (dateFilter !== "ALL") {
        if (!s.createdAt) return false;

        const created = new Date(s.createdAt);
        if (Number.isNaN(created.getTime())) return false;

        const age = now.getTime() - created.getTime();

        if (
          dateFilter === "TODAY" &&
          created.toDateString() !== now.toDateString()
        ) {
          return false;
        }

        if (dateFilter === "7_DAYS" && (age < 0 || age > 7 * day)) {
          return false;
        }

        if (dateFilter === "30_DAYS" && (age < 0 || age > 30 * day)) {
          return false;
        }
      }

      if (!q) return true;

      return [
        getTrackingNumber(s),
        getRecipient(s),
        getDestination(s),
        getPhone(s),
        s.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [shipments, search, tab, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const visible = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  async function copyTracking(tracking: string) {
    try {
      await navigator.clipboard.writeText(tracking);
      setCopied(tracking);
      window.setTimeout(() => setCopied(""), 1800);
    } catch {
      // Clipboard access may be unavailable in some browser contexts.
      // The dashboard itself remains fully usable.
    }
  }

  function exportCsv() {
    const columns = [
      "Tracking Number",
      "Recipient",
      "Destination",
      "Status",
      "Amount NPR",
      "Created At",
    ];

    const esc = (v: unknown) =>
      `"${String(v ?? "").replace(/"/g, '""')}"`;

    const rows = filtered.map((s) => [
      getTrackingNumber(s),
      getRecipient(s),
      getDestination(s),
      formatStatus(s.status),
      getAmount(s),
      formatDate(s.createdAt),
    ]);

    const csv = [columns, ...rows]
      .map((r) => r.map(esc).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "aarambha-vendor-shipments.csv";
    a.click();

    URL.revokeObjectURL(url);
  }

  const tabs: { key: "ALL" | GroupKey; label: string; count: number }[] = [
    { key: "ALL", label: "All", count: stats.total },
    ...GROUP_KEYS.map((k) => ({
      key: k,
      label: GROUPS[k].label,
      count: stats.counts[k],
    })),
  ];

  return (
    <main className="min-h-screen bg-[#FEF8EB] text-[#0A0E12]">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* ---------- Header ---------- */}
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="min-h-5 text-sm font-medium text-[#77756E]">
              {today || "Aarambha Courier"}
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
              Namaste, welcome back
            </h1>

            <p className="mt-1.5 max-w-xl text-sm text-[#77756E]">
              Here is where your parcels are and how much cash you are owed on
              delivery.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/calculator"
              className={`inline-flex h-11 items-center gap-2 rounded-xl border border-[#E5E0D5] bg-white px-4 text-sm font-medium transition hover:border-[#D8D1C3] hover:bg-[#FFFCF5] ${FOCUS}`}
            >
              <Calculator size={15} />
              Rate calculator
            </Link>

            <Link
              href="/vendor/dashboard/shipments/create"
              className={`inline-flex h-11 items-center gap-2 rounded-xl bg-[#FBB501] px-5 text-sm font-semibold shadow-[0_2px_0_#C99200] transition hover:bg-[#FAA212] ${FOCUS}`}
            >
              <Plus size={16} />
              New shipment
            </Link>
          </div>
        </header>

        {/* ---------- Hero ---------- */}
        <section
          aria-label="Cash on delivery and delivery progress"
          className="mt-7"
        >
          <div className="grid overflow-hidden rounded-2xl bg-[#0A0E12] text-white lg:grid-cols-5">
            <div className="p-6 sm:p-8 lg:col-span-2">
              <div className="flex items-center gap-2 text-sm text-[#CFC9BB]">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#FBB501] text-[#0A0E12]">
                  <Wallet size={16} />
                </span>
                Cash on delivery
              </div>

              <p className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
                <span className="mr-2 text-2xl font-semibold text-[#FBB501] sm:text-3xl">
                  Rs.
                </span>
                {formatNPR(stats.cod)}
              </p>

              <p className="mt-3 max-w-xs text-xs leading-5 text-[#A9A395]">
                Total of recorded shipment amounts, excluding cancelled and
                returned parcels. This is not a confirmed settlement balance.
              </p>

              <Link
                href="/vendor/dashboard/payments"
                className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg border border-[#3A3D40] px-4 text-sm font-medium transition hover:border-[#FBB501] hover:text-[#FBB501] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FBB501]"
              >
                View payments
                <ArrowUpRight size={15} />
              </Link>
            </div>

            <div className="border-t border-[#23272B] bg-[#11161B] p-6 sm:p-8 lg:col-span-3 lg:border-l lg:border-t-0">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-base font-semibold">
                  Where your parcels are
                </h2>

                <span className="text-sm text-[#A9A395]">
                  {`${stats.total.toLocaleString("en-IN")} total`}
                </span>
              </div>

              <div
                className="mt-6 flex h-3 w-full gap-0.5 overflow-hidden rounded-full bg-[#23272B]"
                role="img"
                aria-label="Shipments by status"
              >
                {GROUP_KEYS.map((k) =>
                  stats.counts[k] > 0 ? (
                    <div
                      key={k}
                      style={{
                        width: `${(stats.counts[k] / stats.total) * 100}%`,
                        backgroundColor: GROUPS[k].color,
                      }}
                      className="transition-[width] duration-500"
                    />
                  ) : null,
                )}
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5">
                {GROUP_KEYS.map((k) => {
                  const pct =
                    stats.total > 0
                      ? (stats.counts[k] / stats.total) * 100
                      : 0;

                  return (
                    <div key={k}>
                      <dt className="flex items-center gap-2 text-sm text-[#CFC9BB]">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: GROUPS[k].color }}
                        />
                        {GROUPS[k].label}
                      </dt>

                      <dd className="mt-1 text-2xl font-semibold tabular-nums">
                        {stats.counts[k].toLocaleString("en-IN")}

                        <span className="ml-2 text-xs font-normal text-[#8E8979]">
                          {`${pct.toFixed(1)}%`}
                        </span>
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </div>
        </section>

        {/* ---------- Activity + needs attention ---------- */}
        <section
          className="mt-4 grid gap-4 lg:grid-cols-5"
          aria-label="Recent activity"
        >
          <div className="rounded-2xl border border-[#E5E0D5] bg-white p-5 sm:p-6 lg:col-span-3">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-base font-semibold">
                Parcels booked this week
              </h2>

              <span className="text-sm text-[#77756E]">
                {`${week.total} in 7 days`}
              </span>
            </div>

            <div
              className="mt-6 grid h-36 grid-cols-7 items-end gap-2 sm:gap-3"
              role="img"
              aria-label={`Parcels booked per day over the last 7 days: ${week.days
                .map((d) => `${d.label} ${d.count}`)
                .join(", ")}`}
            >
              {week.days.map((d, i) => {
                const isToday = i === week.days.length - 1;
                const h =
                  d.count === 0
                    ? 4
                    : Math.max(10, (d.count / week.max) * 100);

                return (
                  <div
                    key={d.key}
                    className="flex h-full flex-col items-center justify-end gap-2"
                  >
                    <span className="text-xs font-semibold tabular-nums text-[#4D4A43]">
                      {d.count === 0 ? "" : d.count}
                    </span>

                    <div
                      title={`${d.label}: ${d.count} parcels`}
                      style={{ height: `${h}%` }}
                      className={`w-full max-w-10 rounded-t-lg transition-[height] duration-500 ${
                        d.count === 0
                          ? "bg-[#F0EBDD]"
                          : isToday
                            ? "bg-[#FBB501]"
                            : "bg-[#F1D47A]"
                      }`}
                    />

                    <span
                      className={`text-xs ${
                        isToday
                          ? "font-semibold text-[#0A0E12]"
                          : "text-[#77756E]"
                      }`}
                    >
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E0D5] bg-white p-5 sm:p-6 lg:col-span-2">
            <h2 className="text-base font-semibold">Needs your attention</h2>

            <p className="mt-1 text-sm text-[#77756E]">
              Cancelled, returned or failed parcels.
            </p>

            {attention.length === 0 ? (
              <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#EEF7F0] px-4 py-4 text-sm text-[#23693A]">
                <CheckCircle2 size={18} className="shrink-0" />
                Nothing to review. All your parcels are moving.
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-[#F1EDE3]">
                {attention.map((s, i) => {
                  const t = getTrackingNumber(s);

                  return (
                    <li key={s._id || s.id || `${t}-${i}`}>
                      <Link
                        href={`/track?tracking=${encodeURIComponent(t)}`}
                        className={`group flex items-center justify-between gap-3 py-3 ${FOCUS}`}
                      >
                        <span className="min-w-0">
                          <span className="block truncate font-mono text-sm font-semibold">
                            {t}
                          </span>

                          <span className="block truncate text-xs text-[#77756E]">
                            {getRecipient(s)} · {formatStatus(s.status)}
                          </span>
                        </span>

                        <ArrowUpRight
                          size={15}
                          className="shrink-0 text-[#77756E] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        {/* ---------- Shipments ---------- */}
        <section className="mt-8" aria-label="Shipments">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Your shipments
              </h2>

              <p className="mt-1 text-sm text-[#77756E]">
                Search, filter and export your parcels.
              </p>
            </div>

            <button
              type="button"
              onClick={exportCsv}
              disabled={filtered.length === 0}
              className={`inline-flex h-10 items-center gap-2 self-start rounded-xl border border-[#E5E0D5] bg-white px-4 text-sm font-medium transition hover:bg-[#FFFCF5] disabled:opacity-50 sm:self-auto ${FOCUS}`}
            >
              <Download size={15} />
              Export CSV
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#E5E0D5] bg-white">
            <div
              role="tablist"
              aria-label="Filter by status"
              className="flex gap-1 overflow-x-auto border-b border-[#EEE9DF] px-2 pt-2"
            >
              {tabs.map((t) => {
                const active = tab === t.key;

                return (
                  <button
                    key={t.key}
                    role="tab"
                    aria-selected={active}
                    type="button"
                    onClick={() => {
                      setTab(t.key);
                      setPage(1);
                    }}
                    className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 pb-3 pt-2 text-sm transition-colors ${
                      active
                        ? "border-[#FBB501] font-semibold text-[#0A0E12]"
                        : "border-transparent text-[#77756E] hover:text-[#0A0E12]"
                    }`}
                  >
                    {t.label}

                    <span
                      className={`rounded-full px-2 py-0.5 text-xs tabular-nums ${
                        active
                          ? "bg-[#FBB501] text-[#0A0E12]"
                          : "bg-[#F3EFE6] text-[#77756E]"
                      }`}
                    >
                      {t.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77756E]"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by tracking ID, name, phone or address"
                  aria-label="Search shipments"
                  className="h-11 w-full rounded-xl border border-[#E5E0D5] bg-[#FFFCF5] pl-10 pr-3 text-sm outline-none transition placeholder:text-[#A29B8D] focus:border-[#FBB501] focus:bg-white focus:ring-4 focus:ring-[#FBB501]/20"
                />
              </div>

              <label htmlFor="shipment-date" className="sr-only">
                Filter by shipment date
              </label>

              <select
                id="shipment-date"
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setPage(1);
                }}
                className="h-11 rounded-xl border border-[#E5E0D5] bg-[#FFFCF5] px-3 text-sm outline-none focus:border-[#FBB501] focus:ring-4 focus:ring-[#FBB501]/20"
              >
                <option value="ALL">All dates</option>
                <option value="TODAY">Today</option>
                <option value="7_DAYS">Last 7 days</option>
                <option value="30_DAYS">Last 30 days</option>
              </select>
            </div>

            {visible.length === 0 ? (
              <div className="px-4 py-16 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#FFF3CC] text-[#C99200]">
                  <Package size={22} />
                </span>

                <p className="mt-4 text-sm font-semibold">
                  No shipments found
                </p>

                <p className="mt-1 text-sm text-[#77756E]">
                  {shipments.length === 0
                    ? "Create your first shipment and it will show up here."
                    : "Nothing matches these filters. Try a different search or status."}
                </p>

                {shipments.length === 0 && (
                  <Link
                    href="/vendor/dashboard/shipments/create"
                    className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[#FBB501] px-4 text-sm font-semibold hover:bg-[#FAA212]"
                  >
                    <Plus size={15} />
                    Create shipment
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-y border-[#EEE9DF] bg-[#FAF7EF] text-xs text-[#77756E]">
                        <th className="px-5 py-3 font-medium">Tracking ID</th>
                        <th className="px-5 py-3 font-medium">Recipient</th>
                        <th className="px-5 py-3 font-medium">Destination</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3 text-right font-medium">
                          COD amount
                        </th>
                        <th className="px-5 py-3 font-medium">Created</th>
                        <th className="px-5 py-3 text-right font-medium">
                          <span className="sr-only">Action</span>
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#F1EDE3]">
                      {visible.map((s, i) => {
                        const tracking = getTrackingNumber(s);

                        return (
                          <tr
                            key={s._id || s.id || `${tracking}-${i}`}
                            className="transition-colors hover:bg-[#FFFCF5]"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1.5">
                                <span className="whitespace-nowrap font-mono text-sm font-semibold">
                                  {tracking}
                                </span>

                                <CopyButton
                                  tracking={tracking}
                                  copied={copied === tracking}
                                  onCopy={copyTracking}
                                />
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <p className="text-sm font-medium">
                                {getRecipient(s)}
                              </p>

                              {getPhone(s) && (
                                <p className="mt-0.5 text-xs text-[#77756E]">
                                  {getPhone(s)}
                                </p>
                              )}
                            </td>

                            <td className="max-w-[240px] px-5 py-4">
                              <span className="flex items-center gap-1.5 text-sm text-[#4D4A43]">
                                <MapPin
                                  size={13}
                                  className="shrink-0 text-[#A29B8D]"
                                />
                                <span className="truncate">
                                  {getDestination(s)}
                                </span>
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <StatusBadge status={s.status} />
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 text-right text-sm font-semibold tabular-nums">
                              Rs. {formatNPR(getAmount(s))}
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 text-sm text-[#77756E]">
                              {formatDate(s.createdAt)}
                            </td>

                            <td className="px-5 py-4 text-right">
                              <TrackLink tracking={tracking} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <ul className="divide-y divide-[#F1EDE3] md:hidden">
                  {visible.map((s, i) => {
                    const tracking = getTrackingNumber(s);

                    return (
                      <li
                        key={s._id || s.id || `${tracking}-${i}`}
                        className="space-y-3 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-1.5">
                            <span className="truncate font-mono text-sm font-semibold">
                              {tracking}
                            </span>

                            <CopyButton
                              tracking={tracking}
                              copied={copied === tracking}
                              onCopy={copyTracking}
                            />
                          </div>

                          <StatusBadge status={s.status} />
                        </div>

                        <div>
                          <p className="text-sm font-medium">
                            {getRecipient(s)}
                          </p>

                          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#77756E]">
                            <MapPin size={12} className="shrink-0" />
                            <span className="truncate">
                              {getDestination(s)}
                            </span>
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold tabular-nums">
                              Rs. {formatNPR(getAmount(s))}
                            </p>

                            <p className="text-xs text-[#77756E]">
                              {formatDate(s.createdAt)}
                            </p>
                          </div>

                          <TrackLink tracking={tracking} />
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="flex flex-col gap-3 border-t border-[#EEE9DF] px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-[#77756E]">
                    Showing{" "}
                    <span className="font-semibold text-[#0A0E12]">
                      {(safePage - 1) * PAGE_SIZE + 1}–
                      {Math.min(safePage * PAGE_SIZE, filtered.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-[#0A0E12]">
                      {filtered.length}
                    </span>{" "}
                    shipments
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={safePage <= 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="h-9 rounded-lg border border-[#E5E0D5] px-3 text-xs font-medium hover:bg-[#FAF7EF] disabled:opacity-40"
                    >
                      Previous
                    </button>

                    <span className="min-w-20 text-center text-xs text-[#77756E]">
                      Page {safePage} of {totalPages}
                    </span>

                    <button
                      type="button"
                      disabled={safePage >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="h-9 rounded-lg border border-[#E5E0D5] px-3 text-xs font-medium hover:bg-[#FAF7EF] disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* ---------- Quick actions ---------- */}
        <section
          className="mt-8 pb-8"
          aria-label="Quick actions"
        >
          <h2 className="mb-4 text-xl font-bold tracking-tight">
            Quick actions
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <QuickAction
              href="/vendor/dashboard/shipments/create"
              title="Create shipment"
              description="Book a new customer delivery."
              icon={<Plus size={18} />}
              primary
            />

            <QuickAction
              href="/track"
              title="Track a parcel"
              description="Check the latest status by tracking ID."
              icon={<Truck size={18} />}
            />

            <QuickAction
              href="/calculator"
              title="Estimate delivery charge"
              description="Get a rate before you book."
              icon={<Calculator size={18} />}
            />

            <QuickAction
              href="/contact"
              title="Contact support"
              description="Talk to the Aarambha team."
              icon={<LifeBuoy size={18} />}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

/* ----------------------------- Pieces ----------------------------- */

const BADGE: Record<GroupKey, { cls: string; icon: ReactNode }> = {
  PENDING: {
    cls: "bg-[#F3EFE6] text-[#5E5848]",
    icon: <Clock3 size={12} />,
  },
  IN_TRANSIT: {
    cls: "bg-[#FFF3CC] text-[#7A5800]",
    icon: <Truck size={12} />,
  },
  DELIVERED: {
    cls: "bg-[#E4F4E8] text-[#23693A]",
    icon: <CheckCircle2 size={12} />,
  },
  ISSUES: {
    cls: "bg-[#FDE8E3] text-[#9A3926]",
    icon: <AlertTriangle size={12} />,
  },
};

function StatusBadge({ status }: { status?: string }) {
  const b = BADGE[groupOf(status)];

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${b.cls}`}
    >
      {b.icon}
      {formatStatus(status)}
    </span>
  );
}

function CopyButton({
  tracking,
  copied,
  onCopy,
}: {
  tracking: string;
  copied: boolean;
  onCopy: (t: string) => void;
}) {
  return (
    <button
      type="button"
      title="Copy tracking ID"
      aria-label={`Copy tracking ID ${tracking}`}
      onClick={() => onCopy(tracking)}
      className="shrink-0 rounded-md p-1.5 text-[#77756E] transition hover:bg-[#F5EFDF] hover:text-[#0A0E12]"
    >
      {copied ? (
        <Check size={14} className="text-[#23693A]" />
      ) : (
        <Copy size={14} />
      )}
    </button>
  );
}

function TrackLink({ tracking }: { tracking: string }) {
  return (
    <Link
      href={`/track?tracking=${encodeURIComponent(tracking)}`}
      aria-label={`Track shipment ${tracking}`}
      className={`inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E5E0D5] px-3 text-xs font-semibold transition hover:border-[#FBB501] hover:bg-[#FFF8E2] ${FOCUS}`}
    >
      Track
      <ArrowUpRight size={13} />
    </Link>
  );
}

function QuickAction({
  href,
  title,
  description,
  icon,
  primary = false,
}: {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-start gap-4 rounded-2xl border p-5 transition ${FOCUS} ${
        primary
          ? "border-[#FBB501] bg-[#FBB501] hover:bg-[#FAA212]"
          : "border-[#E5E0D5] bg-white hover:border-[#FBB501] hover:bg-[#FFFCF5]"
      }`}
    >
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
          primary
            ? "bg-[#0A0E12] text-[#FBB501]"
            : "bg-[#FFF3CC] text-[#8A6500]"
        }`}
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold">{title}</span>

          <ArrowUpRight
            size={15}
            className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>

        <span
          className={`mt-1 block text-xs leading-5 ${
            primary ? "text-[#3F351D]" : "text-[#77756E]"
          }`}
        >
          {description}
        </span>
      </span>
    </Link>
  );
}
