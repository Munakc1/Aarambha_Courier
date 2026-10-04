"use client";
import { toast } from "@/components/toaster";

export default function NotifyDemo() {
  return (
    <main className="mx-auto max-w-lg px-6 py-16">
      <h1 className="text-2xl font-bold">Toasts</h1>
      <p className="mt-1 text-muted">In-app notifications from @lacspace/notify.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button className="rounded-xl border border-hairline px-4 py-2" onClick={() => toast.success("Saved!")}>Success</button>
        <button className="rounded-xl border border-hairline px-4 py-2" onClick={() => toast.error("Something broke")}>Error</button>
        <button className="rounded-xl border border-hairline px-4 py-2" onClick={() => toast.info("Heads up", { action: { label: "Undo", onClick: () => toast.success("Undone") } })}>With action</button>
        <button className="rounded-xl border border-hairline px-4 py-2" onClick={() => void toast.promise(new Promise((r) => setTimeout(r, 1200)), { loading: "Working…", success: "Done!", error: "Failed" })}>Promise</button>
      </div>
    </main>
  );
}
