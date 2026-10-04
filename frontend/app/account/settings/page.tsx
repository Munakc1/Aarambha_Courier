"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/api";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function call<T>(path: string, body?: unknown, method = "POST"): Promise<T> {
  const token = getToken();
  const res = await fetch(API + path, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: "Bearer " + token } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data: unknown = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "Request failed");
  return data as T;
}
const msgOf = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong");
const field = "w-full rounded-xl border border-hairline bg-surface px-4 py-2 outline-none";
const card = "rounded-2xl border border-hairline p-5 space-y-3";
const btn = "rounded-full gradient-bg px-4 py-2 text-sm font-semibold on-accent";

export default function SettingsPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [setup, setSetup] = useState<{ secret: string; uri: string } | null>(null);
  const [code, setCode] = useState("");
  const [backup, setBackup] = useState<string[] | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(null), 3000); };

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    call<{ enabled: boolean }>("/account/2fa", undefined, "GET").then((r) => setEnabled(r.enabled)).catch(() => {});
  }, [router]);

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    try { await call("/account/profile", { name }, "PATCH"); flash("Profile updated"); } catch (err) { flash(msgOf(err)); }
  }
  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    try { await call("/account/password", { currentPassword: current, newPassword: next }); setCurrent(""); setNext(""); flash("Password changed"); } catch (err) { flash(msgOf(err)); }
  }
  async function begin2fa() {
    try { setSetup(await call<{ secret: string; uri: string }>("/account/2fa/setup")); } catch (err) { flash(msgOf(err)); }
  }
  async function enable2fa() {
    try { const r = await call<{ backupCodes: string[] }>("/account/2fa/enable", { code }); setBackup(r.backupCodes); setEnabled(true); setSetup(null); setCode(""); } catch (err) { flash(msgOf(err)); }
  }
  async function disable2fa() {
    const c = window.prompt("Enter a current 2FA code (or a backup code) to disable:");
    if (!c) return;
    try { await call("/account/2fa/disable", { code: c }); setEnabled(false); flash("2FA disabled"); } catch (err) { flash(msgOf(err)); }
  }

  return (
    <main className="mx-auto max-w-lg space-y-6 px-6 py-16">
      <h1 className="text-2xl font-bold">Account settings</h1>
      {msg && <p className="rounded-xl border border-hairline bg-surface px-4 py-2 text-sm">{msg}</p>}

      <form onSubmit={saveName} className={card}>
        <h2 className="font-semibold">Profile</h2>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New display name" className={field} />
        <button className={btn}>Save name</button>
      </form>

      <form onSubmit={savePassword} className={card}>
        <h2 className="font-semibold">Change password</h2>
        <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="Current password" className={field} />
        <input type="password" value={next} onChange={(e) => setNext(e.target.value)} placeholder="New password (min 8)" className={field} />
        <button className={btn}>Change password</button>
      </form>

      <div className={card}>
        <h2 className="font-semibold">Two-factor authentication {enabled && <span className="text-green-500">· on</span>}</h2>
        {!enabled && !setup && <button onClick={begin2fa} className={btn}>Enable 2FA</button>}
        {!enabled && setup && (
          <div className="space-y-3">
            <p className="text-sm text-muted">Add this secret to your authenticator app (Google Authenticator, Authy…):</p>
            <code className="block break-all rounded-lg bg-surface p-3 text-sm">{setup.secret}</code>
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="6-digit code" className={field} />
            <button onClick={enable2fa} className={btn}>Verify & enable</button>
          </div>
        )}
        {enabled && <button onClick={disable2fa} className="rounded-full border border-hairline px-4 py-2 text-sm">Disable 2FA</button>}
        {backup && (
          <div className="mt-2 space-y-2">
            <p className="text-sm font-medium">Save these backup codes (shown once):</p>
            <ul className="grid grid-cols-2 gap-1 rounded-lg bg-surface p-3 font-mono text-sm">
              {backup.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
