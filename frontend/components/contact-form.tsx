"use client";
import { useActionState } from "react";
import { honeypotProps, timestampValue } from "@lacspace/form";
import { submitContact, type ContactState } from "@/app/actions";

const field = "w-full rounded-xl border border-hairline bg-surface px-4 py-3 outline-none focus:border-hairline";
const label = "mb-1 block text-sm text-muted";
const errCls = "mt-1 text-sm text-red-400";

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, null);

  if (state?.ok) {
    return (
      <p className="rounded-2xl border border-hairline bg-surface p-8 text-center text-lg">
        Thanks — we&rsquo;ll be in touch! ✅
      </p>
    );
  }

  const err = (k: string) => (state && !state.ok ? state.errors[k] : undefined);
  const val = (k: string) => (state && !state.ok ? ((state.values[k] as string) ?? "") : "");

  return (
    <form action={action} className="flex flex-col gap-5">
      <div>
        <label className={label} htmlFor="name">Name</label>
        <input id="name" name="name" defaultValue={val("name")} className={field} />
        {err("name") && <p className={errCls}>{err("name")}</p>}
      </div>
      <div>
        <label className={label} htmlFor="email">Email</label>
        <input id="email" name="email" type="email" defaultValue={val("email")} className={field} />
        {err("email") && <p className={errCls}>{err("email")}</p>}
      </div>
      <div>
        <label className={label} htmlFor="message">Message</label>
        <textarea id="message" name="message" rows={5} defaultValue={val("message")} className={field} />
        {err("message") && <p className={errCls}>{err("message")}</p>}
      </div>

      {/* spam protection — one line each */}
      <input {...honeypotProps("company")} />
      <input type="hidden" name="_ts" defaultValue={timestampValue()} />

      {err("_form") && <p className={errCls}>{err("_form")}</p>}
      <button
        disabled={pending}
        className="gradient-bg rounded-full px-8 py-3 font-semibold on-accent disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
