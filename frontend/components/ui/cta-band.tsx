import Link from "next/link";

export function CTABand({ title, subtitle, ctaLabel = "Get started", ctaHref = "/contact" }: { title: string; subtitle?: string; ctaLabel?: string; ctaHref?: string }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="relative overflow-hidden rounded-[2rem] border border-hairline bg-surface p-12 text-center shadow-lg sm:p-20">
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full gradient-bg opacity-30 blur-3xl animate-drift" />
        <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full gradient-bg opacity-25 blur-3xl animate-drift-slow" />
        <div aria-hidden className="dot-bg pointer-events-none absolute inset-0 opacity-40" />
        <h2 className="relative text-3xl font-bold tracking-tight sm:text-5xl">{title}</h2>
        {subtitle ? <p className="relative mx-auto mt-4 max-w-xl text-lg text-muted">{subtitle}</p> : null}
        <Link href={ctaHref} className="shimmer relative mt-9 inline-block rounded-full gradient-bg px-8 py-3.5 font-semibold on-accent shadow-lg transition hover:-translate-y-0.5">{ctaLabel}</Link>
      </div>
    </section>
  );
}
