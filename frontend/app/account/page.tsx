"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getToken, setToken } from "@/lib/api";
import type { User, Note } from "@ammrambha_courier/types";

// how this works: a PROTECTED page. On mount it calls /auth/me with the stored
// token; if that fails it bounces to /login. Notes are the example CRUD resource.
export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    (async () => {
      try {
        setUser(await api.me());
        setNotes(await api.listNotes());
      } catch { setToken(null); router.push("/login"); }
    })();
  }, [router]);

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const note = await api.createNote({ title, body });
      setNotes((prev) => [note, ...prev]);
      setTitle(""); setBody("");
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to save"); }
  }
  async function remove(id: string) {
    await api.deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }
  function signOut() { setToken(null); router.push("/login"); }

  if (!user) return <main className="mx-auto max-w-2xl px-6 py-16 text-muted">Loading…</main>;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hi, {user.name}</h1>
          <p className="text-muted">{user.email}</p>
        </div>
        <button onClick={signOut} className="rounded-full border border-hairline px-4 py-2 text-sm transition hover:bg-surface">Sign out</button>
      </div>

      <form onSubmit={addNote} className="mt-8 space-y-3 rounded-2xl border border-hairline bg-surface p-5">
        <h2 className="font-semibold">Add a note</h2>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Title" className="w-full rounded-xl border border-hairline bg-app px-4 py-2 outline-none" />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write something…" rows={3} className="w-full rounded-xl border border-hairline bg-app px-4 py-2 outline-none" />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button className="rounded-full gradient-bg px-4 py-2 text-sm font-semibold on-accent">Save note</button>
      </form>

      <ul className="mt-6 space-y-3">
        {notes.length === 0 && <li className="text-muted">No notes yet — add your first above.</li>}
        {notes.map((n) => (
          <li key={n.id} className="flex items-start justify-between rounded-2xl border border-hairline p-4">
            <div>
              <p className="font-medium">{n.title}</p>
              {n.body && <p className="mt-1 text-sm text-muted">{n.body}</p>}
            </div>
            <button onClick={() => remove(n.id)} className="shrink-0 text-sm text-muted transition hover:text-red-400">Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
