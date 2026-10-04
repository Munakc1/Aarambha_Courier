export function Gallery({ items }: { items: { label?: string; emoji?: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {items.map((it, i) => (
        <div key={i} className="group relative grid aspect-square place-items-center overflow-hidden rounded-2xl border border-hairline bg-surface">
          <div aria-hidden className="pointer-events-none absolute inset-0 gradient-bg opacity-10 transition group-hover:opacity-20" />
          <span className="relative text-4xl">{it.emoji ?? "🖼️"}</span>
          {it.label ? <span className="absolute bottom-2 left-3 text-xs text-muted">{it.label}</span> : null}
        </div>
      ))}
    </div>
  );
}
