"use client";
import { useState } from "react";
import { getToken } from "@/lib/api";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function EmailTestPage() {
  const [to, setTo] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    try {
      const token = getToken();
      const res = await fetch(API + "/email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: "Bearer " + token } : {}) },
        body: JSON.stringify({ to }),
      });
      const data: unknown = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as { error?: string }).error ?? "Failed to send");
      setMsg("Sent! If no SMTP is configured, check the API console for the email.");
    } catch (err) { setMsg(err instanceof Error ? err.message : "Failed"); }
    finally { setBusy(false); }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-2xl font-bold">Send a test email</h1>
      <p className="mt-1 text-muted">With no SMTP configured, the email is logged to the API console.</p>
      <form onSubmit={send} className="mt-6 space-y-3">
        <input type="email" required value={to} onChange={(e) => setTo(e.target.value)} placeholder="you@example.com" className="w-full rounded-xl border border-hairline bg-surface px-4 py-3 outline-none" />
        <button disabled={busy} className="w-full rounded-full gradient-bg px-4 py-3 font-semibold on-accent disabled:opacity-60">{busy ? "Sending…" : "Send test email"}</button>
      </form>
      {msg && <p className="mt-4 text-sm text-muted">{msg}</p>}
    </main>
  );
}
