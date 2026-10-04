"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, setToken } from "@/lib/api";

// how this works: posts to /auth/register, stores the JWT, redirects to /account.
export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      const { token } = await api.register({ name, email, password });
      setToken(token);
      router.push("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally { setBusy(false); }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6">
      <h1 className="text-2xl font-bold">Create your account</h1>
      <p className="mt-1 text-muted">It takes a few seconds.</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" className="w-full rounded-xl border border-hairline bg-surface px-4 py-3 outline-none" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@example.com" className="w-full rounded-xl border border-hairline bg-surface px-4 py-3 outline-none" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={8} placeholder="Password (min 8 chars)" className="w-full rounded-xl border border-hairline bg-surface px-4 py-3 outline-none" />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button disabled={busy} className="w-full rounded-full gradient-bg px-4 py-3 font-semibold on-accent transition hover:opacity-90 disabled:opacity-60">{busy ? "Creating…" : "Create account"}</button>
      </form>
      <p className="mt-4 text-sm text-muted">Already have one? <Link href="/login" className="underline">Sign in</Link></p>
    </main>
  );
}
