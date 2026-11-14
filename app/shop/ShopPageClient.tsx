"use client";

import { useState } from "react";
import { Plus, Heart } from "lucide-react";
import HeaderNav from "@/components/layout/HeaderNav";
import CartDrawer from "@/components/layout/CartDrawer";
import Footer from "@/components/layout/Footer";
import { COFFEE_CATALOG, CoffeeProduct, useShopStore } from "@/store/useShopStore";
import { useLocalized, useLangStore, translations } from "@/lib/i18n";

const t = translations.shopPage;
const tp = translations.product;

const FILTERS = [
  { key: "all", label: t.filters.all },
  { key: "BLEND", label: t.filters.blend },
  { key: "SPECIALTY", label: t.filters.specialty },
  { key: "TURKISH", label: t.filters.turkish },
] as const;

function ProductCard({ product }: { product: CoffeeProduct }) {
  const qty = useShopStore((s) => s.cart[product.id] || 0);
  const isLiked = useShopStore((s) => !!s.wishlist[product.id]);
  const addToCart = useShopStore((s) => s.addToCart);
  const toggleWishlist = useShopStore((s) => s.toggleWishlist);
  const l = useLocalized();
  const lang = useLangStore((s) => s.lang);

  const title = lang === "en" ? product.title : product.titleAr;
  const subtitle = lang === "en" ? product.titleAr : product.title;
  const region = lang === "en" ? product.regionEn : product.region;
  const notes = lang === "en" ? product.tastingNotesEn : product.tastingNotes;
  const desc = lang === "en" ? product.descriptionEn : product.description;

  return (
    <div className="group rounded-[14px] border border-n200 bg-n100 p-5 transition hover:shadow-lg">
      {/* Bag Visual */}
      <div className="relative mb-4 flex h-40 items-center justify-center overflow-hidden rounded-[10px] bg-n200/50">
        <div
          className="flex h-28 w-20 flex-col items-center justify-between rounded-lg border border-white/30 p-2 shadow-lg transition group-hover:scale-105"
          style={{ backgroundColor: product.bagColor }}
        >
          <div className="h-1.5 w-full rounded-full bg-black/15" />
          <div className="rounded bg-sandy px-1.5 py-1 text-center">
            <div className="text-[8px] font-bold uppercase tracking-wider text-green">DIWAN</div>
            <div className="text-[6px] font-normal text-green/60">{product.categoryEn}</div>
          </div>
          <span className="text-[9px] font-semibold text-white/90">{product.weight}</span>
        </div>
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute right-3 top-3 rounded-full bg-sandy/80 p-2 opacity-0 transition group-hover:opacity-100"
        >
          <Heart
            className={`h-4 w-4 ${isLiked ? "fill-aqeeq text-aqeeq" : "text-n400"}`}
          />
        </button>
      </div>

      {/* Info */}
      <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-green/50">
        {product.categoryEn}
      </span>
      <h3 className="mt-1 font-editorial text-xl font-bold text-green">{title}</h3>
      <p className="text-sm text-n400">{subtitle}</p>
      <p className="mt-1 text-xs text-n400">{region}</p>

      {/* Tasting Notes */}
      <div className="mt-3 flex flex-wrap gap-1">
        {notes.map((note) => (
          <span
            key={note}
            className="rounded-md bg-green/8 px-2 py-0.5 text-[10px] font-medium text-green"
          >
            {note}
          </span>
        ))}
      </div>

      {/* Description */}
      <p className="mt-3 text-xs leading-relaxed text-n400">
        {desc}
      </p>

      {/* Price + Add */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-bold text-green">{product.price} EGP</span>
        <button
          onClick={() => addToCart(product.id)}
          className="flex items-center gap-1.5 rounded-full bg-green px-4 py-2 text-xs font-semibold text-sandy transition hover:bg-green/90"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{qty > 0 ? `${l(tp.inBag)} (${qty})` : l(tp.add)}</span>
        </button>
      </div>
    </div>
  );
}

export default function ShopPageClient() {
  const [filter, setFilter] = useState<string>("all");
  const l = useLocalized();

  const filtered =
    filter === "all"
      ? COFFEE_CATALOG
      : COFFEE_CATALOG.filter((p) => p.categoryEn === filter);

  return (
    <main className="relative">
      <HeaderNav />
      <CartDrawer />

      {/* Hero */}
      <section className="flex flex-col items-center px-5 pb-8 pt-28 text-center md:px-20 md:pt-32">
        <span className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-green/50">
          {l(t.title)}
        </span>
        <h1 className="font-editorial text-4xl font-bold text-green md:text-6xl">
          {l(t.title)}
        </h1>
        <p className="mt-3 max-w-md text-sm text-n400">
          {l(t.subtitle)}
        </p>
      </section>

      {/* Filters */}
      <section className="mx-auto max-w-[1440px] px-5 md:px-20">
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                filter === f.key
                  ? "bg-green text-sandy"
                  : "border border-n200 text-n500 hover:bg-green/10"
              }`}
            >
              {l(f.label)}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section className="mx-auto max-w-[1440px] px-5 py-10 md:px-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="py-20 text-center text-sm text-n400">
            {l(t.noProducts)}
          </p>
        )}
      </section>

      {/* Gifting Banner */}
      <section className="mx-auto max-w-[1440px] px-5 pb-16 md:px-20">
        <div className="flex flex-col items-center gap-4 rounded-[14px] bg-green p-10 text-center md:p-16">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-sandy/50">
            {l(t.giftingLabel)}
          </span>
          <h2 className="font-editorial text-3xl font-bold text-sandy md:text-4xl">
            {l(t.giftingTitle)}
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-sandy/70">
            {l(t.giftingDesc)}
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
