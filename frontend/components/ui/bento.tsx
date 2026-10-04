import type { ReactNode } from "react";

interface BentoItem { title: string; desc?: string; icon?: ReactNode; className?: string; }

/** A modern, asymmetric "bento" grid. Pass className like "sm:col-span-2" to span. */
export function Bento({ items }: { items: BentoItem[] }) {
  return (
    <div className="grid auto-rows-[minmax(150px,auto)] grid-cols-2 gap-4 sm:grid-cols-3">
      {items.map((it) => (
        <div key={it.title} className={"relative overflow-hidden rounded-3xl border border-hairline bg-surface p-6 transition hover:-translate-y-1 " + (it.className ?? "")}>
          <div aria-hidden className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full gradient-bg opacity-20 blur-2xl" />
          {it.icon ? <div className="mb-3 text-2xl">{it.icon}</div> : null}
          <h3 className="relative font-semibold">{it.title}</h3>
          {it.desc ? <p className="relative mt-1 text-sm text-muted">{it.desc}</p> : null}
        </div>
      ))}
    </div>
  );
}
