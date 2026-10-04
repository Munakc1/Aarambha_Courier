export function Steps({ items }: { items: { title: string; desc: string }[] }) {
  return (
    <ol className="grid gap-6 sm:grid-cols-3">
      {items.map((s, i) => (
        <li key={s.title} className="card p-7">
          <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl gradient-bg text-sm font-bold on-accent">{String(i + 1).padStart(2, "0")}</div>
          <h3 className="font-semibold tracking-tight">{s.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.desc}</p>
        </li>
      ))}
    </ol>
  );
}
