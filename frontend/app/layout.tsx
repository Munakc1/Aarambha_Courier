import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";

import { ThemeProvider } from "@lacspace/theme";
import { site } from "@/lib/site";
import PublicSiteLayout from "@/components/public-site-layout";

// @ts-expect-error Next.js handles this stylesheet import.
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = site.meta({
  title: "Aarambha Courier",
});

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${inter.className}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeProvider defaultTheme="dark">
          <PublicSiteLayout>{children}</PublicSiteLayout>
        </ThemeProvider>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(site.rootJsonLd()),
          }}
        />
      </body>
    </html>
  );
}
