"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getToken } from "@/lib/api";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function CheckoutSuccessPage() {
  const [status, setStatus] = useState<"verifying" | "paid" | "failed">("verifying");
  const [detail, setDetail] = useState("");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const orderId = q.get("orderId");
    const data = q.get("data");   // eSewa returns a base64 `data` param
    const pidx = q.get("pidx");   // Khalti returns `pidx`
    const token = getToken();
    if (!orderId || !token) { setStatus("failed"); setDetail("Missing order or session — please sign in."); return; }
    (async () => {
      let path = ""; let body: Record<string, string> = {};
      if (data) { path = "/checkout/" + orderId + "/esewa/verify"; body = { data }; }
      else if (pidx) { path = "/checkout/" + orderId + "/khalti/verify"; body = { pidx }; }
      else { setStatus("failed"); setDetail("No payment token was returned."); return; }
      try {
        const res = await fetch(API + path, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
          body: JSON.stringify(body),
        });
        if (!res.ok) { const e: unknown = await res.json().catch(() => ({})); throw new Error((e as { error?: string }).error ?? "Verification failed"); }
        setStatus("paid");
      } catch (e) { setStatus("failed"); setDetail(e instanceof Error ? e.message : "Verification failed"); }
    })();
  }, []);

  return (
    <main className="mx-auto max-w-md px-6 py-24 text-center">
      {status === "verifying" && <p className="text-muted">Verifying your payment…</p>}
      {status === "paid" && (<><h1 className="text-3xl font-bold">Payment successful 🎉</h1><p className="mt-2 text-muted">Thank you — your order is paid.</p></>)}
      {status === "failed" && (<><h1 className="text-2xl font-bold">Payment not completed</h1><p className="mt-2 text-muted">{detail}</p></>)}
      <Link href="/checkout" className="mt-6 inline-block rounded-full border border-hairline px-4 py-2 text-sm">Back to checkout</Link>
    </main>
  );
}
