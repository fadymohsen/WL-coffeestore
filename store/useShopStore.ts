import { create } from "zustand";

export interface CoffeeProduct {
  id: string;
  category: "توليفة" | "مختصة" | "تركي";
  categoryEn: "BLEND" | "SPECIALTY" | "TURKISH";
  title: string;
  titleAr: string;
  region: string;
  regionEn: string;
  tastingNotes: string[];
  tastingNotesEn: string[];
  price: number;
  weight: string;
  bagColor: string;
  description: string;
  descriptionEn: string;
}

export const COFFEE_CATALOG: CoffeeProduct[] = [
  {
    id: "uns-blend",
    category: "توليفة",
    categoryEn: "BLEND",
    title: "Uns",
    titleAr: "أُنس",
    region: "توليفة يومية مألوفة",
    regionEn: "Familiar Daily Blend",
    tastingNotes: ["متوازن", "شوكولاتة", "مكسرات"],
    tastingNotesEn: ["Balanced", "Chocolate", "Nuts"],
    price: 120,
    weight: "250g",
    bagColor: "#0E3A33",
    description: "توليفة يومية مألوفة، واضحة وسهلة الاختيار. متاحة سادة أو محوج.",
    descriptionEn: "A familiar daily blend, clear and easy to choose. Available plain or spiced.",
  },
  {
    id: "majlis-blend",
    category: "توليفة",
    categoryEn: "BLEND",
    title: "Majlis",
    titleAr: "مجلس",
    region: "توليفة للضيافة",
    regionEn: "Hospitality Blend",
    tastingNotes: ["غني", "كراميل", "توابل"],
    tastingNotesEn: ["Rich", "Caramel", "Spices"],
    price: 145,
    weight: "250g",
    bagColor: "#A8432C",
    description: "توليفة للمجالس والضيافة. طعم غني يليق بالمناسبات.",
    descriptionEn: "A blend for gatherings and hospitality. A rich taste worthy of occasions.",
  },
  {
    id: "rihla-ethiopia",
    category: "مختصة",
    categoryEn: "SPECIALTY",
    title: "Rihla",
    titleAr: "رحلة",
    region: "إثيوبيا · يرغاتشيفي",
    regionEn: "Ethiopia · Yirgacheffe",
    tastingNotes: ["زهور", "خوخ", "برغموت"],
    tastingNotesEn: ["Floral", "Peach", "Bergamot"],
    price: 185,
    weight: "250g",
    bagColor: "#2A5B77",
    description: "قهوة مختصة من إثيوبيا. لمن يحب يستكشف مذاقات جديدة.",
    descriptionEn: "Specialty coffee from Ethiopia. For those who love to explore new flavors.",
  },
  {
    id: "sultan-turkish",
    category: "تركي",
    categoryEn: "TURKISH",
    title: "Sultan",
    titleAr: "سلطان",
    region: "تحميص غامق · محوج",
    regionEn: "Dark Roast · Spiced",
    tastingNotes: ["هيل", "تحميص غامق", "كريمي"],
    tastingNotesEn: ["Cardamom", "Dark Roast", "Creamy"],
    price: 95,
    weight: "200g",
    bagColor: "#4A463F",
    description: "قهوة تركي بالهيل. تحميص غامق وطحن ناعم للركوة.",
    descriptionEn: "Turkish coffee with cardamom. Dark roast and finely ground for the cezve.",
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
