import type { CartLine } from "@/lib/cart";
import type { Bi } from "@/data/products";
import type { Discount, ShippingRate } from "@/store/useCatalogStore";

export interface DiscountResult {
  ok: boolean;
  /** EGP taken off the subtotal */
  amount: number;
  freeShipping: boolean;
  discount?: Discount;
  error?: Bi;
}

/** Check a promo code against the bag. Every rule is re-read from the discount record. */
export function applyCode(code: string, lines: CartLine[], subtotal: number, discounts: Discount[], now: number): DiscountResult {
  const c = code.trim().toLowerCase();
  const fail = (en: string, ar: string): DiscountResult => ({ ok: false, amount: 0, freeShipping: false, error: { en, ar } });
  if (!c) return fail("Enter a code.", "أدخل الكود.");
  const d = discounts.find((x) => x.code.toLowerCase() === c);
  if (!d || !d.active) return fail("This code is not valid.", "هذا الكود غير صحيح.");
  if (d.startsAt && now < d.startsAt) return fail("This code is not active yet.", "هذا الكود لم يبدأ بعد.");
  if (d.endsAt && now > d.endsAt) return fail("This code has expired.", "انتهت صلاحية هذا الكود.");
  if (d.usageLimit !== null && d.used >= d.usageLimit) return fail("This code has been used up.", "تم استخدام هذا الكود بالكامل.");

  const eligible = d.scope === "all" ? lines : lines.filter((l) => l.item.categoryId === d.scope);
  if (eligible.length === 0) return fail("This code does not apply to what is in your bag.", "هذا الكود لا ينطبق على منتجات سلتك.");
  const base = eligible.reduce((a, l) => a + l.qty * l.variant.price, 0);
  if (subtotal < d.minSubtotal) return fail(`Add ${d.minSubtotal - subtotal} EGP more to use this code.`, `أضف ${d.minSubtotal - subtotal} ج.م لاستخدام الكود.`);

  if (d.type === "shipping") return { ok: true, amount: 0, freeShipping: true, discount: d };
  const raw = d.type === "percent" ? Math.round((base * Math.min(100, d.value)) / 100) : d.value;
  return { ok: true, amount: Math.min(raw, base), freeShipping: false, discount: d };
}

export function findRate(rates: ShippingRate[], city: string) {
  const live = rates.filter((r) => r.active);
  const c = city.trim().toLowerCase();
  if (!c) return null;
  return live.find((r) => r.cities.some((x) => x !== "*" && c.includes(x.toLowerCase()))) ?? live.find((r) => r.cities.includes("*")) ?? null;
}

export function shippingFor(rate: ShippingRate | null, subtotalAfterDiscount: number, freeShipping: boolean) {
  if (!rate) return null;
  const free = freeShipping || (rate.freeOver !== null && subtotalAfterDiscount >= rate.freeOver);
  return { rate, price: free ? 0 : rate.price, free };
}
