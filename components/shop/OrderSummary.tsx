"use client";

import { useState } from "react";
import { Tag, X } from "lucide-react";
import { useCartLines } from "@/lib/cart";
import { useShopStore } from "@/store/useShopStore";
import { useLangStore, useLocalized } from "@/lib/i18n";
import { money } from "@/lib/format";

function PromoField() {
  const l = useLocalized();
  const lang = useLangStore((s) => s.lang);
  const applied = useShopStore((s) => s.promo);
  const setPromo = useShopStore((s) => s.setPromo);
  const { promo } = useCartLines();
  const [draft, setDraft] = useState("");

  if (applied && promo?.ok) {
    return (
      <div className="flex items-center justify-between rounded-xl bg-[#2E6B4F]/10 px-3 py-2.5 text-sm text-[#1f5a3f]">
        <span className="inline-flex items-center gap-2 font-semibold"><Tag className="h-4 w-4" /><bdi dir="ltr">{applied.toUpperCase()}</bdi></span>
        <button onClick={() => { setPromo(""); setDraft(""); }} aria-label={l({ en: "Remove code", ar: "إزالة الكود" })} className="rounded-full p-1 hover:bg-black/5"><X className="h-4 w-4" /></button>
      </div>
    );
  }

  const error = applied && promo && !promo.ok ? promo.error?.[lang] : undefined;
  return (
    <div className="space-y-1.5">
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); setPromo(draft.trim()); } }}
          dir="ltr"
          autoComplete="off"
          placeholder={l({ en: "Promo code", ar: "كود الخصم" })}
          aria-label={l({ en: "Promo code", ar: "كود الخصم" })}
          className="min-w-0 flex-1 rounded-xl border border-n300 bg-sandy px-3 py-2.5 text-sm uppercase outline-none transition placeholder:normal-case focus:border-green focus:ring-2 focus:ring-green/20"
        />
        <button type="button" onClick={() => setPromo(draft.trim())} disabled={!draft.trim()} className="rounded-xl border border-green px-4 py-2.5 text-sm font-semibold text-green transition hover:bg-green hover:text-sandy active:scale-[0.97] disabled:opacity-40">
          {l({ en: "Apply", ar: "تطبيق" })}
        </button>
      </div>
      {error && <p role="alert" className="text-xs text-[#A8322F]">{error}</p>}
    </div>
  );
}

export default function OrderSummary({ showItems = false, promoField = true }: { showItems?: boolean; promoField?: boolean }) {
  const { lines, subtotal, savings, count, discountAmount, promo, shipping, total } = useCartLines();
  const code = useShopStore((s) => s.promo);
  const l = useLocalized();
  const lang = useLangStore((s) => s.lang);
  const row = "flex items-center justify-between text-sm";
  return (
    <div className="space-y-3">
      {showItems && (
        <ul className="space-y-3 border-b border-n200 pb-4">
          {lines.map(({ key, item, variant, qty }) => (
            <li key={key} className="flex items-center gap-3 text-sm">
              <span className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                <span className="absolute -end-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-green px-1 text-[11px] font-semibold text-sandy"><bdi>{qty}</bdi></span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-green">{item.name[lang]}</span>
                <span className="text-xs text-n400">{variant.label[lang]}</span>
              </span>
              <bdi className="font-medium text-green">{money(variant.price * qty, lang)}</bdi>
            </li>
          ))}
        </ul>
      )}
      {promoField && <PromoField />}
      <div className={row}><span className="text-n500">{l({ en: `Subtotal (${count})`, ar: `المجموع (${count})` })}</span><bdi>{money(subtotal, lang)}</bdi></div>
      {savings > 0 && <div className={`${row} text-[#2E6B4F]`}><span>{l({ en: "You save", ar: "وفّرت" })}</span><bdi>{money(savings, lang)}</bdi></div>}
      {code && promo?.ok && discountAmount > 0 && (
        <div className={`${row} text-[#2E6B4F]`}><span>{l({ en: "Promo code", ar: "كود الخصم" })}</span><bdi>-{money(discountAmount, lang)}</bdi></div>
      )}
      <div className={row}>
        <span className="text-n500">{l({ en: "Delivery", ar: "التوصيل" })}</span>
        {shipping ? (
          <bdi className={shipping.free ? "font-medium text-[#2E6B4F]" : ""}>{shipping.free ? l({ en: "Free", ar: "مجاني" }) : money(shipping.price, lang)}</bdi>
        ) : (
          <span className="text-n500">{l({ en: "We confirm it by phone", ar: "نؤكده بالهاتف" })}</span>
        )}
      </div>
      <div className="flex items-center justify-between border-t border-n200 pt-3 text-base font-semibold text-green">
        <span>{l({ en: "Total", ar: "الإجمالي" })}</span><bdi className="text-lg">{money(total, lang)}</bdi>
      </div>
    </div>
  );
}
