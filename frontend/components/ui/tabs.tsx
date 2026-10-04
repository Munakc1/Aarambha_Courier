"use client";

import { useState, type ReactNode } from "react";

export function Tabs({ tabs }: { tabs: { label: string; content: ReactNode }[] }) {
  const [i, setI] = useState(0);
  return (
    <div>
      <div className="inline-flex flex-wrap gap-1 rounded-full border border-hairline bg-surface p-1">
        {tabs.map((t, idx) => (
          <button key={t.label} onClick={() => setI(idx)} className={"rounded-full px-4 py-2 text-sm font-medium transition " + (i === idx ? "gradient-bg on-accent" : "text-muted hover:text-fg")}>{t.label}</button>
        ))}
      </div>
      <div className="mt-6">{tabs[i]?.content}</div>
    </div>
  );
}
