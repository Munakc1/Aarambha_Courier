export function Rating({ value = 5, count }: { value?: number; count?: number }) {
  return (
    <div className="inline-flex items-center gap-1 text-amber-400" aria-label={value + " out of 5"}>
      {[0, 1, 2, 3, 4].map((i) => <span key={i}>{i < Math.round(value) ? "★" : "☆"}</span>)}
      {count ? <span className="ml-1 text-sm text-muted">({count})</span> : null}
    </div>
  );
}
