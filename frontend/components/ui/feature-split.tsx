import type { ReactNode } from "react";

export function FeatureSplit({ eyebrow, title, desc, bullets, media, reverse = false }: { eyebrow?: string; title: string; desc?: string; bullets?: string[]; media?: ReactNode; reverse?: boolean }) {
  return (
    <div className={"grid items-center gap-10 md:grid-cols-2 " + (reverse ? "md:[&>*:first-child]:order-2" : "")}>
      <div>
        {eyebrow ? <p className="text-sm font-semibold uppercase tracking-widest text-faint">{eyebrow}</p> : null}
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{title}</h2>
        {desc ? <p className="mt-4 text-lg text-muted">{desc}</p> : null}
        {bullets ? <ul className="mt-6 space-y-2 text-muted">{bullets.map((b) => <li key={b} className="flex gap-2"><span className="gradient-text">✓</span>{b}</li>)}</ul> : null}
      </div>
      <div className="relative overflow-hidden rounded-3xl border border-hairline bg-surface p-8">
        <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full gradient-bg opacity-30 blur-3xl" />
        <div className="relative">{media ?? <div className="grid h-48 place-items-center text-5xl">✨</div>}</div>
      </div>
    </div>
  );
}
