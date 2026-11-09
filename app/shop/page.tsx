"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HeaderNav from "@/components/layout/HeaderNav";
import CartDrawer from "@/components/layout/CartDrawer";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/motion";
import { CATEGORY_IDS, CATEGORY_META, type CategoryId } from "@/data/products";
import AddToBagButton from "@/components/shop/AddToBagButton";
import { inStock, isLive, isLow, lineKey, useCatalogStore, type CatalogItem } from "@/store/useCatalogStore";
import { useLangStore, useLocalized } from "@/lib/i18n";
import { money } from "@/lib/format";

type Filter = "all" | CategoryId;

function ShopCard({ item }: { item: CatalogItem }) {
  const lang = useLangStore((s) => s.lang);
  const l = useLocalized();
  const [variantKey, setVariantKey] = useState(item.variants[0].key);
  const variant = item.variants.find((v) => v.key === variantKey) ?? item.variants[0];
  const available = inStock(variant);
  const multi = item.variants.length > 1;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[14px] border border-n200 bg-n100 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-16px_rgba(14,58,51,0.25)]">
      <Link href={`/shop/${item.id}`} className="relative block aspect-square overflow-hidden bg-n200" aria-label={item.name[lang]}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={l({ en: `${item.name.en}, 200 g pack with its card`, ar: `${item.name.ar}، عبوة 200 جم مع كارتها` })}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute start-3 top-3 rounded-[6px] bg-sandy/90 px-2.5 py-1 text-[11px] font-semibold text-green backdrop-blur">
          {CATEGORY_META[item.categoryId].label[lang]}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-editorial text-2xl font-semibold text-green"><Link href={`/shop/${item.id}`} className="hover:underline">{item.name[lang]}</Link></h3>
        <p className="mt-1 text-sm leading-relaxed text-n500">{item.description[lang]}</p>

        {multi && (
          <div className="mt-4 flex flex-wrap gap-1.5" role="radiogroup" aria-label={l({ en: "Roast and style", ar: "التحميص والحالة" })}>
            {item.variants.map((v) => (
              <button
                key={v.key}
                role="radio"
                aria-checked={v.key === variantKey}
                onClick={() => setVariantKey(v.key)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition active:scale-[0.97] ${v.key === variantKey ? "border-green bg-green text-sandy" : "border-n300 text-n500 hover:border-green hover:text-green"}`}
              >
                {v.label[lang]}
              </button>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-green"><bdi>{money(variant.price, lang)}</bdi></span>
              {variant.compareAt && variant.compareAt > variant.price && <span className="text-xs text-n400 line-through"><bdi>{money(variant.compareAt, lang)}</bdi></span>}
            </div>
            <div className="text-[11px] text-n400">
              {isLow(variant) ? <span className="font-medium text-[#9A6B12]">{l({ en: `${variant.stock} left`, ar: `متبقي ${variant.stock}` })}</span> : l({ en: "200 g pack", ar: "عبوة 200 جم" })}
            </div>
          </div>
          <AddToBagButton lineKey={lineKey(item.id, variant.key)} disabled={!available} flyImage={item.image} size="sm" />
        </div>
      </div>
    </article>
  );
}

export default function ShopPage() {
  const lang = useLangStore((s) => s.lang);
  const l = useLocalized();
  const items = useCatalogStore((s) => s.items).filter(isLive);
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<"featured" | "low" | "high">("featured");
  const [q, setQ] = useState("");

  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("category");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (c && (CATEGORY_IDS as string[]).includes(c)) setFilter(c as CategoryId);
  }, []);

  const needle = q.trim().toLowerCase();
  const base = (filter === "all" ? items : items.filter((i) => i.categoryId === filter)).filter((i) => !needle || i.name.en.toLowerCase().includes(needle) || i.name.ar.includes(needle));
  const minPrice = (i: CatalogItem) => Math.min(...i.variants.map((v) => v.price));
  const filtered = sort === "featured" ? base : [...base].sort((a, b) => (sort === "low" ? minPrice(a) - minPrice(b) : minPrice(b) - minPrice(a)));
  const filters: Filter[] = ["all", ...CATEGORY_IDS];

  return (
    <main id="main" className="page-in relative">
      <HeaderNav />
      <CartDrawer />

      <section className="mx-auto max-w-[1440px] px-5 pb-10 pt-32 md:px-20 md:pt-40">
        <Reveal>
          <SplitText as="h1" text={l({ en: "Shop", ar: "المتجر" })} className="block font-editorial text-5xl font-semibold text-green md:text-7xl" />
          <p className="mt-4 max-w-xl text-base leading-relaxed text-n500">
            {l({
              en: "Nine blends in three categories. Every pack is 200 g, and every price is in Egyptian pounds.",
              ar: "تسع توليفات في ثلاث فئات. كل عبوة 200 جم، وكل الأسعار بالجنيه المصري.",
            })}
          </p>
        </Reveal>

        <div className="mt-8 flex flex-wrap gap-2" role="tablist">
          {filters.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition active:scale-[0.97] ${filter === f ? "bg-green text-sandy" : "border border-n300 text-n500 hover:border-green hover:text-green"}`}
            >
              {f === "all" ? l({ en: "All", ar: "الكل" }) : CATEGORY_META[f].label[lang]}
            </button>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between gap-4 border-t border-n200 pt-4 text-sm text-n500">
          <div className="flex flex-1 items-center gap-4">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={l({ en: "Search blends", ar: "ابحث عن توليفة" })}
              aria-label={l({ en: "Search blends", ar: "ابحث عن توليفة" })}
              className="w-full max-w-xs rounded-xl border border-n300 bg-n100 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-green focus:ring-2 focus:ring-green/20"
            />
            <span aria-live="polite" className="whitespace-nowrap"><bdi>{filtered.length}</bdi> {l({ en: "products", ar: "منتجات" })}</span>
          </div>
          <label className="flex items-center gap-2">
            {l({ en: "Sort", ar: "الترتيب" })}
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="rounded-lg border border-n300 bg-n100 px-3 py-2 text-sm text-ink outline-none focus:border-green">
              <option value="featured">{l({ en: "Featured", ar: "المميّز" })}</option>
              <option value="low">{l({ en: "Price: low to high", ar: "السعر: الأقل أولاً" })}</option>
              <option value="high">{l({ en: "Price: high to low", ar: "السعر: الأعلى أولاً" })}</option>
            </select>
          </label>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pb-20 md:px-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, i) => (
            <Reveal key={item.id} delay={(i % 3) * 0.07}>
              <ShopCard item={item} />
            </Reveal>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-sm text-n500">{needle ? l({ en: "No blend matches your search.", ar: "لا توجد توليفة تطابق بحثك." }) : l({ en: "No products in this category yet.", ar: "لا توجد منتجات في هذا التصنيف حالياً." })}</p>
            {(needle || filter !== "all") && <button onClick={() => { setQ(""); setFilter("all"); }} className="btn btn-ghost mt-4">{l({ en: "Clear filters", ar: "مسح التصفية" })}</button>}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pb-24 md:px-20">
        <Reveal>
          <div className="grid overflow-hidden rounded-[14px] bg-green text-sandy md:grid-cols-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/diwan/photo/unboxing-flatlay.webp" alt={l({ en: "The DIWAN box, opened", ar: "بوكس ديوان مفتوح" })} loading="lazy" className="h-64 w-full object-cover md:h-full" />
            <div className="flex flex-col justify-center gap-4 p-8 md:p-12">
              <h2 className="font-editorial text-3xl font-semibold md:text-4xl">{l({ en: "Every order opens like a story", ar: "كل طلب يصلك في بوكس" })}</h2>
              <p className="text-sm leading-relaxed text-sandy/80">
                {l({
                  en: "A sealed box, tissue paper with a wax seal, the card for your blend and the white pouch.",
                  ar: "بوكس بختم، وورق زبدة بختم شمعي، وكارت توليفتك، والكيس الأبيض.",
                })}
              </p>
              <Link href="/#unboxing" className="inline-flex w-fit items-center rounded-full border border-sandy/60 px-6 py-3 text-xs font-bold uppercase tracking-widest transition hover:bg-sandy hover:text-green active:scale-[0.97]">
                {l({ en: "See the unboxing", ar: "شاهد فتح البوكس" })}
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
