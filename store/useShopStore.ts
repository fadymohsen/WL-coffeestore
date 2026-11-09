"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Cart lines are keyed `${productId}:${variantKey}`, see lineKey() in useCatalogStore. */
interface ShopState {
  cart: Record<string, number>;
  wishlist: Record<string, boolean>;
  isCartOpen: boolean;
  promo: string;
  shipCity: string;
  setPromo: (code: string) => void;
  setShipCity: (city: string) => void;
  addToCart: (key: string, n?: number) => void;
  removeFromCart: (key: string) => void;
  deleteLine: (key: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  setCartOpen: (open: boolean) => void;
}

export const useShopStore = create<ShopState>()(
  persist(
    (set) => ({
  cart: {},
  wishlist: {},
  isCartOpen: false,
  promo: "",
  shipCity: "",
  setPromo: (promo) => set({ promo }),
  setShipCity: (shipCity) => set({ shipCity }),
  addToCart: (key, n = 1) => set((s) => ({ cart: { ...s.cart, [key]: (s.cart[key] || 0) + n } })),
  removeFromCart: (key) =>
    set((s) => {
      const next = { ...s.cart };
      if ((next[key] || 0) <= 1) delete next[key];
      else next[key] -= 1;
      return { cart: next };
    }),
  deleteLine: (key) =>
    set((s) => {
      const next = { ...s.cart };
      delete next[key];
      return { cart: next };
    }),
  clearCart: () => set({ cart: {}, promo: "" }),
  toggleWishlist: (id) => set((s) => ({ wishlist: { ...s.wishlist, [id]: !s.wishlist[id] } })),
  setCartOpen: (open) => set({ isCartOpen: open }),
}),
    { name: "diwan-bag-v1", skipHydration: true, partialize: (s) => ({ cart: s.cart, wishlist: s.wishlist, promo: s.promo }) },
  ),
);
