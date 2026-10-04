import type { ReactNode } from "react";

export function FeatureCard({ icon, title, desc }: { icon?: ReactNode; title: string; desc: string }) {
  return (
    <div className="card group p-7">
      {icon ? <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl gradient-bg text-2xl accent-glow transition group-hover:scale-105">{icon}</div> : null}
      <h3 className="font-semibold tracking-tight">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{desc}</p>
    </div>
  );
}
