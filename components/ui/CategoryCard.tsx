"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { CATEGORY_META, PRODUCTS, categoryFrom, type CategoryId } from "@/data/products";
import { useShopStore } from "@/store/useShopStore";
import { useLangStore, useLocalized } from "@/lib/i18n";
import { money } from "@/lib/format";

interface CategoryCardProps {
  category: CategoryId;
  defaultRotation: number;
  className?: string;
}

/** One of the three coffee categories, floating over the final scene. */
export default function CategoryCard({ category, defaultRotation, className = "" }: CategoryCardProps) {
  const lang = useLangStore((s) => s.lang);
  const l = useLocalized();
  const setCartOpen = useShopStore((s) => s.setCartOpen);
  const meta = CATEGORY_META[category];
  const blends = PRODUCTS.filter((p) => p.categoryId === category);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 220, damping: 22 });
  const smoothY = useSpring(y, { stiffness: 220, damping: 22 });
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [9, -9]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-9, 9]);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ rotateZ: defaultRotation }}
      whileHover={{ scale: 1.03, rotateZ: 0 }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={`select-none rounded-2xl border border-n200 bg-n100/90 shadow-[0_24px_48px_-12px_rgba(14,58,51,0.12)] backdrop-blur-md max-md:!transform-none md:w-72 md:shrink-0 md:rounded-[14px] md:p-4 ${className}`}
    >
      {/* phones: the whole row is the link, so all three fit on the screen */}
      <Link href={`/shop?category=${category}`} className="flex flex-col items-center gap-1.5 px-1.5 py-3 text-center md:hidden" aria-label={meta.label[lang]}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={blends[0].image} alt="" className="h-14 w-14 rounded-full border-2 border-n100 object-cover shadow-md" style={{ background: blends[0].hex }} />
        <span className="font-editorial text-[15px] font-semibold leading-tight text-green">{meta.label[lang]}</span>
        <span className="text-[11px] font-semibold leading-tight text-n500">
          {l({ en: "From", ar: "يبدأ من" })} <bdi className="text-green">{money(categoryFrom(category), lang)}</bdi>
        </span>
      </Link>

      <div className="max-md:hidden">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-green/60">
          {l({ en: `${blends.length} blends`, ar: `${blends.length} توليفات` })}
        </span>
        <div className="flex -space-x-2 rtl:space-x-reverse">
          {blends.map((b) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={b.id} src={b.image} alt="" className="h-7 w-7 rounded-full border-2 border-n100 object-cover" style={{ background: b.hex }} title={lang === "ar" ? b.name : b.nameEn} />
          ))}
        </div>
      </div>

      <h3 className="font-editorial text-2xl font-semibold leading-tight text-green">{meta.label[lang]}</h3>
      <p className="mb-3 mt-1 text-[11px] leading-snug text-n500 max-md:hidden [@media(max-height:760px)]:hidden">{meta.blurb[lang]}</p>
      <p className="mb-3 text-xs font-semibold text-n500">
        {l({ en: "From", ar: "يبدأ من" })} <bdi className="text-green">{money(categoryFrom(category), lang)}</bdi>
      </p>

      <div className="flex items-center gap-2">
        <Link
          href={`/shop?category=${category}`}
          className="flex flex-1 items-center justify-center gap-1 rounded-full bg-green px-3 py-2 text-[11px] font-semibold text-sandy transition hover:bg-green/90 active:scale-[0.97]"
        >
          <span>{l({ en: "Shop", ar: "تسوّق" })}</span>
          <ArrowUpRight className="h-3 w-3 rtl:-scale-x-100" />
        </Link>
        <button
          onClick={() => setCartOpen(true)}
          className="rounded-full border border-green/25 px-3 py-2 text-[11px] font-semibold text-green transition hover:bg-green/10 active:scale-[0.97]"
        >
          {l({ en: "Bag", ar: "السلة" })}
        </button>
      </div>
      </div>
    </motion.div>
  );
}
