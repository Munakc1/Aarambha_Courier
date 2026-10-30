
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  Search,
  Wallet,
  X,
} from "lucide-react";

type CODStatus = "Pending" | "Settled";

type CODTransaction = {
  id: string;
  shipmentId: string;
  orderId: string;
  customer: string;
  date: string;
  amount: number;
  fee: number;
  status: CODStatus;
};

const initialTransactions: CODTransaction[] = [
  {
    id: "COD-1001",
    shipmentId: "SHP-2001",
    orderId: "ORD-501",
    customer: "Ram Sharma",
    date: "2026-10-13",
    amount: 2500,
    fee: 100,
    status: "Pending",
  },
  {
    id: "COD-1002",
    shipmentId: "SHP-2002",
    orderId: "ORD-502",
    customer: "Sita Karki",
    date: "2026-10-12",
    amount: 1800,
    fee: 80,
    status: "Settled",
  },
  {
    id: "COD-1003",
    shipmentId: "SHP-2003",
    orderId: "ORD-503",
    customer: "Hari Thapa",
    date: "2026-10-11",
    amount: 3200,
    fee: 120,
    status: "Pending",
  },
  {
    id: "COD-1004",
    shipmentId: "SHP-2004",
    orderId: "ORD-504",
    customer: "Maya Rai",
    date: "2026-10-10",
    amount: 950,
    fee: 60,
    status: "Settled",
  },
  {
    id: "COD-1005",
    shipmentId: "SHP-2005",
    orderId: "ORD-505",
    customer: "Anil Gurung",
    date: "2026-10-09",
    amount: 2100,
    fee: 90,
    status: "Pending",
  },
];

const statusStyles: Record<CODStatus, string> = {
  Pending: "border-yellow-500/20 bg-yellow-500/10 text-yellow-500",
  Settled: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
};

const formatNPR = (amount: number) =>
  new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 2,
  }).format(amount);

export default function CODLedgerPage() {
  const [transactions, setTransactions] =
    useState<CODTransaction[]>(initialTransactions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedTransaction, setSelectedTransaction] =
    useState<CODTransaction | null>(null);
  const [notice, setNotice] = useState("");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch = [
        transaction.id,
        transaction.shipmentId,
        transaction.orderId,
        transaction.customer,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || transaction.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [transactions, search, statusFilter]);

  const totalCOD = transactions.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );

  const totalFees = transactions.reduce(
    (total, transaction) => total + transaction.fee,
    0,
  );

  const pendingTransactions = transactions.filter(
    (transaction) => transaction.status === "Pending",
  );

  const settledTransactions = transactions.filter(
    (transaction) => transaction.status === "Settled",
  );

  const pendingAmount = pendingTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );

  const settledAmount = settledTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );

  function markAsSettled(id: string) {
    setTransactions((current) =>
      current.map((transaction) =>
        transaction.id === id
          ? { ...transaction, status: "Settled" }
          : transaction,
      ),
    );

    setSelectedTransaction((current) =>
      current?.id === id ? { ...current, status: "Settled" } : current,
    );

    setNotice(`COD transaction ${id} marked as settled.`);
  }

  function exportCSV() {
    const headers = [
      "Transaction ID",
      "Shipment ID",
      "Order ID",
      "Customer",
      "Date",
      "COD Amount",
      "Delivery Fee",
      "Net Amount",
      "Status",
    ];

    const rows = filteredTransactions.map((transaction) => [
      transaction.id,
      transaction.shipmentId,
      transaction.orderId,
      transaction.customer,
      transaction.date,
      transaction.amount,
      transaction.fee,
      transaction.amount - transaction.fee,
      transaction.status,
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
    anchor.download = "cod-ledger.csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-app px-4 py-6 text-fg sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/vendor/shipments"
              className="mb-3 inline-flex items-center gap-2 text-sm text-muted transition hover:text-primary"
            >
              <ArrowLeft size={16} />
              Back to Shipments
            </Link>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              COD Ledger
            </h1>
            <p className="mt-2 text-sm text-muted">
              Track cash-on-delivery collections, fees, and settlement status.
            </p>
          </div>

          <button
            onClick={exportCSV}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-hairline px-5 py-3 text-sm font-medium transition hover:border-primary hover:text-primary"
          >
            <Download size={17} />
            Export CSV
          </button>
        </div>

        {notice && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            <span>{notice}</span>
            <button
              onClick={() => setNotice("")}
              aria-label="Dismiss message"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total COD Collected"
            value={formatNPR(totalCOD)}
            description="Total recorded COD amount"
            icon={<Wallet size={20} />}
          />
          <StatCard
            title="Pending Settlement"
            value={formatNPR(pendingAmount)}
            description={`${pendingTransactions.length} pending transactions`}
            icon={<Clock3 size={20} />}
          />
          <StatCard
            title="Total Settled"
            value={formatNPR(settledAmount)}
            description={`${settledTransactions.length} settled transactions`}
            icon={<CheckCircle2 size={20} />}
          />
          <StatCard
            title="Delivery Fees"
            value={formatNPR(totalFees)}
            description="Fees on recorded transactions"
            icon={<ArrowDownLeft size={20} />}
          />
        </section>

        <section className="card rounded-2xl p-5 sm:p-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">Settlement Overview</h2>
              <p className="mt-1 text-sm text-muted">
                Breakdown of recorded COD transactions.
              </p>
            </div>
            <p className="text-sm text-muted">
              {transactions.length} transactions
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="text-muted">Settled</span>
                <span className="font-semibold text-emerald-400">
                  {formatNPR(settledAmount)}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-panel">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{
                    width: `${
                      totalCOD > 0 ? (settledAmount / totalCOD) * 100 : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="text-muted">Pending</span>
                <span className="font-semibold text-yellow-500">
                  {formatNPR(pendingAmount)}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-panel">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${
                      totalCOD > 0 ? (pendingAmount / totalCOD) * 100 : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="card overflow-hidden rounded-2xl">
          <div className="flex flex-col gap-4 border-b border-hairline p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold">COD Transactions</h2>
              <p className="mt-1 text-sm text-muted">
                View transaction details and manage settlement status.
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
                  placeholder="Search transactions..."
                  className="w-full rounded-xl border border-hairline bg-panel py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-muted focus:border-primary sm:w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-hairline bg-panel px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="All">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="Settled">Settled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-panel text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-5 py-4 font-medium">Transaction</th>
                  <th className="px-5 py-4 font-medium">Customer / Order</th>
                  <th className="px-5 py-4 font-medium">Date</th>
                  <th className="px-5 py-4 font-medium">COD Amount</th>
                  <th className="px-5 py-4 font-medium">Delivery Fee</th>
                  <th className="px-5 py-4 font-medium">Net Amount</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 text-right font-medium">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-hairline">
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="transition hover:bg-panel/60"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-primary">
                        {transaction.id}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {transaction.shipmentId}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium">{transaction.customer}</p>
                      <p className="mt-1 text-xs text-muted">
                        {transaction.orderId}
                      </p>
                    </td>

                    <td className="px-5 py-4">{transaction.date}</td>

                    <td className="px-5 py-4 font-medium">
                      {formatNPR(transaction.amount)}
                    </td>

                    <td className="px-5 py-4 text-muted">
                      {formatNPR(transaction.fee)}
                    </td>

                    <td className="px-5 py-4 font-semibold">
                      {formatNPR(transaction.amount - transaction.fee)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[transaction.status]}`}
                      >
                        {transaction.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelectedTransaction(transaction)}
                        aria-label={`View ${transaction.id}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-hairline px-3 py-2 text-xs font-medium transition hover:border-primary hover:text-primary"
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredTransactions.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-12 text-center text-muted"
                    >
                      No COD transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-hairline px-5 py-4 text-sm text-muted">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </div>
        </section>

        <section className="rounded-2xl border border-hairline bg-panel/50 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl border border-hairline bg-app p-3 text-primary">
              <ArrowUpRight size={20} />
            </div>
            <div>
              <h3 className="font-semibold">Settlement calculation</h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                Net amount = COD amount − delivery fee. These figures use
                sample data. Connect this page to your backend to display
                verified collections, actual courier fees, and settlement
                records.
              </p>
            </div>
          </div>
        </section>
      </div>

      {selectedTransaction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedTransaction(null);
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-hairline bg-app p-5 shadow-2xl sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">COD Transaction</h2>
                <p className="mt-1 text-sm text-muted">
                  {selectedTransaction.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedTransaction(null)}
                aria-label="Close dialog"
                className="rounded-lg p-2 text-muted transition hover:bg-panel hover:text-fg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <Detail
                label="Shipment ID"
                value={selectedTransaction.shipmentId}
              />
              <Detail label="Order ID" value={selectedTransaction.orderId} />
              <Detail label="Customer" value={selectedTransaction.customer} />
              <Detail label="Transaction Date" value={selectedTransaction.date} />
              <Detail
                label="COD Amount"
                value={formatNPR(selectedTransaction.amount)}
              />
              <Detail
                label="Delivery Fee"
                value={formatNPR(selectedTransaction.fee)}
              />
              <Detail
                label="Net Amount"
                value={formatNPR(
                  selectedTransaction.amount - selectedTransaction.fee,
                )}
              />

              <div className="flex items-center justify-between gap-4 border-b border-hairline pb-3">
                <span className="text-sm text-muted">Status</span>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[selectedTransaction.status]}`}
                >
                  {selectedTransaction.status}
                </span>
              </div>

              {selectedTransaction.status === "Pending" && (
                <button
                  onClick={() => markAsSettled(selectedTransaction.id)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-dark-1 transition hover:opacity-90"
                >
                  <CheckCircle2 size={17} />
                  Mark as Settled
                </button>
              )}

              {selectedTransaction.status === "Settled" && (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                  <CheckCircle2 size={17} />
                  This transaction is settled.
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
  icon: React.ReactNode;
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

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-hairline pb-3">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-right text-sm font-medium">{value}</span>
    </div>
  );
}
