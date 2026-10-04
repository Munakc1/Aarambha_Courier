/** A dependency-free, theme-aware area chart with an animated draw. */
export function AreaChart({ data, height = 160, gradientId = "lac-area", className = "" }: { data: number[]; height?: number; gradientId?: string; className?: string }) {
  const w = 600;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const step = data.length > 1 ? w / (data.length - 1) : w;
  const pts = data.map((d, i) => [i * step, height - ((d - min) / range) * (height - 24) - 12] as const);
  const line = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = line + " L" + w + " " + height + " L0 " + height + " Z";
  return (
    <svg viewBox={"0 0 " + w + " " + height} preserveAspectRatio="none" className={"w-full " + className} style={{ height }} role="img" aria-label="Chart">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-to)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--accent-to)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={"url(#" + gradientId + ")"} />
      <path d={line} fill="none" stroke="var(--accent-to)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-draw" />
    </svg>
  );
}
