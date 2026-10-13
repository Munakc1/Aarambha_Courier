
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Eye,
  Package,
  RotateCcw,
  Search,
  X,
  XCircle,
} from "lucide-react";
import type { ReactNode } from "react";

type ReturnStatus =
  | "Requested"
  | "Approved"
  | "Rejected"
  | "In Transit"
  | "Completed";

type ReturnRequest = {
  id: string;
  orderId: string;
  shipmentId: string;
  customer: string;
  product: string;
  reason: string;
  date: string;
  amount: number;
  status: ReturnStatus;
};

const initialReturns: ReturnRequest[] = [
  {
    id: "RET-1001",
    orderId: "ORD-501",
    shipmentId: "SHP-2001",
    customer: "Ram Sharma",
    product: "Cotton T-Shirt",
    reason: "Wrong item received",
    date: "2026-10-13",
    amount: 1200,
    status: "Requested",
  },
  {
    id: "RET-1002",
    orderId: "ORD-502",
    shipmentId: "SHP-2002",
    customer: "Sita Karki",
    product: "Running Shoes",
    reason: "Size does not fit",
    date: "2026-10-12",
    amount: 2800,
    status: "Approved",
  },
  {
    id: "RET-1003",
    orderId: "ORD-503",
    shipmentId: "SHP-2003",
    customer: "Hari Thapa",
    product: "Backpack",
    reason: "Product damaged",
    date: "2026-10-11",
    amount: 1900,
    status: "In Transit",
  },
  {
    id: "RET-1004",
    orderId: "ORD-504",
    shipmentId: "SHP-2004",
    customer: "Maya Rai",
    product: "Wireless Headphones",
    reason: "Changed mind",
    date: "2026-10-10",
    amount: 3500,
    status: "Completed",
  },
  {
    id: "RET-1005",
    orderId: "ORD-505",
    shipmentId: "SHP-2005",
    customer: "Anil Gurung",
    product: "Wrist Watch",
    reason: "Product not as described",
    date: "2026-10-09",
    amount: 2200,
    status: "Rejected",
  },
];

const statusStyles: Record<ReturnStatus, string> = {
  Requested: "border-yellow-500/20 bg-yellow-500/10 text-yellow-500",
  Approved: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  Rejected: "border-red-500/20 bg-red-500/10 text-red-400",
  "In Transit": "border-orange-500/20 bg-orange-500/10 text-orange-400",
  Completed: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
};

const money = (amount: number) =>
  new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 2,
  }).format(amount);

export default function ReturnsPage() {
  const [returns, setReturns] =
    useState<ReturnRequest[]>(initialReturns);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<ReturnRequest | null>(null);
  const [notice, setNotice] = useState("");

  const filteredReturns = useMemo(() => {
    return returns.filter((item) => {
      const query = search.toLowerCase();

      const matchesSearch = [
        item.id,
        item.orderId,
        item.shipmentId,
        item.customer,
        item.product,
        item.reason,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [returns, search, statusFilter]);

  const requestedCount = returns.filter(
    (item) => item.status === "Requested",
  ).length;

  const approvedCount = returns.filter(
    (item) => item.status === "Approved",
  ).length;

  const inTransitCount = returns.filter(
    (item) => item.status === "In Transit",
  ).length;

  const completedCount = returns.filter(
    (item) => item.status === "Completed",
  ).length;

  const requestedValue = returns
    .filter((item) => item.status === "Requested")
    .reduce((sum, item) => sum + item.amount, 0);

  function updateStatus(id: string, status: ReturnStatus) {
    setReturns((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item)),
    );

    setSelected((current) =>
      current?.id === id ? { ...current, status } : current,
    );

    setNotice(`${id} has been updated to "${status}".`);
  }

  return (
    <main className="min-h-screen bg-app px-4 py-6 text-fg sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/vendor/shipments"
              className="mb-3 inline-flex items-center gap-2 text-sm text-muted transition hover:text-primary"
            >
              <ArrowLeft size={16} />
              Back to Shipments
            </Link>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Returns Management
            </h1>
            <p className="mt-2 text-sm text-muted">
              Review return requests and manage their status.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-hairline bg-panel px-4 py-3">
            <div className="rounded-lg border border-hairline bg-app p-2 text-primary">
              <RotateCcw size={20} />
            </div>
            <div>
              <p className="text-xs text-muted">Total Requests</p>
              <p className="text-lg font-bold">{returns.length}</p>
            </div>
          </div>
        </header>

        {notice && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            <span>{notice}</span>
            <button onClick={() => setNotice("")} aria-label="Dismiss message">
              <X size={16} />
            </button>
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Requested"
            value={requestedCount}
            description="Waiting for review"
            icon={<Clock3 size={20} />}
          />
          <StatCard
            title="Approved"
            value={approvedCount}
            description="Approved for return"
            icon={<CheckCircle2 size={20} />}
          />
          <StatCard
            title="In Transit"
            value={inTransitCount}
            description="Return parcel moving"
            icon={<RotateCcw size={20} />}
          />
          <StatCard
            title="Completed"
            value={completedCount}
            description="Returns completed"
            icon={<Package size={20} />}
          />
        </section>

        <section className="card rounded-2xl p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">Pending Return Value</h2>
              <p className="mt-1 text-sm text-muted">
                Total value of requests waiting for review.
              </p>
            </div>
            <p className="text-2xl font-bold text-primary">
              {money(requestedValue)}
            </p>
          </div>
        </section>

        <section className="card overflow-hidden rounded-2xl">
          <div className="flex flex-col gap-4 border-b border-hairline p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold">Return Requests</h2>
              <p className="mt-1 text-sm text-muted">
                Search requests and review return details.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search returns..."
                  className="w-full rounded-xl border border-hairline bg-panel py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-muted focus:border-primary sm:w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-hairline bg-panel px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="All">All statuses</option>
                <option value="Requested">Requested</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="In Transit">In Transit</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-panel text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-5 py-4 font-medium">Return ID</th>
                  <th className="px-5 py-4 font-medium">Customer / Order</th>
                  <th className="px-5 py-4 font-medium">Product</th>
                  <th className="px-5 py-4 font-medium">Date</th>
                  <th className="px-5 py-4 font-medium">Amount</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 text-right font-medium">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-hairline">
                {filteredReturns.map((item) => (
                  <tr key={item.id} className="transition hover:bg-panel/60">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-primary">{item.id}</p>
                      <p className="mt-1 text-xs text-muted">
                        {item.shipmentId}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium">{item.customer}</p>
                      <p className="mt-1 text-xs text-muted">{item.orderId}</p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium">{item.product}</p>
                      <p className="mt-1 text-xs text-muted">{item.reason}</p>
                    </td>

                    <td className="px-5 py-4">{item.date}</td>

                    <td className="px-5 py-4 font-semibold">
                      {money(item.amount)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[item.status]}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelected(item)}
                        className="inline-flex items-center gap-2 rounded-lg border border-hairline px-3 py-2 text-xs font-medium transition hover:border-primary hover:text-primary"
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredReturns.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-muted">
                      No return requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-hairline px-5 py-4 text-sm text-muted">
            Showing {filteredReturns.length} of {returns.length} return requests
          </div>
        </section>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-hairline bg-app p-5 shadow-2xl sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Return Details</h2>
                <p className="mt-1 text-sm text-primary">{selected.id}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="Close dialog"
                className="rounded-lg p-2 text-muted transition hover:bg-panel hover:text-fg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <Detail label="Customer" value={selected.customer} />
              <Detail label="Order ID" value={selected.orderId} />
              <Detail label="Shipment ID" value={selected.shipmentId} />
              <Detail label="Product" value={selected.product} />
              <Detail label="Return Reason" value={selected.reason} />
              <Detail label="Request Date" value={selected.date} />
              <Detail label="Return Amount" value={money(selected.amount)} />

              <div className="flex items-center justify-between gap-4 border-b border-hairline pb-3">
                <span className="text-sm text-muted">Current Status</span>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[selected.status]}`}
                >
                  {selected.status}
                </span>
              </div>

              {selected.status === "Requested" && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => updateStatus(selected.id, "Approved")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-dark-1 transition hover:opacity-90"
                  >
                    <CheckCircle2 size={17} />
                    Approve Return
                  </button>

                  <button
                    onClick={() => updateStatus(selected.id, "Rejected")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
                  >
                    <XCircle size={17} />
                    Reject Return
                  </button>
                </div>
              )}

              {selected.status === "Approved" && (
                <button
                  onClick={() => updateStatus(selected.id, "In Transit")}
                  className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-dark-1 transition hover:opacity-90"
                >
                  Mark as In Transit
                </button>
              )}

              {selected.status === "In Transit" && (
                <button
                  onClick={() => updateStatus(selected.id, "Completed")}
                  className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-dark-1 transition hover:opacity-90"
                >
                  Mark as Completed
                </button>
              )}

              {(selected.status === "Completed" ||
                selected.status === "Rejected") && (
                <div
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm ${
                    selected.status === "Completed"
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                      : "border-red-500/20 bg-red-500/10 text-red-400"
                  }`}
                >
                  {selected.status === "Completed" ? (
                    <CheckCircle2 size={17} />
                  ) : (
                    <XCircle size={17} />
                  )}
                  Return {selected.status.toLowerCase()}.
                </div>
              )}

              <p className="text-xs leading-5 text-muted">
                Status changes currently affect only this page's demo state.
                Connect the actions to your backend to persist return decisions.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: ReactNode;
}) {
  return (
    <div className="card rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{title}</p>
          <p className="mt-3 text-3xl font-bold">{value}</p>
          <p className="mt-2 text-xs text-muted">{description}</p>
        </div>
        <div className="rounded-xl border border-hairline bg-panel p-3 text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-hairline pb-3">
      <span className="text-sm text-muted">{label}</span>
      <span className="max-w-[65%] break-words text-right text-sm font-medium">
        {value}
      </span>
    </div>
  );
}
