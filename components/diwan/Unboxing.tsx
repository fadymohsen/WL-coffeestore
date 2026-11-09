"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { PRODUCTS } from "@/data/products";
import ProductCard from "./ProductCard";
import { useLangStore } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PHOTO = "/assets/diwan/photo";

interface Bi { ar: string; en: string }
const STAGES: { t: Bi; d: Bi; chips: Bi[] }[] = [
  {
    t: { ar: "البوكس وقفل «افتح الحكاية»", en: "The box and its “Open the Story” seal" },
    d: {
      ar: "علبة كرتون مطوية بغطاء مفصلي، يغلقها استيكر أخضر من الواجهة إلى القاعدة. عندما تفتحه تبدأ الحكاية.",
      en: "A folding carton with a hinged lid, closed by a green sticker running from the front to the base. The moment you open it, the story begins.",
    },
    chips: [{ ar: "19 × 15 × 3.75 سم", en: "19 × 15 × 3.75 cm" }, { ar: "استيكر 4 × 6 سم", en: "4 × 6 cm sticker" }],
  },
  {
    t: { ar: "الحكاية داخل الغطاء", en: "The story inside the lid" },
    d: {
      ar: "رسم خطي يبدأ من البذرة والقطف ويمر بالتحميص والطحن، ثم تتفرع ثلاث طرق للتحضير تلتقي في فنجان واحد حول مجلس.",
      en: "A seed, planting and picking, drying, roasting and grinding. Then the line splits into three brewing methods that meet in the cup, with a gathering around it.",
    },
    chips: [{ ar: "V60", en: "V60" }, { ar: "إسبريسو", en: "Espresso" }, { ar: "تركي", en: "Turkish" }],
  },
  {
    t: { ar: "ورق الزبدة والختم الشمعي", en: "Tissue paper and the wax seal" },
    d: {
      ar: "ورق بنقشة القوس يلف الكارت والكيس، ويغلقه ختم شمعي عقيقي عليه شعار ديوان. اكسر الختم وافتح الورق.",
      en: "A sheet printed with the arch pattern wraps the card and the pouch, closed with a carnelian wax seal bearing the DIWAN mark. Break the seal and notice the details.",
    },
    chips: [{ ar: "ورق 30 × 40 سم", en: "30 × 40 cm paper" }, { ar: "ختم عقيقي", en: "Carnelian seal" }],
  },
  {
    t: { ar: "كارت التوليفة", en: "The blend card" },
    d: {
      ar: "كارت بوجهين: الوش باسم التوليفة ودرجتها، والظهر بوصفة «حضّرها على ذوقك» خطوة بخطوة.",
      en: "A double-sided card: the front names the blend and its roast, the back holds the “Brew it your way” recipe, step by step.",
    },
    chips: [{ ar: "9 × 12 سم", en: "9 × 12 cm" }, { ar: "18 وجهاً", en: "18 sides" }],
  },
  {
    t: { ar: "الكيس الأبيض", en: "The white pouch" },
    d: {
      ar: "كيس أبيض بسوستة وبدون فالف، عليه استيكر شفاف بشعار ديوان، وبداخله 200 جم من القهوة.",
      en: "A white pouch with a calm texture and a zip, no valve, with a clear DIWAN sticker. 200 g of coffee is waiting.",
    },
    chips: [{ ar: "200 جم", en: "200 g" }, { ar: "19 × 14 سم", en: "19 × 14 cm" }],
  },
];

/** Camera move over the flat-lay photo: focus point (0..1) and zoom, clamped so no edge shows. */
const cam = (fx: number, fy: number, s: number) => ({
  scale: s,
  xPercent: Math.max(-(s - 1) * 100, Math.min(0, -(fx * s - 0.5) * 100)),
  yPercent: Math.max(-(s - 1) * 100, Math.min(0, -(fy * s - 0.5) * 100)),
});

export default function Unboxing() {
  const root = useRef<HTMLElement>(null);
  const ons = PRODUCTS[0];
  const lang = useLangStore((s) => s.lang);
  const ar = lang === "ar";

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(".u-cap", { autoAlpha: 0, y: 24 });
        gsap.set(".u-cap-0", { autoAlpha: 1, y: 0 });
        gsap.set(".u-flat", { autoAlpha: 0, transformOrigin: "0 0", ...cam(0.5, 0.5, 1) });
        gsap.set(".u-lid", { autoAlpha: 0, clipPath: "inset(0% 0% 0% 100%)" });
        gsap.set(".u-card", { autoAlpha: 0, yPercent: 40, scale: 0.8 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=450%", scrub: 0.8, pin: true },
        });

        const stage = (i: number, at: number) => {
          tl.to(`.u-cap-${i - 1}`, { autoAlpha: 0, y: -24, duration: 4 }, at - 3)
            .to(`.u-cap-${i}`, { autoAlpha: 1, y: 0, duration: 4 }, at)
            .to(".u-tick-fill", { scaleY: (i + 1) / 5, duration: 6, ease: "none" }, at - 3);
        };

        // 1 · box + seal: the sticker peels away
        tl.to(".u-street", { scale: 1.08, duration: 20, ease: "none" }, 0).to(
          ".u-seal",
          { yPercent: -60, rotate: -14, autoAlpha: 0, duration: 12 },
          8,
        );

        // 2 · lid opens: the line art is revealed right to left
        stage(1, 22);
        tl.to(".u-street", { autoAlpha: 0, duration: 6 }, 22)
          .to(".u-lid", { autoAlpha: 1, duration: 2 }, 22)
          .to(".u-lid", { clipPath: "inset(0% 0% 0% 0%)", duration: 14, ease: "power1.inOut" }, 24)
          .fromTo(".u-lid-img", { scale: 1.12 }, { scale: 1, duration: 22, ease: "none" }, 22);

        // 3 · camera moves in on the wax seal
        stage(2, 44);
        tl.to(".u-lid", { autoAlpha: 0, duration: 6 }, 44)
          .to(".u-flat", { autoAlpha: 1, duration: 6 }, 44)
          .to(".u-flat", { ...cam(0.73, 0.74, 2.3), duration: 12 }, 44);

        // 4 · across to the card, which comes forward and turns over
        stage(3, 64);
        tl.to(".u-flat", { ...cam(0.1, 0.62, 2.2), duration: 12 }, 64)
          .to(".u-card", { autoAlpha: 1, yPercent: 0, scale: 1, duration: 10 }, 70)
          .to(".u-card .flip-inner", { rotateY: 180, duration: 8 }, 82);

        // 5 · the whole table, ending on the pouch
        stage(4, 86);
        tl.to(".u-card", { autoAlpha: 0, yPercent: -30, duration: 6 }, 86)
          .to(".u-flat", { ...cam(0.34, 0.5, 1.55), duration: 10 }, 86)
          .to({}, { duration: 4 });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".u-cap", { autoAlpha: 0 });
        gsap.set(".u-cap-4", { autoAlpha: 1 });
        gsap.set([".u-street", ".u-lid", ".u-seal", ".u-card"], { autoAlpha: 0 });
        gsap.set(".u-flat", { autoAlpha: 1 });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="unboxing"
      className="on-green relative h-svh overflow-hidden bg-green text-sand"
      aria-label={ar ? "افتح الحكاية، فتح البوكس خطوة بخطوة" : "Open the Story, the unboxing experience"}
    >
      <style>{`.u-card .flip-inner{transition:none}`}</style>
      <div className="wrap grid h-full grid-rows-[auto_1fr] gap-4 pb-6 pt-20 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:grid-rows-1 md:items-center md:gap-12 md:py-16">
        {/* text */}
        <div className="flex gap-6">
          <div className="relative hidden w-px shrink-0 bg-sand/20 md:block" aria-hidden="true">
            <div className="u-tick-fill absolute inset-x-0 top-0 h-full origin-top scale-y-[0.2] bg-gold" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-latin text-xs tracking-[0.3em] text-gold md:text-sm">{ar ? "فتح البوكس" : "UNBOXING"}</p>
            <h2 className="font-serif text-3xl font-bold leading-tight md:text-5xl">{ar ? "افتح الحكاية" : "Open the Story"}</h2>
            <div className="mt-4 grid md:mt-8">
              {STAGES.map((s, i) => (
                <article key={s.t.en} className={`u-cap u-cap-${i} col-start-1 row-start-1`}>
                  <p className="font-latin text-sm text-gold">
                    <bdi>{`0${i + 1} / 05`}</bdi>
                  </p>
                  <h3 className="mt-1 font-serif text-xl font-bold md:mt-2 md:text-3xl">{s.t[lang]}</h3>
                  <p className="measure mt-2 text-sm leading-relaxed text-sand/85 md:mt-3 md:text-base">{s.d[lang]}</p>
                  <ul className="mt-3 flex flex-wrap gap-2 md:mt-5">
                    {s.chips.map((c) => (
                      <li key={c.en} className="rounded-[6px] border border-sand/30 px-3 py-1 text-xs font-medium text-sand">
                        <bdi>{c[lang]}</bdi>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* visual */}
        <div className="relative h-full min-h-0 overflow-hidden rounded-[14px] bg-[#0a2a25] shadow-[0_24px_64px_rgba(0,0,0,.35)] md:h-[76svh]">
          {/* eslint-disable @next/next/no-img-element */}
          <img
            src={`${PHOTO}/unboxing-flatlay.webp`}
            alt={ar ? "كيس ديوان وكارت وورق زبدة بختم شمعي داخل البوكس" : "A DIWAN pouch, a card and tissue paper with a wax seal inside the box"}
            className="u-flat absolute inset-0 h-full w-full object-cover"
          />
          <div className="u-street absolute inset-0">
            <img
              src={`${PHOTO}/cafe-street-box.webp`}
              alt={ar ? "واجهة بوكس ديوان: مشهد مقهى في شارع قاهري" : "The DIWAN box front: a café scene on a Cairo street"}
              className="h-full w-full object-cover"
            />
            <img
              src={`${PHOTO}/seal-sticker.webp`}
              alt={ar ? "استيكر قفل البوكس: افتح الحكاية" : "The box seal sticker: Open the Story"}
              className="u-seal absolute bottom-[-4%] left-1/2 w-[20%] -translate-x-1/2 rounded-[6px] shadow-[0_12px_32px_rgba(0,0,0,.4)]"
            />
          </div>
          <div className="u-lid absolute inset-0 bg-green">
            <img
              src={`${PHOTO}/lid-story.webp`}
              alt={ar ? "رسم الحكاية داخل الغطاء: من البذرة إلى الفنجان، وثلاثة أصدقاء في مجلس" : "The lid illustration: from seed to cup, and three friends in a majlis"}
              className="u-lid-img h-full w-full object-contain"
            />
          </div>
          {/* eslint-enable @next/next/no-img-element */}
          <div className="u-card pointer-events-none absolute bottom-[8%] end-[8%] w-[32%] max-w-[220px] drop-shadow-[0_16px_32px_rgba(0,0,0,.45)]">
            <ProductCard product={ons} roast="وسط" spice="سادة" />
          </div>
        </div>
      </div>
    </section>
  );
}
