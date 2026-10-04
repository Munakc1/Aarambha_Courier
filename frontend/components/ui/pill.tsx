import type { ReactNode } from "react";

export function Pill({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={"glass inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-muted " + className}><span aria-hidden className="h-1.5 w-1.5 rounded-full gradient-bg" />{children}</span>;
}
