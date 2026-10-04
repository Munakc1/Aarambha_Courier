import { create, persist } from "@lacspace/store";

/** Ephemeral UI state — e.g. the mobile nav. Not persisted. */
interface UIState {
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
  toggleNav: () => void;
}
export const useUI = create<UIState>((set) => ({
  navOpen: false,
  setNavOpen: (navOpen) => set({ navOpen }),
  toggleNav: () => set((s) => ({ navOpen: !s.navOpen })),
}));

/** Whether the announcement bar was dismissed — persisted to localStorage. */
interface AnnouncementState {
  dismissed: boolean;
  dismiss: () => void;
}
export const useAnnouncement = create<AnnouncementState>(
  persist(
    (set) => ({
      dismissed: false,
      dismiss: () => set({ dismissed: true }),
    }),
    { name: "announcement" },
  ),
);

/** A tiny shopping cart — persisted to localStorage. */
export interface CartItem { id: string; name: string; price: number; }
interface CartState {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  clear: () => void;
}
export const useCart = create<CartState>(
  persist(
    (set) => ({
      items: [],
      add: (item) => set((s) => ({ items: [...s.items, item] })),
      remove: (id) => set((s) => {
        const i = s.items.findIndex((x) => x.id === id);
        if (i === -1) return {};
        const items = s.items.slice();
        items.splice(i, 1);
        return { items };
      }),
      clear: () => set({ items: [] }),
    }),
    { name: "cart" },
  ),
);
