export function Aurora() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[820px] overflow-hidden">
      {/* soft gradient-mesh — blurred orbs keyed to the accent, drifting slowly */}
      <div className="absolute -left-32 -top-24 h-[32rem] w-[32rem] rounded-full opacity-25 blur-[90px] animate-drift" style={{ background: "radial-gradient(circle at 50% 50%, var(--accent-from), transparent 68%)" }} />
      <div className="absolute -right-24 top-24 h-[30rem] w-[30rem] rounded-full opacity-20 blur-[90px] animate-drift-slow" style={{ background: "radial-gradient(circle at 50% 50%, var(--accent-to), transparent 68%)" }} />
      <div className="absolute left-1/3 top-64 h-96 w-96 rounded-full opacity-[0.14] blur-[80px] animate-floaty" style={{ background: "radial-gradient(circle at 50% 50%, var(--accent-to), transparent 70%)" }} />
      {/* faint dotted texture, fading out toward the fold */}
      <div className="dot-bg absolute inset-0 opacity-60" />
      {/* seam that melts the aurora into the page */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[var(--bg)]" />
    </div>
  );
}
