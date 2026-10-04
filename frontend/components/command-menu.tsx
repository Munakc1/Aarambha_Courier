"use client";
import { useRouter } from "next/navigation";
import { CommandPalette } from "@lacspace/ui";

export function CommandMenu() {
  const router = useRouter();
  return (
    <CommandPalette
      accent="#a855f7"
      items={[
        { id: "home", label: "Home", group: "Navigate", shortcut: "G H", onSelect: () => router.push("/") },
        { id: "about", label: "About", group: "Navigate", onSelect: () => router.push("/about") },
        { id: "contact", label: "Contact", group: "Navigate", onSelect: () => router.push("/contact") },
        { id: "packages", label: "Lacspace packages", group: "Links", onSelect: () => window.open("https://lacspace.com/packages", "_blank") },
      ]}
    />
  );
}
