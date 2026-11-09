import type { OrderStatus } from "@/store/useCatalogStore";

export const STATUSES: { id: OrderStatus; en: string; ar: string; cls: string }[] = [
  { id: "new", en: "New", ar: "جديد", cls: "bg-[#ffeb78] text-[#5e4200]" },
  { id: "confirmed", en: "Confirmed", ar: "مؤكد", cls: "bg-[#d4e7ff] text-[#0b3a78]" },
  { id: "packed", en: "Packed", ar: "تم التجهيز", cls: "bg-[#d9f0f2] text-[#0b4a52]" },
  { id: "shipped", en: "Shipped", ar: "تم الشحن", cls: "bg-[#e5d8ff] text-[#42237a]" },
  { id: "delivered", en: "Delivered", ar: "تم التسليم", cls: "bg-[#cdfee1] text-[#0c5132]" },
  { id: "cancelled", en: "Cancelled", ar: "ملغي", cls: "bg-[#e3e3e3] text-[#4a4a4a]" },
];

/** The happy path, in order. */
export const FLOW: OrderStatus[] = ["new", "confirmed", "packed", "shipped", "delivered"];

export const nextStatus = (s: OrderStatus): OrderStatus | null => {
  const i = FLOW.indexOf(s);
  return i >= 0 && i < FLOW.length - 1 ? FLOW[i + 1] : null;
};

export const COURIERS = ["Bosta", "Aramex", "J&T Express", "Mylerz", "Own delivery"];
