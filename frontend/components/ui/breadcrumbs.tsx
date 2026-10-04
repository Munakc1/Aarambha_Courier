import Link from "next/link";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted">
      {items.map((it, i) => (
        <span key={it.label} className="flex items-center gap-2">
          {it.href ? <Link href={it.href} className="hover:text-fg">{it.label}</Link> : <span className="text-fg">{it.label}</span>}
          {i < items.length - 1 ? <span aria-hidden className="text-faint">/</span> : null}
        </span>
      ))}
    </nav>
  );
}
