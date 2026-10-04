"use client";
import { useState } from "react";
import { useSSE } from "@lacspace/sse/react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function LivePage() {
  const [log, setLog] = useState<string[]>([]);
  const { status } = useSSE(API + "/live", {
    onEvent: { message: (m) => setLog((prev) => [String((m as { text?: string }).text ?? ""), ...prev].slice(0, 50)) },
  });

  async function broadcast() {
    await fetch(API + "/live/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "Hello at " + new Date().toLocaleTimeString() }),
    });
  }

  return (
    <main className="mx-auto max-w-lg px-6 py-16">
      <h1 className="text-2xl font-bold">Live feed</h1>
      <p className="mt-1 text-muted">Server-Sent Events — status: {status}.</p>
      <button className="mt-4 rounded-xl border border-hairline px-4 py-2" onClick={broadcast}>Broadcast a message</button>
      <ul className="mt-6 space-y-2">
        {log.map((line, i) => (<li key={i} className="rounded-xl border border-hairline p-3">{line}</li>))}
      </ul>
    </main>
  );
}
