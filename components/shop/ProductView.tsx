"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import HeaderNav from "@/components/layout/HeaderNav";
import CartDrawer from "@/components/layout/CartDrawer";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/ui/Reveal";
import { ImageReveal, SplitText } from "@/components/ui/motion";
import AddToBagButton from "@/components/shop/AddToBagButton";
import ProductCard from "@/components/diwan/ProductCard";
import {
  CATEGORY_META,
  PRODUCTS,
  ROAST_EN,
  SPICE_EN,
  variantKey,
  type Product,
  type Roast,
  type Spice,
} from "@/data/products";
import { inStock, isLive, isLow, lineKey, useCatalogStore } from "@/store/useCatalogStore";
import { useLangStore, useLocalized } from "@/lib/i18n";
import { money } from "@/lib/format";

type Shot = "photo" | "front" | "back";

function Choice<T extends string>({ legend, options, value, onChange, show }: { legend: string; options: readonly T[]; value: T; onChange: (v: T) => void; show: (v: T) => string }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-green">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            onClick={() => onChange(o)}
            className={`min-w-[5.5rem] rounded-xl border px-5 py-3 text-sm font-semibold transition active:scale-[0.97] ${value === o ? "border-green bg-green text-sandy" : "border-n300 text-green hover:border-green"}`}
          >
            {show(o)}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function ProductView({ id }: { id: string }) {
  const l = useLocalized();
  const lang = useLangStore((s) => s.lang);
  const ar = lang === "ar";
  const items = useCatalogStore((s) => s.items);
  const item = items.find((i) => i.id === id);
  const p: Product | undefined = PRODUCTS.find((x) => x.id === id);

  const [roast, setRoast] = useState<Roast | undefined>(p?.roasts?.[0]);
  const [spice, setSpice] = useState<Spice>("سادة");
  const [vk, setVk] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [shot, setShot] = useState<Shot>("photo");

  const key = p?.roasts && roast ? variantKey(roast, spice) : (vk ?? item?.variants[0]?.key ?? "default");
  const variant = item?.variants.find((v) => v.key === key) ?? item?.variants[0];
  const live = !!item && isLive(item);
  const available = live && !!variant && inStock(variant);
  const maxQty = variant && variant.stock !== null ? Math.max(1, variant.stock) : 12;

  const related = useMemo(() => {
    if (!p) return [];
    const same = PRODUCTS.filter((x) => x.id !== p.id && x.categoryId === p.categoryId);
    const other = PRODUCTS.filter((x) => x.id !== p.id && x.categoryId !== p.categoryId);
    return [...same, ...other].slice(0, 4);
  }, [p]);

  if (!item || (!live && item.status === "archived")) {
    return (
      <main id="main" className="relative">
        <HeaderNav />
        <CartDrawer />
        <section className="mx-auto max-w-[720px] px-5 pb-32 pt-44 text-center">
          <h1 className="font-editorial text-4xl font-semibold text-green md:text-5xl">{l({ en: "We could not find this product", ar: "لم نجد هذا المنتج" })}</h1>
          <Link href="/shop" className="btn btn-primary mt-8">{l({ en: "Back to the shop", ar: "العودة للمتجر" })}</Link>
        </section>
        <Footer />
      </main>
    );
  }

  const name = item.name[lang];
  const copy = item.description[lang];
  const cat = CATEGORY_META[item.categoryId].label[lang];
  const steps = p ? (ar ? p.steps : p.stepsEn) : [];

  const price = variant ? (
    <div className="flex items-baseline gap-3">
      <span className="text-3xl font-semibold text-green"><bdi>{money(variant.price, lang)}</bdi></span>
      {variant.compareAt && variant.compareAt > variant.price && <span className="text-lg text-n400 line-through"><bdi>{money(variant.compareAt, lang)}</bdi></span>}
    </div>
  ) : null;

  const facts: [string, string][] = [
    [l({ en: "Pack", ar: "العبوة" }), l({ en: "200 g pouch with a zip, no valve", ar: "كيس 200 جم بسوستة، بدون فالف" })],
    ...(p?.roasts ? ([[l({ en: "Roast", ar: "التحميص" }), p.roasts.map((r) => (ar ? r : ROAST_EN[r])).join(ar ? " أو " : " or ")]] as [string, string][]) : []),
    ...(p?.ratio ? ([[l({ en: "Blend", ar: "التوليفة" }), ar ? p.ratio.label : p.ratio.labelEn]] as [string, string][]) : []),
    ...(p?.type ? ([[l({ en: "Type", ar: "النوع" }), (ar ? p.type : p.typeEn) ?? ""]] as [string, string][]) : []),
    [l({ en: "In the box", ar: "داخل البوكس" }), l({ en: "Your blend's card, tissue paper with a wax seal and the pouch", ar: "كارت التوليفة وورق زبدة بختم شمعي والكيس" })],
  ];

  return (
    <main id="main" className="page-in relative bg-sandy pb-24 md:pb-0">
      <HeaderNav />
      <CartDrawer />

      <section className="mx-auto max-w-[1320px] px-5 pb-16 pt-28 md:px-12 md:pt-36">
        <nav aria-label={l({ en: "Breadcrumb", ar: "مسار الصفحة" })} className="mb-6 text-sm text-n500">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="hover:text-green hover:underline">{l({ en: "Home", ar: "الرئيسية" })}</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/shop" className="hover:text-green hover:underline">{l({ en: "Shop", ar: "المتجر" })}</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href={`/shop?category=${item.categoryId}`} className="hover:text-green hover:underline">{cat}</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-green">{name}</li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          {/* Gallery */}
          <div>
            <ImageReveal className="relative aspect-square rounded-2xl bg-n200">
              {shot === "photo" && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt={l({ en: `${item.name.en}, 200 g pack with its card`, ar: `${item.name.ar}، عبوة 200 جم مع كارتها` })} className="h-full w-full object-cover" />
              )}
              {p && shot !== "photo" && (
                <div className="grid h-full place-items-center p-6 md:p-12" style={{ background: p.hex }}>
                  <div className="w-full max-w-[22rem]">
                    <ProductCard product={p} roast={p.roasts ? roast : undefined} spice={p.roasts ? spice : undefined} flipped={shot === "back"} onFlip={(f) => setShot(f ? "back" : "front")} />
                  </div>
                </div>
              )}
            </ImageReveal>
            {p && (
              <div className="mt-3 flex gap-3" role="group" aria-label={l({ en: "Product views", ar: "صور المنتج" })}>
                {([["photo", l({ en: "Photo", ar: "الصورة" })], ["front", l({ en: "Card front", ar: "وجه الكارت" })], ["back", l({ en: "Card back", ar: "ظهر الكارت" })]] as [Shot, string][]).map(([s, label]) => (
                  <button key={s} aria-pressed={shot === s} onClick={() => setShot(s)} className={`relative h-20 w-20 overflow-hidden rounded-xl border-2 transition sm:h-24 sm:w-24 ${shot === s ? "border-green" : "border-transparent opacity-80 hover:opacity-100"}`} aria-label={label}>
                    {s === "photo" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="grid h-full w-full place-items-center px-1 text-center text-[11px] font-semibold leading-tight text-sand" style={{ background: p.hex }}>{label}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Buy box */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-sm font-medium text-n500">{cat}</p>
            <SplitText as="h1" text={name} className="mt-1 block font-editorial text-5xl font-semibold leading-none text-green md:text-7xl" />
            <p className="mt-5 max-w-md text-base leading-relaxed text-n500">{copy}</p>

            <div className="mt-6">{price}</div>
            {variant && isLow(variant) && <p className="mt-1 text-sm font-medium text-[#9A6B12]">{l({ en: `Only ${variant.stock} left`, ar: `متبقي ${variant.stock} فقط` })}</p>}
            {!available && <p className="mt-1 text-sm font-medium text-[#A8322F]">{l({ en: "Currently unavailable", ar: "غير متوفر حالياً" })}</p>}

            <div className="mt-7 space-y-5">
              {p?.roasts && roast && (
                <>
                  <Choice legend={l({ en: "Roast", ar: "درجة التحميص" })} options={p.roasts} value={roast} onChange={setRoast} show={(r) => (ar ? r : ROAST_EN[r])} />
                  <Choice legend={l({ en: "Style", ar: "النوع" })} options={p.states!} value={spice} onChange={setSpice} show={(s) => (ar ? s : SPICE_EN[s])} />
                </>
              )}
              {!p?.roasts && item.variants.length > 1 && (
                <Choice legend={l({ en: "Option", ar: "الخيار" })} options={item.variants.map((v) => v.key)} value={key} onChange={setVk} show={(k) => item.variants.find((v) => v.key === k)?.label[lang] ?? k} />
              )}

              <div>
                <p className="mb-2 text-sm font-semibold text-green">{l({ en: "Quantity", ar: "الكمية" })}</p>
                <div className="inline-flex items-center rounded-full border border-n300">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label={l({ en: "Decrease quantity", ar: "تقليل الكمية" })} className="rounded-full p-3 text-green transition hover:bg-green/10 active:scale-90"><Minus className="h-4 w-4" /></button>
                  <span className="w-10 text-center font-semibold text-green" aria-live="polite"><bdi>{qty}</bdi></span>
                  <button onClick={() => setQty(Math.min(maxQty, qty + 1))} aria-label={l({ en: "Increase quantity", ar: "زيادة الكمية" })} className="rounded-full p-3 text-green transition hover:bg-green/10 active:scale-90"><Plus className="h-4 w-4" /></button>
                </div>
              </div>
            </div>

            <div className="mt-8 hidden md:block">
              {variant && <AddToBagButton lineKey={lineKey(item.id, variant.key)} qty={qty} disabled={!available} flyImage={item.image} className="w-full" />}
            </div>
            <p className="mt-4 text-sm text-n500">{l({ en: "Cash on delivery. We call you to confirm before it ships.", ar: "الدفع عند الاستلام. نتصل بك لتأكيد الطلب قبل الشحن." })}</p>

            <dl className="mt-8 divide-y divide-n200 border-y border-n200 text-sm">
              {facts.map(([k, v]) => (
                <div key={k} className="flex gap-6 py-3">
                  <dt className="w-28 shrink-0 text-n500">{k}</dt>
                  <dd className="font-medium text-green">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {steps.length > 0 && (
        <section className="border-y border-n200 bg-n100 py-16 md:py-24">
          <div className="mx-auto grid max-w-[1320px] gap-10 px-5 md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] md:gap-20 md:px-12">
            <Reveal>
              <h2 className="font-editorial text-4xl font-semibold text-green md:text-5xl">{l({ en: "How to brew it", ar: "طريقة التحضير" })}</h2>
              {p?.note && <p className="mt-4 max-w-sm text-sm text-n500">{ar ? p.note : p.noteEn}</p>}
            </Reveal>
            <Reveal delay={0.1}>
              <ol className="space-y-3">
                {steps.map((s, i) => (
                  <li key={s} className="flex items-center gap-4 rounded-xl border border-n200 bg-sandy p-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-green text-sm font-semibold text-sandy"><bdi>{i + 1}</bdi></span>
                    <span className="text-base text-ink">{s}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mx-auto max-w-[1320px] px-5 py-16 md:px-12 md:py-24">
          <h2 className="font-editorial text-3xl font-semibold text-green md:text-5xl">{l({ en: "More from the table", ar: "توليفات أخرى" })}</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((r, i) => {
              const ri = items.find((x) => x.id === r.id);
              const from = ri ? Math.min(...ri.variants.map((v) => v.price)) : 0;
              return (
                <Reveal key={r.id} delay={i * 0.05}>
                  <Link href={`/shop/${r.id}`} className="group block">
                    <span className="relative block aspect-square overflow-hidden rounded-xl" style={{ background: r.hex }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
                    </span>
                    <span className="mt-3 flex items-baseline justify-between gap-2">
                      <span className="font-editorial text-xl font-semibold text-green">{ar ? r.name : r.nameEn}</span>
                      <span className="text-sm font-semibold text-green"><bdi>{money(from, lang)}</bdi></span>
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      {/* mobile buy bar */}
      {variant && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-n200 bg-sandy/95 px-5 py-3 backdrop-blur md:hidden">
          <div>
            <p className="text-xs text-n500">{name}</p>
            <p className="font-semibold text-green"><bdi>{money(variant.price * qty, lang)}</bdi></p>
          </div>
          <AddToBagButton lineKey={lineKey(item.id, variant.key)} qty={qty} disabled={!available} flyImage={item.image} size="sm" />
        </div>
      )}

      <Footer />
    </main>
  );
}
