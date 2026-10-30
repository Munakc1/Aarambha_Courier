
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

  // Hide the public website layout on dashboard routes,
  // but keep it visible on vendor login and register pages.
  const isDashboard =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/vendor" ||
    (pathname.startsWith("/vendor/") &&
      pathname !== "/vendor/login" &&
      pathname !== "/vendor/register") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/rider" ||
    pathname.startsWith("/rider/");

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
