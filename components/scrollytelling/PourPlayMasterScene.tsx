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

gsap.registerPlugin(ScrollTrigger);

/**
 * Each scene owns a slice of the scroll: beans on load, then the grinder, the pour, and the wave into the cup.
 * Entering a slice plays that scene's clip; the scroll position only chooses which clip is on.
 */
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

      // scroll only picks the scene; the scene's own clip does the playing
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

      // text for each scene, on the same slices of scroll as the video
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: { ...trigger, scrub: true },
      });

      // Scene 1 (0 - 20%): GRIND / PLAY lifts away as the grinder splits open, then GRIND tracks sideways
      tl.to(".s1", { y: -130, autoAlpha: 0, duration: 0.08, ease: "power2.in" }, 0.01)
        .fromTo(".s2a", { y: 90, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.05 }, 0.08)
        .fromTo(".s2a-word", { xPercent: 10 }, { xPercent: -10, duration: 0.2, ease: "none" }, 0.08)
        .to(".s2a", { y: -110, autoAlpha: 0, duration: 0.04, ease: "power2.in" }, 0.2);

      // Scene 2 (20 - 50%): POUR ritual
      tl.fromTo(".s2b", { x: -60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.05 }, 0.25)
        .to(".s2b", { y: -90, autoAlpha: 0, duration: 0.04, ease: "power2.in" }, 0.44);

      // Scene 3 (50 - 75%): espresso wave, SIP / SIP
      tl.fromTo(".s3", { y: 70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.05 }, 0.53)
        .to(".s3", { y: -80, autoAlpha: 0, duration: 0.04, ease: "power2.in" }, 0.7);

      // Scene 4 (75 - 100%): ceramic mug + cards
      tl.fromTo(
        ".s4",
        { y: 60, autoAlpha: 0, scale: 0.96 },
        { y: 0, autoAlpha: 1, scale: 1, duration: 0.08, ease: "power3.out" },
        0.78
      );

      // pad so the timeline spans exactly 0..1 of the scroll range
      tl.to({}, { duration: 0.14 }, 0.86);

      // ---- Intro: pour the beans on load with scroll locked, then hand over to scroll ----
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
          // never keep the page locked if the clip stalls
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
      <div className="sticky top-0 isolate h-screen w-full overflow-hidden bg-[#e6d7bd] md:bg-white">
        {/* LAYER 0: giant display type that sits "behind" the video subject */}
        <div className="absolute inset-0 z-0">
          <div className="s1 absolute inset-x-0 top-[10%] flex flex-col items-start px-6 md:top-[24%] md:flex-row md:items-baseline md:justify-between md:px-16">
            <h1 className={`intro invisible ${display} text-[clamp(3.5rem,21vw,6rem)] text-roast md:text-[clamp(3rem,12.5vw,11rem)]`}>GRIND</h1>
            <h1 className={`intro invisible ${display} self-end text-[clamp(3.5rem,21vw,6rem)] text-[#c29576] md:self-auto md:text-[clamp(3rem,12.5vw,11rem)]`}>PLAY</h1>
          </div>

          <div className="s2a invisible absolute inset-x-0 top-[10%] overflow-hidden md:top-[30%]">
            <h2
              className={`s2a-word ${display} whitespace-nowrap text-center text-[clamp(4rem,26vw,7rem)] text-[#b8866b]/80 md:text-[clamp(6rem,24vw,20rem)]`}
            >
              GRIND
            </h2>
          </div>

          <div className="s2b invisible absolute left-6 top-[10%] md:left-16 md:top-[20%]">
            <h2 className={`${display} text-[clamp(3.5rem,19vw,6rem)] text-roast md:text-[clamp(5rem,15vw,12rem)]`}>POUR</h2>
            <div className={`${display} -mt-2 text-[clamp(3rem,15vw,5rem)] text-[#c29576] md:text-[clamp(4rem,12vw,9rem)]`}>
              Ritual
            </div>
          </div>

          <div className="s3 invisible absolute inset-x-0 top-[14%] px-6 md:top-[12%] md:px-16">
            <h2 className={`${display} text-[clamp(4rem,22vw,7rem)] text-roast md:text-[clamp(5rem,16vw,13rem)]`}>SIP</h2>
          </div>
        </div>

        {/* LAYER 1: the scene clips. multiply lets dark objects occlude the type behind */}
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

        {/* LAYER 2: interactive UI + type that must sit in front of the video */}
        <div className="pointer-events-none absolute inset-0 z-20">
          {/* Stage 1 */}
          <div className="s1 absolute inset-0">
            <div className="intro invisible absolute inset-x-0 top-[16%] hidden items-center gap-3 md:flex px-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5c4332] md:px-16 md:text-xs">
              <span>POUR / PLAY</span>
              <span>•</span>
              <span>Single Origin Extraction</span>
            </div>
            <div className="intro invisible pointer-events-auto absolute left-6 right-6 top-[max(30%,14rem)] max-w-xs md:bottom-16 md:left-16 md:right-auto md:top-auto">
              <p className="mb-5 text-xs leading-relaxed text-[#4a372b] md:text-sm">
                Precision-milled conical burrs engineered to preserve delicate floral
                aromatics from whole roasted bean to uniform extraction bed.
              </p>
              <button
                onClick={() => scrollToProgress(0.95)}
                className="inline-flex items-center gap-2.5 rounded-full bg-espresso px-6 py-3 text-xs font-semibold uppercase tracking-widest text-cream shadow-lg transition hover:bg-[#3e2a1e]"
              >
                <span>Shop Now</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="intro-hint invisible absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-0.5 rounded-full bg-[#f6efe2]/85 px-3 py-1.5 backdrop-blur-md text-[10px] font-semibold uppercase tracking-[0.22em] text-espresso">
              <span>Scroll</span>
              <ChevronDown className="h-4 w-4 animate-bounce" />
            </div>
          </div>

          {/* Stage 2A */}
          <div className="s2a invisible absolute inset-0">
            <div className="pointer-events-auto absolute left-6 right-6 top-[max(30%,14rem)] max-w-xs md:bottom-16 md:left-16 md:right-auto md:top-auto">
              <p className="mb-4 text-xs leading-relaxed text-[#4a372b]">
                Zero-retention vertical chute disperses grounds directly into your filter
                cone with micrometer consistency.
              </p>
              <button
                onClick={() => scrollToProgress(0.3)}
                className="rounded-full bg-espresso px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-cream transition hover:bg-[#3e2a1e]"
              >
                Explore Pour
              </button>
            </div>
          </div>

          {/* Stage 2B */}
          <div className="s2b invisible absolute inset-0">
            <div className="absolute left-6 right-6 top-[max(30%,14rem)] max-w-xs md:bottom-[14%] md:left-auto md:right-16 md:top-auto">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#6e4f3a]">
                Chapter 02 · Thermal Bloom
              </span>
              <p className="mt-3 text-xs leading-relaxed text-[#4a372b] md:text-sm">
                Spiral borosilicate ribs channel 93°C water through the blooming coffee
                bed for a clean, sweet extraction.
              </p>
              <div className="pointer-events-auto mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-espresso/10 px-3 py-1.5 text-[11px] font-semibold text-espresso">
                  93°C · 1:16 Ratio · 2m 45s
                </span>
                <button
                  onClick={() => setRecipeOpen((o) => !o)}
                  aria-expanded={recipeOpen}
                  className="rounded-full bg-espresso px-4 py-1.5 text-[11px] font-semibold text-cream transition hover:bg-[#3e2a1e]"
                >
                  {recipeOpen ? "Hide Recipe" : "View Recipe"}
                </button>
              </div>
              {recipeOpen && (
                <ol className="pointer-events-auto mt-3 space-y-1 rounded-xl bg-[#f6efe2]/90 p-3 text-[11px] leading-snug text-[#4a372b] backdrop-blur-md">
                  <li>1. 15g medium-fine grounds, rinse filter.</li>
                  <li>2. Bloom with 45g water, wait 30s.</li>
                  <li>3. Pour in slow spirals to 240g by 1m 30s.</li>
                  <li>4. Draw-down finishes around 2m 45s.</li>
                </ol>
              )}
            </div>
          </div>

          {/* Stage 3: submerged outline SIP sits in front of the dark wave */}
          <div className="s3 invisible absolute inset-0">
            <div className="absolute inset-x-0 top-[10%] px-6 md:px-16">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#5c4332]">
                Chapter 03 · Golden Crema
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-[6%] flex justify-start px-6 md:bottom-[8%] md:justify-end md:px-16">
              <h2
                className={`${display} text-stroke-cream text-[clamp(4rem,22vw,7rem)] md:text-[clamp(5rem,16vw,13rem)] drop-shadow-[0_6px_24px_rgba(0,0,0,0.35)]`}
              >
                SIP
              </h2>
            </div>
          </div>

          {/* Stage 4 */}
          <div className="s4 invisible absolute inset-0 flex flex-col items-center px-6 pt-20 md:px-14">
            <div className="pointer-events-auto text-center">
              <h2 className={`${display} text-4xl text-espresso sm:text-5xl md:text-6xl`}>
                FIND
                <br />
                YOUR CUP
              </h2>
              <button
                onClick={() => setCartOpen(true)}
                className="mt-3 rounded-full bg-espresso px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-cream shadow-md transition hover:bg-[#3e2a1e]"
              >
                Claim Now
              </button>
            </div>

            <div className="pointer-events-auto absolute inset-x-0 top-[max(26%,12.5rem)] flex snap-x gap-3 overflow-x-auto px-6 py-4 md:contents">
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
              className="pointer-events-auto absolute bottom-5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-espresso/10 px-3 py-1.5 text-xs font-semibold text-espresso transition hover:bg-espresso/20"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fixed progress + stage jump */}
      <div className="fixed bottom-5 right-6 z-40 flex items-center gap-2">
        <span
          ref={percentRef}
          className="hidden rounded-full bg-espresso/85 px-3 py-1 text-[11px] font-medium text-cream backdrop-blur-md sm:inline-block"
        >
          0%
        </span>
        <button
          onClick={nextStop}
          aria-label="Jump to next chapter"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-espresso text-cream shadow-xl transition hover:scale-105"
        >
          <Compass className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
