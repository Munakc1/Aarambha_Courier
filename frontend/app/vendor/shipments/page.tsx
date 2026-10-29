
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Upload,
  RefreshCw,
  Package,
  Truck,
  CheckCircle2,
  Clock3,
  XCircle,
  Eye,
  X,
  MapPin,
  Phone,
  CalendarDays,
  Wallet,
  AlertCircle,
  Download,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

type ShipmentStatus =
  | "CREATED"
  | "PENDING_PICKUP"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

type Shipment = {
  _id: string;
  trackingNumber: string;
  senderName?: string;
  senderPhone?: string;
  receiverName: string;
  receiverPhone?: string;
  receiverAddress?: string;
  receiverCity?: string;
  description?: string;
  status: ShipmentStatus;
  paymentMethod?: string;
  paymentStatus?: string;
  codAmount?: number;
  shippingFee?: number;
  createdAt?: string;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  shipments?: Shipment[];
  data?: Shipment[] | { shipments?: Shipment[] };
};

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: "All statuses", value: "ALL" },
  { label: "Created", value: "CREATED" },
  { label: "Pending pickup", value: "PENDING_PICKUP" },
  { label: "Picked up", value: "PICKED_UP" },
  { label: "In transit", value: "IN_TRANSIT" },
  { label: "Out for delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Returned", value: "RETURNED" },
];

function formatMoney(value?: number) {
  return `Rs. ${(Number(value) || 0).toLocaleString("en-IN")}`;
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

function statusLabel(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function statusClass(status: string) {
  switch (status) {
    case "DELIVERED":
      return "bg-emerald-50 text-emerald-700";
    case "IN_TRANSIT":
    case "OUT_FOR_DELIVERY":
    case "PICKED_UP":
      return "bg-blue-50 text-blue-700";
    case "CANCELLED":
    case "RETURNED":
      return "bg-red-50 text-red-700";
    default:
      return "bg-amber-50 text-amber-800";
  }
}

function extractShipments(payload: ApiResponse): Shipment[] {
  if (Array.isArray(payload.shipments)) return payload.shipments;
  if (Array.isArray(payload.data)) return payload.data;
  if (
    payload.data &&
    !Array.isArray(payload.data) &&
    Array.isArray(payload.data.shipments)
  ) {
    return payload.data.shipments;
  }
  return [];
}

export default function VendorShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selected, setSelected] = useState<Shipment | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadShipments = useCallback(async (refresh = false) => {
    setError("");
    setNotice("");
    refresh ? setRefreshing(true) : setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/shipments`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      const payload = (await response.json().catch(() => ({}))) as ApiResponse;

      if (!response.ok || payload.success === false) {
        throw new Error(
          payload.message || `Could not load shipments (${response.status}).`
        );
      }

      setShipments(extractShipments(payload));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load shipments. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadShipments();
  }, [loadShipments]);

  const filteredShipments = useMemo(() => {
    const term = search.trim().toLowerCase();

    return shipments.filter((shipment) => {
      const matchesStatus =
        statusFilter === "ALL" || shipment.status === statusFilter;

      const matchesSearch =
        !term ||
        [
          shipment.trackingNumber,
          shipment.receiverName,
          shipment.receiverPhone,
          shipment.receiverCity,
          shipment.description,
        ].some((value) => String(value || "").toLowerCase().includes(term));

      return matchesStatus && matchesSearch;
    });
  }, [shipments, search, statusFilter]);

  const stats = useMemo(
    () => [
      {
        label: "Total shipments",
        value: shipments.length,
        icon: Package,
      },
      {
        label: "In transit",
        value: shipments.filter((s) =>
          ["IN_TRANSIT", "OUT_FOR_DELIVERY", "PICKED_UP"].includes(s.status)
        ).length,
        icon: Truck,
      },
      {
        label: "Delivered",
        value: shipments.filter((s) => s.status === "DELIVERED").length,
        icon: CheckCircle2,
      },
      {
        label: "Awaiting processing",
        value: shipments.filter((s) =>
          ["CREATED", "PENDING_PICKUP"].includes(s.status)
        ).length,
        icon: Clock3,
      },
    ],
    [shipments]
  );

  async function cancelShipment(shipment: Shipment) {
    if (
      !window.confirm(
        `Cancel shipment ${shipment.trackingNumber}? This request will be sent to the server.`
      )
    ) {
      return;
    }

    setBusyId(shipment._id);
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `${API_URL}/api/shipments/${encodeURIComponent(shipment._id)}/cancel`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { Accept: "application/json" },
        }
      );

      const payload = (await response.json().catch(() => ({}))) as ApiResponse;

      if (!response.ok || payload.success === false) {
        throw new Error(
          payload.message || `Cancellation failed (${response.status}).`
        );
      }

      setNotice("Cancellation request completed.");
      setSelected(null);
      await loadShipments(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to cancel this shipment."
      );
    } finally {
      setBusyId(null);
    }
  }

  function exportCsv() {
    const columns = [
      "trackingNumber",
      "receiverName",
      "receiverPhone",
      "receiverCity",
      "description",
      "status",
      "paymentMethod",
      "paymentStatus",
      "codAmount",
      "shippingFee",
      "createdAt",
    ] as const;

    const escapeCsv = (value: unknown) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = [
      columns.join(","),
      ...filteredShipments.map((shipment) =>
        columns.map((column) => escapeCsv(shipment[column])).join(",")
      ),
    ];

    const blob = new Blob(["\uFEFF" + rows.join("\r\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "aarambha-shipments.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[#F7F7F5] p-4 text-[#141B22] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Vendor dashboard / Operations
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Shipments
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your parcels and follow their delivery progress.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={exportCsv}
              disabled={!filteredShipments.length}
              className="inline-flex items-center gap-2 border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={16} /> Export CSV
            </button>
            <Link
              href="/vendor/shipments/bulk"
              className="inline-flex items-center gap-2 border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-50"
            >
              <Upload size={16} /> Bulk upload
            </Link>
            <Link
              href="/vendor/shipments/new"
              className="inline-flex items-center gap-2 bg-[#FBB501] px-4 py-2.5 text-sm font-bold text-[#141B22] hover:bg-[#FAA212]"
            >
              <Plus size={17} /> New shipment
            </Link>
          </div>
        </header>

        {error && (
          <div className="flex items-start gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">Something went wrong</p>
              <p className="mt-1">{error}</p>
              <p className="mt-1 text-xs">
                Check that the API is running and that this vendor is logged in.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void loadShipments(true)}
              className="shrink-0 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {notice && (
          <div className="border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            {notice}
          </div>
        )}

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="border border-gray-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{label}</p>
                <Icon size={19} className="text-gray-500" />
              </div>
              <p className="mt-3 text-3xl font-bold tabular-nums">
                {loading ? "—" : value}
              </p>
            </div>
          ))}
        </section>

        <section className="border border-gray-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-gray-200 p-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tracking number, recipient, city..."
                className="w-full border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#FBB501]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#FBB501]"
              aria-label="Filter shipments by status"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => void loadShipments(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 border border-gray-300 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-500">
            <span>
              {loading
                ? "Loading shipments..."
                : `${filteredShipments.length} shipment(s) found`}
            </span>
            <span className="hidden sm:inline">
              Showing live records from your account
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-[#F7F7F5] text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Tracking</th>
                  <th className="px-4 py-3 font-semibold">Recipient</th>
                  <th className="px-4 py-3 font-semibold">Destination</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                  <th className="px-4 py-3 font-semibold">Payment</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                      <RefreshCw className="mx-auto mb-3 animate-spin" size={22} />
                      Loading your shipments...
                    </td>
                  </tr>
                ) : filteredShipments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-14 text-center">
                      <Package className="mx-auto mb-3 text-gray-400" size={30} />
                      <p className="font-semibold">No shipments found</p>
                      <p className="mt-1 text-gray-500">
                        Try another search or create your first shipment.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredShipments.map((shipment) => (
                    <tr key={shipment._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <p className="font-bold">{shipment.trackingNumber}</p>
                        <p className="mt-1 max-w-44 truncate text-xs text-gray-500">
                          {shipment.description || "Parcel"}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium">{shipment.receiverName}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {shipment.receiverPhone || "No phone"}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={14} className="text-gray-400" />
                          {shipment.receiverCity || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        {formatDate(shipment.createdAt)}
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium">
                          {formatMoney(shipment.codAmount ?? shipment.shippingFee)}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {shipment.paymentMethod || "Not specified"}
                          {shipment.paymentStatus
                            ? ` · ${shipment.paymentStatus}`
                            : ""}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex whitespace-nowrap px-2.5 py-1 text-xs font-semibold ${statusClass(shipment.status)}`}
                        >
                          {statusLabel(shipment.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelected(shipment)}
                            aria-label={`View ${shipment.trackingNumber}`}
                            className="border border-gray-300 p-2 hover:bg-gray-100"
                          >
                            <Eye size={16} />
                          </button>
                          {!["DELIVERED", "CANCELLED", "RETURNED"].includes(
                            shipment.status
                          ) && (
                            <button
                              type="button"
                              onClick={() => void cancelShipment(shipment)}
                              disabled={busyId === shipment._id}
                              className="border border-red-200 p-2 text-red-700 hover:bg-red-50 disabled:opacity-50"
                              aria-label={`Cancel ${shipment.trackingNumber}`}
                            >
                              {busyId === shipment._id ? (
                                <RefreshCw size={16} className="animate-spin" />
                              ) : (
                                <XCircle size={16} />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={(event) => {
              if (event.target === event.currentTarget) setSelected(null);
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="shipment-detail-title"
              className="max-h-[90vh] w-full max-w-xl overflow-y-auto bg-white"
            >
              <header className="flex items-start justify-between border-b border-gray-200 p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Shipment details
                  </p>
                  <h2
                    id="shipment-detail-title"
                    className="mt-1 text-xl font-bold"
                  >
                    {selected.trackingNumber}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="p-2 hover:bg-gray-100"
                  aria-label="Close details"
                >
                  <X size={20} />
                </button>
              </header>

              <div className="space-y-5 p-5">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase text-gray-500">
                    Delivery status
                  </p>
                  <span
                    className={`inline-flex px-3 py-1.5 text-sm font-semibold ${statusClass(selected.status)}`}
                  >
                    {statusLabel(selected.status)}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="border border-gray-200 p-3">
                    <p className="text-xs text-gray-500">Recipient</p>
                    <p className="mt-1 font-semibold">{selected.receiverName}</p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={14} /> {selected.receiverPhone || "—"}
                    </p>
                  </div>
                  <div className="border border-gray-200 p-3">
                    <p className="text-xs text-gray-500">Destination</p>
                    <p className="mt-1 font-semibold">
                      {selected.receiverCity || "—"}
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                      {selected.receiverAddress || "No address provided"}
                    </p>
                  </div>
                  <div className="border border-gray-200 p-3">
                    <p className="text-xs text-gray-500">Payment method</p>
                    <p className="mt-1 font-semibold">
                      {selected.paymentMethod || "—"}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {selected.paymentStatus || "Status not provided"}
                    </p>
                  </div>
                  <div className="border border-gray-200 p-3">
                    <p className="text-xs text-gray-500">Shipment date</p>
                    <p className="mt-1 flex items-center gap-2 font-semibold">
                      <CalendarDays size={15} />
                      {formatDate(selected.createdAt)}
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                      <Wallet size={15} />
                      {formatMoney(selected.codAmount ?? selected.shippingFee)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-gray-500">
                    Parcel description
                  </p>
                  <p className="mt-1 text-sm">
                    {selected.description || "No description provided"}
                  </p>
                </div>

                <Link
                  href={`/track?trackingNumber=${encodeURIComponent(selected.trackingNumber)}`}
                  className="inline-flex w-full items-center justify-center border border-gray-300 px-4 py-3 text-sm font-semibold hover:bg-gray-50"
                >
                  Open tracking page
                </Link>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
