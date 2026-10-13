"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import Link from "next/link";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Download,
  ExternalLink,
  LoaderCircle,
  Package,
  Plus,
  RefreshCw,
  Search,
  Truck,
  Wallet,
  XCircle,
} from "lucide-react";

type ShipmentStatus =
  | "PENDING"
  | "PENDING_PICKUP"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED"
  | "FAILED";

type Shipment = {
  _id?: string;
  id?: string;
  trackingNumber?: string;
  trackingId?: string;
  shipmentId?: string;
  status?: ShipmentStatus | string;
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
  paymentStatus?: string;
  createdAt?: string;
  updatedAt?: string;
};

type ApiResponse = {
  shipments?: Shipment[];
  data?: Shipment[] | { shipments?: Shipment[] };
  results?: Shipment[];
  message?: string;
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const COLORS = {
  page: "#FEF8EB",
  yellow: "#FBB501",
  orange: "#FAA212",
  black: "#0A0E12",
  border: "#E5E0D5",
  muted: "#77756E",
};

const STATUS_OPTIONS = [
  "ALL",
  "PENDING",
  "PENDING_PICKUP",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
  "FAILED",
] as const;

function getTrackingNumber(shipment: Shipment) {
  return (
    shipment.trackingNumber ||
    shipment.trackingId ||
    shipment.shipmentId ||
    shipment._id ||
    shipment.id ||
    "—"
  );
}

function getRecipient(shipment: Shipment) {
  return (
    shipment.recipientName ||
    shipment.receiverName ||
    shipment.customerName ||
    "Customer"
  );
}

function getDestination(shipment: Shipment) {
  return (
    shipment.destination ||
    shipment.deliveryAddress ||
    shipment.receiverAddress ||
    shipment.city ||
    "Address not provided"
  );
}

function getAmount(shipment: Shipment) {
  const amount =
    shipment.codAmount ?? shipment.totalAmount ?? shipment.amount ?? 0;

  return Number.isFinite(Number(amount)) ? Number(amount) : 0;
}

function normalizeStatus(status?: string) {
  return (status || "PENDING").toUpperCase().replace(/[\s-]+/g, "_");
}

function formatStatus(status?: string) {
  return normalizeStatus(status)
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatNPR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(value);
}

function getStatusStyle(status?: string) {
  const normalized = normalizeStatus(status);

  if (normalized === "DELIVERED") {
    return "border-[#B8D9C0] bg-[#EDF7EE] text-[#276738]";
  }

  if (["IN_TRANSIT", "OUT_FOR_DELIVERY", "PICKED_UP"].includes(normalized)) {
    return "border-[#E9D49A] bg-[#FFF7DE] text-[#765600]";
  }

  if (["CANCELLED", "FAILED", "RETURNED"].includes(normalized)) {
    return "border-[#E6C1B8] bg-[#FFF0EC] text-[#9A3926]";
  }

  return "border-[#E5E0D5] bg-[#F7F5EF] text-[#656159]";
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Unable to load shipments. Please try again.";
}

export default function VendorDashboardPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [copiedTracking, setCopiedTracking] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 8;

  const loadShipments = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      /*
       * IMPORTANT:
       * Change this URL to your existing vendor shipment-list endpoint
       * if your backend uses a different route.
       *
       * credentials: "include" preserves cookie-based authentication.
       */
      const response = await fetch(`${API_URL}/api/vendor/shipments`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (response.status === 401 || response.status === 403) {
        throw new Error(
          "Your session may have expired. Please sign in again.",
        );
      }

      if (!response.ok) {
        throw new Error(
          `Unable to retrieve shipments (HTTP ${response.status}).`,
        );
      }

      const result: ApiResponse | Shipment[] = await response.json();

      let list: Shipment[] = [];

      if (Array.isArray(result)) {
        list = result;
      } else if (Array.isArray(result.shipments)) {
        list = result.shipments;
      } else if (Array.isArray(result.results)) {
        list = result.results;
      } else if (Array.isArray(result.data)) {
        list = result.data;
      } else if (
        result.data &&
        !Array.isArray(result.data) &&
        Array.isArray(result.data.shipments)
      ) {
        list = result.data.shipments;
      }

      setShipments(list);
      setCurrentPage(1);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadShipments();
  }, [loadShipments]);

  const stats = useMemo(() => {
    const count = (statuses: string[]) =>
      shipments.filter((shipment) =>
        statuses.includes(normalizeStatus(shipment.status)),
      ).length;

    return {
      total: shipments.length,
      pending: count(["PENDING", "PENDING_PICKUP"]),
      inTransit: count(["PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY"]),
      delivered: count(["DELIVERED"]),
      cancelled: count(["CANCELLED", "FAILED", "RETURNED"]),
      cod: shipments
        .filter(
          (shipment) =>
            normalizeStatus(shipment.status) !== "CANCELLED" &&
            normalizeStatus(shipment.status) !== "RETURNED",
        )
        .reduce((sum, shipment) => sum + getAmount(shipment), 0),
    };
  }, [shipments]);

  const filteredShipments = useMemo(() => {
    const query = search.trim().toLowerCase();
    const now = new Date();

    return shipments.filter((shipment) => {
      const status = normalizeStatus(shipment.status);

      if (statusFilter !== "ALL" && status !== statusFilter) {
        return false;
      }

      if (dateFilter !== "ALL") {
        if (!shipment.createdAt) return false;

        const created = new Date(shipment.createdAt);

        if (Number.isNaN(created.getTime())) return false;

        const age = now.getTime() - created.getTime();
        const day = 24 * 60 * 60 * 1000;

        if (dateFilter === "TODAY" && created.toDateString() !== now.toDateString()) {
          return false;
        }

        if (dateFilter === "7_DAYS" && (age < 0 || age > 7 * day)) {
          return false;
        }

        if (dateFilter === "30_DAYS" && (age < 0 || age > 30 * day)) {
          return false;
        }
      }

      if (!query) return true;

      const searchable = [
        getTrackingNumber(shipment),
        getRecipient(shipment),
        getDestination(shipment),
        shipment.recipientPhone,
        shipment.receiverPhone,
        shipment.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [shipments, search, statusFilter, dateFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredShipments.length / pageSize),
  );

  const safePage = Math.min(currentPage, totalPages);

  const visibleShipments = filteredShipments.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  async function copyTracking(tracking: string) {
    try {
      await navigator.clipboard.writeText(tracking);
      setCopiedTracking(tracking);
      window.setTimeout(() => setCopiedTracking(""), 1800);
    } catch {
      setError("Could not copy the tracking number. Please copy it manually.");
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

    const escapeCsv = (value: unknown) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = filteredShipments.map((shipment) => [
      getTrackingNumber(shipment),
      getRecipient(shipment),
      getDestination(shipment),
      formatStatus(shipment.status),
      getAmount(shipment),
      formatDate(shipment.createdAt),
    ]);

    const csv = [columns, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "aarambha-vendor-shipments.csv";
    anchor.click();

    URL.revokeObjectURL(url);
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCurrentPage(1);
  }

  return (
    <main
      className="min-h-screen min-w-0"
      style={{
        backgroundColor: COLORS.page,
        color: COLORS.black,
      }}
    >
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Page heading */}
        <header className="flex flex-col justify-between gap-5 border-b border-[#E5E0D5] pb-6 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#77756E]">
              <Package size={14} />
              Vendor portal
              <span className="text-[#B8B0A0]">/</span>
              Operations
            </div>

            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-[#77756E]">
              Your shipment activity, delivery progress, and cash-on-delivery
              overview.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void loadShipments(true)}
              disabled={loading || refreshing}
              className="inline-flex h-10 items-center justify-center gap-2 border border-[#D8D1C3] bg-white px-3 text-sm font-medium transition-colors hover:bg-[#FAF7EF] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={15}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <Link
              href="/calculator"
              className="inline-flex h-10 items-center justify-center gap-2 border border-[#D8D1C3] bg-white px-3 text-sm font-medium transition-colors hover:bg-[#FAF7EF]"
            >
              <Wallet size={15} />
              Rate calculator
            </Link>

            <Link
              href="/vendor/dashboard/shipments/create"
              className="inline-flex h-10 items-center justify-center gap-2 bg-[#FBB501] px-4 text-sm font-semibold text-[#0A0E12] transition-colors hover:bg-[#FAA212]"
            >
              <Plus size={16} />
              New shipment
            </Link>
          </div>
        </header>

        {/* Errors */}
        {error && (
          <div
            role="alert"
            className="mt-5 flex items-start justify-between gap-3 border border-[#E6C1B8] bg-[#FFF0EC] px-4 py-3 text-sm text-[#873624]"
          >
            <div className="flex items-start gap-2">
              <XCircle size={17} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>

            <button
              type="button"
              aria-label="Dismiss error"
              onClick={() => setError("")}
              className="shrink-0 p-1 hover:bg-[#FBE1DA]"
            >
              <XCircle size={15} />
            </button>
          </div>
        )}

        {/* KPI summary */}
        <section aria-label="Shipment overview" className="mt-7">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#77756E]">
              Shipment overview
            </h2>

            {loading && (
              <span className="flex items-center gap-2 text-xs text-[#77756E]">
                <LoaderCircle size={13} className="animate-spin" />
                Loading data
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 border-l border-t border-[#E5E0D5] sm:grid-cols-3 xl:grid-cols-6">
            <Stat
              label="Total shipments"
              value={loading ? "—" : stats.total.toLocaleString("en-IN")}
              icon={<Package size={16} />}
              note="All recorded shipments"
            />

            <Stat
              label="Awaiting pickup"
              value={loading ? "—" : stats.pending.toLocaleString("en-IN")}
              icon={<Clock3 size={16} />}
              note="Pending collection"
            />

            <Stat
              label="In transit"
              value={loading ? "—" : stats.inTransit.toLocaleString("en-IN")}
              icon={<Truck size={16} />}
              note="On the delivery network"
            />

            <Stat
              label="Delivered"
              value={loading ? "—" : stats.delivered.toLocaleString("en-IN")}
              icon={<CheckCircle2 size={16} />}
              note="Marked as delivered"
            />

            <Stat
              label="Cancelled / returned"
              value={loading ? "—" : stats.cancelled.toLocaleString("en-IN")}
              icon={<Activity size={16} />}
              note="Requires review"
            />

            <Stat
              label="COD amount"
              value={
                loading
                  ? "—"
                  : `Rs. ${formatNPR(stats.cod)}`
              }
              icon={<Wallet size={16} />}
              note="Recorded shipment amounts"
              compact
            />
          </div>
        </section>

        {/* Main operational content */}
        <section className="mt-8">
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Shipments
              </h2>
              <p className="mt-1 text-sm text-[#77756E]">
                Search and review your shipment records.
              </p>
            </div>

            <button
              type="button"
              onClick={exportCsv}
              disabled={filteredShipments.length === 0}
              className="inline-flex h-9 items-center justify-center gap-2 self-start border border-[#D8D1C3] bg-white px-3 text-sm font-medium transition-colors hover:bg-[#FAF7EF] disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
            >
              <Download size={15} />
              Export CSV
            </button>
          </div>

          <div className="overflow-hidden border border-[#E5E0D5] bg-white">
            {/* Search and filters */}
            <div className="flex flex-col gap-3 border-b border-[#E5E0D5] p-4 lg:flex-row lg:items-center lg:justify-between">
              <form
                onSubmit={handleSearch}
                className="relative w-full lg:max-w-md"
              >
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#77756E]"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search tracking, recipient, destination..."
                  aria-label="Search shipments"
                  className="h-10 w-full border border-[#E5E0D5] bg-white pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-[#A29B8D] focus:border-[#C99A00]"
                />
              </form>

              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <label
                    htmlFor="shipment-status"
                    className="sr-only"
                  >
                    Filter by shipment status
                  </label>

                  <select
                    id="shipment-status"
                    value={statusFilter}
                    onChange={(event) => {
                      setStatusFilter(event.target.value);
                      setCurrentPage(1);
                    }}
                    className="h-10 max-w-full border border-[#E5E0D5] bg-white px-3 text-sm outline-none focus:border-[#C99A00]"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status === "ALL" ? "All statuses" : formatStatus(status)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <label htmlFor="shipment-date" className="sr-only">
                    Filter by shipment date
                  </label>

                  <select
                    id="shipment-date"
                    value={dateFilter}
                    onChange={(event) => {
                      setDateFilter(event.target.value);
                      setCurrentPage(1);
                    }}
                    className="h-10 border border-[#E5E0D5] bg-white px-3 text-sm outline-none focus:border-[#C99A00]"
                  >
                    <option value="ALL">All dates</option>
                    <option value="TODAY">Today</option>
                    <option value="7_DAYS">Last 7 days</option>
                    <option value="30_DAYS">Last 30 days</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Shipment table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left">
                <thead className="bg-[#FAF7EF] text-[10px] font-semibold uppercase tracking-[0.12em] text-[#77756E]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Tracking ID</th>
                    <th className="px-4 py-3 font-semibold">Recipient</th>
                    <th className="px-4 py-3 font-semibold">Destination</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Amount
                    </th>
                    <th className="px-4 py-3 font-semibold">Created</th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EEE9DF]">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-16 text-center">
                        <LoaderCircle
                          size={22}
                          className="mx-auto animate-spin text-[#A38A43]"
                        />
                        <p className="mt-3 text-sm text-[#77756E]">
                          Loading shipment records...
                        </p>
                      </td>
                    </tr>
                  ) : visibleShipments.length > 0 ? (
                    visibleShipments.map((shipment, index) => {
                      const tracking = getTrackingNumber(shipment);
                      const status = normalizeStatus(shipment.status);

                      return (
                        <tr
                          key={
                            shipment._id ||
                            shipment.id ||
                            `${tracking}-${index}`
                          }
                          className="transition-colors hover:bg-[#FFFCF5]"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <span className="whitespace-nowrap text-sm font-semibold">
                                {tracking}
                              </span>

                              <button
                                type="button"
                                title="Copy tracking number"
                                aria-label={`Copy tracking number ${tracking}`}
                                onClick={() => void copyTracking(tracking)}
                                className="p-1 text-[#77756E] transition-colors hover:bg-[#F5EFDF] hover:text-[#0A0E12]"
                              >
                                {copiedTracking === tracking ? (
                                  <Check size={13} />
                                ) : (
                                  <Copy size={13} />
                                )}
                              </button>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <p className="text-sm font-medium">
                              {getRecipient(shipment)}
                            </p>
                            {(shipment.recipientPhone ||
                              shipment.receiverPhone) && (
                              <p className="mt-1 text-xs text-[#77756E]">
                                {shipment.recipientPhone ||
                                  shipment.receiverPhone}
                              </p>
                            )}
                          </td>

                          <td className="max-w-[220px] px-4 py-4">
                            <span className="block truncate text-sm text-[#4D4A43]">
                              {getDestination(shipment)}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex whitespace-nowrap border px-2 py-1 text-[11px] font-medium ${getStatusStyle(status)}`}
                            >
                              {formatStatus(status)}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-4 py-4 text-right text-sm tabular-nums">
                            Rs. {formatNPR(getAmount(shipment))}
                          </td>

                          <td className="whitespace-nowrap px-4 py-4 text-sm text-[#77756E]">
                            {formatDate(shipment.createdAt)}
                          </td>

                          <td className="px-4 py-4 text-right">
                            <Link
                              href={`/track?tracking=${encodeURIComponent(tracking)}`}
                              title={`Track ${tracking}`}
                              aria-label={`Track shipment ${tracking}`}
                              className="inline-flex h-8 items-center justify-center gap-1 border border-[#E5E0D5] px-2 text-xs font-medium transition-colors hover:border-[#FBB501] hover:bg-[#FFF8E2]"
                            >
                              View
                              <ExternalLink size={12} />
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-16 text-center">
                        <Package
                          size={25}
                          className="mx-auto text-[#B8B0A0]"
                        />

                        <p className="mt-3 text-sm font-semibold">
                          No shipments found
                        </p>

                        <p className="mt-1 text-sm text-[#77756E]">
                          {shipments.length === 0
                            ? "Your shipment records will appear here when available."
                            : "Try changing your search or filters."}
                        </p>

                        {shipments.length === 0 && (
                          <Link
                            href="/vendor/dashboard/shipments/create"
                            className="mt-4 inline-flex h-9 items-center gap-2 bg-[#FBB501] px-3 text-sm font-semibold hover:bg-[#FAA212]"
                          >
                            <Plus size={15} />
                            Create shipment
                          </Link>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && filteredShipments.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-[#E5E0D5] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-[#77756E]">
                  Showing{" "}
                  <span className="font-medium text-[#0A0E12]">
                    {(safePage - 1) * pageSize + 1}–
                    {Math.min(safePage * pageSize, filteredShipments.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-[#0A0E12]">
                    {filteredShipments.length}
                  </span>{" "}
                  shipments
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={safePage <= 1}
                    onClick={() => setCurrentPage((page) => page - 1)}
                    className="h-8 border border-[#E5E0D5] px-3 text-xs font-medium hover:bg-[#FAF7EF] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <span className="min-w-16 text-center text-xs text-[#77756E]">
                    Page {safePage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={safePage >= totalPages}
                    onClick={() => setCurrentPage((page) => page + 1)}
                    className="h-8 border border-[#E5E0D5] px-3 text-xs font-medium hover:bg-[#FAF7EF] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Operational summaries */}
        <section className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-5">
          <div className="border border-[#E5E0D5] bg-white p-5 sm:p-6 lg:col-span-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold">
                  Delivery performance
                </h2>
                <p className="mt-1 text-sm text-[#77756E]">
                  Distribution of your recorded shipments by status.
                </p>
              </div>

              <Activity size={18} className="text-[#77756E]" />
            </div>

            <div className="mt-6 space-y-5">
              <ProgressRow
                label="Delivered"
                count={stats.delivered}
                total={stats.total}
                color="#478653"
              />

              <ProgressRow
                label="In transit"
                count={stats.inTransit}
                total={stats.total}
                color="#D9A100"
              />

              <ProgressRow
                label="Awaiting pickup"
                count={stats.pending}
                total={stats.total}
                color="#8A8376"
              />

              <ProgressRow
                label="Cancelled / returned"
                count={stats.cancelled}
                total={stats.total}
                color="#B34B36"
              />
            </div>

            <p className="mt-5 border-t border-[#EEE9DF] pt-4 text-xs leading-5 text-[#77756E]">
              Percentages are calculated from the shipment records returned by
              the current API. They are not a delivery-time SLA or a guarantee
              of performance.
            </p>
          </div>

          <div className="flex flex-col justify-between bg-[#0A0E12] p-5 text-white sm:p-6 lg:col-span-2">
            <div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#D5D0C5]">
                  COD overview
                </p>
                <Wallet size={18} className="text-[#FBB501]" />
              </div>

              <p className="mt-7 text-sm text-[#D5D0C5]">
                Recorded shipment amount
              </p>

              <p className="mt-2 break-words text-2xl font-semibold tracking-tight sm:text-3xl">
                Rs. {loading ? "—" : formatNPR(stats.cod)}
              </p>

              <p className="mt-3 max-w-sm text-xs leading-5 text-[#B5B0A6]">
                Calculated from the available shipment amount fields. This
                figure is not a verified settlement balance or confirmed
                remittance.
              </p>
            </div>

            <Link
              href="/vendor/dashboard/payments"
              className="mt-8 inline-flex min-h-10 items-center justify-between gap-3 border border-[#46484A] px-3 text-sm font-medium transition-colors hover:border-[#FBB501] hover:bg-[#191C1F]"
            >
              View payment records
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* Quick actions */}
        <section className="mt-8 pb-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold tracking-tight">
              Quick actions
            </h2>
            <p className="mt-1 text-sm text-[#77756E]">
              Common tasks for your daily operations.
            </p>
          </div>

          <div className="grid grid-cols-1 border-l border-t border-[#E5E0D5] sm:grid-cols-2 xl:grid-cols-4">
            <QuickAction
              href="/vendor/dashboard/shipments/create"
              title="Create shipment"
              description="Register a new customer delivery."
              icon={<Plus size={17} />}
              primary
            />

            <QuickAction
              href="/track"
              title="Track shipment"
              description="Check the latest shipment status."
              icon={<Truck size={17} />}
            />

            <QuickAction
              href="/calculator"
              title="Calculate delivery"
              description="Estimate the delivery charge."
              icon={<Wallet size={17} />}
            />

            <QuickAction
              href="/contact"
              title="Get support"
              description="Contact the Aarambha team."
              icon={<CalendarDays size={17} />}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  icon,
  note,
  compact = false,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  note: string;
  compact?: boolean;
}) {
  return (
    <div className="min-w-0 border-b border-r border-[#E5E0D5] bg-white p-4 transition-colors hover:bg-[#FFFCF5] sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-xs font-medium text-[#77756E]">
          {label}
        </span>
        <span className="shrink-0 text-[#9A8B67]">{icon}</span>
      </div>

      <p
        className={`mt-4 break-words font-semibold leading-tight tracking-tight text-[#0A0E12] ${
          compact ? "text-lg sm:text-xl" : "text-2xl sm:text-3xl"
        }`}
      >
        {value}
      </p>

      <p className="mt-2 text-[11px] leading-4 text-[#8B8579]">{note}</p>
    </div>
  );
}

function ProgressRow({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm text-[#4D4A43]">{label}</span>

        <span className="shrink-0 text-xs tabular-nums text-[#77756E]">
          {count}{" "}
          <span className="text-[#B0A99B]">
            ({percentage.toFixed(1)}%)
          </span>
        </span>
      </div>

      <div
        className="h-1.5 w-full overflow-hidden bg-[#F0EDE5]"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Number(percentage.toFixed(1))}
      >
        <div
          className="h-full transition-[width] duration-300"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
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
  icon: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex min-h-32 flex-col justify-between gap-5 border-b border-r border-[#E5E0D5] p-4 transition-colors sm:p-5 ${
        primary
          ? "bg-[#FBB501] text-[#0A0E12] hover:bg-[#FAA212]"
          : "bg-white hover:bg-[#FFFCF5]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={
            primary
              ? "text-[#0A0E12]"
              : "text-[#8D7B4B] group-hover:text-[#0A0E12]"
          }
        >
          {icon}
        </span>

        <ArrowUpRight
          size={15}
          className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </div>

      <div>
        <p className="text-sm font-semibold">{title}</p>

        <p
          className={`mt-1 text-xs leading-5 ${
            primary ? "text-[#3F351D]" : "text-[#77756E]"
          }`}
        >
          {description}
        </p>
      </div>
    </Link>
  );
}
