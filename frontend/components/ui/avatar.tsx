export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name.split(" ").map((x) => x[0]).join("").slice(0, 2).toUpperCase();
  return <span className="inline-flex items-center justify-center rounded-full gradient-bg font-bold on-accent" style={{ width: size, height: size, fontSize: size * 0.4 }}>{initials}</span>;
}

export function AvatarGroup({ names }: { names: string[] }) {
  return <div className="flex -space-x-2">{names.map((n) => <span key={n} className="rounded-full bg-app p-0.5"><Avatar name={n} size={36} /></span>)}</div>;
}
