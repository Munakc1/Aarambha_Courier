import "@lacspace/components/styles.css";
import "../lacspace-ui.css";
import { ToastProvider } from "@lacspace/components";

// Scoped to this route so the add-on needs no edits to app/layout.tsx. To use
// the kit across the whole app, move these two imports there and wrap <body>
// with <UIProvider> from @/components/ui-provider instead.
export default function UILayout({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
