"use client";

import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useShopStore } from "@/store/useShopStore";
import { useToastStore } from "@/store/useToastStore";
import { useCartLines, type CartLine } from "@/lib/cart";
import { useLangStore, useLocalized } from "@/lib/i18n";
import { money } from "@/lib/format";

export function LineSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-n200 bg-n100/70 p-3" aria-hidden="true">
      <div className="h-16 w-16 animate-pulse rounded-lg bg-n200" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-2/3 animate-pulse rounded bg-n200" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-n200" />
      </div>
      <div className="h-8 w-20 animate-pulse rounded-full bg-n200" />
    </div>
  );
}

function Line({ line, compact }: { line: CartLine; compact?: boolean }) {
  const lang = useLangStore((s) => s.lang);
  const l = useLocalized();
  const add = useShopStore((s) => s.addToCart);
  const remove = useShopStore((s) => s.removeFromCart);
  const drop = useShopStore((s) => s.deleteLine);
  const push = useToastStore((s) => s.push);
  const { item, variant, qty } = line;
  const atMax = variant.stock !== null && qty >= variant.stock;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: lang === "ar" ? 40 : -40, transition: { duration: 0.2 } }}
      className="flex gap-4 rounded-xl border border-n200 bg-n100/70 p-3"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.image} alt="" className={`shrink-0 rounded-lg object-cover ${compact ? "h-16 w-16" : "h-20 w-20 sm:h-24 sm:w-24"}`} />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-semibold text-green">{item.name[lang]}</p>
            <p className="text-xs text-n400">{variant.label[lang]}</p>
          </div>
          <button onClick={() => { const q = line.qty; drop(line.key); push(l({ en: `${item.name.en} removed`, ar: `تمت إزالة ${item.name.ar}` }), "ok", { label: l({ en: "Undo", ar: "تراجع" }), run: () => add(line.key, q) }); }} aria-label={l({ en: `Remove ${item.name.en}`, ar: `إزالة ${item.name.ar}` })} className="-m-1.5 rounded-full p-2.5 text-n400 transition hover:bg-[#A8322F]/10 hover:text-[#A8322F]">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-auto flex items-end justify-between pt-3">
          <div className="inline-flex items-center rounded-full border border-n300 bg-sandy/60">
            <button onClick={() => remove(line.key)} aria-label={l({ en: "Decrease quantity", ar: "تقليل الكمية" })} className="rounded-full p-2.5 text-green transition hover:bg-green/10 active:scale-90">
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-7 text-center text-sm font-semibold text-green" aria-live="polite"><bdi>{qty}</bdi></span>
            <button disabled={atMax} onClick={() => add(line.key)} aria-label={l({ en: "Increase quantity", ar: "زيادة الكمية" })} className="rounded-full p-2.5 text-green transition hover:bg-green/10 active:scale-90 disabled:opacity-30">
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="text-end">
            {variant.compareAt && variant.compareAt > variant.price && (
              <p className="text-[11px] text-n400 line-through"><bdi>{money(variant.compareAt * qty, lang)}</bdi></p>
            )}
            <p className="font-semibold text-green"><bdi>{money(variant.price * qty, lang)}</bdi></p>
          </div>
        </div>

        {line.unavailable && <p className="mt-2 text-xs text-[#A8322F]">{l({ en: "This item is no longer available.", ar: "هذا المنتج لم يعد متوفراً." })}</p>}
        {!line.unavailable && line.overStock && (
          <p className="mt-2 text-xs text-[#9A6B12]">{l({ en: `Only ${variant.stock} left. Reduce the quantity.`, ar: `المتبقي ${variant.stock} فقط، قلل الكمية.` })}</p>
        )}
      </div>
    </motion.li>
  );
}

export default function CartLines({ compact, loading }: { compact?: boolean; loading?: boolean }) {
  const { lines } = useCartLines();
  if (loading) {
    return (
      <div className="space-y-3">
        <LineSkeleton />
        <LineSkeleton />
      </div>
    );
  }
  return (
    <ul className="space-y-3">
      <AnimatePresence initial={false}>
        {lines.map((line) => (
          <Line key={line.key} line={line} compact={compact} />
        ))}
      </AnimatePresence>
    </ul>
  );
}
