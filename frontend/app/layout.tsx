import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ThemeProvider } from "@lacspace/theme";
import { site } from "@/lib/site";
import PublicSiteLayout from "@/components/public-site-layout";


import "./globals.css";

export const metadata: Metadata = site.meta({
  title: "Aarambha Courier",
});

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="font-inter" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider defaultTheme="light">
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