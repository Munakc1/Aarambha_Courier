"use client";

import { useQuery } from "@lacspace/query";

interface Stats { users: number; uptime: number; requests: number; }

export function LiveStats() {
  // Shared cache, de-duped requests, and revalidation on window focus.
  const { data, isLoading } = useQuery("stats", async () => {
    const res = await fetch("/api/stats");
    if (!res.ok) throw new Error("Failed to load stats");
    return (await res.json()) as Stats;
  });

  const items = [
    { label: "Active users", value: data ? data.users.toLocaleString() : "—" },
    { label: "Uptime", value: data ? data.uptime + "%" : "—" },
    { label: "Requests / mo", value: data ? new Intl.NumberFormat("en", { notation: "compact" }).format(data.requests) : "—" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((s) => (
        <div key={s.label} className="rounded-2xl border border-hairline bg-app p-6 text-center">
          <div className={"text-3xl font-bold tabular-nums " + (isLoading ? "animate-pulse text-muted" : "")}>{s.value}</div>
          <div className="mt-1 text-sm text-muted">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
