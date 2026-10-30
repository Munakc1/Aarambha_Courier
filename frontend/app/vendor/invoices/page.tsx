
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Eye,
  FileText,
  Search,
  X,
} from "lucide-react";

type InvoiceStatus = "Paid" | "Pending" | "Overdue";

type Invoice = {
  id: string;
  orderId: string;
  issueDate: string;
  dueDate: string;
  customer: string;
  amount: number;
  status: InvoiceStatus;
};

const initialInvoices: Invoice[] = [
  {
    id: "INV-1001",
    orderId: "ORD-501",
    issueDate: "2026-10-01",
    dueDate: "2026-10-15",
    customer: "Ram Sharma",
    amount: 2500,
    status: "Paid",
  },
  {
    id: "INV-1002",
    orderId: "ORD-502",
    issueDate: "2026-10-05",
    dueDate: "2026-10-19",
    customer: "Sita Karki",
    amount: 1800,
    status: "Pending",
  },
  {
    id: "INV-1003",
    orderId: "ORD-503",
    issueDate: "2026-09-15",
    dueDate: "2026-09-29",
    customer: "Hari Thapa",
    amount: 3200,
    status: "Overdue",
  },
  {
    id: "INV-1004",
    orderId: "ORD-504",
    issueDate: "2026-10-08",
    dueDate: "2026-10-22",
    customer: "Maya Rai",
    amount: 950,
    status: "Paid",
  },
  {
    id: "INV-1005",
    orderId: "ORD-505",
    issueDate: "2026-10-10",
    dueDate: "2026-10-24",
    customer: "Anil Gurung",
    amount: 2100,
    status: "Pending",
  },
];

const statusStyles: Record<InvoiceStatus, string> = {
  Paid: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  Pending: "border-yellow-500/20 bg-yellow-500/10 text-yellow-500",
  Overdue: "border-red-500/20 bg-red-500/10 text-red-400",
};

const money = (amount: number) =>
  new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 2,
  }).format(amount);

export default function InvoicesPage() {
  const [invoices] = useState<Invoice[]>(initialInvoices);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<Invoice | null>(null);

  const filteredInvoices = useMemo(
    () =>
      invoices.filter((invoice) => {
        const query = search.toLowerCase();

        const matchesSearch = [
          invoice.id,
          invoice.orderId,
          invoice.customer,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

        return (
          matchesSearch &&
          (statusFilter === "All" || invoice.status === statusFilter)
        );
      }),
    [invoices, search, statusFilter],
  );

  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = invoices
    .filter((invoice) => invoice.status === "Paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingAmount = invoices
    .filter((invoice) => invoice.status === "Pending")
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const overdueAmount = invoices
    .filter((invoice) => invoice.status === "Overdue")
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  function exportCSV() {
    const headers = [
      "Invoice ID",
      "Order ID",
      "Customer",
      "Issue Date",
      "Due Date",
      "Amount NPR",
      "Status",
    ];

    const rows = filteredInvoices.map((invoice) => [
      invoice.id,
      invoice.orderId,
      invoice.customer,
      invoice.issueDate,
      invoice.dueDate,
      invoice.amount,
      invoice.status,
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
    anchor.download = "vendor-invoices.csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function printInvoice(invoice: Invoice) {
    const printWindow = window.open("", "_blank", "width=800,height=700");

    if (!printWindow) {
      window.alert("Please allow pop-ups to print this invoice.");
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>${invoice.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #222; }
            h1 { margin-bottom: 6px; }
            .muted { color: #666; }
            .row { display: flex; justify-content: space-between; gap: 20px; padding: 12px 0; border-bottom: 1px solid #ddd; }
            .total { font-size: 22px; font-weight: bold; margin-top: 25px; text-align: right; }
          </style>
        </head>
        <body>
          <h1>Aarambha</h1>
          <p class="muted">Vendor Invoice</p>
          <h2>${invoice.id}</h2>
          <div class="row"><span>Order ID</span><strong>${invoice.orderId}</strong></div>
          <div class="row"><span>Customer</span><strong>${invoice.customer}</strong></div>
          <div class="row"><span>Issue Date</span><strong>${invoice.issueDate}</strong></div>
          <div class="row"><span>Due Date</span><strong>${invoice.dueDate}</strong></div>
          <div class="row"><span>Status</span><strong>${invoice.status}</strong></div>
          <p class="total">Total: ${money(invoice.amount)}</p>
          <p class="muted">Demo invoice. Connect verified billing data before using for accounting.</p>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);

    printWindow.document.close();
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
              Invoices
            </h1>
            <p className="mt-2 text-sm text-muted">
              View invoice records, payment statuses, and due dates.
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

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Invoiced" value={money(totalAmount)} />
          <StatCard title="Paid" value={money(paidAmount)} />
          <StatCard title="Pending" value={money(pendingAmount)} />
          <StatCard title="Overdue" value={money(overdueAmount)} />
        </section>

        <section className="card overflow-hidden rounded-2xl">
          <div className="flex flex-col gap-4 border-b border-hairline p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold">Invoice Records</h2>
              <p className="mt-1 text-sm text-muted">
                Search, filter, view, and print invoice details.
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
                  placeholder="Search invoices..."
                  className="w-full rounded-xl border border-hairline bg-panel py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-muted focus:border-primary sm:w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-hairline bg-panel px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="All">All statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-panel text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-5 py-4 font-medium">Invoice</th>
                  <th className="px-5 py-4 font-medium">Customer</th>
                  <th className="px-5 py-4 font-medium">Issue Date</th>
                  <th className="px-5 py-4 font-medium">Due Date</th>
                  <th className="px-5 py-4 font-medium">Amount</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="transition hover:bg-panel/60">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-primary">{invoice.id}</p>
                      <p className="mt-1 text-xs text-muted">{invoice.orderId}</p>
                    </td>
                    <td className="px-5 py-4">{invoice.customer}</td>
                    <td className="px-5 py-4">{invoice.issueDate}</td>
                    <td className="px-5 py-4">{invoice.dueDate}</td>
                    <td className="px-5 py-4 font-semibold">
                      {money(invoice.amount)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[invoice.status]}`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelected(invoice)}
                        className="inline-flex items-center gap-2 rounded-lg border border-hairline px-3 py-2 text-xs font-medium transition hover:border-primary hover:text-primary"
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-muted">
                      No invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-hairline px-5 py-4 text-sm text-muted">
            Showing {filteredInvoices.length} of {invoices.length} invoices
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
                <h2 className="text-lg font-semibold">Invoice Details</h2>
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
              <Detail label="Order ID" value={selected.orderId} />
              <Detail label="Customer" value={selected.customer} />
              <Detail label="Issue Date" value={selected.issueDate} />
              <Detail label="Due Date" value={selected.dueDate} />
              <Detail label="Amount" value={money(selected.amount)} />
              <Detail label="Status" value={selected.status} />

              <button
                onClick={() => printInvoice(selected)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-dark-1 transition hover:opacity-90"
              >
                <FileText size={17} />
                Print / Save as PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="card rounded-2xl p-5">
      <p className="text-sm text-muted">{title}</p>
      <p className="mt-3 break-words text-2xl font-bold">{value}</p>
      <div className="mt-4 flex items-center gap-2 text-xs text-muted">
        <FileText size={15} className="text-primary" />
        Invoice overview
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
