
"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { CommandMenu } from "@/components/command-menu";
import { AnnouncementBar } from "@/components/announcement-bar";
import SiteHeader from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function PublicSiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  // Hide public website navigation on all authenticated dashboard routes.
  const isDashboard =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/vendor" ||
    pathname.startsWith("/vendor/");

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <CommandMenu />
      <AnnouncementBar />
      <SiteHeader />

      <main id="main" tabIndex={-1}>
        {children}
      </main>

      <SiteFooter />
    </>
  );
}
