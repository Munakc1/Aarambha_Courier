import type { ReactNode } from "react";

const tones = {
  default: "border-hairline bg-surface text-muted",
  accent: "border-transparent gradient-bg on-accent",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  danger: "border-red-500/30 bg-red-500/10 text-red-400",
} as const;

export function Badge({ children, tone = "default", className = "" }: { children: ReactNode; tone?: keyof typeof tones; className?: string }) {
  return <span className={"inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold " + tones[tone] + " " + className}>{children}</span>;
}
