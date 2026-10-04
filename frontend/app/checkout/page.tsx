"use client";
import { useState } from "react";
import { getToken } from "@/lib/api";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const msgOf = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong");

async function call<T>(path: string, body: unknown): Promise<T> {
  const token = getToken();
  const res = await fetch(API + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: "Bearer " + token } : {}) },
    body: JSON.stringify(body),
  });
  const data: unknown = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "Request failed");
  return data as T;
}

export default function CheckoutPage() {
  const [label, setLabel] = useState("Pro plan");
  const [amount, setAmount] = useState(1000);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function createOrder(e: React.FormEvent) {
    e.preventDefault();
    try {
      const o = await call<{ id: string; display: string }>("/checkout", { label, amount });
      setOrderId(o.id);
      setMsg("Order " + o.display + " created — choose how to pay.");
    } catch (err) { setMsg(msgOf(err)); }
  }
  async function payEsewa() {
    if (!orderId) return;
    try {
      const form = await call<{ action: string; fields: Record<string, string> }>("/checkout/" + orderId + "/esewa", {});
      const f = document.createElement("form");
      f.method = "POST";
      f.action = form.action;
      for (const [k, val] of Object.entries(form.fields)) {
        const i = document.createElement("input");
        i.type = "hidden"; i.name = k; i.value = val;
        f.appendChild(i);
      }
      document.body.appendChild(f);
      f.submit();
    } catch (err) { setMsg(msgOf(err)); }
  }
  async function payKhalti() {
    if (!orderId) return;
    try {
      const r = await call<{ paymentUrl: string }>("/checkout/" + orderId + "/khalti", {});
      window.location.href = r.paymentUrl;
    } catch (err) { setMsg(msgOf(err)); }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <p className="mt-1 text-sm text-muted">Sign in first, then create an order and pay.</p>
      <form onSubmit={createOrder} className="mt-6 space-y-3 rounded-2xl border border-hairline p-5">
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="What are you buying?" className="w-full rounded-xl border border-hairline bg-surface px-4 py-2 outline-none" />
        <input type="number" min={10} value={amount} onChange={(e) => setAmount(Number(e.target.value))} placeholder="Amount (NPR)" className="w-full rounded-xl border border-hairline bg-surface px-4 py-2 outline-none" />
        <button className="w-full rounded-full gradient-bg px-4 py-2 font-semibold on-accent">Create order</button>
      </form>
      {msg && <p className="mt-4 text-sm text-muted">{msg}</p>}
      {orderId && (
        <div className="mt-6 space-y-3">
          <button onClick={payEsewa} className="w-full rounded-full border border-hairline px-4 py-3 font-semibold transition hover:bg-surface">Pay with eSewa <span className="text-muted">(works in test)</span></button>
          <button onClick={payKhalti} className="w-full rounded-full border border-hairline px-4 py-3 font-semibold transition hover:bg-surface">Pay with Khalti</button>
        </div>
      )}
      <p className="mt-6 text-xs text-muted">eSewa works out-of-the-box in test mode. Khalti needs KHALTI_SECRET in .env.</p>
    </main>
  );
}
