import { NextResponse } from "next/server";

// Demo endpoint powering <LiveStats/> (@lacspace/query). Swap in your real data.
export const dynamic = "force-dynamic";

export function GET() {
  const jitter = (n: number) => n + Math.floor(Math.random() * n * 0.04);
  return NextResponse.json({
    users: jitter(12480),
    uptime: 99.98,
    requests: jitter(1_840_000),
  });
}
