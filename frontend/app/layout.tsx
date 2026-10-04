import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@lacspace/theme";
import { site } from "@/lib/site";
import { CommandMenu } from "@/components/command-menu";
import { AnnouncementBar } from "@/components/announcement-bar";
import SiteHeader from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
// @ts-expect-error -- Next.js handles CSS side-effect imports during compilation.
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = site.meta({ title: "LSFolio" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${inter.className}`} suppressHydrationWarning>
      <body className="antialiased">
        {/* Keyboard users land here first and can jump past the nav (WCAG 2.4.1). */}
        <a href="#main" className="skip-link">Skip to content</a>
        {/* ✨ Dark / light / system theming with a built-in no-flash script — @lacspace/theme */}
        <ThemeProvider defaultTheme="dark">
          {/* ✨ Press ⌘K / Ctrl-K anywhere — powered by @lacspace/ui */}
          <CommandMenu />
          <AnnouncementBar />
          <SiteHeader />
          <div id="main" tabIndex={-1}>{children}</div>
          <SiteFooter />
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(site.rootJsonLd()) }}
        />
      </body>
    </html>
  );
}
