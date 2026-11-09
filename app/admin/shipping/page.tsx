"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { PageHead, btnDark, btnLight, card, input } from "@/components/admin/AdminShell";
import { useCatalogStore, type ShippingRate } from "@/store/useCatalogStore";
import { useToastStore } from "@/store/useToastStore";
import { useLangStore, useLocalized } from "@/lib/i18n";
import { askConfirm } from "@/lib/confirm";
import { useTrap } from "@/lib/useTrap";
import { money } from "@/lib/format";

const blank = (): ShippingRate => ({ id: "", name: { ar: "", en: "" }, cities: [], price: 0, freeOver: null, eta: { ar: "", en: "" }, active: true });

function Editor({ initial, onClose }: { initial: ShippingRate; onClose: () => void }) {
  const trap = useTrap(onClose);
  const l = useLocalized();
  const upsert = useCatalogStore((s) => s.upsertRate);
  const push = useToastStore((s) => s.push);
  const [r, setR] = useState<ShippingRate>(initial);
  const [cities, setCities] = useState(initial.cities.join(", "));
  const [error, setError] = useState("");

  const save = () => {
    const list = cities.split(/[,،]/).map((c) => c.trim().toLowerCase()).filter(Boolean);
    if (!r.name.en || !r.name.ar) return setError(l({ en: "Name the zone in English and Arabic.", ar: "سمِّ المنطقة بالإنجليزية والعربية." }));
    if (list.length === 0) return setError(l({ en: "Add at least one city, or * for everywhere else.", ar: "أضف مدينة واحدة على الأقل، أو * لباقي المناطق." }));
    if (r.price < 0) return setError(l({ en: "The price cannot be negative.", ar: "السعر لا يكون سالباً." }));
    upsert({ ...r, cities: list, id: r.id || `r-${Date.now().toString(36)}` });
    push(l({ en: "Shipping rate saved", ar: "تم حفظ سعر الشحن" }));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div className="flex h-full w-full max-w-lg flex-col bg-[#f7f7f7]" ref={trap} role="dialog" aria-modal="true" aria-labelledby="edit-title" data-lenis-prevent onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#e1e1e1] bg-white px-5 py-4">
          <h2 id="edit-title" className="text-lg font-semibold">{initial.id ? initial.name.en : l({ en: "Add shipping rate", ar: "إضافة سعر شحن" })}</h2>
          <button onClick={onClose} className="rounded-md p-2 hover:bg-black/5" aria-label={l({ en: "Close", ar: "إغلاق" })}><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <div className={`${card} grid gap-4 p-4 sm:grid-cols-2`}>
            <label className="text-sm font-medium">{l({ en: "Zone name (English)", ar: "اسم المنطقة (إنجليزي)" })}<input className={`${input} mt-1`} value={r.name.en} onChange={(e) => setR({ ...r, name: { ...r.name, en: e.target.value } })} dir="ltr" /></label>
            <label className="text-sm font-medium">{l({ en: "Zone name (Arabic)", ar: "اسم المنطقة (عربي)" })}<input className={`${input} mt-1`} value={r.name.ar} onChange={(e) => setR({ ...r, name: { ...r.name, ar: e.target.value } })} dir="rtl" /></label>
            <label className="text-sm font-medium sm:col-span-2">{l({ en: "Cities (comma separated, lowercase match)", ar: "المدن (مفصولة بفاصلة)" })}
              <input className={`${input} mt-1`} value={cities} onChange={(e) => setCities(e.target.value)} placeholder="cairo, giza, القاهرة" />
              <span className="mt-1 block text-xs font-normal text-[#616161]">{l({ en: "Use * to cover every city not listed in another zone.", ar: "استخدم * لتغطية كل مدينة غير مذكورة في منطقة أخرى." })}</span>
            </label>
          </div>
          <div className={`${card} grid gap-4 p-4 sm:grid-cols-2`}>
            <label className="text-sm font-medium">{l({ en: "Price (EGP)", ar: "السعر (ج.م)" })}<input type="number" min={0} className={`${input} mt-1`} value={r.price} onChange={(e) => setR({ ...r, price: Number(e.target.value) })} dir="ltr" /></label>
            <label className="text-sm font-medium">{l({ en: "Free delivery from (EGP)", ar: "مجاني ابتداءً من (ج.م)" })}<input type="number" min={0} className={`${input} mt-1`} value={r.freeOver ?? ""} onChange={(e) => setR({ ...r, freeOver: e.target.value === "" ? null : Number(e.target.value) })} dir="ltr" placeholder={l({ en: "Never", ar: "أبداً" })} /></label>
            <label className="text-sm font-medium">{l({ en: "Delivery time (English)", ar: "مدة التوصيل (إنجليزي)" })}<input className={`${input} mt-1`} value={r.eta.en} onChange={(e) => setR({ ...r, eta: { ...r.eta, en: e.target.value } })} dir="ltr" placeholder="1 to 2 days" /></label>
            <label className="text-sm font-medium">{l({ en: "Delivery time (Arabic)", ar: "مدة التوصيل (عربي)" })}<input className={`${input} mt-1`} value={r.eta.ar} onChange={(e) => setR({ ...r, eta: { ...r.eta, ar: e.target.value } })} dir="rtl" placeholder="من يوم إلى يومين" /></label>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={r.active} onChange={(e) => setR({ ...r, active: e.target.checked })} className="h-4 w-4 accent-[#1a1a1a]" />{l({ en: "Active", ar: "مفعّل" })}</label>
        </div>
        <div className="flex items-center gap-3 border-t border-[#e1e1e1] bg-white px-5 py-4">
          <button className={btnDark} onClick={save}>{l({ en: "Save", ar: "حفظ" })}</button>
          <button className={btnLight} onClick={onClose}>{l({ en: "Cancel", ar: "إلغاء" })}</button>
          {error && <p role="alert" className="text-sm text-[#A8322F]">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default function ShippingPage() {
  const l = useLocalized();
  const lang = useLangStore((s) => s.lang);
  const rates = useCatalogStore((s) => s.shippingRates);
  const upsert = useCatalogStore((s) => s.upsertRate);
  const del = useCatalogStore((s) => s.deleteRate);
  const push = useToastStore((s) => s.push);
  const [edit, setEdit] = useState<ShippingRate | null>(null);

  return (
    <>
      <PageHead title={l({ en: "Shipping", ar: "الشحن" })} action={<button className={btnDark} onClick={() => setEdit(blank())}><Plus className="me-1 inline h-4 w-4" />{l({ en: "Add rate", ar: "إضافة سعر" })}</button>} />
      <p className="mb-4 max-w-2xl text-sm text-[#616161]">{l({ en: "At checkout, the customer's city picks the rate. With no active rate, the store says delivery is confirmed by phone.", ar: "عند إتمام الطلب، تحدد مدينة العميل سعر الشحن. وإن لم يوجد سعر مفعّل، يظهر أن التوصيل يُؤكَّد بالهاتف." })}</p>
      <div className={`${card} overflow-x-auto`}>
        {rates.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-[#616161]">{l({ en: "No shipping rates yet.", ar: "لا توجد أسعار شحن بعد." })}</p>
            <button className={`${btnDark} mt-4`} onClick={() => setEdit(blank())}>{l({ en: "Add your first rate", ar: "أضف أول سعر" })}</button>
          </div>
        ) : (
          <table className="w-full min-w-[640px] text-sm">
            <thead><tr className="border-b border-[#e1e1e1] text-xs text-[#616161]">{[{ en: "Zone", ar: "المنطقة" }, { en: "Cities", ar: "المدن" }, { en: "Price", ar: "السعر" }, { en: "Free from", ar: "مجاني من" }, { en: "Time", ar: "المدة" }, { en: "Status", ar: "الحالة" }].map((h) => <th key={h.en} className="p-3 text-start font-medium">{l(h)}</th>)}<th /></tr></thead>
            <tbody>
              {rates.map((r) => (
                <tr key={r.id} className="border-b border-[#f0f0f0] last:border-0 hover:bg-[#fafafa]">
                  <td className="p-3"><button className="font-semibold hover:underline" onClick={() => setEdit(r)}>{r.name[lang]}</button></td>
                  <td className="max-w-[14rem] truncate p-3 text-[#616161]" dir="ltr">{r.cities.join(", ")}</td>
                  <td className="p-3"><bdi>{money(r.price, lang)}</bdi></td>
                  <td className="p-3"><bdi>{r.freeOver === null ? "—" : money(r.freeOver, lang)}</bdi></td>
                  <td className="p-3 text-[#616161]">{r.eta[lang] || "—"}</td>
                  <td className="p-3"><button onClick={() => upsert({ ...r, active: !r.active })} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${r.active ? "bg-[#cdfee1] text-[#0c5132]" : "bg-[#e3e3e3] text-[#4a4a4a]"}`}>{r.active ? l({ en: "Active", ar: "مفعّل" }) : l({ en: "Off", ar: "متوقف" })}</button></td>
                  <td className="p-3 text-end"><button className="rounded-md p-2 text-[#A8322F] hover:bg-[#A8322F]/10" aria-label={l({ en: `Delete ${r.name.en}`, ar: `حذف ${r.name.ar}` })} onClick={() => askConfirm({ title: l({ en: `Delete ${r.name.en}?`, ar: `حذف ${r.name.ar}؟` }), confirmLabel: l({ en: "Confirm", ar: "تأكيد" }), cancelLabel: l({ en: "Cancel", ar: "إلغاء" }), danger: true }).then((ok) => ok && (del(r.id), push(l({ en: `${r.name.en} deleted`, ar: `تم حذف ${r.name.ar}` }), "ok", { label: l({ en: "Undo", ar: "تراجع" }), run: () => upsert(r) })))}><Trash2 className="h-4 w-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {edit && <Editor key={edit.id || "new"} initial={edit} onClose={() => setEdit(null)} />}
    </>
  );
}
