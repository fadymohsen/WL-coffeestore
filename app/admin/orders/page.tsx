"use client";

import { useState } from "react";
import { Check, Download, Plus, Search, X } from "lucide-react";
import { PageHead, btnDark, btnLight, card, input } from "@/components/admin/AdminShell";
import { COURIERS, FLOW, STATUSES, nextStatus } from "@/components/admin/orderMeta";
import { useCatalogStore, type NewOrder, type Order, type OrderStatus } from "@/store/useCatalogStore";
import { useToastStore } from "@/store/useToastStore";
import { downloadCsv } from "@/lib/csv";
import { useLangStore, useLocalized } from "@/lib/i18n";
import { askConfirm } from "@/lib/confirm";
import { useTrap } from "@/lib/useTrap";
import { money } from "@/lib/format";

const stMeta = (id: OrderStatus) => STATUSES.find((s) => s.id === id)!;

function Pill({ id }: { id: OrderStatus }) {
  const l = useLocalized();
  const st = stMeta(id);
  return <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${st.cls}`}>{l(st)}</span>;
}

function Detail({ id, onClose }: { id: string; onClose: () => void }) {
  const trap = useTrap(onClose);
  const l = useLocalized();
  const lang = useLangStore((s) => s.lang);
  const order = useCatalogStore((s) => s.orders.find((o) => o.id === id));
  const setStatus = useCatalogStore((s) => s.setOrderStatus);
  const setPaid = useCatalogStore((s) => s.setOrderPaid);
  const update = useCatalogStore((s) => s.updateOrder);
  const refund = useCatalogStore((s) => s.refundOrder);
  const push = useToastStore((s) => s.push);
  const [rf, setRf] = useState({ amount: "", reason: "", restock: true });
  const [tracking, setTracking] = useState(order?.tracking ?? { courier: "", number: "" });
  const [note, setNote] = useState(order?.internalNote ?? "");

  if (!order) return null;
  const fmt = (t: number) => new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-GB", { dateStyle: "medium", timeStyle: "short" }).format(t);
  const next = nextStatus(order.status);
  const cancelled = order.status === "cancelled";
  const reached = new Set(order.timeline.map((e) => e.status));
  const tlLabel = (s: string) => (s === "paid" ? l({ en: "Payment received", ar: "تم استلام الدفع" }) : s === "note" ? l({ en: "Note", ar: "ملاحظة" }) : l(stMeta(s as OrderStatus)));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div className="flex h-full w-full max-w-2xl flex-col bg-[#f7f7f7]" ref={trap} role="dialog" aria-modal="true" aria-labelledby="edit-title" data-lenis-prevent onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#e1e1e1] bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <h2 id="edit-title" className="text-lg font-semibold"><bdi>{order.id}</bdi></h2>
            <Pill id={order.status} />
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${order.payment.paid ? "bg-[#cdfee1] text-[#0c5132]" : "bg-[#ffeb78] text-[#5e4200]"}`}>
              {order.payment.paid ? l({ en: "Paid", ar: "مدفوع" }) : l({ en: "Unpaid", ar: "غير مدفوع" })}
            </span>
          </div>
          <button onClick={onClose} className="rounded-md p-2 hover:bg-black/5" aria-label={l({ en: "Close", ar: "إغلاق" })}><X className="h-5 w-5" /></button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {/* progress */}
          {!cancelled && (
            <ol className={`${card} flex items-center justify-between p-4`} aria-label={l({ en: "Order progress", ar: "تقدّم الطلب" })}>
              {FLOW.map((s, i) => {
                const done = reached.has(s);
                return (
                  <li key={s} className="flex flex-1 items-center">
                    <span className="flex flex-col items-center gap-1.5">
                      <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-semibold ${done ? "bg-[#1a1a1a] text-white" : "bg-[#ececec] text-[#8a8a8a]"}`}>{done ? <Check className="h-4 w-4" /> : i + 1}</span>
                      <span className={`text-[11px] ${done ? "font-medium" : "text-[#8a8a8a]"}`}>{l(stMeta(s))}</span>
                    </span>
                    {i < FLOW.length - 1 && <span className={`mx-1 mb-5 h-0.5 flex-1 ${reached.has(FLOW[i + 1]) ? "bg-[#1a1a1a]" : "bg-[#ececec]"}`} />}
                  </li>
                );
              })}
            </ol>
          )}

          <div className="flex flex-wrap gap-2">
            {next && <button className={btnDark} onClick={() => { setStatus(order.id, next); push(l({ en: `Order marked as ${stMeta(next).en}`, ar: `تم تحديد الطلب كـ ${stMeta(next).ar}` })); }}>{l({ en: "Mark as", ar: "تحديد كـ" })} {l(stMeta(next))}</button>}
            {!order.payment.paid && !cancelled && <button className={btnLight} onClick={() => { setPaid(order.id, true); push(l({ en: "Payment recorded", ar: "تم تسجيل الدفع" })); }}>{l({ en: "Mark as paid", ar: "تسجيل كمدفوع" })}</button>}
            {!cancelled && order.status !== "delivered" && (
              <button className={`${btnLight} text-[#8e0b21]`} onClick={() => askConfirm({ title: l({ en: "Cancel this order?", ar: "إلغاء هذا الطلب؟" }), confirmLabel: l({ en: "Confirm", ar: "تأكيد" }), cancelLabel: l({ en: "Cancel", ar: "إلغاء" }), danger: true }).then((ok) => ok && setStatus(order.id, "cancelled"))}>{l({ en: "Cancel order", ar: "إلغاء الطلب" })}</button>
            )}
          </div>

          <section className={`${card} p-4`}>
            <h3 className="mb-3 text-sm font-semibold">{l({ en: "Items", ar: "المنتجات" })}</h3>
            <ul className="divide-y divide-[#f0f0f0] text-sm">
              {order.lines.map((ln) => (
                <li key={ln.key} className="flex justify-between gap-4 py-2">
                  <span>{ln.name[lang]} <span className="text-[#8a8a8a]">· {ln.variant[lang]}</span> <bdi>× {ln.qty}</bdi></span>
                  <bdi>{money(ln.price * ln.qty, lang)}</bdi>
                </li>
              ))}
              <li className="flex justify-between pt-3 text-[#616161]"><span>{l({ en: "Subtotal", ar: "المجموع" })}</span><bdi>{money(order.subtotal, lang)}</bdi></li>
              {order.discount && <li className="flex justify-between pt-2 text-[#0c5132]"><span>{l({ en: "Code", ar: "الكود" })} <bdi dir="ltr">{order.discount.code}</bdi></span><bdi>-{money(order.discount.amount, lang)}</bdi></li>}
              <li className="flex justify-between pt-2 text-[#616161]"><span>{l({ en: "Delivery", ar: "التوصيل" })}{order.shipping ? ` · ${order.shipping.label[lang]}` : ""}</span><bdi>{order.shipping ? (order.shipping.price ? money(order.shipping.price, lang) : l({ en: "Free", ar: "مجاني" })) : l({ en: "Not set", ar: "غير محدد" })}</bdi></li>
              <li className="flex justify-between pt-3 font-semibold"><span>{l({ en: "Total", ar: "الإجمالي" })}</span><bdi>{money(order.total, lang)}</bdi></li>
              {order.refunds.length > 0 && <li className="flex justify-between pt-2 text-[#8e0b21]"><span>{l({ en: "Refunded", ar: "المسترد" })}</span><bdi>-{money(order.refunds.reduce((a, r) => a + r.amount, 0), lang)}</bdi></li>}
            </ul>
          </section>

          <section className={`${card} grid gap-4 p-4 text-sm sm:grid-cols-2`}>
            <div>
              <h3 className="mb-2 text-sm font-semibold">{l({ en: "Customer", ar: "العميل" })}</h3>
              <p className="font-medium">{order.customer.name}</p>
              <p dir="ltr" className="text-start text-[#616161]">{order.customer.phone}</p>
              {order.customer.email && <p dir="ltr" className="text-start text-[#616161]">{order.customer.email}</p>}
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold">{l({ en: "Delivery address", ar: "عنوان التوصيل" })}</h3>
              <p>{order.customer.address}</p>
              <p>{order.customer.city}</p>
              {order.customer.notes && <p className="mt-1 text-[#616161]">{order.customer.notes}</p>}
            </div>
          </section>

          {!cancelled && order.total - order.refunds.reduce((a, r) => a + r.amount, 0) > 0 && (
            <section className={`${card} p-4`}>
              <h3 className="mb-3 text-sm font-semibold">{l({ en: "Refund", ar: "استرداد" })}</h3>
              <div className="grid gap-3 sm:grid-cols-[8rem_1fr]">
                <label className="text-xs text-[#616161]">{l({ en: "Amount (EGP)", ar: "المبلغ (ج.م)" })}<input type="number" min={1} max={order.total} className={`${input} mt-1`} value={rf.amount} onChange={(e) => setRf({ ...rf, amount: e.target.value })} dir="ltr" /></label>
                <label className="text-xs text-[#616161]">{l({ en: "Reason", ar: "السبب" })}<input className={`${input} mt-1`} value={rf.reason} onChange={(e) => setRf({ ...rf, reason: e.target.value })} /></label>
              </div>
              <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={rf.restock} onChange={(e) => setRf({ ...rf, restock: e.target.checked })} className="h-4 w-4 accent-[#1a1a1a]" />{l({ en: "Put the items back in stock", ar: "إعادة المنتجات للمخزون" })}</label>
              <button
                className={`${btnLight} mt-3`}
                disabled={!Number(rf.amount) || Number(rf.amount) > order.total - order.refunds.reduce((a, r) => a + r.amount, 0)}
                onClick={() => { refund(order.id, Number(rf.amount), rf.reason, rf.restock); setRf({ amount: "", reason: "", restock: true }); push(l({ en: "Refund recorded", ar: "تم تسجيل الاسترداد" })); }}
              >{l({ en: "Record refund", ar: "تسجيل الاسترداد" })}</button>
              <p className="mt-2 text-xs text-[#616161]">{l({ en: "This records the refund. Send the money back through your courier or bank.", ar: "هذا يسجّل الاسترداد فقط. أعد المبلغ للعميل عبر شركة الشحن أو البنك." })}</p>
            </section>
          )}

          <section className={`${card} p-4`}>
            <h3 className="mb-3 text-sm font-semibold">{l({ en: "Shipping and tracking", ar: "الشحن والتتبع" })}</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-[#616161]">{l({ en: "Courier", ar: "شركة الشحن" })}
                <input list="couriers" className={`${input} mt-1`} value={tracking.courier} onChange={(e) => setTracking({ ...tracking, courier: e.target.value })} dir="ltr" />
                <datalist id="couriers">{COURIERS.map((c) => <option key={c} value={c} />)}</datalist>
              </label>
              <label className="text-xs text-[#616161]">{l({ en: "Tracking number", ar: "رقم التتبع" })}
                <input className={`${input} mt-1`} value={tracking.number} onChange={(e) => setTracking({ ...tracking, number: e.target.value })} dir="ltr" />
              </label>
            </div>
            <button className={`${btnLight} mt-3`} onClick={() => { update(order.id, { tracking }); push(l({ en: "Tracking saved", ar: "تم حفظ التتبع" })); }}>{l({ en: "Save tracking", ar: "حفظ التتبع" })}</button>
          </section>

          <section className={`${card} p-4`}>
            <h3 className="mb-2 text-sm font-semibold">{l({ en: "Internal note", ar: "ملاحظة داخلية" })}</h3>
            <textarea rows={3} className={input} value={note} onChange={(e) => setNote(e.target.value)} onBlur={() => update(order.id, { internalNote: note })} placeholder={l({ en: "Only your team sees this", ar: "يراها فريقك فقط" })} />
          </section>

          <section className={`${card} p-4`}>
            <h3 className="mb-3 text-sm font-semibold">{l({ en: "Timeline", ar: "السجل الزمني" })}</h3>
            <ol className="space-y-3">
              {[...order.timeline].reverse().map((e, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#1a1a1a]" />
                  <span><span className="font-medium">{tlLabel(e.status)}</span><span className="block text-xs text-[#8a8a8a]">{fmt(e.at)}</span></span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}

function Draft({ onClose, onCreated }: { onClose: () => void; onCreated: (id: string) => void }) {
  const trap = useTrap(onClose);
  const l = useLocalized();
  const lang = useLangStore((s) => s.lang);
  const items = useCatalogStore((s) => s.items);
  const place = useCatalogStore((s) => s.placeOrder);
  const push = useToastStore((s) => s.push);
  const [cust, setCust] = useState({ name: "", phone: "", email: "", address: "", city: "", notes: "" });
  const [rows, setRows] = useState<{ key: string; qty: number }[]>([]);
  const [pick, setPick] = useState("");
  const [shipPrice, setShipPrice] = useState("");
  const [error, setError] = useState("");

  const options = items.flatMap((i) => i.variants.map((v) => ({ key: `${i.id}:${v.key}`, i, v })));
  const lines = rows.map((r) => ({ ...r, o: options.find((o) => o.key === r.key)! })).filter((r) => r.o);
  const subtotal = lines.reduce((a, r) => a + r.qty * r.o.v.price, 0);
  const ship = Number(shipPrice) || 0;

  const create = () => {
    if (!cust.name.trim() || cust.phone.replace(/\D/g, "").length < 10) return setError(l({ en: "Add the customer name and a phone number.", ar: "أضف اسم العميل ورقم هاتف." }));
    if (lines.length === 0) return setError(l({ en: "Add at least one product.", ar: "أضف منتجاً واحداً على الأقل." }));
    const order: NewOrder = {
      customer: cust,
      lines: lines.map((r) => ({ key: r.key, name: r.o.i.name, variant: r.o.v.label, qty: r.qty, price: r.o.v.price })),
      subtotal,
      discount: null,
      shipping: ship ? { label: { en: "Manual", ar: "يدوي" }, price: ship } : null,
      total: subtotal + ship,
      source: "draft",
    };
    const created = place(order);
    push(l({ en: `Order ${created.id} created`, ar: `تم إنشاء الطلب ${created.id}` }));
    onCreated(created.id);
  };

  return (
    <div className="fixed inset-0 z-[55] flex justify-end bg-black/40" onClick={onClose}>
      <div className="flex h-full w-full max-w-xl flex-col bg-[#f7f7f7]" ref={trap} role="dialog" aria-modal="true" aria-labelledby="edit-title" data-lenis-prevent onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#e1e1e1] bg-white px-5 py-4">
          <h2 id="edit-title" className="text-lg font-semibold">{l({ en: "Create order", ar: "إنشاء طلب" })}</h2>
          <button onClick={onClose} className="rounded-md p-2 hover:bg-black/5" aria-label={l({ en: "Close", ar: "إغلاق" })}><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <section className={`${card} grid gap-3 p-4 sm:grid-cols-2`}>
            <h3 className="text-sm font-semibold sm:col-span-2">{l({ en: "Customer", ar: "العميل" })}</h3>
            <input className={input} placeholder={l({ en: "Full name", ar: "الاسم" })} value={cust.name} onChange={(e) => setCust({ ...cust, name: e.target.value })} />
            <input className={input} placeholder={l({ en: "Phone", ar: "الهاتف" })} value={cust.phone} onChange={(e) => setCust({ ...cust, phone: e.target.value })} dir="ltr" />
            <input className={input} placeholder={l({ en: "City", ar: "المدينة" })} value={cust.city} onChange={(e) => setCust({ ...cust, city: e.target.value })} />
            <input className={input} placeholder={l({ en: "Address", ar: "العنوان" })} value={cust.address} onChange={(e) => setCust({ ...cust, address: e.target.value })} />
          </section>
          <section className={`${card} p-4`}>
            <h3 className="mb-3 text-sm font-semibold">{l({ en: "Products", ar: "المنتجات" })}</h3>
            <div className="flex gap-2">
              <select className={input} value={pick} onChange={(e) => setPick(e.target.value)} aria-label={l({ en: "Add a product", ar: "أضف منتجاً" })}>
                <option value="">{l({ en: "Choose a product", ar: "اختر منتجاً" })}</option>
                {options.map((o) => <option key={o.key} value={o.key}>{o.i.name[lang]} · {o.v.label[lang]} · {money(o.v.price, lang)}</option>)}
              </select>
              <button className={btnLight} disabled={!pick} onClick={() => { setRows(rows.some((r) => r.key === pick) ? rows.map((r) => (r.key === pick ? { ...r, qty: r.qty + 1 } : r)) : [...rows, { key: pick, qty: 1 }]); setPick(""); }}>{l({ en: "Add", ar: "إضافة" })}</button>
            </div>
            <ul className="mt-3 divide-y divide-[#f0f0f0] text-sm">
              {lines.map((r) => (
                <li key={r.key} className="flex items-center justify-between gap-3 py-2">
                  <span>{r.o.i.name[lang]} <span className="text-[#8a8a8a]">· {r.o.v.label[lang]}</span></span>
                  <span className="flex items-center gap-2">
                    <input type="number" min={1} className={`${input} !w-16`} value={r.qty} onChange={(e) => setRows(rows.map((x) => (x.key === r.key ? { ...x, qty: Math.max(1, Number(e.target.value)) } : x)))} dir="ltr" aria-label={l({ en: "Quantity", ar: "الكمية" })} />
                    <button onClick={() => setRows(rows.filter((x) => x.key !== r.key))} className="rounded-md p-1.5 text-[#A8322F] hover:bg-[#A8322F]/10" aria-label={l({ en: "Remove", ar: "إزالة" })}><X className="h-4 w-4" /></button>
                  </span>
                </li>
              ))}
            </ul>
            <label className="mt-3 block text-xs text-[#616161]">{l({ en: "Delivery fee (EGP, optional)", ar: "رسوم التوصيل (ج.م، اختياري)" })}<input type="number" min={0} className={`${input} mt-1 max-w-[10rem]`} value={shipPrice} onChange={(e) => setShipPrice(e.target.value)} dir="ltr" /></label>
            <p className="mt-3 flex justify-between text-sm font-semibold"><span>{l({ en: "Total", ar: "الإجمالي" })}</span><bdi>{money(subtotal + ship, lang)}</bdi></p>
          </section>
        </div>
        <div className="flex items-center gap-3 border-t border-[#e1e1e1] bg-white px-5 py-4">
          <button className={btnDark} onClick={create}>{l({ en: "Create order", ar: "إنشاء الطلب" })}</button>
          <button className={btnLight} onClick={onClose}>{l({ en: "Cancel", ar: "إلغاء" })}</button>
          {error && <p role="alert" className="text-sm text-[#A8322F]">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const l = useLocalized();
  const lang = useLangStore((s) => s.lang);
  const orders = useCatalogStore((s) => s.orders);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [pay, setPay] = useState<"all" | "paid" | "unpaid">("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [sort, setSort] = useState<{ key: "date" | "total"; dir: 1 | -1 }>({ key: "date", dir: -1 });
  const [page, setPage] = useState(1);

  const needle = q.trim().toLowerCase();
  const matched = orders.filter(
    (o) =>
      (filter === "all" || o.status === filter) &&
      (pay === "all" || (pay === "paid") === o.payment.paid) &&
      (!needle || o.id.toLowerCase().includes(needle) || o.customer.name.toLowerCase().includes(needle) || o.customer.phone.includes(needle)),
  );
  const all = [...matched].sort((a, b) => (sort.key === "date" ? a.createdAt - b.createdAt : a.total - b.total) * sort.dir);
  const PER = 20;
  const pages = Math.max(1, Math.ceil(all.length / PER));
  const cur = Math.min(page, pages);
  const list = all.slice((cur - 1) * PER, cur * PER);
  const fmt = (t: number) => new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-GB", { dateStyle: "medium", timeStyle: "short" }).format(t);
  const toggleSort = (key: "date" | "total") => { setSort((s) => (s.key === key ? { key, dir: (s.dir * -1) as 1 | -1 } : { key, dir: -1 })); setPage(1); };

  const exportCsv = () =>
    downloadCsv("diwan-orders.csv", [
      ["Order", "Date", "Customer", "Phone", "City", "Address", "Status", "Paid", "Courier", "Tracking", "Total (EGP)", "Items"],
      ...all.map((o) => [o.id, new Date(o.createdAt).toISOString(), o.customer.name, o.customer.phone, o.customer.city, o.customer.address, o.status, o.payment.paid ? "yes" : "no", o.tracking.courier, o.tracking.number, o.total, o.lines.map((x) => `${x.name.en} ${x.variant.en} x${x.qty}`).join("; ")]),
    ]);

  return (
    <>
      <PageHead title={l({ en: "Orders", ar: "الطلبات" })} action={<div className="flex gap-2"><button className={btnLight} onClick={exportCsv} disabled={all.length === 0}><Download className="me-1.5 inline h-4 w-4" />CSV</button><button className={btnDark} onClick={() => setCreating(true)}><Plus className="me-1 inline h-4 w-4" />{l({ en: "Create order", ar: "إنشاء طلب" })}</button></div>} />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[14rem] flex-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8a8a]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={l({ en: "Search order, name or phone", ar: "ابحث بالطلب أو الاسم أو الهاتف" })} className={`${input} ps-9`} aria-label={l({ en: "Search orders", ar: "بحث في الطلبات" })} />
        </div>
        <select value={pay} onChange={(e) => setPay(e.target.value as typeof pay)} className={`${input} !w-auto`} aria-label={l({ en: "Payment", ar: "الدفع" })}>
          <option value="all">{l({ en: "All payments", ar: "كل المدفوعات" })}</option>
          <option value="paid">{l({ en: "Paid", ar: "مدفوع" })}</option>
          <option value="unpaid">{l({ en: "Unpaid", ar: "غير مدفوع" })}</option>
        </select>
      </div>

      <div className="mb-4 flex flex-wrap gap-2" role="tablist">
        {[{ id: "all" as const, en: "All", ar: "الكل" }, ...STATUSES].map((s) => (
          <button key={s.id} role="tab" aria-selected={filter === s.id} onClick={() => { setFilter(s.id); setPage(1); }} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${filter === s.id ? "bg-[#1a1a1a] text-white" : "bg-white text-[#303030] shadow-[0_0_0_1px_#e1e1e1] hover:bg-[#fafafa]"}`}>
            {l(s)}<bdi className="ms-1.5 text-xs opacity-70">{s.id === "all" ? orders.length : orders.filter((o) => o.status === s.id).length}</bdi>
          </button>
        ))}
      </div>

      <div className={`${card} overflow-x-auto`}>
        {all.length === 0 ? (
          <p className="p-12 text-center text-sm text-[#616161]">
            {orders.length === 0 ? l({ en: "No orders yet. They appear here as soon as a customer checks out.", ar: "لا طلبات بعد. ستظهر هنا بمجرد أن يُتمّ عميل طلبه." }) : l({ en: "No orders match these filters.", ar: "لا طلبات تطابق هذه التصفية." })}
          </p>
        ) : (
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-[#e1e1e1] text-xs text-[#616161]">
                {[{ en: "Order", ar: "الطلب" }, { en: "Date", ar: "التاريخ", k: "date" as const }, { en: "Customer", ar: "العميل" }, { en: "Payment", ar: "الدفع" }, { en: "Status", ar: "الحالة" }, { en: "Total", ar: "الإجمالي", k: "total" as const }].map((h) => (
                  <th key={h.en} scope="col" aria-sort={h.k && sort.key === h.k ? (sort.dir === 1 ? "ascending" : "descending") : undefined} className="p-3 text-start font-medium">
                    {h.k ? (
                      <button onClick={() => toggleSort(h.k)} className="inline-flex items-center gap-1 font-medium hover:text-[#1a1a1a]">
                        {l(h)}<span aria-hidden="true">{sort.key === h.k ? (sort.dir === 1 ? "↑" : "↓") : "↕"}</span>
                      </button>
                    ) : l(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((o: Order) => (
                <tr key={o.id} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setOpen(o.id)} onClick={() => setOpen(o.id)} className="cursor-pointer border-b border-[#f0f0f0] last:border-0 hover:bg-[#fafafa] focus:bg-[#fafafa]">
                  <td className="p-3 font-semibold"><bdi>{o.id}</bdi></td>
                  <td className="p-3 text-[#616161]">{fmt(o.createdAt)}</td>
                  <td className="p-3">{o.customer.name}</td>
                  <td className="p-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${o.payment.paid ? "bg-[#cdfee1] text-[#0c5132]" : "bg-[#ececec] text-[#4a4a4a]"}`}>{o.payment.paid ? l({ en: "Paid", ar: "مدفوع" }) : l({ en: "Unpaid", ar: "غير مدفوع" })}</span></td>
                  <td className="p-3"><Pill id={o.status} /></td>
                  <td className="p-3"><bdi>{money(o.total, lang)}</bdi></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pages > 1 && (
        <nav className="mt-4 flex items-center justify-between text-sm" aria-label={l({ en: "Pages", ar: "الصفحات" })}>
          <span className="text-[#616161]"><bdi>{(cur - 1) * PER + 1}–{Math.min(cur * PER, all.length)}</bdi> / <bdi>{all.length}</bdi></span>
          <div className="flex gap-2">
            <button className={btnLight} disabled={cur === 1} onClick={() => setPage(cur - 1)}>{l({ en: "Previous", ar: "السابق" })}</button>
            <button className={btnLight} disabled={cur === pages} onClick={() => setPage(cur + 1)}>{l({ en: "Next", ar: "التالي" })}</button>
          </div>
        </nav>
      )}

      {open && <Detail key={open} id={open} onClose={() => setOpen(null)} />}
      {creating && <Draft onClose={() => setCreating(false)} onCreated={(id) => { setCreating(false); setOpen(id); }} />}
    </>
  );
}
