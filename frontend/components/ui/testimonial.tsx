export function Testimonial({ quote, author, role }: { quote: string; author: string; role?: string }) {
  const initials = author.split(" ").map((x) => x[0]).join("").slice(0, 2).toUpperCase();
  return (
    <figure className="card flex h-full flex-col p-7">
      <div aria-hidden className="text-3xl leading-none gradient-text">&ldquo;</div>
      <blockquote className="mt-1 flex-1 text-[15px] font-medium leading-relaxed text-fg/90">{quote}</blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-hairline pt-5">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full gradient-bg text-sm font-bold on-accent">{initials}</span>
        <span className="text-sm"><span className="block font-semibold text-fg">{author}</span>{role ? <span className="block text-muted">{role}</span> : null}</span>
      </figcaption>
    </figure>
  );
}
