export function Progress({ value, label }: { value: number; label?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div>
      {label ? <div className="mb-1 flex justify-between text-sm"><span>{label}</span><span className="text-muted">{v}%</span></div> : null}
      <div className="h-2 overflow-hidden rounded-full bg-app"><div className="h-full gradient-bg" style={{ width: v + "%" }} /></div>
    </div>
  );
}
