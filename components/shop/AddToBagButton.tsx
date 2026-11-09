"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2, Plus } from "lucide-react";
import { useShopStore } from "@/store/useShopStore";
import { useLocalized } from "@/lib/i18n";

interface Props {
  lineKey: string;
  disabled?: boolean;
  /** Open the bag drawer after adding */
  openBag?: boolean;
  onAdded?: () => void;
  qty?: number;
  label?: string;
  /** Photo that flies to the bag icon when the item is added */
  flyImage?: string;
  className?: string;
  size?: "sm" | "md";
}

/** Add to bag with a visible working and added state, so a tap never feels ignored. */
export default function AddToBagButton({ lineKey, disabled, openBag = true, onAdded, qty = 1, label, flyImage, className = "", size = "md" }: Props) {
  const l = useLocalized();
  const add = useShopStore((s) => s.addToCart);
  const setOpen = useShopStore((s) => s.setCartOpen);
  const [state, setState] = useState<"idle" | "adding" | "added">("idle");
  const timers = useRef<number[]>([]);
  const btn = useRef<HTMLButtonElement>(null);

  const fly = () => {
    const target = document.querySelector<HTMLElement>("[data-cart-icon]");
    const from = btn.current?.getBoundingClientRect();
    if (!flyImage || !target || !from || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = target.getBoundingClientRect();
    const size = 64;
    const sx = from.left + from.width / 2 - size / 2;
    const sy = from.top + from.height / 2 - size / 2;
    const dx = t.left + t.width / 2 - size / 2 - sx;
    const dy = t.top + t.height / 2 - size / 2 - sy;
    const el = document.createElement("img");
    el.src = flyImage;
    el.alt = "";
    el.style.cssText = `position:fixed;left:${sx}px;top:${sy}px;width:${size}px;height:${size}px;border-radius:9999px;object-fit:cover;z-index:120;pointer-events:none;box-shadow:0 12px 32px rgba(14,58,51,.35);border:3px solid #F4ECDC`;
    document.body.appendChild(el);
    el.animate(
      [
        { transform: "translate(0,0) scale(0.6)", opacity: 0 },
        { transform: `translate(${dx * 0.15}px,${Math.min(dy * 0.15, 0) - 70}px) scale(1.05)`, opacity: 1, offset: 0.25 },
        { transform: `translate(${dx}px,${dy}px) scale(0.25)`, opacity: 0.35 },
      ],
      { duration: 820, easing: "cubic-bezier(.55,0,.25,1)" },
    ).finished.then(() => {
      el.remove();
      target.animate([{ transform: "scale(1)" }, { transform: "scale(1.3)" }, { transform: "scale(1)" }], { duration: 380, easing: "ease-out" });
    });
  };

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const click = () => {
    if (state !== "idle") return;
    setState("adding");
    timers.current.push(
      window.setTimeout(() => {
        add(lineKey, qty);
        fly();
        setState("added");
        onAdded?.();
        if (openBag) setOpen(true);
        timers.current.push(window.setTimeout(() => setState("idle"), 1400));
      }, 380),
    );
  };

  const pad = size === "sm" ? "px-4 py-2.5 text-xs" : "px-6 py-3.5 text-sm";
  return (
    <button
      ref={btn}
      disabled={disabled}
      onClick={click}
      aria-live="polite"
      className={`relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 ${state === "added" ? "bg-[#2E6B4F] text-sandy" : "bg-green text-sandy hover:bg-[#0b2f29]"} ${pad} ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={state}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.16 }}
          className="inline-flex items-center gap-2"
        >
          {state === "adding" && <Loader2 className="h-4 w-4 animate-spin" />}
          {state === "added" && <Check className="h-4 w-4" />}
          {state === "idle" && <Plus className="h-4 w-4" />}
          {state === "idle" && (disabled ? l({ en: "Unavailable", ar: "غير متوفر" }) : (label ?? l({ en: "Add to bag", ar: "أضف للسلة" })))}
          {state === "adding" && l({ en: "Adding", ar: "جارٍ الإضافة" })}
          {state === "added" && l({ en: "Added", ar: "تمت الإضافة" })}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
