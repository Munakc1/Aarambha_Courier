"use client";

import { useActionState } from "react";
import { honeypotProps, timestampValue } from "@lacspace/form";
import { submitNewsletter, type SubscribeState } from "@/app/actions";

/** An email capture block — validated & spam-protected via @lacspace/form. */
export function Newsletter({ title = "Stay in the loop", subtitle = "Occasional updates. No spam — unsubscribe anytime." }: { title?: string; subtitle?: string }) {
  const [state, action, pending] = useActionState<SubscribeState, FormData>(submitNewsletter, null);
  const err = state && !state.ok ? (state.errors.email ?? state.errors._form) : undefined;

  return (
    <div className="gradient-border relative mx-auto max-w-3xl overflow-hidden rounded-[1.75rem] border border-transparent bg-surface p-8 text-center shadow-lg sm:p-12">
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full gradient-bg opacity-20 blur-3xl" />
      <h2 className="relative text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      <p className="relative mx-auto mt-2 max-w-md text-sm text-muted">{subtitle}</p>
      {state?.ok ? (
        <p className="relative mx-auto mt-6 max-w-md rounded-xl border border-hairline bg-app p-4 text-sm">You&rsquo;re subscribed — thanks! ✅</p>
      ) : (
        <form action={action} className="relative mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row">
          <input name="email" type="email" placeholder="you@example.com" aria-label="Email" className="w-full flex-1 rounded-full border border-hairline bg-app px-5 py-3 outline-none transition focus:border-accent" />
          <input {...honeypotProps("website")} />
          <input type="hidden" name="_ts" defaultValue={timestampValue()} />
          <button disabled={pending} className="rounded-full gradient-bg px-6 py-3 font-semibold on-accent transition hover:-translate-y-0.5 disabled:opacity-60">{pending ? "Joining…" : "Subscribe"}</button>
        </form>
      )}
      {err ? <p className="relative mt-3 text-sm text-red-400">{err}</p> : null}
    </div>
  );
}
