"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;
const locks = new Set<string>();

const applyLock = () => {
  const locked = locks.size > 0;
  document.documentElement.style.overflow = locked ? "hidden" : "";
  if (lenisInstance) {
    if (locked) lenisInstance.stop();
    else lenisInstance.start();
  }
};

/** Smooth-scroll to a 0..1 fraction of the full page scroll range. */
export function scrollToProgress(fraction: number, duration = 1.8) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const top = max * Math.min(1, Math.max(0, fraction));
  if (lenisInstance) lenisInstance.scrollTo(top, { duration });
  else window.scrollTo({ top, behavior: "smooth" });
}

/** Independent keyed locks, so closing the cart can't end the intro lock. */
export function setScrollLocked(locked: boolean, key = "cart") {
  if (locked) locks.add(key);
  else locks.delete(key);
  applyLock();
}

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({
      lerp: 0.065,
      smoothWheel: true,
      wheelMultiplier: 1,
    });
    lenisInstance = lenis;
    if (locks.size) lenis.stop();

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return <>{children}</>;
}
