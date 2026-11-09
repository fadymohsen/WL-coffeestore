"use client";

import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { PageHead, btnLight, card, input } from "@/components/admin/AdminShell";
import { useCatalogStore } from "@/store/useCatalogStore";
import { downloadCsv } from "@/lib/csv";
import { useLangStore, useLocalized } from "@/lib/i18n";
import { money } from "@/lib/format";

export default function CustomersPage() {
  const l = useLocalized();
  const lang = useLangStore((s) => s.lang);
  const orders = useCatalogStore((s) => s.orders);
  const [q, setQ] = useState("");

  const customers = useMemo(() => {
    const map = new Map<string, { name: string; phone: string; city: string; email: string; orders: number; spent: number; last: number }>();
    orders.forEach((o) => {
      const k = o.customer.phone.replace(/\D/g, "");
      const c = map.get(k) ?? { name: o.customer.name, phone: o.customer.phone, city: o.customer.city, email: o.customer.email, orders: 0, spent: 0, last: 0 };
      c.orders += 1;
      if (o.status !== "cancelled") c.spent += o.total;
      if (o.createdAt >= c.last) { c.last = o.createdAt; c.name = o.customer.name; c.city = o.customer.city; c.email = o.customer.email || c.email; }
      map.set(k, c);
    });
    return [...map.values()].sort((a, b) => b.spent - a.spent);
  }, [orders]);

  const needle = q.trim().toLowerCase();
  const list = customers.filter((c) => !needle || c.name.toLowerCase().includes(needle) || c.phone.includes(needle) || c.city.toLowerCase().includes(needle));
  const fmt = (t: number) => new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-GB", { dateStyle: "medium" }).format(t);

  return (
    <>
      <PageHead
        title={l({ en: "Customers", ar: "العملاء" })}
        action={<button className={btnLight} disabled={customers.length === 0} onClick={() => downloadCsv("diwan-customers.csv", [["Name", "Phone", "Email", "City", "Orders", "Spent (EGP)", "Last order"], ...customers.map((c) => [c.name, c.phone, c.email, c.city, c.orders, c.spent, new Date(c.last).toISOString()])])}><Download className="me-1.5 inline h-4 w-4" />CSV</button>}
      />
      <p className="mb-4 max-w-2xl text-sm text-[#616161]">{l({ en: "Customers are built from orders, matched by phone number.", ar: "يُبنى العملاء من الطلبات، ويُطابَقون برقم الهاتف." })}</p>
      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8a8a]" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={l({ en: "Search name, phone or city", ar: "ابحث بالاسم أو الهاتف أو المدينة" })} className={`${input} ps-9`} aria-label={l({ en: "Search customers", ar: "بحث في العملاء" })} />
      </div>
      <div className={`${card} overflow-x-auto`}>
        {list.length === 0 ? (
          <p className="p-12 text-center text-sm text-[#616161]">{customers.length === 0 ? l({ en: "No customers yet. They appear after the first order.", ar: "لا عملاء بعد. سيظهرون بعد أول طلب." }) : l({ en: "No customers match.", ar: "لا عملاء مطابقون." })}</p>
        ) : (
          <table className="w-full min-w-[640px] text-sm">
            <thead><tr className="border-b border-[#e1e1e1] text-xs text-[#616161]">{[{ en: "Customer", ar: "العميل" }, { en: "City", ar: "المدينة" }, { en: "Orders", ar: "الطلبات" }, { en: "Spent", ar: "الإنفاق" }, { en: "Last order", ar: "آخر طلب" }].map((h) => <th key={h.en} className="p-3 text-start font-medium">{l(h)}</th>)}</tr></thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.phone} className="border-b border-[#f0f0f0] last:border-0">
                  <td className="p-3"><div className="font-medium">{c.name}</div><div className="text-xs text-[#8a8a8a]" dir="ltr">{c.phone}</div></td>
                  <td className="p-3">{c.city}</td>
                  <td className="p-3"><bdi>{c.orders}</bdi>{c.orders > 1 && <span className="ms-2 rounded-full bg-[#cdfee1] px-2 py-0.5 text-[11px] font-semibold text-[#0c5132]">{l({ en: "Returning", ar: "عائد" })}</span>}</td>
                  <td className="p-3"><bdi>{money(c.spent, lang)}</bdi></td>
                  <td className="p-3 text-[#616161]">{fmt(c.last)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
