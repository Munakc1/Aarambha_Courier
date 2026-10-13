"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Package,
  Plus,
  Upload,
  Search,
  Download,
  Eye,
  Truck,
  CheckCircle2,
  Clock3,
  XCircle,
  ArrowUpRight,
} from "lucide-react";

type Shipment = {
  id: string;
  recipient: string;
  phone: string;
  destination: string;
  date: string;
  amount: number;
  status: "Pending" | "In Transit" | "Delivered" | "Cancelled";
};

const initialShipments: Shipment[] = [
  {
    id: "SHP-1001",
    recipient: "Ram Sharma",
    phone: "9800000001",
    destination: "Kathmandu",
    date: "2026-10-12",
    amount: 2500,
    status: "In Transit",
  },
  {
    id: "SHP-1002",
    recipient: "Sita Thapa",
    phone: "9800000002",
    destination: "Pokhara",
    date: "2026-10-11",
    amount: 1800,
    status: "Delivered",
  },
  {
    id: "SHP-1003",
    recipient: "Hari KC",
    phone: "9800000003",
    destination: "Lalitpur",
    date: "2026-10-12",
    amount: 3200,
    status: "Pending",
  },
  {
    id: "SHP-1004",
    recipient: "Anita Rai",
    phone: "9800000004",
    destination: "Butwal",
    date: "2026-10-10",
    amount: 1500,
    status: "Delivered",
  },
  {
    id: "SHP-1005",
    recipient: "Bikash Gurung",
    phone: "9800000005",
    destination: "Biratnagar",
    date: "2026-10-13",
    amount: 2100,
    status: "Cancelled",
  },
];

const statusStyles: Record<Shipment["status"], string> = {
  Pending: "bg-amber-500/10 text-amber-600",
  "In Transit": "bg-blue-500/10 text-blue-600",
  Delivered: "bg-emerald-500/10 text-emerald-600",
  Cancelled: "bg-red-500/10 text-red-600",
};

function formatCurrency(amount: number) {
  return `Rs. ${amount.toLocaleString("en-IN")}`;
}

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState(initialShipments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<Shipment | null>(null);

  const filteredShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      const matchesSearch = [
        shipment.id,
        shipment.recipient,
        shipment.phone,
        shipment.destination,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || shipment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [shipments, search, statusFilter]);

  const stats = [
    {
      label: "Total Shipments",
      value: shipments.length,
      icon: Package,
    },
    {
      label: "In Transit",
      value: shipments.filter((s) => s.status === "In Transit").length,
      icon: Truck,
    },
    {
      label: "Delivered",
      value: shipments.filter((s) => s.status === "Delivered").length,
      icon: CheckCircle2,
    },
    {
      label: "Pending",
      value: shipments.filter((s) => s.status === "Pending").length,
      icon: Clock3,
    },
  ];

  function exportCsv() {
    const headers = [
      "Shipment ID",
      "Recipient",
      "Phone",
      "Destination",
      "Date",
      "Amount",
      "Status",
    ];

    const rows = filteredShipments.map((s) => [
      s.id,
      s.recipient,
      s.phone,
      s.destination,
      s.date,
      s.amount,
      s.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    );

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "shipments.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function cancelShipment(id: string) {
    setShipments((current) =>
      current.map((shipment) =>
        shipment.id === id
          ? { ...shipment, status: "Cancelled" }
          : shipment
      )
    );
    setSelected(null);
  }

  return (
    <main className="min-h-screen bg-app p-4 text-fg sm:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-muted">Vendor / Shipments</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Shipments
            </h1>
            <p className="mt-2 text-sm text-muted">
              Create, track, and manage your shipments.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/vendor/shipments/bulk"
              className="inline-flex items-center gap-2 rounded-xl border border-hairline px-4 py-3 text-sm font-semibold hover:bg-panel"
            >
              <Upload size={17} />
              Bulk Upload
            </Link>

            <Link
              href="/vendor/shipments/new"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-dark-1 hover:brightness-95"
            >
              <Plus size={18} />
              Create Shipment
            </Link>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="card p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">{label}</span>
                <span className="rounded-xl bg-primary/15 p-3">
                  <Icon size={20} className="text-primary" />
                </span>
              </div>
              <p className="mt-5 text-3xl font-bold">{value}</p>
              <p className="mt-2 text-xs text-muted">
                Current sample records
              </p>
            </div>
          ))}
        </section>

        <section className="card overflow-hidden">
          <div className="flex flex-col justify-between gap-4 border-b border-hairline p-5 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-semibold">All Shipments</h2>
              <p className="mt-1 text-sm text-muted">
                {filteredShipments.length} shipments found
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex items-center gap-2 rounded-xl border border-hairline px-3">
                <Search size={17} className="text-muted" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search shipments..."
                  className="min-w-0 bg-transparent py-3 text-sm outline-none"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-hairline bg-app px-3 py-3 text-sm outline-none"
              >
                <option>All</option>
                <option>Pending</option>
                <option>In Transit</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>

              <button
                onClick={exportCsv}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-hairline px-4 py-3 text-sm font-semibold hover:bg-panel"
              >
                <Download size={17} />
                Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-panel text-muted">
                <tr>
                  {[
                    "Shipment",
                    "Recipient",
                    "Destination",
                    "Date",
                    "Amount",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th key={heading} className="whitespace-nowrap px-5 py-4 font-medium">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-hairline">
                {filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-panel">
                    <td className="whitespace-nowrap px-5 py-4 font-semibold">
                      {shipment.id}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <p className="font-medium">{shipment.recipient}</p>
                      <p className="mt-1 text-xs text-muted">
                        {shipment.phone}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      {shipment.destination}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      {shipment.date}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 font-medium">
                      {formatCurrency(shipment.amount)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[shipment.status]}`}>
                        {shipment.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <button
                        onClick={() => setSelected(shipment)}
                        aria-label={`View ${shipment.id}`}
                        className="rounded-lg border border-hairline p-2 hover:bg-primary/10"
                      >
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredShipments.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-muted">
                      No shipments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <section className="w-full max-w-lg rounded-2xl border border-hairline bg-app p-6 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold">Shipment Details</h2>
                  <p className="mt-1 text-sm text-muted">{selected.id}</p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-lg p-2 hover:bg-panel"
                  aria-label="Close details"
                >
                  <XCircle size={21} />
                </button>
              </div>

              <div className="mt-6 space-y-4 text-sm">
                <Detail label="Recipient" value={selected.recipient} />
                <Detail label="Phone" value={selected.phone} />
                <Detail label="Destination" value={selected.destination} />
                <Detail label="Shipment Date" value={selected.date} />
                <Detail label="Amount" value={formatCurrency(selected.amount)} />
                <Detail label="Status" value={selected.status} />
              </div>

              {selected.status !== "Delivered" &&
                selected.status !== "Cancelled" && (
                  <button
                    onClick={() => cancelShipment(selected.id)}
                    className="mt-6 rounded-xl border border-red-500/30 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-500/10"
                  >
                    Cancel Shipment
                  </button>
                )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-hairline pb-3">
      <span className="text-muted">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
