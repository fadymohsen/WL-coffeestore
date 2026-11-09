"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { PageHead, btnDark, btnLight, card, input } from "@/components/admin/AdminShell";
import { CATEGORY_IDS, CATEGORY_META } from "@/data/products";
import { useCatalogStore, type Discount, type DiscountType } from "@/store/useCatalogStore";
import { useToastStore } from "@/store/useToastStore";
import { useLangStore, useLocalized } from "@/lib/i18n";
import { askConfirm } from "@/lib/confirm";
import { useTrap } from "@/lib/useTrap";
import { money } from "@/lib/format";

const blank = (): Discount => ({ id: "", code: "", type: "percent", value: 10, minSubtotal: 0, usageLimit: null, used: 0, startsAt: null, endsAt: null, scope: "all", active: true, note: "" });

const randomCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

const toDate = (t: number | null) => (t ? new Date(t).toISOString().slice(0, 10) : "");
const fromDate = (v: string, end = false) => (v ? new Date(v + (end ? "T23:59:59" : "T00:00:00")).getTime() : null);

function Editor({ initial, onClose }: { initial: Discount; onClose: () => void }) {
  const trap = useTrap(onClose);
  const l = useLocalized();
  const discounts = useCatalogStore((s) => s.discounts);
  const upsert = useCatalogStore((s) => s.upsertDiscount);
  const push = useToastStore((s) => s.push);
  const [d, setD] = useState<Discount>(initial);
  const [error, setError] = useState("");
  const isNew = !initial.id;

  const save = () => {
    const code = d.code.trim().toUpperCase();
    if (!/^[A-Z0-9_-]{3,24}$/.test(code)) return setError(l({ en: "Use 3 to 24 letters, numbers, dashes or underscores.", ar: "استخدم من 3 إلى 24 حرفاً أو رقماً أو شرطة." }));
    if (discounts.some((x) => x.code.toUpperCase() === code && x.id !== d.id)) return setError(l({ en: "This code already exists.", ar: "هذا الكود موجود بالفعل." }));
    if (d.type !== "shipping" && d.value <= 0) return setError(l({ en: "Enter a value above zero.", ar: "أدخل قيمة أكبر من صفر." }));
    if (d.type === "percent" && d.value > 100) return setError(l({ en: "A percentage cannot be above 100.", ar: "النسبة لا تتجاوز 100." }));
    if (d.startsAt && d.endsAt && d.endsAt < d.startsAt) return setError(l({ en: "The end date is before the start date.", ar: "تاريخ الانتهاء قبل تاريخ البدء." }));
    upsert({ ...d, code, id: d.id || `d-${Date.now().toString(36)}` });
    push(l({ en: `Code ${code} saved`, ar: `تم حفظ الكود ${code}` }));
    onClose();
  };

  const types: { id: DiscountType; en: string; ar: string }[] = [
    { id: "percent", en: "Percentage off", ar: "نسبة خصم" },
    { id: "fixed", en: "Fixed amount off", ar: "مبلغ ثابت" },
    { id: "shipping", en: "Free delivery", ar: "توصيل مجاني" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div className="flex h-full w-full max-w-xl flex-col bg-[#f7f7f7]" ref={trap} role="dialog" aria-modal="true" aria-labelledby="edit-title" data-lenis-prevent onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#e1e1e1] bg-white px-5 py-4">
          <h2 id="edit-title" className="text-lg font-semibold">{isNew ? l({ en: "Create discount code", ar: "إنشاء كود خصم" }) : initial.code}</h2>
          <button onClick={onClose} className="rounded-md p-2 hover:bg-black/5" aria-label={l({ en: "Close", ar: "إغلاق" })}><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <div className={`${card} p-4`}>
            <label className="text-sm font-medium">{l({ en: "Code", ar: "الكود" })}
              <div className="mt-1 flex gap-2">
                <input className={`${input} uppercase`} value={d.code} onChange={(e) => setD({ ...d, code: e.target.value })} dir="ltr" placeholder="WELCOME10" />
                <button type="button" className={btnLight} onClick={() => setD({ ...d, code: randomCode() })}>{l({ en: "Generate", ar: "توليد" })}</button>
              </div>
            </label>
            <fieldset className="mt-4">
              <legend className="mb-2 text-sm font-medium">{l({ en: "Type", ar: "النوع" })}</legend>
              <div className="flex flex-wrap gap-2">
                {types.map((t) => (
                  <button key={t.id} type="button" aria-pressed={d.type === t.id} onClick={() => setD({ ...d, type: t.id })} className={`rounded-lg border px-3 py-2 text-sm font-medium ${d.type === t.id ? "border-[#1a1a1a] bg-[#1a1a1a] text-white" : "border-[#c9c9c9] bg-white hover:bg-[#fafafa]"}`}>{l(t)}</button>
                ))}
              </div>
            </fieldset>
            {d.type !== "shipping" && (
              <label className="mt-4 block text-sm font-medium">{d.type === "percent" ? l({ en: "Percent off", ar: "نسبة الخصم %" }) : l({ en: "Amount off (EGP)", ar: "قيمة الخصم (ج.م)" })}
                <input type="number" min={0} className={`${input} mt-1 max-w-[10rem]`} value={d.value || ""} onChange={(e) => setD({ ...d, value: Number(e.target.value) })} dir="ltr" />
              </label>
            )}
          </div>

          <div className={`${card} grid gap-4 p-4 sm:grid-cols-2`}>
            <label className="text-sm font-medium">{l({ en: "Applies to", ar: "ينطبق على" })}
              <select className={`${input} mt-1`} value={d.scope} onChange={(e) => setD({ ...d, scope: e.target.value as Discount["scope"] })}>
                <option value="all">{l({ en: "Everything", ar: "كل المنتجات" })}</option>
                {CATEGORY_IDS.map((c) => <option key={c} value={c}>{l(CATEGORY_META[c].label)}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium">{l({ en: "Minimum order (EGP)", ar: "الحد الأدنى للطلب (ج.م)" })}
              <input type="number" min={0} className={`${input} mt-1`} value={d.minSubtotal || ""} onChange={(e) => setD({ ...d, minSubtotal: Number(e.target.value) })} dir="ltr" placeholder="0" />
            </label>
            <label className="text-sm font-medium">{l({ en: "Usage limit", ar: "حد الاستخدام" })}
              <input type="number" min={1} className={`${input} mt-1`} value={d.usageLimit ?? ""} onChange={(e) => setD({ ...d, usageLimit: e.target.value === "" ? null : Math.max(1, Number(e.target.value)) })} dir="ltr" placeholder={l({ en: "Unlimited", ar: "بلا حد" })} />
            </label>
            <div />
            <label className="text-sm font-medium">{l({ en: "Starts", ar: "يبدأ" })}
              <input type="date" className={`${input} mt-1`} value={toDate(d.startsAt)} onChange={(e) => setD({ ...d, startsAt: fromDate(e.target.value) })} dir="ltr" />
            </label>
            <label className="text-sm font-medium">{l({ en: "Ends", ar: "ينتهي" })}
              <input type="date" className={`${input} mt-1`} value={toDate(d.endsAt)} onChange={(e) => setD({ ...d, endsAt: fromDate(e.target.value, true) })} dir="ltr" />
            </label>
          </div>

          <div className={`${card} p-4`}>
            <label className="text-sm font-medium">{l({ en: "Internal note", ar: "ملاحظة داخلية" })}
              <input className={`${input} mt-1`} value={d.note} onChange={(e) => setD({ ...d, note: e.target.value })} />
            </label>
            <label className="mt-3 flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={d.active} onChange={(e) => setD({ ...d, active: e.target.checked })} className="h-4 w-4 accent-[#1a1a1a]" />
              {l({ en: "Active", ar: "مفعّل" })}
            </label>
          </div>
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

export default function DiscountsPage() {
  const l = useLocalized();
  const lang = useLangStore((s) => s.lang);
  const discounts = useCatalogStore((s) => s.discounts);
  const orders = useCatalogStore((s) => s.orders);
  const upsert = useCatalogStore((s) => s.upsertDiscount);
  const del = useCatalogStore((s) => s.deleteDiscount);
  const push = useToastStore((s) => s.push);
  const [edit, setEdit] = useState<Discount | null>(null);
  const [now, setNow] = useState(0);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
  }, []);

  const given = (code: string) => orders.filter((o) => o.discount?.code.toLowerCase() === code.toLowerCase() && o.status !== "cancelled").reduce((a, o) => a + (o.discount?.amount ?? 0), 0);
  const value = (d: Discount) => (d.type === "percent" ? `${d.value}%` : d.type === "fixed" ? money(d.value, lang) : l({ en: "Free delivery", ar: "توصيل مجاني" }));
  const fmt = (t: number) => new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-GB", { dateStyle: "medium" }).format(t);

  return (
    <>
      <PageHead title={l({ en: "Discounts", ar: "الخصومات" })} action={<button className={btnDark} onClick={() => setEdit(blank())}><Plus className="me-1 inline h-4 w-4" />{l({ en: "Create code", ar: "إنشاء كود" })}</button>} />
      <p className="mb-4 max-w-2xl text-sm text-[#616161]">{l({ en: "Customers enter a code in the bag or at checkout. Rules are checked again when the order is placed.", ar: "يدخل العميل الكود في السلة أو عند إتمام الطلب، وتُراجع الشروط مرة أخرى عند تأكيده." })}</p>

      <div className={`${card} overflow-x-auto`}>
        {discounts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-[#616161]">{l({ en: "No discount codes yet.", ar: "لا توجد أكواد خصم بعد." })}</p>
            <button className={`${btnDark} mt-4`} onClick={() => setEdit(blank())}>{l({ en: "Create your first code", ar: "أنشئ أول كود" })}</button>
          </div>
        ) : (
          <table className="w-full min-w-[820px] text-sm">
            <thead><tr className="border-b border-[#e1e1e1] text-xs text-[#616161]">{[{ en: "Code", ar: "الكود" }, { en: "Discount", ar: "الخصم" }, { en: "Applies to", ar: "ينطبق على" }, { en: "Used", ar: "الاستخدام" }, { en: "Given away", ar: "قيمة الخصم" }, { en: "Dates", ar: "التواريخ" }, { en: "Status", ar: "الحالة" }].map((h) => <th key={h.en} className="p-3 text-start font-medium">{l(h)}</th>)}<th /></tr></thead>
            <tbody>
              {discounts.map((d) => {
                const expired = d.endsAt !== null && now > 0 && d.endsAt < now;
                const exhausted = d.usageLimit !== null && d.used >= d.usageLimit;
                const st = !d.active ? { t: l({ en: "Off", ar: "متوقف" }), c: "bg-[#e3e3e3] text-[#4a4a4a]" } : expired ? { t: l({ en: "Expired", ar: "منتهٍ" }), c: "bg-[#fed3d1] text-[#8e0b21]" } : exhausted ? { t: l({ en: "Used up", ar: "مستنفد" }), c: "bg-[#ffeb78] text-[#5e4200]" } : { t: l({ en: "Active", ar: "مفعّل" }), c: "bg-[#cdfee1] text-[#0c5132]" };
                return (
                  <tr key={d.id} className="border-b border-[#f0f0f0] last:border-0 hover:bg-[#fafafa]">
                    <td className="p-3"><button className="font-semibold hover:underline" dir="ltr" onClick={() => setEdit(d)}>{d.code}</button>{d.note && <div className="text-xs text-[#8a8a8a]">{d.note}</div>}</td>
                    <td className="p-3"><bdi>{value(d)}</bdi>{d.minSubtotal > 0 && <div className="text-xs text-[#8a8a8a]">{l({ en: `Min ${d.minSubtotal} EGP`, ar: `حد أدنى ${d.minSubtotal} ج.م` })}</div>}</td>
                    <td className="p-3">{d.scope === "all" ? l({ en: "Everything", ar: "كل المنتجات" }) : CATEGORY_META[d.scope].label[lang]}</td>
                    <td className="p-3"><bdi>{d.used}{d.usageLimit !== null ? ` / ${d.usageLimit}` : ""}</bdi></td>
                    <td className="p-3"><bdi>{money(given(d.code), lang)}</bdi></td>
                    <td className="p-3 text-[#616161]">{d.startsAt || d.endsAt ? `${d.startsAt ? fmt(d.startsAt) : "…"} → ${d.endsAt ? fmt(d.endsAt) : "…"}` : l({ en: "Always", ar: "دائماً" })}</td>
                    <td className="p-3"><button onClick={() => upsert({ ...d, active: !d.active })} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${st.c}`}>{st.t}</button></td>
                    <td className="p-3 text-end"><button className="rounded-md p-2 text-[#A8322F] hover:bg-[#A8322F]/10" aria-label={l({ en: `Delete ${d.code}`, ar: `حذف ${d.code}` })} onClick={() => askConfirm({ title: l({ en: `Delete ${d.code}?`, ar: `حذف ${d.code}؟` }), confirmLabel: l({ en: "Confirm", ar: "تأكيد" }), cancelLabel: l({ en: "Cancel", ar: "إلغاء" }), danger: true }).then((ok) => ok && (del(d.id), push(l({ en: `${d.code} deleted`, ar: `تم حذف ${d.code}` }), "ok", { label: l({ en: "Undo", ar: "تراجع" }), run: () => upsert(d) })))}><Trash2 className="h-4 w-4" /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {edit && <Editor key={edit.id || "new"} initial={edit} onClose={() => setEdit(null)} />}
    </>
  );
}
