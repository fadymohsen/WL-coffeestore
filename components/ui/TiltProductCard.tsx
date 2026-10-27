"use client";

import type { MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Heart, Plus } from "lucide-react";
import { CoffeeProduct, useShopStore } from "@/store/useShopStore";

interface TiltProductCardProps {
  product: CoffeeProduct;
  defaultRotation: number;
  className?: string;
}

export default function TiltProductCard({
  product,
  defaultRotation,
  className = "",
}: TiltProductCardProps) {
  const qty = useShopStore((s) => s.cart[product.id] || 0);
  const isLiked = useShopStore((s) => !!s.wishlist[product.id]);
  const addToCart = useShopStore((s) => s.addToCart);
  const toggleWishlist = useShopStore((s) => s.toggleWishlist);
  const setCartOpen = useShopStore((s) => s.setCartOpen);

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
      className={`w-64 shrink-0 select-none rounded-2xl border border-espresso/10 bg-[#f6efe2]/90 p-4 shadow-[0_24px_48px_-12px_rgba(42,30,23,0.18)] backdrop-blur-md sm:w-72 ${className}`}
    >
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#5c4332]">
          {product.category}
        </span>
        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label={`Save ${product.title}`}
          aria-pressed={isLiked}
          className="rounded-full p-1.5 transition hover:bg-espresso/10"
        >
          <Heart
            className={`h-3.5 w-3.5 transition ${
              isLiked ? "fill-[#b85032] text-[#b85032]" : "text-espresso/50"
            }`}
          />
        </button>
      </div>

      <div className="relative mb-3 flex h-24 items-center [@media(max-height:760px)]:hidden justify-center overflow-hidden rounded-xl bg-[#e5d7c3]/75">
        <div
          className="flex h-20 w-14 flex-col items-center justify-between rounded-lg border border-white/30 p-1.5 shadow-lg"
          style={{ backgroundColor: product.bagColor }}
        >
          <div className="h-1 w-full rounded-full bg-black/15" />
          <div className="rounded bg-[#faf6f0] px-1 py-0.5 text-center text-[6px] font-bold uppercase tracking-wider text-espresso">
            POUR/PLAY
            <div className="text-[5px] font-normal opacity-70">{product.category}</div>
          </div>
          <span className="text-[7px] font-semibold text-white/90">{product.weight}</span>
        </div>
        <span className="absolute bottom-2 right-2.5 rounded-full bg-espresso/85 px-2 py-0.5 text-[10px] font-bold text-cream">
          ${product.price}
        </span>
      </div>

      <h3 className="font-editorial text-lg leading-tight text-espresso">{product.title}</h3>
      <p className="mb-2 text-[11px] text-[#6e5644]">{product.region}</p>

      <div className="mb-3.5 flex flex-wrap gap-1 [@media(max-height:820px)]:hidden">
        {product.tastingNotes.map((note) => (
          <span
            key={note}
            className="rounded-md bg-espresso/8 px-2 py-0.5 text-[10px] font-medium text-roast"
          >
            {note}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => addToCart(product.id)}
          className="flex flex-1 items-center justify-center gap-1 rounded-full bg-espresso px-3 py-2 text-[11px] font-semibold text-cream transition hover:bg-[#3e2a1e]"
        >
          <Plus className="h-3 w-3" />
          <span>{qty > 0 ? `In Bag (${qty})` : "Buy Now"}</span>
        </button>
        <button
          onClick={() => setCartOpen(true)}
          className="rounded-full border border-espresso/25 px-3 py-2 text-[11px] font-semibold text-espresso transition hover:bg-espresso/10"
        >
          View Bag
        </button>
      </div>
    </motion.div>
  );
}
