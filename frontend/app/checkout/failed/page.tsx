import Link from "next/link";

export default function CheckoutFailedPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="text-2xl font-bold">Payment cancelled</h1>
      <p className="mt-2 text-muted">Your payment was not completed.</p>
      <Link href="/checkout" className="mt-6 inline-block rounded-full border border-hairline px-4 py-2 text-sm">Try again</Link>
    </main>
  );
}
