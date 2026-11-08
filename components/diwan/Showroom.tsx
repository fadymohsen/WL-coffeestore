"use client";

import { useEffect, useState } from "react";
import { CATEGORIES, PRODUCTS, STORE, type Category, type Product, type Roast, type Spice } from "@/data/products";
import ProductCard from "./ProductCard";
import { setScrollLocked } from "@/components/providers/SmoothScrollProvider";

export function Showroom({ highlight, onOpen }: { highlight: string[]; onOpen: (p: Product) => void }) {
  const [cat, setCat] = useState<Category | "الكل">("الكل");
  const list = cat === "الكل" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat);
  const tabs: (Category | "الكل")[] = ["الكل", ...CATEGORIES];
  const count = (t: Category | "الكل") => (t === "الكل" ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === t).length);

  return (
    <section id="catalog" className="py-24" aria-labelledby="catalog-h">
      <div className="wrap">
        <p className="font-latin text-sm tracking-[0.3em] text-carnelian">THE NINE BLENDS</p>
        <h2 id="catalog-h" className="font-serif text-4xl font-bold text-green">الكروت التسعة</h2>
        <p className="measure mt-2 text-ink/80">لكل توليفة كارتها: الوش للاختيار، والظهر لوصفة «حضّرها على ذوقك». اقلب الكارت وجرّب.</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/diwan/photo/pour-turkish.webp" alt="سكب قهوة تركي من الركوة النحاسية في فنجان أخضر" loading="lazy" className="mt-8 h-48 w-full rounded-[14px] object-cover object-[50%_35%] md:h-72" />

        <div role="tablist" className="mt-6 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={cat === t}
              onClick={() => setCat(t)}
              className={`rounded-[10px] border px-4 py-2 text-sm font-semibold transition ${cat === t ? "border-green bg-green text-sand" : "border-green/40 text-green hover:bg-green/10"}`}
            >
              {t} (<bdi>{count(t)}</bdi>)
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <div key={p.id} className={`rounded-[14px] p-2 transition ${highlight.includes(p.id) ? "ring-4 ring-carnelian ring-offset-4 ring-offset-sand" : ""}`}>
              <ProductCard product={p} onOpen={() => onOpen(p)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Selector<T extends string>({ label, options, value, onChange }: { label: string; options: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <fieldset className="mt-4">
      <legend className="mb-2 text-sm font-semibold text-green">{label}</legend>
      <div className="flex gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            onClick={() => onChange(o)}
            className={`rounded-[10px] border px-5 py-2 font-semibold transition ${value === o ? "border-green bg-green text-sand" : "border-green/40 text-green hover:bg-green/10"}`}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function ConfigBody({ p, onClose }: { p: Product; onClose: () => void }) {
  const [roast, setRoast] = useState<Roast>(p.roasts ? p.roasts[0] : "وسط");
  const [spice, setSpice] = useState<Spice>("سادة");
  const [grind, setGrind] = useState<"حبوب كاملة" | "مطحون إسبريسو">("حبوب كاملة");
  const store = STORE[p.id];

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,260px)_1fr]">
      <div className="mx-auto w-full max-w-[260px]">
        <ProductCard product={p} roast={p.roasts ? roast : undefined} spice={p.roasts ? spice : undefined} />
      </div>
      <div>
        <p className="font-medium text-ink/70">{p.category} · <bdi>{p.weight}</bdi></p>
        <p className="measure mt-1">{p.copy}</p>

        {p.category === "قهوة تركي" && p.roasts && (
          <>
            {/* only the 2 valid roast levels for this blend are rendered */}
            <Selector label="اختر التحميص" options={p.roasts} value={roast} onChange={setRoast} />
            <Selector label="اختر الحالة" options={p.states!} value={spice} onChange={setSpice} />
          </>
        )}

        {p.category === "إسبريسو" && p.ratio && (
          <>
            <div className="mt-4">
              <div className="mb-1 text-sm font-semibold text-green"><bdi>{p.ratio.label}</bdi></div>
              <div className="flex h-3 overflow-hidden rounded-full bg-sand-deep" role="img" aria-label={p.ratio.label}>
                <div style={{ width: `${p.ratio.arabica}%`, background: p.hex }} />
                <div style={{ width: `${p.ratio.robusta}%`, background: "#CDA76C" }} />
              </div>
            </div>
            <Selector label="الطحن" options={["حبوب كاملة", "مطحون إسبريسو"] as const} value={grind} onChange={setGrind} />
            <p className="mt-4 inline-block rounded-[6px] bg-green px-3 py-1 text-sm text-sand">
              <bdi>18 جم</bdi> ← <bdi>36 جم</bdi> في <bdi>25–30</bdi> ثانية · {p.note}
            </p>
          </>
        )}

        {p.category === "قهوة منكهة" && (
          <p className="mt-4 rounded-[10px] border border-green/30 bg-n100 p-4">
            {p.type} · <bdi>{p.weight}</bdi><br />
            <bdi>80 مل حليب + 40 مل ماء</bdi>
          </p>
        )}

        <div className="mt-6 border-t border-n200 pt-4">
          {store.price != null ? (
            <p className="text-2xl font-bold text-green"><bdi>{store.price}</bdi> ج.م {store.stock === 0 && <span className="text-sm text-[#9A6B12]">· غير متوفر حالياً</span>}</p>
          ) : (
            <p className="text-sm text-n500">السعر والمخزون يُسحبان من بيانات المتجر الفعلية (<code>STORE</code> في <code>data/products.ts</code>).</p>
          )}
          <div className="mt-3 flex flex-wrap gap-3">
            <a
              className="btn btn-carnelian"
              href="https://instagram.com/diwan_eg"
              target="_blank"
              rel="noreferrer"
            >
              اطلب عبر @diwan_eg
            </a>
            <button onClick={onClose} className="btn btn-ghost">إغلاق</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Configurator({ product, onClose }: { product: Product | null; onClose: () => void }) {
  useEffect(() => {
    setScrollLocked(!!product, "pdp");
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("keydown", esc);
      setScrollLocked(false, "pdp");
    };
  }, [product, onClose]);

  if (!product) return null;
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={`اختيار ${product.name}`}>
      <button aria-label="إغلاق" className="absolute inset-0 bg-ink/50" onClick={onClose} />
      <aside className="absolute inset-y-0 end-0 w-full max-w-3xl overflow-y-auto bg-sand p-6 shadow-2xl md:p-10" data-lenis-prevent>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-4xl font-bold text-green">{product.name}</h2>
          <button onClick={onClose} className="text-3xl leading-none text-green" aria-label="إغلاق">×</button>
        </div>
        <ConfigBody key={product.id} p={product} onClose={onClose} />
      </aside>
    </div>
  );
}

