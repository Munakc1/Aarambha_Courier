import "@lacspace/components/styles.css";
import "@lacspace/charts/styles.css";
import "@lacspace/table/styles.css";
import "@lacspace/date/styles.css";
import "../lacspace-ui.css";

// Scoped to this route; move these imports to app/layout.tsx to use the kit
// everywhere. Order matters: lacspace-ui.css maps this app's tokens onto the
// kit, so it comes last.
export default function InsightsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
