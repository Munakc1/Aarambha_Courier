export function StatBand({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-[1.5rem] border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-surface px-6 py-10 text-center transition hover:bg-panel">
          <div className="gradient-text text-4xl font-bold tabular-nums tracking-tight sm:text-5xl">{s.value}</div>
          <div className="mt-2 text-sm text-muted">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
