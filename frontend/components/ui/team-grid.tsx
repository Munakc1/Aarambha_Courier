export function TeamGrid({ members }: { members: { name: string; role: string; bio?: string }[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((m) => (
        <div key={m.name} className="card p-7 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl gradient-bg text-xl font-bold on-accent accent-glow">{m.name.split(" ").map((x) => x[0]).join("").slice(0, 2)}</div>
          <h3 className="mt-4 font-semibold tracking-tight">{m.name}</h3>
          <p className="gradient-text text-sm font-medium">{m.role}</p>
          {m.bio ? <p className="mt-2 text-sm leading-relaxed text-muted">{m.bio}</p> : null}
        </div>
      ))}
    </div>
  );
}
