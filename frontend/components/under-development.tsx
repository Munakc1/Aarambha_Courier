"use client";

import Link from "next/link";

/** A branded placeholder for pages that don't have content yet. */
export function UnderDevelopment({ title = "This page", path }: { title?: string; path?: string }) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-bg text-3xl">🚧</div>
      <p className="text-sm font-semibold uppercase tracking-widest text-muted">Under development</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight"><span className="gradient-text">{title}</span> is coming soon</h1>
      <p className="mt-4 max-w-md text-muted">We're putting the finishing touches on this page. Check back shortly — or head back home in the meantime.</p>
      <div className="mt-8 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-surface">
        <div className="h-full w-1/3 gradient-bg" style={{ animation: "loadbar 1.8s ease-in-out infinite" }} />
      </div>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="gradient-bg rounded-full px-6 py-3 font-semibold on-accent">Back home</Link>
        <Link href="/contact" className="rounded-full border border-hairline px-6 py-3 font-semibold transition hover:bg-surface">Get in touch</Link>
      </div>
      {path ? (
        <p className="mt-8 text-xs text-faint">Add your content in <code className="rounded bg-surface px-1.5 py-0.5">app{path}/page.tsx</code>.</p>
      ) : null}
    </div>
  );
}
