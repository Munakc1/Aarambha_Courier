
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  Building2,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Download,
  FileText,
  LifeBuoy,
  LoaderCircle,
  Package,
  PackageCheck,
  Pencil,
  RefreshCw,
  Search,
  Smartphone,
  Truck,
  Wallet,
  X,
  XCircle,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

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
  codAmount?: number;
  totalAmount?: number;
  amount?: number;
  deliveryCharge?: number;
  shippingCharge?: number;
  charge?: number;
  payoutStatus?: string;
  paymentStatus?: string;
  createdAt?: string;
  deliveredAt?: string;
  updatedAt?: string;
};

type Payout = {
  _id?: string;
  id?: string;
  reference?: string;
  payoutId?: string;
  settlementId?: string;
  amount?: number;
  netAmount?: number;
  method?: string;
  status?: string;
  parcels?: number;
  paidAt?: string;
  createdAt?: string;
};

type PayoutAccount = {
  method?: string;
  accountName?: string;
  bankName?: string;
  accountNumber?: string;
  walletNumber?: string;
  branch?: string;
};

type Bucket = "PAYABLE" | "COLLECTING" | "NONE";
type Tab = "ALL" | Bucket;

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const ENDPOINTS = {
  shipments: "/api/vendor/shipments",
  payouts: "/api/vendor/payments",
  account: "/api/vendor/payout-account",
};

const ACCOUNT_SETTINGS_HREF = "/vendor/dashboard/settings";
const PAGE_SIZE = 8;

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function num(value: unknown): number {
  if (value === null || value === undefined || value === "") return 0;

  const result = Number(value);
  return Number.isFinite(result) ? result : 0;
}

function normalize(value?: string): string {
  return (value || "PENDING").trim().toUpperCase().replace(/[\s-]+/g, "_");
}

function pretty(value?: string): string {
  return normalize(value)
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

function trackingOf(shipment: Shipment): string {
  return (
    shipment.trackingNumber ||
    shipment.trackingId ||
    shipment.shipmentId ||
    shipment._id ||
    shipment.id ||
    "—"
  );
}

function recipientOf(shipment: Shipment): string {
  return (
    shipment.recipientName ||
    shipment.receiverName ||
    shipment.customerName ||
    "Customer"
  );
}

/**
 * IMPORTANT:
 * codAmount must represent the COD collected from the customer.
 * The other fields are compatibility fallbacks; change this if your backend
 * uses totalAmount or amount for something other than COD.
 */
function codOf(shipment: Shipment): number {
  return num(shipment.codAmount ?? shipment.totalAmount ?? shipment.amount);
}

function chargeOf(shipment: Shipment): number {
  return num(
    shipment.deliveryCharge ??
      shipment.shippingCharge ??
      shipment.charge,
  );
}

function netOf(shipment: Shipment): number {
  return codOf(shipment) - chargeOf(shipment);
}

function dateOf(shipment: Shipment): string | undefined {
  return shipment.deliveredAt || shipment.updatedAt || shipment.createdAt;
}

function bucketOf(shipment: Shipment): Bucket {
  const status = normalize(shipment.status);

  if (status === "DELIVERED") return "PAYABLE";

  if (
    [
      "CANCELLED",
      "CANCELED",
      "RETURNED",
      "RETURN_TO_SENDER",
      "FAILED",
    ].includes(status)
  ) {
    return "NONE";
  }

  return "COLLECTING";
}

const PAID_STATUSES = ["PAID", "SETTLED", "COMPLETED", "SUCCESS"];

function isPaidOut(shipment: Shipment): boolean {
  // Check each field independently so PENDING in one field cannot override PAID.
  return [shipment.payoutStatus, shipment.paymentStatus].some((status) =>
    PAID_STATUSES.includes(normalize(status)),
  );
}

function isConfirmedPayout(payout: Payout): boolean {
  return PAID_STATUSES.includes(normalize(payout.status));
}

function npr(value: number): string {
  return new Intl.NumberFormat("en-NP", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value?: string): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function parseList<T>(result: unknown, keys: string[]): T[] {
  if (Array.isArray(result)) return result as T[];
  if (!result || typeof result !== "object") return [];

  const record = result as Record<string, unknown>;

  for (const key of keys) {
    if (Array.isArray(record[key])) return record[key] as T[];
  }

  for (const key of ["data", "result"]) {
    const nested = record[key];
    if (nested && typeof nested === "object") {
      const parsed = parseList<T>(nested, keys);
      if (parsed.length > 0) return parsed;
    }
  }

  return [];
}

async function getJson(path: string): Promise<unknown> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error("Your session may have expired. Please sign in again.");
  }

  if (!response.ok) {
    throw new Error(`Request failed (HTTP ${response.status}).`);
  }

  return response.json();
}

function parseAccount(result: unknown): PayoutAccount | null {
  if (!result || typeof result !== "object") return null;

  const record = result as Record<string, unknown>;

  // Support common API response wrappers.
  const candidate =
    record.account ??
    record.payoutAccount ??
    record.data ??
    record.result ??
    result;

  if (!candidate || typeof candidate !== "object") return null;

  const account = candidate as PayoutAccount;

  const hasDetails = [
    account.method,
    account.accountName,
    account.bankName,
    account.accountNumber,
    account.walletNumber,
    account.branch,
  ].some((value) => typeof value === "string" && value.trim().length > 0);

  return hasDetails ? account : null;
}

function maskNumber(value?: string): string {
  if (!value) return "—";

  const normalized = value.replace(/\s+/g, "");
  if (normalized.length <= 4) return normalized;

  return `${"•".repeat(Math.min(normalized.length - 4, 8))}${normalized.slice(-4)}`;
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function VendorPaymentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [account, setAccount] = useState<PayoutAccount | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [secondaryError, setSecondaryError] = useState("");

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("ALL");
  const [page, setPage] = useState(1);
  const [copied, setCopied] = useState("");
  const [showAccount, setShowAccount] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    setError("");
    setSecondaryError("");

    try {
      const [shipmentResult, payoutResult, accountResult] =
        await Promise.allSettled([
          getJson(ENDPOINTS.shipments),
          getJson(ENDPOINTS.payouts),
          getJson(ENDPOINTS.account),
        ]);

      if (shipmentResult.status === "fulfilled") {
        setShipments(
          parseList<Shipment>(shipmentResult.value, [
            "shipments",
            "results",
          ]),
        );
      } else {
        setError(
          shipmentResult.reason instanceof Error
            ? shipmentResult.reason.message
            : "Unable to load shipment records.",
        );
      }

      if (payoutResult.status === "fulfilled") {
        setPayouts(
          parseList<Payout>(payoutResult.value, [
            "payments",
            "payouts",
            "settlements",
            "results",
          ]),
        );
      } else {
        setPayouts([]);
        setSecondaryError(
          "Payout history could not be loaded. Shipment totals may still be available.",
        );
      }

      if (accountResult.status === "fulfilled") {
        setAccount(parseAccount(accountResult.value));
      } else {
        setAccount(null);
        setSecondaryError((current) =>
          current
            ? `${current} Payout account details are also unavailable.`
            : "Payout account details could not be loaded.",
        );
      }

      setPage(1);
    } catch {
      setError("Something went wrong while loading payment information.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  /* Financial summary */

  const money = useMemo(() => {
    let codDelivered = 0;
    let deliveryCharges = 0;
    let paidOut = 0;
    let collecting = 0;
    let deliveredCount = 0;
    let collectingCount = 0;
    let invalidNetCount = 0;

    for (const shipment of shipments) {
      const bucket = bucketOf(shipment);

      if (bucket === "PAYABLE") {
        const cod = codOf(shipment);
        const charge = chargeOf(shipment);
        const net = cod - charge;

        deliveredCount += 1;
        codDelivered += cod;
        deliveryCharges += charge;

        if (net < 0) invalidNetCount += 1;

        // Shipment-level payout statuses are used for this estimate.
        if (isPaidOut(shipment)) paidOut += net;
      } else if (bucket === "COLLECTING") {
        collectingCount += 1;
        collecting += codOf(shipment);
      }
    }

    const earnedNet = codDelivered - deliveryCharges;

    return {
      codDelivered,
      deliveryCharges,
      earnedNet,
      paidOut,
      unpaidBalance: earnedNet - paidOut,
      collecting,
      deliveredCount,
      collectingCount,
      invalidNetCount,
    };
  }, [shipments]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return shipments.filter((shipment) => {
      if (tab !== "ALL" && bucketOf(shipment) !== tab) return false;
      if (!query) return true;

      const searchable = [
        trackingOf(shipment),
        recipientOf(shipment),
        shipment.status,
        shipment.paymentStatus,
        shipment.payoutStatus,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [shipments, search, tab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "ALL", label: "All parcels", count: shipments.length },
    { key: "PAYABLE", label: "Delivered", count: money.deliveredCount },
    {
      key: "COLLECTING",
      label: "In transit / processing",
      count: money.collectingCount,
    },
    {
      key: "NONE",
      label: "Cancelled / returned",
      count: shipments.filter((s) => bucketOf(s) === "NONE").length,
    },
  ];

  /* Actions */

  async function copyText(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      window.setTimeout(() => setCopied(""), 1800);
    } catch {
      setError("Could not copy the value. Please copy it manually.");
    }
  }

  function exportCsv() {
    const columns = [
      "Tracking ID",
      "Recipient",
      "Shipment Status",
      "Payment Status",
      "COD NPR",
      "Delivery Charge NPR",
      "Estimated Net NPR",
      "Payout Status",
      "Date",
    ];

    const escapeCsv = (value: unknown) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = filtered.map((shipment) => [
      trackingOf(shipment),
      recipientOf(shipment),
      pretty(shipment.status),
      pretty(shipment.paymentStatus),
      codOf(shipment),
      chargeOf(shipment),
      bucketOf(shipment) === "NONE" ? "" : netOf(shipment),
      pretty(shipment.payoutStatus),
      formatDate(dateOf(shipment)),
    ]);

    const csv = [columns, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "aarambha-cod-payments.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const focus =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C99200] focus-visible:ring-offset-2";

  return (
    <main className="min-h-screen bg-[#FEF8EB] text-[#0A0E12]">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header */}
        <header className="flex flex-col justify-between gap-5 border-b border-[#E5E0D5] pb-6 md:flex-row md:items-end">
          <div>
            <Link
              href="/vendor/dashboard"
              className={`inline-flex items-center gap-2 text-sm font-medium text-[#77756E] hover:text-[#0A0E12] ${focus}`}
            >
              <ArrowLeft size={15} />
              Vendor dashboard
            </Link>

            <div className="mt-5 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#FBB501] text-[#0A0E12]">
                <Wallet size={24} />
              </span>
              <div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Payments
                </h1>
                <p className="mt-1 text-sm text-[#77756E]">
                  COD collections, deductions and vendor settlements.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void load(true)}
              disabled={loading || refreshing}
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#E5E0D5] bg-white px-4 text-sm font-semibold transition hover:bg-[#FFFCF5] disabled:opacity-50 ${focus}`}
            >
              <RefreshCw
                size={15}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing…" : "Refresh"}
            </button>

            <button
              type="button"
              onClick={exportCsv}
              disabled={loading || filtered.length === 0}
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#FBB501] px-4 text-sm font-bold transition hover:bg-[#FAA212] disabled:cursor-not-allowed disabled:opacity-50 ${focus}`}
            >
              <Download size={15} />
              Export CSV
            </button>
          </div>
        </header>

        {/* Errors */}
        {error && (
          <div
            role="alert"
            className="mt-5 flex items-start justify-between gap-3 border border-[#E6C1B8] bg-[#FFF0EC] p-4 text-sm text-[#873624]"
          >
            <div className="flex gap-3">
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Unable to load shipment payments</p>
                <p className="mt-1">{error}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
              className="p-1 hover:bg-[#FBE1DA]"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {secondaryError && (
          <div
            role="status"
            className="mt-4 flex items-start gap-3 border border-[#E5D5A6] bg-[#FFF8E2] p-3 text-sm text-[#715500]"
          >
            <AlertTriangle size={17} className="mt-0.5 shrink-0" />
            <p>{secondaryError}</p>
          </div>
        )}

        {/* Main financial summary */}
        <section
          aria-label="COD financial summary"
          className="mt-7 grid gap-4 xl:grid-cols-[1.5fr_1fr]"
        >
          <div className="overflow-hidden rounded-xl bg-[#0A0E12] text-white">
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[#CFC9BB]">
                    Estimated unpaid COD balance
                  </p>
                  <p className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                    <span className="mr-2 text-2xl text-[#FBB501]">Rs.</span>
                    {loading ? "—" : npr(money.unpaidBalance)}
                  </p>
                </div>
                <span className="grid h-14 w-14 place-items-center rounded-xl bg-[#FBB501] text-[#0A0E12]">
                  <Banknote size={28} />
                </span>
              </div>

              <p className="mt-4 max-w-xl text-xs leading-5 text-[#A9A395]">
                Estimate from delivered shipment amounts, charges and
                shipment-level payout statuses. Confirm final settlement
                amounts against Aarambha&apos;s authoritative payment records.
              </p>

              {!loading && money.unpaidBalance < 0 && (
                <div className="mt-4 flex items-start gap-2 border border-[#FAA212]/30 bg-[#FAA212]/10 p-3 text-xs text-[#FFD98A]">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  <p>
                    Recorded payouts exceed the estimated net amount. Review
                    settlement records and adjustments before taking further
                    action.
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 border-t border-white/10 bg-[#11161B] sm:grid-cols-4">
              <DarkFigure
                label="Delivered COD"
                value={money.codDelivered}
                loading={loading}
              />
              <DarkFigure
                label="Delivery charges"
                value={money.deliveryCharges}
                loading={loading}
                minus
              />
              <DarkFigure
                label="Recorded payouts"
                value={money.paidOut}
                loading={loading}
              />
              <DarkFigure
                label="COD in network"
                value={money.collecting}
                loading={loading}
              />
            </div>
          </div>

          {/* Payout account */}
          <div className="flex min-w-0 flex-col rounded-xl border border-[#E5E0D5] bg-white p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A6500]">
                  Settlement destination
                </p>
                <h2 className="mt-2 text-lg font-bold">Payout account</h2>
                <p className="mt-1 text-sm text-[#77756E]">
                  Your saved bank or supported wallet details.
                </p>
              </div>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#FFF3CC] text-[#8A6500]">
                {account?.bankName || normalize(account?.method) === "BANK" ? (
                  <Building2 size={20} />
                ) : (
                  <Smartphone size={20} />
                )}
              </span>
            </div>

            {loading ? (
              <div className="flex flex-1 items-center justify-center py-10">
                <LoaderCircle
                  size={22}
                  className="animate-spin text-[#C99200]"
                />
              </div>
            ) : account ? (
              <div className="mt-5 flex flex-1 flex-col">
                <div className="border-y border-[#EEE9DF] py-4">
                  <p className="text-xs text-[#77756E]">Account holder</p>
                  <p className="mt-1 break-words text-sm font-semibold">
                    {account.accountName || "Not specified"}
                  </p>

                  <p className="mt-4 text-xs text-[#77756E]">
                    Payment provider
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {account.bankName ||
                      (account.method ? pretty(account.method) : "Not specified")}
                  </p>

                  {account.branch && (
                    <>
                      <p className="mt-4 text-xs text-[#77756E]">Branch</p>
                      <p className="mt-1 text-sm">{account.branch}</p>
                    </>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-[#77756E]">
                      Account / wallet number
                    </p>
                    <p className="mt-1 break-all font-mono text-sm font-semibold">
                      {showAccount
                        ? account.accountNumber || account.walletNumber || "—"
                        : maskNumber(account.accountNumber || account.walletNumber)}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => setShowAccount((value) => !value)}
                      className="rounded-lg border border-[#E5E0D5] px-3 py-2 text-xs font-semibold hover:bg-[#FFFCF5]"
                    >
                      {showAccount ? "Hide" : "View"}
                    </button>
                    {(account.accountNumber || account.walletNumber) && (
                      <CopyButton
                        value={(account.accountNumber || account.walletNumber)!}
                        copied={copied === (account.accountNumber || account.walletNumber)}
                        onCopy={copyText}
                      />
                    )}
                  </div>
                </div>

                <Link
                  href={ACCOUNT_SETTINGS_HREF}
                  className={`mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#E5E0D5] px-4 text-sm font-semibold hover:border-[#FBB501] hover:bg-[#FFFCF5] ${focus}`}
                >
                  <Pencil size={15} />
                  Manage payout details
                </Link>
              </div>
            ) : (
              <div className="mt-5 flex flex-1 flex-col items-start justify-center border border-dashed border-[#E0D8C3] bg-[#FFFCF5] p-5">
                <p className="text-sm font-semibold">No payout account available</p>
                <p className="mt-2 text-sm leading-6 text-[#77756E]">
                  If you have not added a payout account, visit settings to
                  check the available options.
                </p>
                <Link
                  href={ACCOUNT_SETTINGS_HREF}
                  className={`mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#FBB501] px-4 text-sm font-bold hover:bg-[#FAA212] ${focus}`}
                >
                  Add payout account
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Summary cards */}
        <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Delivered parcels"
            value={loading ? "—" : String(money.deliveredCount)}
            detail="Delivered shipment records"
            icon={<PackageCheck size={19} />}
          />
          <SummaryCard
            label="Awaiting delivery"
            value={loading ? "—" : String(money.collectingCount)}
            detail={`COD in network: Rs. ${npr(money.collecting)}`}
            icon={<Truck size={19} />}
          />
          <SummaryCard
            label="Net after charges"
            value={loading ? "—" : `Rs. ${npr(money.earnedNet)}`}
            detail="Delivered COD less recorded charges"
            icon={<Wallet size={19} />}
          />
          <SummaryCard
            label="Payout records"
            value={loading ? "—" : String(payouts.length)}
            detail="Transactions returned by the payout API"
            icon={<FileText size={19} />}
          />
        </section>

        {!loading && money.invalidNetCount > 0 && (
          <div className="mt-4 flex gap-3 border border-[#E5D5A6] bg-[#FFF8E2] p-4 text-sm text-[#715500]">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <p>
              {money.invalidNetCount} delivered shipment(s) have charges greater
              than their COD amount. Check these records before finalizing
              settlements.
            </p>
          </div>
        )}

        {/* COD table */}
        <section className="mt-9">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A6500]">
                Shipment reconciliation
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight">
                COD by parcel
              </h2>
              <p className="mt-1 text-sm text-[#77756E]">
                Review delivery status, charges and estimated net amounts.
              </p>
            </div>
            <p className="text-xs text-[#77756E]">
              {loading ? "Loading records…" : `${filtered.length} matching parcels`}
            </p>
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border border-[#E5E0D5] bg-white">
            <div className="flex gap-1 overflow-x-auto border-b border-[#EEE9DF] px-3 pt-3">
              {tabs.map((item) => {
                const active = tab === item.key;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setTab(item.key);
                      setPage(1);
                    }}
                    aria-pressed={active}
                    className={`flex shrink-0 items-center gap-2 border-b-2 px-3 pb-3 pt-2 text-sm transition ${
                      active
                        ? "border-[#FBB501] font-bold text-[#0A0E12]"
                        : "border-transparent text-[#77756E] hover:text-[#0A0E12]"
                    }`}
                  >
                    {item.label}
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs tabular-nums ${
                        active
                          ? "bg-[#FBB501] text-[#0A0E12]"
                          : "bg-[#F3EFE6] text-[#77756E]"
                      }`}
                    >
                      {loading ? "—" : item.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77756E]"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search tracking ID, customer or status"
                  aria-label="Search payments"
                  className="h-11 w-full rounded-lg border border-[#E5E0D5] bg-[#FFFCF5] pl-10 pr-4 text-sm outline-none transition placeholder:text-[#A29B8D] focus:border-[#C99200] focus:ring-2 focus:ring-[#FBB501]/20"
                />
              </div>

              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="inline-flex items-center gap-1 self-start text-xs font-semibold text-[#77756E] hover:text-[#0A0E12] sm:self-auto"
                >
                  <X size={14} />
                  Clear search
                </button>
              )}
            </div>

            {loading ? (
              <LoadingState label="Loading your shipments" />
            ) : error ? (
              <div className="px-5 py-16 text-center">
                <AlertTriangle size={25} className="mx-auto text-[#9A3926]" />
                <p className="mt-3 text-sm font-semibold">
                  Shipment records could not be loaded
                </p>
                <button
                  type="button"
                  onClick={() => void load(true)}
                  className="mt-4 rounded-lg bg-[#FBB501] px-4 py-2.5 text-sm font-bold hover:bg-[#FAA212]"
                >
                  Try again
                </button>
              </div>
            ) : visible.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[#FFF3CC] text-[#8A6500]">
                  <Package size={23} />
                </span>
                <p className="mt-4 text-sm font-bold">No parcels found</p>
                <p className="mt-1 text-sm text-[#77756E]">
                  {shipments.length === 0
                    ? "Shipment records will appear here when available."
                    : "Try a different tab or search term."}
                </p>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-y border-[#EEE9DF] bg-[#FAF7EF] text-xs text-[#77756E]">
                        <th className="px-5 py-4 font-semibold">Tracking</th>
                        <th className="px-4 py-4 font-semibold">Recipient</th>
                        <th className="px-4 py-4 font-semibold">Status</th>
                        <th className="whitespace-nowrap px-4 py-4 text-right font-semibold">COD amount</th>
                        <th className="whitespace-nowrap px-4 py-4 text-right font-semibold">Delivery charge</th>
                        <th className="whitespace-nowrap px-4 py-4 text-right font-semibold">Estimated net</th>
                        <th className="whitespace-nowrap px-5 py-4 font-semibold">Date</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#F1EDE3]">
                      {visible.map((shipment, index) => {
                        const tracking = trackingOf(shipment);
                        const bucket = bucketOf(shipment);
                        const key =
                          shipment._id || shipment.id || `${tracking}-${index}`;

                        return (
                          <tr key={key} className="transition hover:bg-[#FFFCF5]">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1">
                                <Link
                                  href={`/track?tracking=${encodeURIComponent(tracking)}`}
                                  className="font-mono text-xs font-bold underline-offset-4 hover:underline"
                                >
                                  {tracking}
                                </Link>
                                <CopyButton
                                  value={tracking}
                                  copied={copied === tracking}
                                  onCopy={copyText}
                                />
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <p className="text-sm font-semibold">{recipientOf(shipment)}</p>
                            </td>
                            <td className="px-4 py-4">
                              <PayBadge shipment={shipment} />
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-right text-sm tabular-nums">
                              Rs. {npr(codOf(shipment))}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-right text-sm tabular-nums text-[#9A3926]">
                              {chargeOf(shipment) > 0
                                ? `− Rs. ${npr(chargeOf(shipment))}`
                                : "—"}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-bold tabular-nums">
                              {bucket === "NONE" ? "—" : `Rs. ${npr(netOf(shipment))}`}
                            </td>
                            <td className="whitespace-nowrap px-5 py-4 text-xs text-[#77756E]">
                              {formatDate(dateOf(shipment))}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile records */}
                <ul className="divide-y divide-[#F1EDE3] md:hidden">
                  {visible.map((shipment, index) => {
                    const tracking = trackingOf(shipment);
                    const bucket = bucketOf(shipment);

                    return (
                      <li
                        key={shipment._id || shipment.id || `${tracking}-${index}`}
                        className="space-y-4 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1">
                              <Link
                                href={`/track?tracking=${encodeURIComponent(tracking)}`}
                                className="truncate font-mono text-sm font-bold"
                              >
                                {tracking}
                              </Link>
                              <CopyButton
                                value={tracking}
                                copied={copied === tracking}
                                onCopy={copyText}
                              />
                            </div>
                            <p className="mt-1 truncate text-xs text-[#77756E]">
                              {recipientOf(shipment)}
                            </p>
                          </div>
                          <PayBadge shipment={shipment} />
                        </div>

                        <dl className="grid grid-cols-3 gap-2 bg-[#FAF7EF] p-3">
                          <div>
                            <dt className="text-[11px] text-[#77756E]">COD</dt>
                            <dd className="mt-1 text-xs font-semibold tabular-nums">
                              Rs. {npr(codOf(shipment))}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-[11px] text-[#77756E]">Charge</dt>
                            <dd className="mt-1 text-xs font-semibold tabular-nums text-[#9A3926]">
                              {chargeOf(shipment) > 0
                                ? `Rs. ${npr(chargeOf(shipment))}`
                                : "—"}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-[11px] text-[#77756E]">Est. net</dt>
                            <dd className="mt-1 break-words text-xs font-bold tabular-nums">
                              {bucket === "NONE" ? "—" : `Rs. ${npr(netOf(shipment))}`}
                            </dd>
                          </div>
                        </dl>

                        <div className="flex items-center justify-between text-xs text-[#77756E]">
                          <span>{formatDate(dateOf(shipment))}</span>
                          <span>{pretty(shipment.status)}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {/* Pagination */}
                <div className="flex flex-col gap-3 border-t border-[#EEE9DF] bg-[#FFFCF5] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <p className="text-xs text-[#77756E]">
                    Showing{" "}
                    <span className="font-bold text-[#0A0E12]">
                      {(safePage - 1) * PAGE_SIZE + 1}–
                      {Math.min(safePage * PAGE_SIZE, filtered.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-[#0A0E12]">
                      {filtered.length}
                    </span>{" "}
                    parcels
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={safePage <= 1}
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                      className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#E5E0D5] bg-white px-3 text-xs font-semibold hover:bg-[#FAF7EF] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ArrowLeft size={13} />
                      Previous
                    </button>

                    <span className="min-w-16 text-center text-xs font-medium text-[#77756E]">
                      {safePage} / {totalPages}
                    </span>

                    <button
                      type="button"
                      disabled={safePage >= totalPages}
                      onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                      className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#E5E0D5] bg-white px-3 text-xs font-semibold hover:bg-[#FAF7EF] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Payout history */}
        <section className="mt-9">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A6500]">
              Settlement records
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">Payout history</h2>
            <p className="mt-1 text-sm text-[#77756E]">
              Transfers recorded by the Aarambha payments system.
            </p>
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border border-[#E5E0D5] bg-white">
            {loading ? (
              <LoadingState label="Loading payout records" />
            ) : payouts.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-[#FFF3CC] text-[#8A6500]">
                  <FileText size={21} />
                </span>
                <p className="mt-3 text-sm font-bold">
                  {secondaryError ? "Payout history unavailable" : "No payout records found"}
                </p>
                <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-[#77756E]">
                  {secondaryError
                    ? "We could not retrieve payout history. Refresh or try again later."
                    : "Transfers will appear here when the payout API returns settlement records."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#F1EDE3]">
                {payouts.map((payout, index) => {
                  const reference =
                    payout.reference ||
                    payout.payoutId ||
                    payout.settlementId ||
                    payout._id ||
                    payout.id ||
                    `Payout ${index + 1}`;

                  const confirmed = isConfirmedPayout(payout);
                  const failed = ["FAILED", "REJECTED", "CANCELLED", "CANCELED"].includes(
                    normalize(payout.status),
                  );

                  return (
                    <div
                      key={payout._id || payout.id || reference}
                      className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 transition hover:bg-[#FFFCF5] sm:px-5"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${
                            confirmed
                              ? "bg-[#E4F4E8] text-[#23693A]"
                              : failed
                                ? "bg-[#FFF0EC] text-[#9A3926]"
                                : "bg-[#FFF3CC] text-[#8A6500]"
                          }`}
                        >
                          {confirmed ? (
                            <CheckCircle2 size={19} />
                          ) : failed ? (
                            <XCircle size={19} />
                          ) : (
                            <Clock3 size={19} />
                          )}
                        </span>

                        <div className="min-w-0">
                          <p className="truncate font-mono text-sm font-bold">{reference}</p>
                          <p className="mt-1 text-xs text-[#77756E]">
                            {formatDate(payout.paidAt || payout.createdAt)}
                            {payout.method ? ` · ${payout.method}` : ""}
                            {payout.parcels != null ? ` · ${payout.parcels} parcels` : ""}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-bold tabular-nums">
                          Rs. {npr(num(payout.netAmount ?? payout.amount))}
                        </p>
                        <p
                          className={`mt-1 text-xs font-semibold ${
                            confirmed
                              ? "text-[#23693A]"
                              : failed
                                ? "text-[#9A3926]"
                                : "text-[#8A6500]"
                          }`}
                        >
                          {pretty(payout.status)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Help */}
        <section className="mt-8 pb-8">
          <Link
            href="/contact"
            className={`group flex items-start gap-4 rounded-xl border border-[#E5E0D5] bg-white p-5 transition hover:border-[#FBB501] hover:bg-[#FFFCF5] ${focus}`}
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#FFF3CC] text-[#8A6500]">
              <LifeBuoy size={19} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-3">
                <span className="text-sm font-bold">Need help with a settlement?</span>
                <ArrowUpRight
                  size={16}
                  className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
              <span className="mt-1 block text-sm leading-6 text-[#77756E]">
                Contact Aarambha support with the shipment tracking ID or payout
                reference so the team can investigate the transaction.
              </span>
            </span>
          </Link>
        </section>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* UI components                                                               */
/* -------------------------------------------------------------------------- */

function DarkFigure({
  label,
  value,
  loading,
  minus = false,
}: {
  label: string;
  value: number;
  loading: boolean;
  minus?: boolean;
}) {
  return (
    <div className="border-b border-r border-white/10 px-4 py-4 last:border-r-0 sm:px-5">
      <p className="text-xs leading-5 text-[#A9A395]">{label}</p>
      <p className="mt-1 break-words text-sm font-bold tabular-nums sm:text-base">
        {loading
          ? "—"
          : `${minus && value > 0 ? "− " : ""}Rs. ${npr(value)}`}
      </p>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
}) {
  return (
    <div className="border border-[#E5E0D5] bg-white p-5 transition hover:border-[#D8CDAF]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[#77756E]">{label}</p>
        <span className="grid h-9 w-9 shrink-0 place-items-center bg-[#FFF3CC] text-[#8A6500]">
          {icon}
        </span>
      </div>
      <p className="mt-5 break-words text-2xl font-bold tracking-tight">{value}</p>
      <p className="mt-2 text-xs leading-5 text-[#77756E]">{detail}</p>
    </div>
  );
}

function PayBadge({ shipment }: { shipment: Shipment }) {
  const bucket = bucketOf(shipment);

  let label = "Awaiting delivery";
  let className = "border-[#E5E0D5] bg-[#F3EFE6] text-[#5E5848]";
  let icon = <Truck size={12} />;

  if (bucket === "PAYABLE") {
    if (isPaidOut(shipment)) {
      label = "Paid out";
      className = "border-[#B7DCC0] bg-[#E4F4E8] text-[#23693A]";
      icon = <CheckCircle2 size={12} />;
    } else {
      label = "Delivered";
      className = "border-[#E5D5A6] bg-[#FFF3CC] text-[#7A5800]";
      icon = <Clock3 size={12} />;
    }
  } else if (bucket === "NONE") {
    label = pretty(shipment.status);
    className = "border-[#E5E0D5] bg-[#F3EFE6] text-[#77756E]";
    icon = <XCircle size={12} />;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap border px-2.5 py-1 text-[11px] font-semibold ${className}`}
    >
      {icon}
      {label}
    </span>
  );
}

function CopyButton({
  value,
  copied,
  onCopy,
}: {
  value: string;
  copied: boolean;
  onCopy: (value: string) => void;
}) {
  return (
    <button
      type="button"
      title="Copy value"
      aria-label={`Copy ${value}`}
      onClick={() => void onCopy(value)}
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

function LoadingState({ label }: { label: string }) {
  return (
    <div className="px-5 py-16 text-center">
      <LoaderCircle size={25} className="mx-auto animate-spin text-[#C99200]" />
      <p className="mt-4 text-sm font-medium">{label}</p>
      <p className="mt-1 text-xs text-[#77756E]">
        Retrieving available records…
      </p>
    </div>
  );
}
