
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Download,
  Package,
  TrendingUp,
  Truck,
} from "lucide-react";

type ReportRecord = {
  date: string;
  shipments: number;
  delivered: number;
  returned: number;
  revenue: number;
};

const reportData: ReportRecord[] = [
  { date: "2026-09-14", shipments: 18, delivered: 15, returned: 1, revenue: 12500 },
  { date: "2026-09-21", shipments: 24, delivered: 20, returned: 2, revenue: 16800 },
  { date: "2026-09-28", shipments: 21, delivered: 18, returned: 1, revenue: 14900 },
  { date: "2026-10-05", shipments: 31, delivered: 27, returned: 2, revenue: 22400 },
  { date: "2026-10-12", shipments: 28, delivered: 24, returned: 1, revenue: 19700 },
];

const money = (amount: number) =>
  new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function ReportsPage() {
  const [period, setPeriod] = useState("30");
  const [notice, setNotice] = useState("");

  const filteredData = useMemo(() => {
    if (period === "all") return reportData;

    const days = Number(period);
    const latestDate = new Date(reportData[reportData.length - 1].date);
    const cutoff = new Date(latestDate);
    cutoff.setDate(cutoff.getDate() - days);

    return reportData.filter((record) => new Date(record.date) >= cutoff);
  }, [period]);

  const totals = useMemo(
    () =>
      filteredData.reduce(
        (result, record) => ({
          shipments: result.shipments + record.shipments,
          delivered: result.delivered + record.delivered,
          returned: result.returned + record.returned,
          revenue: result.revenue + record.revenue,
        }),
        { shipments: 0, delivered: 0, returned: 0, revenue: 0 },
      ),
    [filteredData],
  );

  const deliveryRate =
    totals.shipments > 0
      ? Math.round((totals.delivered / totals.shipments) * 100)
      : 0;

  const maxRevenue = Math.max(
    1,
    ...filteredData.map((record) => record.revenue),
  );

  function exportCSV() {
    const headers = [
      "Period Starting",
      "Shipments",
      "Delivered",
      "Returned",
      "Revenue NPR",
    ];

    const rows = filteredData.map((record) => [
      record.date,
      record.shipments,
      record.delivered,
      record.returned,
      record.revenue,
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
    anchor.download = "vendor-reports.csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setNotice("Report CSV exported successfully.");
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
              Reports & Analytics
            </h1>
            <p className="mt-2 text-sm text-muted">
              Review shipment performance, delivery rates, and revenue.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              className="rounded-xl border border-hairline bg-panel px-4 py-3 text-sm outline-none focus:border-primary"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="all">All available data</option>
            </select>

            <button
              onClick={exportCSV}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-dark-1 transition hover:opacity-90"
            >
              <Download size={17} />
              Export Report
            </button>
          </div>
        </header>

        {notice && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            <span>{notice}</span>
            <button onClick={() => setNotice("")}>Dismiss</button>
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Shipments"
            value={totals.shipments.toLocaleString()}
            description="Shipments in selected period"
            icon={<Package size={20} />}
          />
          <StatCard
            title="Delivered"
            value={totals.delivered.toLocaleString()}
            description={`${deliveryRate}% delivery rate`}
            icon={<Truck size={20} />}
          />
          <StatCard
            title="Total Revenue"
            value={money(totals.revenue)}
            description="Recorded revenue"
            icon={<TrendingUp size={20} />}
          />
          <StatCard
            title="Returns"
            value={totals.returned.toLocaleString()}
            description="Recorded returned shipments"
            icon={<BarChart3 size={20} />}
          />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="card rounded-2xl p-5 sm:p-6 xl:col-span-2">
            <div className="mb-6">
              <h2 className="font-semibold">Revenue Overview</h2>
              <p className="mt-1 text-sm text-muted">
                Revenue by reporting period.
              </p>
            </div>

            {filteredData.length > 0 ? (
              <div className="space-y-5">
                {filteredData.map((record) => (
                  <div key={record.date}>
                    <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                      <span className="text-muted">{record.date}</span>
                      <span className="font-semibold">
                        {money(record.revenue)}
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-panel">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{
                          width: `${(record.revenue / maxRevenue) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-10 text-center text-sm text-muted">
                No report data is available for this period.
              </p>
            )}

            <div className="mt-6 border-t border-hairline pt-4">
              <p className="text-xs leading-5 text-muted">
                This chart displays sample reporting data. Connect your
                shipment and payment APIs for live analytics.
              </p>
            </div>
          </div>

          <div className="card rounded-2xl p-5 sm:p-6">
            <h2 className="font-semibold">Shipment Performance</h2>
            <p className="mt-1 text-sm text-muted">
              Status breakdown for the selected period.
            </p>

            <div className="mt-6 space-y-6">
              <ProgressRow
                label="Delivered"
                value={totals.delivered}
                total={totals.shipments}
                color="bg-emerald-500"
              />
              <ProgressRow
                label="Returned"
                value={totals.returned}
                total={totals.shipments}
                color="bg-red-400"
              />
              <ProgressRow
                label="Other / In Progress"
                value={Math.max(
                  0,
                  totals.shipments - totals.delivered - totals.returned,
                )}
                total={totals.shipments}
                color="bg-primary"
              />
            </div>

            <div className="mt-7 rounded-xl border border-hairline bg-panel p-4">
              <p className="text-sm text-muted">Delivery success rate</p>
              <p className="mt-2 text-3xl font-bold text-emerald-400">
                {deliveryRate}%
              </p>
            </div>
          </div>
        </section>

        <section className="card overflow-hidden rounded-2xl">
          <div className="border-b border-hairline p-5">
            <h2 className="font-semibold">Detailed Report</h2>
            <p className="mt-1 text-sm text-muted">
              Shipment and revenue totals for each reporting period.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-panel text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-5 py-4 font-medium">Period Starting</th>
                  <th className="px-5 py-4 font-medium">Shipments</th>
                  <th className="px-5 py-4 font-medium">Delivered</th>
                  <th className="px-5 py-4 font-medium">Returned</th>
                  <th className="px-5 py-4 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {filteredData.map((record) => (
                  <tr key={record.date} className="transition hover:bg-panel/60">
                    <td className="px-5 py-4">{record.date}</td>
                    <td className="px-5 py-4">{record.shipments}</td>
                    <td className="px-5 py-4 text-emerald-400">
                      {record.delivered}
                    </td>
                    <td className="px-5 py-4 text-red-400">
                      {record.returned}
                    </td>
                    <td className="px-5 py-4 font-semibold">
                      {money(record.revenue)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-panel/60 font-semibold">
                  <td className="px-5 py-4">Total</td>
                  <td className="px-5 py-4">{totals.shipments}</td>
                  <td className="px-5 py-4">{totals.delivered}</td>
                  <td className="px-5 py-4">{totals.returned}</td>
                  <td className="px-5 py-4">{money(totals.revenue)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
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

function ProgressRow({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-medium">
          {value} <span className="text-muted">({Math.round(percentage)}%)</span>
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-panel">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
