export function LogoCloud({ names, label }: { names: string[]; label?: string }) {
  return (
    <div className="text-center">
      {label ? <p className="text-xs font-semibold uppercase tracking-widest text-faint">{label}</p> : null}
      <div className="mt-7 flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
        {names.map((n) => <span key={n} className="text-lg font-bold tracking-tight text-muted opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0">{n}</span>)}
      </div>
    </div>
  );
}
