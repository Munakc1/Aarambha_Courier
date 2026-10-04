"use client";
import { ToastProvider } from "@lacspace/components";

/**
 * Wrap <body> with this once to use the component kit across the whole app,
 * and import the two stylesheets in app/layout.tsx:
 *
 *   import "@lacspace/components/styles.css";
 *   import "./lacspace-ui.css";
 */
export function UIProvider({ children }: { children: React.ReactNode }) {
  return <ToastProvider position="bottom-right">{children}</ToastProvider>;
}
