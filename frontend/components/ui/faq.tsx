export function FAQ({ items, title }: { items: { q: string; a: string }[]; title?: string }) {
  return (
    <div className="mx-auto max-w-3xl">
      {title ? <h2 className="mb-8 text-center text-3xl font-bold sm:text-4xl">{title}</h2> : null}
      <div className="overflow-hidden rounded-2xl border border-hairline bg-surface">
        {items.map((it, i) => (
          <details key={it.q} className={"group px-6 " + (i > 0 ? "border-t border-hairline" : "")}>
            <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-medium">{it.q}<span className="ml-4 text-muted transition group-open:rotate-45">+</span></summary>
            <p className="pb-5 text-sm leading-relaxed text-muted">{it.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
