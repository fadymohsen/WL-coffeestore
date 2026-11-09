"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download, TrendingDown, TrendingUp } from "lucide-react";
import { PageHead, btnLight, card } from "@/components/admin/AdminShell";
import { AreaChart, Bar } from "@/components/admin/charts";
import { STATUSES } from "@/components/admin/orderMeta";
import { isLow, useCatalogStore, type Order } from "@/store/useCatalogStore";
import { CATEGORY_META } from "@/data/products";
import { downloadCsv } from "@/lib/csv";
import { useLangStore, useLocalized } from "@/lib/i18n";
import { money } from "@/lib/format";

const DAY = 86_400_000;
type Range = 7 | 30 | 90;

const sum = (o: Order[]) => o.reduce((a, b) => a + b.total, 0);

function Delta({ now, prev }: { now: number; prev: number }) {
  if (prev === 0) return <span className="text-xs text-[#8a8a8a]">—</span>;
  const pct = Math.round(((now - prev) / prev) * 100);
  const up = pct >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${up ? "text-[#0c5132]" : "text-[#8e0b21]"}`}>
      <Icon className="h-3.5 w-3.5" />
      <bdi>{up ? "+" : ""}{pct}%</bdi>
    </span>
  );
}

export default function AdminOverview() {
  const l = useLocalized();
  const lang = useLangStore((s) => s.lang);
  const orders = useCatalogStore((s) => s.orders);
  const items = useCatalogStore((s) => s.items);
  const messages = useCatalogStore((s) => s.messages);
  const markRead = useCatalogStore((s) => s.markMessageRead);
  const [range, setRange] = useState<Range>(30);

  // read the clock after mount, so the prerendered page does not freeze a date
  const [today, setToday] = useState(0);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(new Date().setHours(0, 0, 0, 0));
  }, []);

  const s = useMemo(() => {
    const live = orders.filter((o) => o.status !== "cancelled");
    const start = today - (range - 1) * DAY;
    const cur = live.filter((o) => o.createdAt >= start);
    const prev = live.filter((o) => o.createdAt >= start - range * DAY && o.createdAt < start);

    const series = Array.from({ length: range }, (_, i) => {
      const t = start + i * DAY;
      const day = cur.filter((o) => o.createdAt >= t && o.createdAt < t + DAY);
      return { t, revenue: sum(day), orders: day.length };
    });

    const sold = new Map<string, { qty: number; revenue: number; name: { ar: string; en: string } }>();
    cur.forEach((o) =>
      o.lines.forEach((ln) => {
        const id = ln.key.split(":")[0];
        const c = sold.get(id) ?? { qty: 0, revenue: 0, name: ln.name };
        sold.set(id, { qty: c.qty + ln.qty, revenue: c.revenue + ln.qty * ln.price, name: ln.name });
      }),
    );
    const top = [...sold.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 6);

    const byCat = (Object.keys(CATEGORY_META) as (keyof typeof CATEGORY_META)[]).map((c) => {
      const ids = items.filter((i) => i.categoryId === c).map((i) => i.id);
      const revenue = cur.reduce((a, o) => a + o.lines.filter((ln) => ids.includes(ln.key.split(":")[0])).reduce((x, ln) => x + ln.qty * ln.price, 0), 0);
      return { c, revenue };
    });

    const phones = new Map<string, number>();
    orders.forEach((o) => phones.set(o.customer.phone.replace(/\D/g, ""), (phones.get(o.customer.phone.replace(/\D/g, "")) ?? 0) + 1));
    const customers = phones.size;
    const returning = [...phones.values()].filter((n) => n > 1).length;

    const tracked = items.flatMap((i) => i.variants.filter((v) => v.stock !== null).map((v) => ({ i, v })));
    const stockValue = tracked.reduce((a, { v }) => a + (v.stock ?? 0) * (v.cost ?? 0), 0);
    const retailValue = tracked.reduce((a, { v }) => a + (v.stock ?? 0) * v.price, 0);
    const low = items.flatMap((i) => i.variants.filter((v) => v.stock !== null && (v.stock === 0 || isLow(v))).map((v) => ({ i, v })));

    const funnel = STATUSES.map((st) => ({ ...st, n: orders.filter((o) => o.status === st.id).length }));
    const paid = orders.filter((o) => o.payment.paid && o.status !== "cancelled");
    const unpaidDelivered = orders.filter((o) => o.status === "delivered" && !o.payment.paid).length;

    return {
      revenue: sum(cur), prevRevenue: sum(prev), count: cur.length, prevCount: prev.length,
      aov: cur.length ? Math.round(sum(cur) / cur.length) : 0, prevAov: prev.length ? Math.round(sum(prev) / prev.length) : 0,
      units: cur.reduce((a, o) => a + o.lines.reduce((x, ln) => x + ln.qty, 0), 0),
      series, top, byCat, customers, returning, stockValue, retailValue, low, funnel, collected: sum(paid), unpaidDelivered,
      pending: orders.filter((o) => o.status === "new").length,
    };
  }, [orders, items, range, today]);

  const fmtDay = (t: number) => new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-GB", { day: "numeric", month: "short" }).format(t);
  const maxTop = Math.max(1, ...s.top.map((t) => t.revenue));
  const maxCat = Math.max(1, ...s.byCat.map((c) => c.revenue));
  const maxFunnel = Math.max(1, ...s.funnel.map((f) => f.n));

  const exportOrders = () =>
    downloadCsv("diwan-orders.csv", [
      ["Order", "Date", "Customer", "Phone", "City", "Status", "Paid", "Total (EGP)", "Items"],
      ...orders.map((o) => [o.id, new Date(o.createdAt).toISOString(), o.customer.name, o.customer.phone, o.customer.city, o.status, o.payment.paid ? "yes" : "no", o.total, o.lines.map((x) => `${x.name.en} ${x.variant.en} x${x.qty}`).join("; ")]),
    ]);

  const kpis = [
    { label: l({ en: "Revenue", ar: "الإيرادات" }), value: money(s.revenue, lang), d: <Delta now={s.revenue} prev={s.prevRevenue} /> },
    { label: l({ en: "Orders", ar: "الطلبات" }), value: String(s.count), d: <Delta now={s.count} prev={s.prevCount} /> },
    { label: l({ en: "Average order", ar: "متوسط الطلب" }), value: money(s.aov, lang), d: <Delta now={s.aov} prev={s.prevAov} /> },
    { label: l({ en: "Packs sold", ar: "العبوات المباعة" }), value: String(s.units), d: null },
  ];

  return (
    <>
      <PageHead
        title={l({ en: "Overview", ar: "نظرة عامة" })}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg bg-white p-0.5 shadow-[0_0_0_1px_#e1e1e1]" role="tablist">
              {([7, 30, 90] as Range[]).map((r) => (
                <button key={r} role="tab" aria-selected={range === r} onClick={() => setRange(r)} className={`rounded-md px-3 py-1.5 text-sm font-medium ${range === r ? "bg-[#1a1a1a] text-white" : "text-[#303030] hover:bg-[#f5f5f5]"}`}>
                  <bdi>{r}</bdi> {l({ en: "days", ar: "يوماً" })}
                </button>
              ))}
            </div>
            <button className={btnLight} onClick={exportOrders}><Download className="me-1.5 inline h-4 w-4" />{l({ en: "Export orders", ar: "تصدير الطلبات" })}</button>
          </div>
        }
      />

      {s.pending > 0 && (
        <Link href="/admin/orders" className="mb-4 flex items-center justify-between rounded-xl bg-[#1a1a1a] px-5 py-3 text-sm text-white transition hover:bg-[#303030]">
          <span>{l({ en: `${s.pending} new order${s.pending > 1 ? "s" : ""} waiting to be confirmed`, ar: `${s.pending} طلب جديد بانتظار التأكيد` })}</span>
          <span className="font-semibold underline">{l({ en: "Review", ar: "مراجعة" })}</span>
        </Link>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className={`${card} p-5`}>
            <p className="text-sm text-[#616161]">{k.label}</p>
            <p className="mt-2 text-2xl font-semibold text-[#1a1a1a]"><bdi>{k.value}</bdi></p>
            <div className="mt-1 h-5">{k.d}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <section className={`${card} p-5 lg:col-span-2`} aria-labelledby="rev-h">
          <div className="flex items-baseline justify-between">
            <h2 id="rev-h" className="text-sm font-semibold">{l({ en: "Revenue over time", ar: "الإيرادات عبر الزمن" })}</h2>
            <span className="text-xs text-[#8a8a8a]">{l({ en: "Cancelled orders excluded", ar: "بدون الطلبات الملغاة" })}</span>
          </div>
          {s.revenue === 0 ? (
            <p className="py-20 text-center text-sm text-[#616161]">{l({ en: "No orders in this period yet.", ar: "لا طلبات في هذه الفترة بعد." })}</p>
          ) : (
            <div className="mt-4">
              <AreaChart data={s.series.map((d) => ({ label: fmtDay(d.t), value: d.revenue }))} format={(n) => money(n, lang)} />
            </div>
          )}
        </section>

        <section className={`${card} p-5`} aria-labelledby="fun-h">
          <h2 id="fun-h" className="text-sm font-semibold">{l({ en: "Order pipeline", ar: "مسار الطلبات" })}</h2>
          <ul className="mt-5 space-y-3.5">
            {s.funnel.map((f) => (
              <li key={f.id}>
                <div className="mb-1 flex justify-between text-sm"><span>{l(f)}</span><bdi className="font-semibold">{f.n}</bdi></div>
                <Bar value={f.n} max={maxFunnel} />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <section className={`${card} p-5`} aria-labelledby="top-h">
          <h2 id="top-h" className="text-sm font-semibold">{l({ en: "Top products by revenue", ar: "الأعلى إيراداً" })}</h2>
          {s.top.length === 0 ? <p className="py-8 text-sm text-[#616161]">{l({ en: "Nothing sold in this period.", ar: "لا مبيعات في هذه الفترة." })}</p> : (
            <ul className="mt-4 space-y-3.5">
              {s.top.map((t) => (
                <li key={t.name.en}>
                  <div className="mb-1 flex justify-between text-sm"><span>{t.name[lang]} <bdi className="text-[#8a8a8a]">× {t.qty}</bdi></span><bdi className="font-semibold">{money(t.revenue, lang)}</bdi></div>
                  <Bar value={t.revenue} max={maxTop} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={`${card} p-5`} aria-labelledby="cat-h">
          <h2 id="cat-h" className="text-sm font-semibold">{l({ en: "Revenue by category", ar: "الإيرادات حسب الفئة" })}</h2>
          <ul className="mt-4 space-y-3.5">
            {s.byCat.map((c) => (
              <li key={c.c}>
                <div className="mb-1 flex justify-between text-sm"><span>{CATEGORY_META[c.c].label[lang]}</span><bdi className="font-semibold">{money(c.revenue, lang)}</bdi></div>
                <Bar value={c.revenue} max={maxCat} />
              </li>
            ))}
          </ul>
          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-[#ececec] pt-4 text-sm">
            <div><dt className="text-[#616161]">{l({ en: "Customers", ar: "العملاء" })}</dt><dd className="mt-1 text-lg font-semibold"><bdi>{s.customers}</bdi></dd></div>
            <div><dt className="text-[#616161]">{l({ en: "Returning", ar: "عائدون" })}</dt><dd className="mt-1 text-lg font-semibold"><bdi>{s.returning}</bdi></dd></div>
          </dl>
        </section>

        <section className={`${card} p-5`} aria-labelledby="inv-h">
          <h2 id="inv-h" className="text-sm font-semibold">{l({ en: "Inventory", ar: "المخزون" })}</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-[#616161]">{l({ en: "Stock at cost", ar: "المخزون بالتكلفة" })}</dt><dd className="font-semibold"><bdi>{money(s.stockValue, lang)}</bdi></dd></div>
            <div className="flex justify-between"><dt className="text-[#616161]">{l({ en: "Stock at retail", ar: "المخزون بسعر البيع" })}</dt><dd className="font-semibold"><bdi>{money(s.retailValue, lang)}</bdi></dd></div>
            <div className="flex justify-between"><dt className="text-[#616161]">{l({ en: "Cash collected", ar: "المحصَّل نقداً" })}</dt><dd className="font-semibold"><bdi>{money(s.collected, lang)}</bdi></dd></div>
            {s.unpaidDelivered > 0 && <div className="flex justify-between text-[#8e0b21]"><dt>{l({ en: "Delivered, not marked paid", ar: "مسلَّم ولم يُسجَّل دفعه" })}</dt><dd className="font-semibold"><bdi>{s.unpaidDelivered}</bdi></dd></div>}
          </dl>
          <h3 className="mt-5 border-t border-[#ececec] pt-4 text-sm font-semibold">{l({ en: "Needs restocking", ar: "يحتاج إعادة تخزين" })}</h3>
          {s.low.length === 0 ? <p className="mt-2 text-sm text-[#616161]">{l({ en: "Nothing is low. Track stock in Inventory to get alerts.", ar: "لا شيء منخفض. فعّل تتبع المخزون لتصلك التنبيهات." })}</p> : (
            <ul className="mt-2 space-y-1.5 text-sm">
              {s.low.slice(0, 5).map(({ i, v }) => (
                <li key={i.id + v.key} className="flex justify-between"><span>{i.name[lang]} <span className="text-[#8a8a8a]">· {v.label[lang]}</span></span><bdi className={`font-semibold ${v.stock === 0 ? "text-[#8e0b21]" : "text-[#9A6B12]"}`}>{v.stock}</bdi></li>
              ))}
            </ul>
          )}
          <Link href="/admin/inventory" className="mt-3 inline-block text-sm font-semibold underline">{l({ en: "Open inventory", ar: "فتح المخزون" })}</Link>
        </section>
      </div>

      <section className={`${card} mt-4 p-5`} aria-labelledby="msg-h">
        <h2 id="msg-h" className="text-sm font-semibold">{l({ en: "Messages", ar: "الرسائل" })}</h2>
        {messages.length === 0 ? <p className="py-6 text-sm text-[#616161]">{l({ en: "No messages from the contact form yet.", ar: "لا رسائل من نموذج التواصل بعد." })}</p> : (
          <ul className="mt-3 divide-y divide-[#f0f0f0]">
            {messages.slice(0, 5).map((m) => (
              <li key={m.id}>
                <button onClick={() => markRead(m.id)} className="flex w-full items-start gap-3 py-3 text-start">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${m.read ? "bg-transparent" : "bg-[#1a1a1a]"}`} aria-label={m.read ? undefined : l({ en: "Unread", ar: "غير مقروء" })} />
                  <span className="min-w-0 flex-1 text-sm">
                    <span className={m.read ? "" : "font-semibold"}>{m.name}</span>
                    <span className="ms-2 text-xs text-[#8a8a8a]" dir="ltr">{m.contact}</span>
                    <span className="block truncate text-[#616161]">{m.body}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
