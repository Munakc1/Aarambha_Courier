export function Timeline({ items }: { items: { date?: string; title: string; desc?: string }[] }) {
  return (
    <ol className="relative ml-3 border-l border-hairline">
      {items.map((it) => (
        <li key={it.title} className="mb-8 ml-6">
          <span aria-hidden className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full gradient-bg" />
          {it.date ? <p className="text-xs font-semibold uppercase tracking-widest text-faint">{it.date}</p> : null}
          <h3 className="mt-1 font-semibold">{it.title}</h3>
          {it.desc ? <p className="mt-1 text-sm text-muted">{it.desc}</p> : null}
        </li>
      ))}
    </ol>
  );
}
