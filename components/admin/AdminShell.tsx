"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Boxes, ExternalLink, Menu, Package, Percent, Search, Settings, ShoppingCart, Truck, Users, X } from "lucide-react";
import { useCatalogStore } from "@/store/useCatalogStore";
import { useTrap } from "@/lib/useTrap";
import { useLangStore, useLocalized } from "@/lib/i18n";

const GROUPS = [
  {
    en: "Sales", ar: "المبيعات",
    items: [
      { href: "/admin", icon: BarChart3, en: "Overview", ar: "نظرة عامة" },
      { href: "/admin/orders", icon: ShoppingCart, en: "Orders", ar: "الطلبات" },
      { href: "/admin/customers", icon: Users, en: "Customers", ar: "العملاء" },
    ],
  },
  {
    en: "Catalog", ar: "الكتالوج",
    items: [
      { href: "/admin/products", icon: Package, en: "Products", ar: "المنتجات" },
      { href: "/admin/inventory", icon: Boxes, en: "Inventory", ar: "المخزون" },
    ],
  },
  {
    en: "Marketing", ar: "التسويق",
    items: [{ href: "/admin/discounts", icon: Percent, en: "Discounts", ar: "الخصومات" }],
  },
  {
    en: "Store", ar: "المتجر",
    items: [
      { href: "/admin/shipping", icon: Truck, en: "Shipping", ar: "الشحن" },
      { href: "/admin/settings", icon: Settings, en: "Settings", ar: "الإعدادات" },
    ],
  },
];
const FLAT = GROUPS.flatMap((g) => g.items);

/** Ctrl or Cmd + K: jump to a page, an order or a product. */
function Palette({ onClose }: { onClose: () => void }) {
  const l = useLocalized();
  const lang = useLangStore((s) => s.lang);
  const router = useRouter();
  const orders = useCatalogStore((s) => s.orders);
  const items = useCatalogStore((s) => s.items);
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const trap = useTrap(onClose);

  const results = useMemo(() => {
    const n = q.trim().toLowerCase();
    const pages = FLAT.filter((p) => !n || p.en.toLowerCase().includes(n) || p.ar.includes(n)).map((p) => ({ key: p.href, label: l(p), hint: l({ en: "Page", ar: "صفحة" }), href: p.href }));
    const ord = n ? orders.filter((o) => o.id.toLowerCase().includes(n) || o.customer.name.toLowerCase().includes(n) || o.customer.phone.includes(n)).slice(0, 5).map((o) => ({ key: o.id, label: `${o.id} · ${o.customer.name}`, hint: l({ en: "Order", ar: "طلب" }), href: "/admin/orders" })) : [];
    const prod = n ? items.filter((p) => p.name.en.toLowerCase().includes(n) || p.name.ar.includes(n)).slice(0, 5).map((p) => ({ key: p.id, label: p.name[lang], hint: l({ en: "Product", ar: "منتج" }), href: "/admin/products" })) : [];
    return [...pages, ...ord, ...prod];
  }, [q, orders, items, lang, l]);

  const go = (href: string) => { router.push(href); onClose(); };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-start justify-center bg-black/40 p-4 pt-[15vh]" role="dialog" aria-modal="true" aria-label={l({ en: "Search", ar: "بحث" })} onClick={onClose}>
      <div ref={trap} className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-[#ececec] px-4">
          <Search className="h-4 w-4 text-[#8a8a8a]" />
          <input
            aria-label={l({ en: "Search pages, orders, products", ar: "ابحث في الصفحات والطلبات والمنتجات" })}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={results[i] ? `pal-${i}` : undefined}
            value={q}
            onChange={(e) => { setQ(e.target.value); setI(0); }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setI((x) => Math.min(results.length - 1, x + 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setI((x) => Math.max(0, x - 1)); }
              if (e.key === "Enter" && results[i]) go(results[i].href);
              if (e.key === "Escape") onClose();
            }}
            placeholder={l({ en: "Search pages, orders, products", ar: "ابحث في الصفحات والطلبات والمنتجات" })}
            className="h-12 flex-1 bg-transparent text-sm outline-none"
          />
        </div>
        <ul id="palette-list" role="listbox" className="max-h-80 overflow-y-auto p-2" data-lenis-prevent>
          {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-[#616161]">{l({ en: "Nothing found", ar: "لا نتائج" })}</li>}
          {results.map((r, idx) => (
            <li key={r.key + r.hint} role="option" id={`pal-${idx}`} aria-selected={idx === i}>
              <button tabIndex={-1} onMouseEnter={() => setI(idx)} onClick={() => go(r.href)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-start text-sm ${idx === i ? "bg-[#f1f1f1]" : ""}`}>
                <span>{r.label}</span><span className="text-xs text-[#8a8a8a]">{r.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Back-office frame: deliberately plain and neutral, nothing like the storefront. */
export default function AdminShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const l = useLocalized();
  const lang = useLangStore((s) => s.lang);
  const toggle = useLangStore((s) => s.toggle);
  const newOrders = useCatalogStore((s) => s.orders.filter((o) => o.status === "new").length);
  const storeName = useCatalogStore((s) => s.settings.storeName);
  const [open, setOpen] = useState(false);
  const [palette, setPalette] = useState(false);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPalette((p) => !p); }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  const nav = (
    <nav className="flex flex-col gap-5 p-3" aria-label={l({ en: "Admin", ar: "لوحة التحكم" })}>
      {GROUPS.map((g) => (
        <div key={g.en}>
          <p className="mb-1 px-3 text-[11px] font-semibold text-[#8a8a8a]">{l(g)}</p>
          {g.items.map((n) => {
            const active = n.href === "/admin" ? path === "/admin" : path.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${active ? "bg-white text-[#1a1a1a] shadow-[0_0_0_1px_#e1e1e1]" : "text-[#4a4a4a] hover:bg-black/5"}`}
              >
                <n.icon className="h-4 w-4" />
                <span className="flex-1">{l(n)}</span>
                {n.href === "/admin/orders" && newOrders > 0 && <span className="rounded-full bg-[#1a1a1a] px-2 py-0.5 text-[11px] font-semibold text-white"><bdi>{newOrders}</bdi></span>}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#f1f1f1] text-[#303030]" data-lenis-prevent>
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 bg-[#1a1a1a] px-4 text-white">
        <button className="rounded-md p-2 hover:bg-white/10 md:hidden" onClick={() => setOpen((o) => !o)} aria-label={l({ en: "Menu", ar: "القائمة" })}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <span className="text-sm font-semibold tracking-wide">{storeName} <span className="font-normal text-white/60">Admin</span></span>
        <button onClick={() => setPalette(true)} className="mx-auto hidden h-9 w-full max-w-md items-center gap-2 rounded-lg bg-white/10 px-3 text-sm text-white/70 transition hover:bg-white/15 md:flex">
          <Search className="h-4 w-4" />
          <span className="flex-1 text-start">{l({ en: "Search", ar: "بحث" })}</span>
          <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[11px]">Ctrl K</kbd>
        </button>
        <div className="ms-auto flex items-center gap-1 md:ms-0">
          <button onClick={() => setPalette(true)} className="rounded-md p-2 hover:bg-white/10 md:hidden" aria-label={l({ en: "Search", ar: "بحث" })}><Search className="h-4 w-4" /></button>
          <button onClick={toggle} className="rounded-md px-3 py-1.5 text-xs font-semibold hover:bg-white/10">{lang === "en" ? "عربي" : "EN"}</button>
          <Link href="/" className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold hover:bg-white/10">
            <span className="hidden sm:inline">{l({ en: "View store", ar: "عرض المتجر" })}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px]">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto border-e border-[#e1e1e1] md:block">{nav}</aside>
        {open && <div className="fixed inset-x-0 top-14 z-30 max-h-[calc(100vh-3.5rem)] overflow-y-auto border-b border-[#e1e1e1] bg-[#f1f1f1] md:hidden">{nav}</div>}
        <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
      </div>
      {palette && <Palette onClose={() => setPalette(false)} />}
    </div>
  );
}

export function PageHead({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-xl font-semibold text-[#1a1a1a]">{title}</h1>
      {action}
    </div>
  );
}

export const card = "rounded-xl border border-[#e1e1e1] bg-white shadow-[0_1px_0_rgba(0,0,0,.04)]";
export const btnDark = "rounded-lg bg-[#1a1a1a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#303030] active:scale-[0.98] disabled:opacity-40";
export const btnLight = "rounded-lg border border-[#c9c9c9] bg-white px-4 py-2 text-sm font-semibold text-[#303030] transition hover:bg-[#fafafa] active:scale-[0.98] disabled:opacity-40";
export const input = "w-full rounded-lg border border-[#c9c9c9] bg-white px-3 py-2 text-sm text-[#303030] outline-none transition focus:border-[#1a1a1a] focus:ring-2 focus:ring-black/10";
