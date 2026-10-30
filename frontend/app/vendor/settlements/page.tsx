
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowLeftRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  Search,
  Wallet,
  X,
} from "lucide-react";
import type { ReactNode } from "react";

type SettlementStatus = "Pending" | "Processing" | "Paid";

type Settlement = {
  id: string;
  period: string;
  date: string;
  shipments: number;
  grossAmount: number;
  fees: number;
  adjustments: number;
  status: SettlementStatus;
  method: string;
  reference: string;
};

const initialSettlements: Settlement[] = [
  {
    id: "STL-1001",
    period: "Oct 06 - Oct 12, 2026",
    date: "2026-10-13",
    shipments: 24,
    grossAmount: 28500,
    fees: 1800,
    adjustments: 0,
    status: "Paid",
    method: "Bank Transfer",
    reference: "TRX-784210",
  },
  {
    id: "STL-1002",
    period: "Sep 29 - Oct 05, 2026",
    date: "2026-10-06",
    shipments: 18,
    grossAmount: 19200,
    fees: 1250,
    adjustments: -200,
    status: "Processing",
    method: "Bank Transfer",
    reference: "TRX-784211",
  },
  {
    id: "STL-1003",
    period: "Sep 22 - Sep 28, 2026",
    date: "2026-09-29",
    shipments: 31,
    grossAmount: 36400,
    fees: 2400,
    adjustments: 0,
    status: "Pending",
    method: "Bank Transfer",
    reference: "Not assigned",
  },
  {
    id: "STL-1004",
    period: "Sep 15 - Sep 21, 2026",
    date: "2026-09-22",
    shipments: 15,
    grossAmount: 15700,
    fees: 950,
    adjustments: 150,
    status: "Paid",
    method: "Bank Transfer",
    reference: "TRX-784189",
  },
];

const statusStyles: Record<SettlementStatus, string> = {
  Pending: "border-yellow-500/20 bg-yellow-500/10 text-yellow-500",
  Processing: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  Paid: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
};

const money = (amount: number) =>
  new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 2,
  }).format(amount);

const netAmount = (item: Settlement) =>
  item.grossAmount - item.fees + item.adjustments;

export default function SettlementsPage() {
  const [settlements, setSettlements] =
    useState<Settlement[]>(initialSettlements);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<Settlement | null>(null);
  const [notice, setNotice] = useState("");

  const filteredSettlements = useMemo(() => {
    return settlements.filter((item) => {
      const query = search.toLowerCase();

      const matchesSearch = [
        item.id,
        item.period,
        item.reference,
        item.method,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [settlements, search, statusFilter]);

  const totalSettled = settlements
    .filter((item) => item.status === "Paid")
    .reduce((sum, item) => sum + netAmount(item), 0);

  const pendingAmount = settlements
    .filter((item) => item.status === "Pending")
    .reduce((sum, item) => sum + netAmount(item), 0);

  const processingAmount = settlements
    .filter((item) => item.status === "Processing")
    .reduce((sum, item) => sum + netAmount(item), 0);

  const totalFees = settlements.reduce((sum, item) => sum + item.fees, 0);

  function exportCSV() {
    const headers = [
      "Settlement ID",
      "Period",
      "Date",
      "Shipments",
      "Gross Amount",
      "Fees",
      "Adjustments",
      "Net Amount",
      "Status",
      "Method",
      "Reference",
    ];

    const rows = filteredSettlements.map((item) => [
      item.id,
      item.period,
      item.date,
      item.shipments,
      item.grossAmount,
      item.fees,
      item.adjustments,
      netAmount(item),
      item.status,
      item.method,
      item.reference,
    ]);

    const escapeCSV = (value: string | number) =>
      `"${String(value).replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "vendor-settlements.csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function updateStatus(id: string, status: SettlementStatus) {
    setSettlements((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item)),
    );

    setSelected((current) =>
      current?.id === id ? { ...current, status } : current,
    );

    setNotice(`${id} status updated to ${status}.`);
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
              Settlements
            </h1>
            <p className="mt-2 text-sm text-muted">
              Review your earnings, deductions, and settlement history.
            </p>
          </div>

          <button
            onClick={exportCSV}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-hairline px-5 py-3 text-sm font-medium transition hover:border-primary hover:text-primary"
          >
            <Download size={17} />
            Export CSV
          </button>
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
            title="Total Settled"
            value={money(totalSettled)}
            description="Successfully paid"
            icon={<CheckCircle2 size={20} />}
          />
          <StatCard
            title="Pending"
            value={money(pendingAmount)}
            description="Awaiting settlement"
            icon={<Clock3 size={20} />}
          />
          <StatCard
            title="Processing"
            value={money(processingAmount)}
            description="Being processed"
            icon={<ArrowLeftRight size={20} />}
          />
          <StatCard
            title="Total Fees"
            value={money(totalFees)}
            description="Recorded service fees"
            icon={<Wallet size={20} />}
          />
        </section>

        <section className="card rounded-2xl p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold">Settlement Summary</h2>
              <p className="mt-1 text-sm text-muted">
                Overview of your recorded payouts.
              </p>
            </div>
            <div className="rounded-xl border border-hairline bg-panel p-3 text-primary">
              <ArrowUpRight size={20} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <SummaryBox
              label="Paid"
              amount={totalSettled}
              count={settlements.filter((item) => item.status === "Paid").length}
              color="text-emerald-400"
            />
            <SummaryBox
              label="Pending"
              amount={pendingAmount}
              count={
                settlements.filter((item) => item.status === "Pending").length
              }
              color="text-yellow-500"
            />
            <SummaryBox
              label="Processing"
              amount={processingAmount}
              count={
                settlements.filter((item) => item.status === "Processing")
                  .length
              }
              color="text-blue-400"
            />
          </div>
        </section>

        <section className="card overflow-hidden rounded-2xl">
          <div className="flex flex-col gap-4 border-b border-hairline p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold">Settlement History</h2>
              <p className="mt-1 text-sm text-muted">
                View payout periods and settlement details.
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
                  placeholder="Search settlements..."
                  className="w-full rounded-xl border border-hairline bg-panel py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-muted focus:border-primary sm:w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-hairline bg-panel px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="All">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-panel text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-5 py-4 font-medium">Settlement</th>
                  <th className="px-5 py-4 font-medium">Period</th>
                  <th className="px-5 py-4 font-medium">Shipments</th>
                  <th className="px-5 py-4 font-medium">Gross Amount</th>
                  <th className="px-5 py-4 font-medium">Fees</th>
                  <th className="px-5 py-4 font-medium">Net Payout</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 text-right font-medium">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-hairline">
                {filteredSettlements.map((item) => (
                  <tr key={item.id} className="transition hover:bg-panel/60">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-primary">{item.id}</p>
                      <p className="mt-1 text-xs text-muted">{item.date}</p>
                    </td>
                    <td className="px-5 py-4">{item.period}</td>
                    <td className="px-5 py-4">{item.shipments}</td>
                    <td className="px-5 py-4">{money(item.grossAmount)}</td>
                    <td className="px-5 py-4 text-muted">{money(item.fees)}</td>
                    <td className="px-5 py-4 font-semibold">
                      {money(netAmount(item))}
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

                {filteredSettlements.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-muted">
                      No settlements found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-hairline px-5 py-4 text-sm text-muted">
            Showing {filteredSettlements.length} of {settlements.length} settlements
          </div>
        </section>

        <div className="rounded-2xl border border-hairline bg-panel/50 p-4 text-sm leading-6 text-muted sm:p-5">
          Net payout is calculated as gross amount minus fees plus or minus
          adjustments. Connect the page to your verified settlement API before
          using these figures for actual financial records.
        </div>
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
                <h2 className="text-lg font-semibold">Settlement Details</h2>
                <p className="mt-1 text-sm text-primary">{selected.id}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="Close dialog"
                className="rounded-lg p-2 text-muted hover:bg-panel hover:text-fg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <Detail label="Period" value={selected.period} />
              <Detail label="Settlement Date" value={selected.date} />
              <Detail label="Shipments" value={String(selected.shipments)} />
              <Detail label="Payment Method" value={selected.method} />
              <Detail label="Reference" value={selected.reference} />
              <Detail label="Gross Amount" value={money(selected.grossAmount)} />
              <Detail label="Fees" value={money(selected.fees)} />
              <Detail label="Adjustments" value={money(selected.adjustments)} />
              <Detail label="Net Payout" value={money(netAmount(selected))} />

              <div className="flex items-center justify-between gap-4 border-b border-hairline pb-3">
                <span className="text-sm text-muted">Status</span>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[selected.status]}`}
                >
                  {selected.status}
                </span>
              </div>

              {selected.status !== "Paid" && (
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Demo status action
                  </label>
                  <select
                    value={selected.status}
                    onChange={(event) =>
                      updateStatus(
                        selected.id,
                        event.target.value as SettlementStatus,
                      )
                    }
                    className="w-full rounded-xl border border-hairline bg-panel px-3 py-3 text-sm outline-none focus:border-primary"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Paid">Paid</option>
                  </select>
                  <p className="mt-2 text-xs text-muted">
                    This changes only the local demo state, not an actual bank
                    payment.
                  </p>
                </div>
              )}
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
  value: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <div className="card rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-muted">{title}</p>
          <p className="mt-3 break-words text-2xl font-bold">{value}</p>
          <p className="mt-2 text-xs text-muted">{description}</p>
        </div>
        <div className="rounded-xl border border-hairline bg-panel p-3 text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}

function SummaryBox({
  label,
  amount,
  count,
  color,
}: {
  label: string;
  amount: number;
  count: number;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-hairline bg-panel p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className={`mt-2 text-xl font-bold ${color}`}>{money(amount)}</p>
      <p className="mt-2 text-xs text-muted">
        {count} settlement{count === 1 ? "" : "s"}
      </p>
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
