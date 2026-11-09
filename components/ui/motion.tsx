"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Headline that rises out of a mask, one word at a time. Reads as plain text to assistive tech. */
export function SplitText({ text, as: Tag = "span", className = "", delay = 0, stagger = 0.06 }: { text: string; as?: ElementType; className?: string; delay?: number; stagger?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  // watch the whole heading: a word clipped by its own mask never reports as visible
  const seen = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: "115%", rotate: 3 }}
            animate={seen || reduce ? { y: 0, rotate: 0 } : { y: "115%", rotate: 3 }}
            transition={{ duration: 0.9, delay: delay + i * stagger, ease: EASE }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** A photograph that unveils itself: a wipe, then the picture settles from slightly zoomed in. */
export function ImageReveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
      whileInView={{ clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.1, delay, ease: EASE }}
    >
      <motion.div
        className="h-full w-full"
        initial={reduce ? false : { scale: 1.25 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 1.5, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/** Pulls its content a little toward the pointer. Off on touch and with reduced motion. */
export function Magnetic({ children, strength = 0.25, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}

/** Thin bar across the top that fills as the page is read. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });
  return <motion.div aria-hidden="true" style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-[0%_50%] bg-aqeeq rtl:origin-[100%_50%]" />;
}

/** Slow ribbon of words. Stops on hover and when the visitor prefers less motion. */
export function Marquee({ items, className = "" }: { items: string[]; className?: string }) {
  const row = (
    <ul className="flex shrink-0 items-center gap-10 pe-10" aria-hidden="true">
      {items.map((t, i) => (
        <li key={i} className="flex items-center gap-10 whitespace-nowrap">
          <span>{t}</span>
          <span className="inline-block h-2 w-2 rotate-45 bg-current opacity-40" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] ${className}`}>
      <div className="marquee-track flex shrink-0 group-hover:[animation-play-state:paused]">
        {row}
        {row}
      </div>
    </div>
  );
}

/** Parallax wrapper: the child drifts against the scroll by `speed` pixels. */
export function Drift({ children, speed = 40, className = "" }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
