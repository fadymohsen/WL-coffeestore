"use client";

import { useEffect, useMemo, useState } from "react";
import { inStock, isLive, resolveLine, useCatalogStore, type CatalogItem, type CatalogVariant } from "@/store/useCatalogStore";
import { useShopStore } from "@/store/useShopStore";
import { applyCode, findRate, shippingFor } from "@/lib/pricing";

/** True once the saved bag has been read from the browser. */
export function useBagReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const unsub = useShopStore.persist.onFinishHydration(() => setReady(true));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (useShopStore.persist.hasHydrated()) setReady(true);
    return unsub;
  }, []);
  return ready;
}

export interface CartLine {
  key: string;
  qty: number;
  item: CatalogItem;
  variant: CatalogVariant;
  /** Quantity asked for is more than the tracked stock */
  overStock: boolean;
  unavailable: boolean;
}

/** The bag, joined with the live catalog so prices and stock are never stale. */
export function useCartLines() {
  const cart = useShopStore((s) => s.cart);
  const items = useCatalogStore((s) => s.items);
  const discounts = useCatalogStore((s) => s.discounts);
  const rates = useCatalogStore((s) => s.shippingRates);
  const promo = useShopStore((s) => s.promo);
  const city = useShopStore((s) => s.shipCity);
  // read the clock after mount, so the prerendered page does not freeze a date
  const [now, setNow] = useState(0);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
  }, [promo]);

  return useMemo(() => {
    const lines: CartLine[] = Object.entries(cart)
      .map(([key, qty]) => {
        const r = resolveLine(items, key);
        if (!r) return null;
        const unavailable = !isLive(r.item) || !inStock(r.variant);
        const overStock = r.variant.stock !== null && qty > r.variant.stock;
        return { key, qty, ...r, unavailable, overStock };
      })
      .filter((x): x is CartLine => !!x);
    const count = lines.reduce((a, b) => a + b.qty, 0);
    const subtotal = lines.reduce((a, b) => a + b.qty * b.variant.price, 0);
    const savings = lines.reduce((a, b) => a + (b.variant.compareAt && b.variant.compareAt > b.variant.price ? (b.variant.compareAt - b.variant.price) * b.qty : 0), 0);
    const blocked = lines.some((l) => l.unavailable || l.overStock);
    const code = promo ? applyCode(promo, lines, subtotal, discounts, now || 1e15) : null;
    const discountAmount = code?.ok ? code.amount : 0;
    const after = subtotal - discountAmount;
    const ship = shippingFor(findRate(rates, city), after, !!code?.ok && code.freeShipping);
    const total = after + (ship?.price ?? 0);
    return { lines, count, subtotal, savings, blocked, promo: code, discountAmount, shipping: ship, total };
  }, [cart, items, discounts, rates, promo, city, now]);
}
