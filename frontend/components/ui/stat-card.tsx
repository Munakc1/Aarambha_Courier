export function StatCard({ label, value, delta }: { label: string; value: string; delta?: string }) {
  const down = delta?.trim().startsWith("-");
  return (
    <div className="card p-6">
      <div className="text-3xl font-bold tabular-nums tracking-tight">{value}</div>
      <div className="mt-1 text-sm text-muted">{label}</div>
      {delta ? <div className={"mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold " + (down ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400")}>{down ? "▼" : "▲"} {delta}</div> : null}
    </div>
  );
}
