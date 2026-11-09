"use client";

import Link from "next/link";
import { CATEGORY_META, PRODUCTS } from "@/data/products";
import Reveal from "@/components/ui/Reveal";
import { ImageReveal, Marquee, SplitText } from "@/components/ui/motion";
import { isLive, useCatalogStore } from "@/store/useCatalogStore";
import { useLangStore } from "@/lib/i18n";
import { money } from "@/lib/format";

/** The nine blends as photographs, one large and eight around it. */
export function Featured() {
  const lang = useLangStore((s) => s.lang);
  const ar = lang === "ar";
  const items = useCatalogStore((s) => s.items);
  const live = PRODUCTS.filter((p) => items.some((i) => i.id === p.id && isLive(i)));
  const from = (p: (typeof PRODUCTS)[number]) => Math.min(...(items.find((i) => i.id === p.id)?.variants.map((v) => v.price) ?? [0]));

  return (
    <section id="blends" className="py-20 md:py-28" aria-labelledby="blends-h">
      <div className="wrap">
        <Reveal>
          <SplitText as="h2" text={ar ? "تسع توليفات لتختار منها" : "Nine blends on one table"} className="block max-w-2xl font-serif text-4xl font-bold leading-tight text-green md:text-6xl" />
          <p className="measure mt-4 text-ink/75">
            {ar ? "اضغط على أي توليفة لتراها. تصلك كل واحدة في بوكس مع كارتها وكيس 200 جم." : "Pick the photo that looks like your cup. Every blend arrives in a box with its card and a 200 g pouch."}
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {live.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 0.06} className={i === 0 ? "col-span-2 row-span-2" : ""}>
              <Link href={`/shop/${p.id}`} className="group flex h-full w-full flex-col text-start">
                <ImageReveal delay={(i % 4) * 0.08} className={`relative block w-full rounded-[14px] ${i === 0 ? "aspect-square md:aspect-auto md:min-h-0 md:flex-1" : "aspect-square"}`}><span className="relative block h-full w-full" style={{ background: p.hex }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={ar ? `${p.name}، عبوة 200 جم مع كارتها` : `${p.nameEn}, 200 g pack with its card`} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]" />
                </span></ImageReveal>
                <span className="mt-3 flex items-baseline justify-between gap-3">
                  <span className={`font-serif font-bold leading-none text-green transition group-hover:text-carnelian ${i === 0 ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"}`}>{ar ? p.name : p.nameEn}</span>
                  <span className="shrink-0 text-sm font-semibold text-green"><bdi>{money(from(p), lang)}</bdi></span>
                </span>
                <span className="mt-1 text-xs text-ink/60 md:text-sm">{CATEGORY_META[p.categoryId].label[lang]}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>

      <Marquee
        className="mt-20 font-editorial text-5xl font-semibold text-green/15 md:text-7xl"
        items={live.map((p) => (ar ? p.name : p.nameEn))}
      />
    </section>
  );
}

