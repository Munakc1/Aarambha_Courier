import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden px-6 text-center">
      <div aria-hidden className="pointer-events-none absolute h-96 w-96 rounded-full gradient-bg opacity-20 blur-3xl animate-drift-slow" />
      <div className="relative text-[9rem] font-black leading-none gradient-text-animated">404</div>
      <p className="relative text-lg text-muted">This page wandered off. Let's get you home.</p>
      <Link href="/" className="shimmer relative rounded-full gradient-bg px-7 py-3.5 font-semibold on-accent transition hover:-translate-y-0.5">Back home</Link>
    </main>
  );
}
