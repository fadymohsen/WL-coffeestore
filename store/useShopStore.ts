import { create } from "zustand";

export interface CoffeeProduct {
  id: string;
  category: "ORIGIN" | "ROAST" | "FLAVOR";
  title: string;
  region: string;
  tastingNotes: string[];
  price: number;
  weight: string;
  bagColor: string;
}

export const COFFEE_CATALOG: CoffeeProduct[] = [
  {
    id: "origin-ethiopia",
    category: "ORIGIN",
    title: "Halo Beriti",
    region: "Yirgacheffe · 2,150m",
    tastingNotes: ["Bergamot", "Jasmine", "Peach"],
    price: 26,
    weight: "250g",
    bagColor: "#8FA9B3",
  },
  {
    id: "roast-colombia",
    category: "ROAST",
    title: "Pink Bourbon",
    region: "Huila · Small Lot",
    tastingNotes: ["Panela", "Blood Orange", "Praline"],
    price: 29,
    weight: "250g",
    bagColor: "#C87D64",
  },
  {
    id: "flavor-kenya",
    category: "FLAVOR",
    title: "Gatomboya AA",
    region: "Nyeri · Washed SL28",
    tastingNotes: ["Blackcurrant", "Hibiscus", "Cacao"],
    price: 32,
    weight: "250g",
    bagColor: "#D8C5AE",
  },
];

interface ShopState {
  cart: Record<string, number>;
  wishlist: Record<string, boolean>;
  isCartOpen: boolean;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  toggleWishlist: (id: string) => void;
  setCartOpen: (open: boolean) => void;
}

export const useShopStore = create<ShopState>((set) => ({
  cart: {},
  wishlist: {},
  isCartOpen: false,
  addToCart: (id) =>
    set((s) => ({ cart: { ...s.cart, [id]: (s.cart[id] || 0) + 1 } })),
  removeFromCart: (id) =>
    set((s) => {
      const next = { ...s.cart };
      if ((next[id] || 0) <= 1) delete next[id];
      else next[id] -= 1;
      return { cart: next };
    }),
  toggleWishlist: (id) =>
    set((s) => ({ wishlist: { ...s.wishlist, [id]: !s.wishlist[id] } })),
  setCartOpen: (open) => set({ isCartOpen: open }),
}));
