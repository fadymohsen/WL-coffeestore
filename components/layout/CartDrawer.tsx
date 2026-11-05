"use client";

import { useEffect } from "react";
import { Minus, Plus, X } from "lucide-react";
import { setScrollLocked } from "@/components/providers/SmoothScrollProvider";
import { COFFEE_CATALOG, useShopStore } from "@/store/useShopStore";

export default function CartDrawer() {
  const { cart, isCartOpen, setCartOpen, addToCart, removeFromCart } = useShopStore();
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = COFFEE_CATALOG.reduce((sum, p) => sum + (cart[p.id] || 0) * p.price, 0);
  const items = COFFEE_CATALOG.filter((p) => cart[p.id]);

  useEffect(() => {
    if (!isCartOpen) return;
    setScrollLocked(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      setScrollLocked(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [isCartOpen, setCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs"
      onClick={() => setCartOpen(false)}
    >
      <aside
        role="dialog"
        aria-label="حقيبتك"
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-md flex-col justify-between overflow-y-auto border-l border-n200 bg-n100 p-6 shadow-2xl"
      >
        <div>
          <div className="flex items-center justify-between border-b border-n200 pb-4">
            <h3 className="font-editorial text-2xl text-green">حقيبتك ({totalItems})</h3>
            <button
              onClick={() => setCartOpen(false)}
              aria-label="إغلاق الحقيبة"
              className="rounded-full p-2 hover:bg-green/10"
            >
              <X className="h-5 w-5 text-green" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {items.length === 0 && (
              <p className="py-10 text-center text-sm text-n400">الحقيبة فاضية</p>
            )}
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-[10px] border border-n200 bg-sandy/70 p-3"
              >
                <div>
                  <div className="text-sm font-semibold text-green">{item.title}</div>
                  <div className="font-arabic text-xs text-n400">{item.titleAr}</div>
                  <div className="text-xs text-n400">
                    {item.region} · {item.price} EGP
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove one ${item.title}`}
                    className="rounded-full bg-green/10 p-1"
                  >
                    <Minus className="h-3.5 w-3.5 text-green" />
                  </button>
                  <span className="w-5 text-center text-xs font-bold text-green">{cart[item.id]}</span>
                  <button
                    onClick={() => addToCart(item.id)}
                    aria-label={`Add one ${item.title}`}
                    className="rounded-full bg-green/10 p-1"
                  >
                    <Plus className="h-3.5 w-3.5 text-green" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-n200 pt-4">
          <div className="mb-4 flex items-center justify-between text-sm font-bold text-green">
            <span>الإجمالي</span>
            <span>{subtotal} EGP</span>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="w-full rounded-full bg-green py-3 text-xs font-bold uppercase tracking-widest text-sandy transition hover:bg-green/90"
          >
            إتمام الطلب
          </button>
        </div>
      </aside>
    </div>
  );
}
