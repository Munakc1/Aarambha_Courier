import Link from "next/link";

interface Tier { name: string; price: string; period?: string; features: string[]; ctaLabel?: string; ctaHref?: string; featured?: boolean; }

export function PricingTable({ tiers }: { tiers: Tier[] }) {
  return (
    <div className="grid items-center gap-6 md:grid-cols-3">
      {tiers.map((t) => (
        <div key={t.name} className={"relative flex flex-col rounded-[1.5rem] border p-8 transition " + (t.featured ? "gradient-border border-transparent bg-surface shadow-lg md:scale-[1.04]" : "border-hairline bg-surface hover:border-accent")}>
          {t.featured ? <span className="absolute -top-3 left-8 rounded-full gradient-bg px-3 py-1 text-xs font-bold on-accent shadow-sm">Most popular</span> : null}
          <h3 className="font-semibold tracking-tight">{t.name}</h3>
          <div className="mt-4 flex items-end gap-1"><span className="text-5xl font-bold tracking-tight">{t.price}</span>{t.period ? <span className="mb-1.5 text-sm text-muted">/{t.period}</span> : null}</div>
          <ul className="mt-7 flex-1 space-y-3 text-sm text-muted">
            {t.features.map((f) => <li key={f} className="flex gap-2.5"><span className="mt-0.5 gradient-text font-bold">✓</span>{f}</li>)}
          </ul>
          <Link href={t.ctaHref ?? "/contact"} className={"mt-8 rounded-full px-6 py-3 text-center font-semibold transition " + (t.featured ? "shimmer gradient-bg on-accent hover:-translate-y-0.5" : "border border-hairline hover:bg-app")}>{t.ctaLabel ?? "Choose " + t.name}</Link>
        </div>
      ))}
    </div>
  );
}
