"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ShoppingBag, X } from "lucide-react";
import { setScrollLocked } from "@/components/providers/SmoothScrollProvider";
import CartLines from "@/components/shop/CartLines";
import OrderSummary from "@/components/shop/OrderSummary";
import { useCartLines } from "@/lib/cart";
import { useShopStore } from "@/store/useShopStore";
import { useLangStore, useLocalized } from "@/lib/i18n";
import { useTrap } from "@/lib/useTrap";

export default function CartDrawer() {
  const isOpen = useShopStore((s) => s.isCartOpen);
  const setOpen = useShopStore((s) => s.setCartOpen);
  const { lines, count, blocked } = useCartLines();
  const lang = useLangStore((s) => s.lang);
  const l = useLocalized();
  const [loading, setLoading] = useState(false);
  const trap = useTrap(() => setOpen(false));

  useEffect(() => {
    if (!isOpen) return;
    setScrollLocked(true);
    // brief skeleton so a freshly opened bag never flashes stale lines
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const t = window.setTimeout(() => setLoading(false), 320);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      setScrollLocked(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, setOpen]);

  const off = lang === "ar" ? "-100%" : "100%";
  const close = () => setOpen(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[2px]"
          onClick={close}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.aside
            ref={trap}
            role="dialog"
            aria-modal="true"
            aria-label={l({ en: "Your bag", ar: "سلتك" })}
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
            initial={{ x: off }}
            animate={{ x: 0 }}
            exit={{ x: off }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className={`flex h-full w-full max-w-[26rem] flex-col bg-sandy shadow-2xl ${lang === "ar" ? "me-auto" : ""}`}
          >
            <div className="flex items-center justify-between border-b border-n200 px-5 py-4">
              <h3 className="font-editorial text-2xl font-semibold text-green">
                {l({ en: "Your bag", ar: "سلتك" })} <bdi className="text-base font-normal text-n400">({count})</bdi>
              </h3>
              <button onClick={close} aria-label={l({ en: "Close", ar: "إغلاق" })} className="rounded-full p-2.5 text-green transition hover:bg-green/10 active:scale-90">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {!loading && lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-green/10 text-green"><ShoppingBag className="h-7 w-7" /></span>
                  <p className="font-editorial text-2xl font-semibold text-green">{l({ en: "Your bag is empty", ar: "السلة فارغة" })}</p>
                  <p className="max-w-[16rem] text-sm text-n500">{l({ en: "Nine blends are waiting. Start with the one that sounds like your morning.", ar: "ابدأ بإحدى التوليفات التسع." })}</p>
                  <Link href="/shop" onClick={close} className="btn btn-primary mt-1">{l({ en: "Browse the shop", ar: "تصفّح المتجر" })}</Link>
                </div>
              ) : (
                <CartLines compact loading={loading} />
              )}
            </div>

            {lines.length > 0 && !loading && (
              <div className="border-t border-n200 bg-n100 px-5 py-5">
                <OrderSummary />
                {blocked && <p role="alert" className="mt-3 text-xs text-[#A8322F]">{l({ en: "Fix the highlighted items to continue.", ar: "راجع المنتجات المنبَّه عليها لتكمل الطلب." })}</p>}
                <Link
                  href="/checkout"
                  onClick={(e) => { if (blocked) e.preventDefault(); else close(); }}
                  aria-disabled={blocked}
                  className={`btn btn-primary mt-4 w-full ${blocked ? "pointer-events-none opacity-40" : ""}`}
                >
                  {l({ en: "Checkout", ar: "إتمام الطلب" })}
                </Link>
                <Link href="/cart" onClick={close} className="mt-3 block text-center text-sm font-medium text-green underline-offset-4 hover:underline">
                  {l({ en: "View full bag", ar: "عرض السلة كاملة" })}
                </Link>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
