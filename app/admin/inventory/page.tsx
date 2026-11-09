"use client";

import { useMemo, useState } from "react";
import { Download, Minus, Plus, Search } from "lucide-react";
import { PageHead, btnDark, btnLight, card, input } from "@/components/admin/AdminShell";
import { CATEGORY_META } from "@/data/products";
import { isLow, useCatalogStore, type AdjustReason } from "@/store/useCatalogStore";
import { downloadCsv } from "@/lib/csv";
import { useLangStore, useLocalized } from "@/lib/i18n";
import { useTrap } from "@/lib/useTrap";
import { money } from "@/lib/format";

type View = "all" | "low" | "out" | "history";

const REASONS: { id: AdjustReason; en: string; ar: string }[] = [
  { id: "restock", en: "Restock", ar: "إعادة تخزين" },
  { id: "return", en: "Customer return", ar: "مرتجع عميل" },
  { id: "damaged", en: "Damaged or lost", ar: "تالف أو مفقود" },
  { id: "correction", en: "Count correction", ar: "تصحيح جرد" },
];

export default function InventoryPage() {
  const l = useLocalized();
  const lang = useLangStore((s) => s.lang);
  const items = useCatalogStore((s) => s.items);
  const adjustments = useCatalogStore((s) => s.adjustments);
  const adjust = useCatalogStore((s) => s.adjustStock);
  const setStock = useCatalogStore((s) => s.setStock);
  const setVariant = useCatalogStore((s) => s.setVariant);
  const [view, setView] = useState<View>("all");
  const [q, setQ] = useState("");
  const [dlg, setDlg] = useState<{ id: string; key: string } | null>(null);
  const [delta, setDelta] = useState("");
  const [reason, setReason] = useState<AdjustReason>("restock");
  const [note, setNote] = useState("");
  const trap = useTrap(() => setDlg(null));

  const rows = useMemo(() => items.flatMap((i) => i.variants.map((v) => ({ i, v }))), [items]);
  const needle = q.trim().toLowerCase();
  const filtered = rows.filter(({ i, v }) => {
    const match = !needle || i.name.en.toLowerCase().includes(needle) || i.name.ar.includes(needle) || v.sku.toLowerCase().includes(needle);
    const f = view === "all" ? true : view === "low" ? isLow(v) : v.stock === 0;
    return match && f;
  });

  const tracked = rows.filter(({ v }) => v.stock !== null);
  const cost = tracked.reduce((a, { v }) => a + (v.stock ?? 0) * (v.cost ?? 0), 0);
  const retail = tracked.reduce((a, { v }) => a + (v.stock ?? 0) * v.price, 0);
  const lowN = rows.filter(({ v }) => isLow(v)).length;
  const outN = rows.filter(({ v }) => v.stock === 0).length;
  const fmt = (t: number) => new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-GB", { dateStyle: "medium", timeStyle: "short" }).format(t);

  const target = dlg ? rows.find(({ i, v }) => i.id === dlg.id && v.key === dlg.key) : null;
  const apply = () => {
    const n = Math.trunc(Number(delta));
    if (!dlg || !n) return;
    adjust(dlg.id, dlg.key, n, reason, note);
    setDlg(null); setDelta(""); setNote("");
  };

  const exportCsv = () =>
    downloadCsv("diwan-inventory.csv", [
      ["Product", "Variant", "SKU", "Stock", "Alert at", "Cost", "Price", "Stock at cost", "Stock at retail"],
      ...rows.map(({ i, v }) => [i.name.en, v.label.en, v.sku, v.stock, v.threshold, v.cost, v.price, v.stock !== null && v.cost !== null ? v.stock * v.cost : null, v.stock !== null ? v.stock * v.price : null]),
    ]);

  const stats = [
    { label: l({ en: "Tracked variants", ar: "خيارات متتبَّعة" }), value: `${tracked.length} / ${rows.length}` },
    { label: l({ en: "Low stock", ar: "مخزون منخفض" }), value: String(lowN) },
    { label: l({ en: "Out of stock", ar: "نفد" }), value: String(outN) },
    { label: l({ en: "Stock at retail", ar: "المخزون بسعر البيع" }), value: money(retail, lang), sub: l({ en: `At cost ${money(cost, lang)}`, ar: `بالتكلفة ${money(cost, lang)}` }) },
  ];

  const tabs: { id: View; en: string; ar: string }[] = [
    { id: "all", en: "All", ar: "الكل" }, { id: "low", en: "Low", ar: "منخفض" }, { id: "out", en: "Out of stock", ar: "نفد" }, { id: "history", en: "History", ar: "السجل" },
  ];

  return (
    <>
      <PageHead title={l({ en: "Inventory", ar: "المخزون" })} action={<button className={btnLight} onClick={exportCsv}><Download className="me-1.5 inline h-4 w-4" />CSV</button>} />

      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`${card} p-5`}>
            <p className="text-sm text-[#616161]">{s.label}</p>
            <p className="mt-2 text-2xl font-semibold"><bdi>{s.value}</bdi></p>
            {s.sub && <p className="mt-1 text-xs text-[#8a8a8a]"><bdi>{s.sub}</bdi></p>}
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2" role="tablist">
          {tabs.map((t) => (
            <button key={t.id} role="tab" aria-selected={view === t.id} onClick={() => setView(t.id)} className={`rounded-lg px-3 py-1.5 text-sm font-medium ${view === t.id ? "bg-[#1a1a1a] text-white" : "bg-white shadow-[0_0_0_1px_#e1e1e1] hover:bg-[#fafafa]"}`}>{l(t)}</button>
          ))}
        </div>
        {view !== "history" && (
          <div className="relative ms-auto min-w-[14rem] flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8a8a]" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={l({ en: "Search name or SKU", ar: "ابحث بالاسم أو الرمز" })} className={`${input} ps-9`} aria-label={l({ en: "Search inventory", ar: "بحث في المخزون" })} />
          </div>
        )}
      </div>

      {view !== "history" ? (
        <div className={`${card} overflow-x-auto`}>
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-[#e1e1e1] text-xs text-[#616161]">
                {[{ en: "Product", ar: "المنتج" }, { en: "SKU", ar: "الرمز" }, { en: "Status", ar: "الحالة" }, { en: "Alert at", ar: "تنبيه عند" }, { en: "In stock", ar: "المتوفر" }, { en: "Adjust", ar: "تعديل" }].map((h) => <th key={h.en} className="p-3 text-start font-medium">{l(h)}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map(({ i, v }) => {
                const status = v.stock === null ? { t: l({ en: "Not tracked", ar: "غير متتبَّع" }), c: "bg-[#e3e3e3] text-[#4a4a4a]" }
                  : v.stock === 0 ? { t: l({ en: "Out of stock", ar: "نفد" }), c: "bg-[#fed3d1] text-[#8e0b21]" }
                  : isLow(v) ? { t: l({ en: "Low", ar: "منخفض" }), c: "bg-[#ffeb78] text-[#5e4200]" }
                  : { t: l({ en: "In stock", ar: "متوفر" }), c: "bg-[#cdfee1] text-[#0c5132]" };
                return (
                  <tr key={i.id + v.key} className="border-b border-[#f0f0f0] last:border-0">
                    <td className="p-3"><div className="font-medium">{i.name[lang]}</div><div className="text-xs text-[#8a8a8a]">{v.label[lang]} · {CATEGORY_META[i.categoryId].label[lang]}</div></td>
                    <td className="p-3 text-[#616161]" dir="ltr">{v.sku}</td>
                    <td className="p-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.c}`}>{status.t}</span></td>
                    <td className="p-3"><input type="number" min={0} dir="ltr" aria-label={`${i.name.en} ${v.label.en} alert`} className={`${input} !w-20`} value={v.threshold} onChange={(e) => setVariant(i.id, v.key, { threshold: Math.max(0, Number(e.target.value)) })} /></td>
                    <td className="p-3">
                      <input type="number" min={0} dir="ltr" aria-label={`${i.name.en} ${v.label.en} stock`} className={`${input} !w-24`} value={v.stock ?? ""} placeholder="—" onChange={(e) => setStock(i.id, v.key, e.target.value === "" ? null : Math.max(0, Math.floor(Number(e.target.value))))} />
                    </td>
                    <td className="p-3">
                      <button disabled={v.stock === null} onClick={() => setDlg({ id: i.id, key: v.key })} className={`${btnLight} !px-3 !py-1.5 disabled:opacity-40`}>
                        <Plus className="me-0.5 inline h-3.5 w-3.5" /><Minus className="me-1 inline h-3.5 w-3.5" />{l({ en: "Adjust", ar: "تعديل" })}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={6} className="p-10 text-center text-[#616161]">{l({ en: "Nothing here.", ar: "لا شيء هنا." })}</td></tr>}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={`${card} overflow-x-auto`}>
          {adjustments.length === 0 ? (
            <p className="p-12 text-center text-sm text-[#616161]">{l({ en: "No stock changes yet. Adjustments and orders on tracked stock are logged here.", ar: "لا تغييرات في المخزون بعد. تُسجَّل هنا التعديلات والطلبات على المخزون المتتبَّع." })}</p>
          ) : (
            <table className="w-full min-w-[640px] text-sm">
              <thead><tr className="border-b border-[#e1e1e1] text-xs text-[#616161]">{[{ en: "When", ar: "الوقت" }, { en: "Product", ar: "المنتج" }, { en: "Change", ar: "التغيير" }, { en: "Reason", ar: "السبب" }, { en: "Note", ar: "ملاحظة" }].map((h) => <th key={h.en} className="p-3 text-start font-medium">{l(h)}</th>)}</tr></thead>
              <tbody>
                {adjustments.slice(0, 200).map((a) => {
                  const it = items.find((x) => x.id === a.itemId);
                  const v = it?.variants.find((x) => x.key === a.variantKey);
                  const reasonLabel = a.reason === "order" ? l({ en: "Order", ar: "طلب" }) : l(REASONS.find((r) => r.id === a.reason)!);
                  return (
                    <tr key={a.id} className="border-b border-[#f0f0f0] last:border-0">
                      <td className="p-3 text-[#616161]">{fmt(a.at)}</td>
                      <td className="p-3">{it?.name[lang] ?? a.itemId} <span className="text-[#8a8a8a]">· {v?.label[lang]}</span></td>
                      <td className={`p-3 font-semibold ${a.delta > 0 ? "text-[#0c5132]" : "text-[#8e0b21]"}`}><bdi>{a.delta > 0 ? "+" : ""}{a.delta}</bdi></td>
                      <td className="p-3">{reasonLabel}</td>
                      <td className="p-3 text-[#616161]">{a.note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {dlg && target && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setDlg(null)}>
          <div ref={trap} role="dialog" aria-modal="true" aria-labelledby="adj-title" className="w-full max-w-md rounded-xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <h2 id="adj-title" className="text-lg font-semibold">{l({ en: "Adjust stock", ar: "تعديل المخزون" })}</h2>
            <p className="mt-1 text-sm text-[#616161]">{target.i.name[lang]} · {target.v.label[lang]} · <bdi>{l({ en: "now", ar: "الآن" })} {target.v.stock}</bdi></p>
            <label className="mt-4 block text-sm font-medium">{l({ en: "Change (use a minus to remove)", ar: "التغيير (استخدم سالب للخصم)" })}
              <input type="number" dir="ltr" value={delta} onChange={(e) => setDelta(e.target.value)} className={`${input} mt-1`} placeholder="+24" />
            </label>
            <label className="mt-3 block text-sm font-medium">{l({ en: "Reason", ar: "السبب" })}
              <select value={reason} onChange={(e) => setReason(e.target.value as AdjustReason)} className={`${input} mt-1`}>{REASONS.map((r) => <option key={r.id} value={r.id}>{l(r)}</option>)}</select>
            </label>
            <label className="mt-3 block text-sm font-medium">{l({ en: "Note (optional)", ar: "ملاحظة (اختياري)" })}
              <input value={note} onChange={(e) => setNote(e.target.value)} className={`${input} mt-1`} />
            </label>
            <p className="mt-3 text-sm text-[#616161]"><bdi>{l({ en: "New stock", ar: "المخزون الجديد" })}: {Math.max(0, (target.v.stock ?? 0) + Math.trunc(Number(delta) || 0))}</bdi></p>
            <div className="mt-5 flex gap-3"><button className={btnDark} onClick={apply} disabled={!Math.trunc(Number(delta))}>{l({ en: "Apply", ar: "تطبيق" })}</button><button className={btnLight} onClick={() => setDlg(null)}>{l({ en: "Cancel", ar: "إلغاء" })}</button></div>
          </div>
        </div>
      )}
    </>
  );
}
