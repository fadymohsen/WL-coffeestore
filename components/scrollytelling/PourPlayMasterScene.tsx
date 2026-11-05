"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ChevronDown, Compass, RotateCcw } from "lucide-react";
import ScrollVideoScenes, { type ScrollVideoScenesHandle } from "./ScrollVideoScenes";
import TiltProductCard from "@/components/ui/TiltProductCard";
import { scrollToProgress, setScrollLocked } from "@/components/providers/SmoothScrollProvider";
import { COFFEE_CATALOG, useShopStore } from "@/store/useShopStore";
import { useLocalized, translations } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);

const SCENE_ENDS = [0.06, 0.2, 0.5, 1];
const STAGE_STOPS = [0, 0.2, 0.5, 0.75, 1];

const sceneAt = (p: number) => {
  const i = SCENE_ENDS.findIndex((end) => p < end);
  return i === -1 ? SCENE_ENDS.length - 1 : i;
};

export default function PourPlayMasterScene() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<ScrollVideoScenesHandle>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef(0);
  const [recipeOpen, setRecipeOpen] = useState(false);
  const setCartOpen = useShopStore((s) => s.setCartOpen);

  const l = useLocalized();
  const t = translations;

  const introStarted = useRef(false);
  const videoReady = useRef(false);
  const introEnded = useRef<(() => void) | null>(null);
  const [reducedMotion] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const startIntro = useRef<(() => void) | null>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const introDone = { current: false };
      let scene = -1;

      const trigger = {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
      };

      const syncScene = (p: number) => {
        const next = sceneAt(p);
        if (next === scene) return;
        scene = next;
        videoRef.current?.show(next);
      };

      ScrollTrigger.create({
        ...trigger,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          if (percentRef.current) {
            percentRef.current.textContent = `${Math.round(self.progress * 100)}%`;
          }
          if (introDone.current) syncScene(self.progress);
        },
      });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: { ...trigger, scrub: true },
      });

      // Scene 1 (0 - 20%): DIWAN intro lifts away
      tl.to(".s1", { y: -130, autoAlpha: 0, duration: 0.08, ease: "power2.in" }, 0.01)
        .fromTo(".s2a", { y: 90, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.05 }, 0.08)
        .fromTo(".s2a-word", { xPercent: 10 }, { xPercent: -10, duration: 0.2, ease: "none" }, 0.08)
        .to(".s2a", { y: -110, autoAlpha: 0, duration: 0.04, ease: "power2.in" }, 0.2);

      // Scene 2 (20 - 50%): Pour ritual
      tl.fromTo(".s2b", { x: -60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.05 }, 0.25)
        .to(".s2b", { y: -90, autoAlpha: 0, duration: 0.04, ease: "power2.in" }, 0.44);

      // Scene 3 (50 - 75%): SIP
      tl.fromTo(".s3", { y: 70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.05 }, 0.53)
        .to(".s3", { y: -80, autoAlpha: 0, duration: 0.04, ease: "power2.in" }, 0.7);

      // Scene 4 (75 - 100%): Shop
      tl.fromTo(
        ".s4",
        { y: 60, autoAlpha: 0, scale: 0.96 },
        { y: 0, autoAlpha: 1, scale: 1, duration: 0.08, ease: "power3.out" },
        0.78
      );

      tl.to({}, { duration: 0.14 }, 0.86);

      const finishIntro = () => {
        if (introDone.current) return;
        introDone.current = true;
        setScrollLocked(false, "intro");
        syncScene(progressRef.current);
        gsap.to(".intro-hint", { autoAlpha: 1, duration: 0.6 });
      };

      const skip = reduced || window.scrollY > 24;
      gsap.set(".intro", { autoAlpha: 0, y: 36 });
      if (skip) {
        gsap.set(".intro", { autoAlpha: 1, y: 0 });
        gsap.set(".intro-hint", { autoAlpha: 0 });
        introDone.current = true;
        startIntro.current = () => syncScene(progressRef.current);
      } else {
        window.scrollTo(0, 0);
        setScrollLocked(true, "intro");
        introEnded.current = finishIntro;
        startIntro.current = () => {
          if (introStarted.current) return;
          introStarted.current = true;
          scene = 0;
          videoRef.current?.show(0);
          gsap.to(".intro", { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "power3.out", delay: 0.25 });
          gsap.delayedCall(4.5, finishIntro);
        };
      }
      if (videoReady.current) startIntro.current();

      return () => {
        setScrollLocked(false, "intro");
      };
    },
    { scope: containerRef }
  );

  const nextStop = () => {
    const p = progressRef.current;
    const next = STAGE_STOPS.find((s) => s > p + 0.02);
    scrollToProgress(next ?? 0);
  };

  const display = "font-editorial leading-[0.85] tracking-tight";

  return (
    <section ref={containerRef} className="relative h-[600vh] w-full">
      <div className="sticky top-0 isolate h-screen w-full overflow-hidden bg-n100 md:bg-white">
        {/* LAYER 0: Display type behind the video */}
        <div className="absolute inset-0 z-0">
          <div className="s1 absolute inset-x-0 top-[10%] flex flex-col items-start px-5 md:top-[24%] md:flex-row md:items-baseline md:justify-between md:px-20">
            <h1 className={`intro invisible ${display} text-[clamp(3.5rem,21vw,6rem)] text-green md:text-[clamp(3rem,12.5vw,11rem)]`}>
              DIWAN
            </h1>
            <h1 className={`intro invisible ${display} self-end text-[clamp(2.5rem,14vw,4rem)] text-aqeeq/70 md:self-auto md:text-[clamp(2rem,7vw,6rem)]`}>
              ديوان
            </h1>
          </div>

          <div className="s2a invisible absolute inset-x-0 top-[10%] overflow-hidden md:top-[30%]">
            <h2
              className={`s2a-word ${display} whitespace-nowrap text-center text-[clamp(4rem,26vw,7rem)] text-green/20 md:text-[clamp(6rem,24vw,20rem)]`}
            >
              {l(t.coffeeRitual)}
            </h2>
          </div>

          <div className="s2b invisible absolute left-5 top-[10%] md:left-20 md:top-[20%]">
            <h2 className={`${display} text-[clamp(3.5rem,19vw,6rem)] text-green md:text-[clamp(5rem,15vw,12rem)]`}>
              {l(t.pourWord)}
            </h2>
            <div className={`${display} -mt-2 text-[clamp(3rem,15vw,5rem)] text-aqeeq/60 md:text-[clamp(4rem,12vw,9rem)]`}>
              Pour
            </div>
          </div>

          <div className="s3 invisible absolute inset-x-0 top-[14%] px-5 md:top-[12%] md:px-20">
            <h2 className={`${display} text-[clamp(4rem,22vw,7rem)] text-green md:text-[clamp(5rem,16vw,13rem)]`}>
              {l(t.sipWord)}
            </h2>
          </div>
        </div>

        {/* LAYER 1: Video scenes */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[50svh] [mask-image:linear-gradient(to_bottom,transparent,#000_24%)] md:inset-0 md:h-auto md:[mask-image:none] md:mix-blend-multiply">
          <ScrollVideoScenes
            ref={videoRef}
            still={reducedMotion}
            onReady={() => {
              videoReady.current = true;
              startIntro.current?.();
            }}
            onIntroEnd={() => introEnded.current?.()}
          />
        </div>

        {/* LAYER 2: Interactive UI */}
        <div className="pointer-events-none absolute inset-0 z-20">
          {/* Stage 1 — Hero */}
          <div className="s1 absolute inset-0">
            <div className="intro invisible absolute inset-x-0 top-[16%] hidden items-center gap-3 px-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-green/60 md:flex md:px-20 md:text-xs">
              <span>DIWAN</span>
              <span>·</span>
              <span>{l(t.hero.coffeeForEveryCulture)}</span>
            </div>
            <div className="intro invisible pointer-events-auto absolute left-5 right-5 top-[max(30%,14rem)] max-w-sm md:bottom-16 md:left-20 md:right-auto md:top-auto">
              <p className="mb-5 text-sm leading-relaxed text-n500 md:text-base">
                {l(t.hero.tagline)}
              </p>
              <button
                onClick={() => scrollToProgress(0.95)}
                className="inline-flex items-center gap-2.5 rounded-full bg-green px-6 py-3 text-xs font-semibold uppercase tracking-widest text-sandy shadow-lg transition hover:bg-green/90"
              >
                <span>{l(t.hero.shopNow)}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="intro-hint invisible absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-0.5 rounded-full bg-n100/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-green backdrop-blur-md">
              <span>{l(t.hero.scroll)}</span>
              <ChevronDown className="h-4 w-4 animate-bounce" />
            </div>
          </div>

          {/* Stage 2A — Grind */}
          <div className="s2a invisible absolute inset-0">
            <div className="pointer-events-auto absolute left-5 right-5 top-[max(30%,14rem)] max-w-xs md:bottom-16 md:left-20 md:right-auto md:top-auto">
              <p className="mb-4 text-sm leading-relaxed text-n500">
                {l(t.grind.text)}
              </p>
              <button
                onClick={() => scrollToProgress(0.3)}
                className="rounded-full bg-green px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-sandy transition hover:bg-green/90"
              >
                {l(t.grind.cta)}
              </button>
            </div>
          </div>

          {/* Stage 2B — Pour */}
          <div className="s2b invisible absolute inset-0">
            <div className="absolute left-5 right-5 top-[max(30%,14rem)] max-w-xs md:bottom-[14%] md:left-auto md:right-20 md:top-auto">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-green/60">
                {l(t.pour.label)}
              </span>
              <p className="mt-3 text-sm leading-relaxed text-n500">
                {l(t.pour.text)}
              </p>
              <div className="pointer-events-auto mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-green/10 px-3 py-1.5 text-[11px] font-semibold text-green">
                  93°C · 1:16 · 2:30
                </span>
                <button
                  onClick={() => setRecipeOpen((o) => !o)}
                  aria-expanded={recipeOpen}
                  className="rounded-full bg-green px-4 py-1.5 text-[11px] font-semibold text-sandy transition hover:bg-green/90"
                >
                  {recipeOpen ? l(t.pour.hide) : l(t.pour.recipe)}
                </button>
              </div>
              {recipeOpen && (
                <ol className="pointer-events-auto mt-3 space-y-1 rounded-xl bg-n100/90 p-3 text-[11px] leading-snug text-n500 backdrop-blur-md">
                  <li>{l(t.pour.step1)}</li>
                  <li>{l(t.pour.step2)}</li>
                  <li>{l(t.pour.step3)}</li>
                  <li>{l(t.pour.step4)}</li>
                </ol>
              )}
            </div>
          </div>

          {/* Stage 3: Sip */}
          <div className="s3 invisible absolute inset-0">
            <div className="absolute inset-x-0 top-[10%] px-5 md:px-20">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-green/60">
                {l(t.sip.label)}
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-[6%] flex justify-start px-5 md:bottom-[8%] md:justify-end md:px-20">
              <h2
                className={`${display} text-stroke-sandy text-[clamp(4rem,22vw,7rem)] md:text-[clamp(5rem,16vw,13rem)] drop-shadow-[0_6px_24px_rgba(0,0,0,0.35)]`}
              >
                SIP
              </h2>
            </div>
          </div>

          {/* Stage 4: Shop */}
          <div className="s4 invisible absolute inset-0 flex flex-col items-center px-5 pt-20 md:px-14">
            <div className="pointer-events-auto text-center">
              <h2 className={`${display} whitespace-pre-line text-4xl text-green sm:text-5xl md:text-6xl`}>
                {l(t.shopScene.choose)}
              </h2>
              <p className="mt-2 text-sm text-n400">{l(t.shopScene.findYourCup)}</p>
              <button
                onClick={() => setCartOpen(true)}
                className="mt-3 rounded-full bg-green px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-sandy shadow-md transition hover:bg-green/90"
              >
                {l(t.shopScene.shop)}
              </button>
            </div>

            <div className="pointer-events-auto absolute inset-x-0 top-[max(26%,12.5rem)] flex snap-x gap-3 overflow-x-auto px-5 py-4 md:contents">
              <TiltProductCard
                product={COFFEE_CATALOG[0]}
                defaultRotation={-3}
                className="snap-center md:absolute md:left-14 md:top-[26%]"
              />
              <TiltProductCard
                product={COFFEE_CATALOG[1]}
                defaultRotation={2}
                className="snap-center md:absolute md:bottom-14 md:left-28"
              />
              <TiltProductCard
                product={COFFEE_CATALOG[2]}
                defaultRotation={-2}
                className="snap-center md:absolute md:right-14 md:top-[38%]"
              />
            </div>

            <button
              onClick={() => scrollToProgress(0)}
              className="pointer-events-auto absolute bottom-5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-green/10 px-3 py-1.5 text-xs font-semibold text-green transition hover:bg-green/20"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{l(t.shopScene.backToTop)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fixed progress + stage jump */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
        <span
          ref={percentRef}
          className="hidden rounded-full bg-green/85 px-3 py-1 text-[11px] font-medium text-sandy backdrop-blur-md sm:inline-block"
        >
          0%
        </span>
        <button
          onClick={nextStop}
          aria-label="Jump to next chapter"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-green text-sandy shadow-xl transition hover:scale-105"
        >
          <Compass className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
