import type { ReactNode } from "react";

export function Section({ eyebrow, title, lead, children, className = "" }: { eyebrow?: string; title?: string; lead?: string; children?: ReactNode; className?: string }) {
  return (
    <section className={"mx-auto max-w-6xl px-6 py-20 sm:py-24 " + className}>
      {eyebrow ? <p className="text-sm font-semibold uppercase tracking-widest gradient-text">{eyebrow}</p> : null}
      {title ? <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{title}</h2> : null}
      {lead ? <p className="mt-4 max-w-2xl text-lg text-muted">{lead}</p> : null}
      {children ? <div className="mt-12">{children}</div> : null}
    </section>
  );
}
