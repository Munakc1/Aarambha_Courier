import type { ReactNode } from "react";

const tones = {
  info: { c: "border-sky-500/30 bg-sky-500/10", i: "💡" },
  success: { c: "border-emerald-500/30 bg-emerald-500/10", i: "✅" },
  warning: { c: "border-amber-500/30 bg-amber-500/10", i: "⚠️" },
  danger: { c: "border-red-500/30 bg-red-500/10", i: "⛔" },
} as const;

export function Callout({ children, title, tone = "info" }: { children: ReactNode; title?: string; tone?: keyof typeof tones }) {
  const t = tones[tone];
  return (
    <div className={"flex gap-3 rounded-2xl border p-4 " + t.c}>
      <div className="text-lg leading-none">{t.i}</div>
      <div className="text-sm">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className="text-muted">{children}</div>
      </div>
    </div>
  );
}
