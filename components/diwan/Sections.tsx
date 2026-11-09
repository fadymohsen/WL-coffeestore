"use client";

import Link from "next/link";
import { useState } from "react";
import { BRAND_STORY, DEFERRED, PERSONAS, PILLARS, PRODUCTS, REELS } from "@/data/products";
import { AnimatePresence, motion } from "motion/react";
import Reveal from "@/components/ui/Reveal";
import { Magnetic, SplitText } from "@/components/ui/motion";
import { useCatalogStore } from "@/store/useCatalogStore";
import { money } from "@/lib/format";
import { useLangStore } from "@/lib/i18n";
import { useTrap } from "@/lib/useTrap";

export function Story() {
  const lang = useLangStore((s) => s.lang);
  const ar = lang === "ar";
  const items = useCatalogStore((s) => s.items);
  const [active, setActive] = useState<string>(PERSONAS[0].id);
  const persona = PERSONAS.find((x) => x.id === active) ?? PERSONAS[0];
  const picks = persona.picks.map((id) => PRODUCTS.find((x) => x.id === id)!);
  const from = (id: string) => Math.min(...(items.find((i) => i.id === id)?.variants.map((v) => v.price) ?? [0]));

  return (
    <section id="story" className="relative overflow-hidden bg-sand py-24 md:py-36" aria-labelledby="story-h">
      <div className="wrap">
        <div className="max-w-3xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/diwan/Diwan_Arch_Green_tight.png" alt="" aria-hidden="true" className="mb-8 h-10 w-auto" />
          <SplitText as="h2" text={ar ? "حكايتنا" : "Our story"} className="block font-serif text-6xl font-bold leading-[0.95] text-green md:text-8xl" />
          <Reveal delay={0.15}>
            <blockquote className="mt-8 font-serif text-xl leading-[1.75] text-ink/85 md:text-[1.7rem] md:leading-[1.7]">{BRAND_STORY[lang]}</blockquote>
          </Reveal>
          <Reveal delay={0.25}>
            <Magnetic className="mt-10 inline-block">
              <Link href="/our-story" className="btn btn-primary">{ar ? "اقرأ الحكاية كاملة" : "Read the full story"}</Link>
            </Magnetic>
          </Reveal>
        </div>
      </div>

      {/* Which coffee person are you */}
      <div className="wrap mt-24 md:mt-36">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-24">
          <div>
            <SplitText as="h3" text={ar ? "أي شخصية قهوة أنت؟" : "Which coffee person are you?"} className="block font-serif text-4xl font-bold leading-tight text-green md:text-5xl" />
            <div role="tablist" aria-label={ar ? "شخصيات القهوة" : "Coffee personalities"} className="mt-8 flex flex-wrap gap-2">
              {PERSONAS.map((x) => (
                <button
                  key={x.id}
                  role="tab"
                  id={`persona-${x.id}`}
                  aria-selected={active === x.id}
                  aria-controls="persona-panel"
                  onClick={() => setActive(x.id)}
                  className={`relative rounded-full px-5 py-3 text-sm font-semibold transition active:scale-[0.97] ${active === x.id ? "text-sand" : "border border-green/30 text-green hover:bg-green/10"}`}
                >
                  {active === x.id && <motion.span layoutId="persona-pill" className="absolute inset-0 rounded-full bg-green" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                  <span className="relative">{x.name[lang]}</span>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={persona.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="mt-6 max-w-sm text-lg leading-relaxed text-ink/80"
                aria-live="polite"
              >
                {persona.desc[lang]}
              </motion.p>
            </AnimatePresence>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-ink/70">
              {ar
                ? "لو تحب نرشح لك توليفة حسب طريقة التحضير والذوق، ابعت لنا وسنساعدك مباشرة."
                : "If you'd like a blend recommended for your brewing method and taste, message us and we will help you directly."}
            </p>
          </div>

          <div id="persona-panel" role="tabpanel" aria-labelledby={`persona-${active}`}>
            <p className="mb-4 text-sm font-semibold text-green">{ar ? "نرشح لك" : "We suggest"}</p>
            <AnimatePresence mode="wait">
              <motion.ul
                key={persona.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-2 gap-4 md:gap-6"
              >
                {picks.map((pk, i) => (
                  <motion.li key={pk.id} initial={{ opacity: 0, y: 28, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}>
                    <Link href={`/shop/${pk.id}`} className="group block">
                      <span className="relative block aspect-square overflow-hidden rounded-[18px]" style={{ background: pk.hex }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={pk.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.05]" />
                      </span>
                      <span className="mt-3 flex items-baseline justify-between gap-3">
                        <span className="font-serif text-2xl font-bold text-green transition group-hover:text-carnelian">{ar ? pk.name : pk.nameEn}</span>
                        <span className="text-sm font-semibold text-green"><bdi>{money(from(pk.id), lang)}</bdi></span>
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Behind() {
  const lang = useLangStore((s) => s.lang);
  const ar = lang === "ar";
  return (
    <section id="behind" className="py-24" aria-labelledby="behind-h">
      <div className="wrap">
        <Reveal>
          <p className="font-latin text-sm tracking-[0.3em] text-carnelian">{ar ? "من داخل ديوان" : "BEHIND DIWAN"}</p>
          <h2 id="behind-h" className="font-serif text-4xl font-bold text-green">{ar ? "من داخل ديوان" : "Inside DIWAN"}</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <ul className="space-y-4" aria-label={ar ? "ركائز المحتوى" : "Content pillars"}>
            {PILLARS.map((p) => (
              <li key={p.name.en}>
                <div className="flex justify-between text-sm font-semibold text-green"><span>{p.name[lang]}</span><bdi>{p.pct}%</bdi></div>
                <div className="mt-1 h-3 rounded-full bg-sand-deep"><div className="h-full rounded-full bg-green" style={{ width: `${p.pct * 2}%` }} /></div>
              </li>
            ))}
          </ul>
          <div className="grid gap-4 sm:grid-cols-3">
            {REELS.map((r, i) => (
              <Reveal key={r.title.en} delay={i * 0.08}>
                <article className="group relative flex aspect-[9/16] flex-col justify-end overflow-hidden rounded-[14px] p-4 text-sand">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={["/assets/diwan/photo/unboxing-flatlay.webp", "/assets/diwan/photo/pour-turkish.webp", "/assets/diwan/photo/filming-beans.webp"][i]} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-green/95 via-green/40 to-transparent" aria-hidden="true" />
                  <h3 className="relative font-serif text-xl font-bold">{r.title[lang]}</h3>
                  <p className="relative mt-1 text-xs">{r.desc[lang]}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Roadmap() {
  const lang = useLangStore((s) => s.lang);
  const ar = lang === "ar";
  const [open, setOpen] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const trap = useTrap(() => setOpen(null));
  return (
    <section id="soon" className="bg-sand-deep/40 py-24" aria-labelledby="soon-h">
      <div className="wrap">
        <Reveal>
          <p className="font-latin text-sm tracking-[0.3em] text-carnelian">{ar ? "قريباً" : "COMING SOON"}</p>
          <h2 id="soon-h" className="font-serif text-4xl font-bold text-green">{ar ? "قريباً في ديوان" : "Coming soon to DIWAN"}</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEFERRED.map((d, i) => (
            <Reveal key={d.en} delay={(i % 3) * 0.07}>
              <article className="rounded-[14px] border border-n200 bg-sand p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <span className="rounded-[6px] bg-sand-deep px-3 py-1 text-xs font-semibold text-green">
                  {ar ? "قريباً" : "Soon, details not yet final"}
                </span>
                <h3 className="mt-4 font-serif text-2xl font-bold text-green">{d[lang]}</h3>
                <button className="btn btn-ghost mt-4 text-sm" onClick={() => { setOpen(d.en); setDone(false); }}>
                  {ar ? "بلّغني عند الإطلاق" : "Notify me at launch"}
                </button>
              </article>
            </Reveal>
          ))}
        </div>

        <figure className="mt-12">
          <div className="grid gap-3 md:h-[30rem] md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:grid-rows-2">
            {/* eslint-disable @next/next/no-img-element */}
            <img src="/assets/diwan/photo/shopfront-exterior.webp" alt={ar ? "تصور مستقبلي لواجهة مقهى ديوان بمظلة خضراء داكنة" : "Future concept of the DIWAN café front, with a deep green awning"} loading="lazy" className="h-56 w-full rounded-[14px] object-cover md:row-span-2 md:h-full" />
            <img src="/assets/diwan/photo/shopfront-bar.webp" alt={ar ? "بار القهوة والرفوف داخل مقهى ديوان المستقبلي" : "The coffee bar and shelves inside the future DIWAN café"} loading="lazy" className="h-40 w-full min-h-0 rounded-[14px] object-cover md:h-full" />
            <img src="/assets/diwan/photo/shopfront-seating.webp" alt={ar ? "منطقة الجلوس داخل مقهى ديوان المستقبلي" : "The seating area inside the future DIWAN café"} loading="lazy" className="h-40 w-full min-h-0 rounded-[14px] object-cover md:h-full" />
            {/* eslint-enable @next/next/no-img-element */}
          </div>
          <figcaption className="mt-3 text-sm text-ink/70">
            {ar
              ? "اتجاه بيئي مستقبلي: مقهى ومحمصة ديوان، بمظلة خضراء داكنة وخشب دافئ وخامات طبيعية هادئة."
              : "A future direction: the DIWAN café and roastery, with a deep green awning, warm wood and calm natural materials."}
          </figcaption>
        </figure>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4" onClick={() => setOpen(null)}>
          <form
            ref={trap}
            role="dialog"
            aria-modal="true"
            aria-label={DEFERRED.find((d) => d.en === open)?.[lang]}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-[14px] bg-sand p-6"
            onSubmit={(e) => {
              e.preventDefault();
              const k = "diwan-notify";
              const list = JSON.parse(localStorage.getItem(k) ?? "[]");
              localStorage.setItem(k, JSON.stringify([...list, { category: open, email }]));
              setDone(true);
            }}
          >
            <h3 className="font-serif text-2xl font-bold text-green">{DEFERRED.find((d) => d.en === open)?.[lang]}</h3>
            {done ? (
              <p className="mt-3 text-[#2E6B4F]">{ar ? "سجلنا اهتمامك. سنخبرك عند الإطلاق." : "Your interest is saved. We'll tell you at launch."}</p>
            ) : (
              <>
                <label className="mt-3 block text-sm font-semibold">
                  {ar ? "البريد الإلكتروني" : "Email"}
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-[6px] border border-n300 bg-n100 px-3 py-2" dir="ltr" />
                </label>
                <button className="btn btn-primary mt-4 w-full">{ar ? "بلّغني" : "Notify me"}</button>
              </>
            )}
            <button type="button" className="mt-3 w-full text-sm text-green underline" onClick={() => setOpen(null)}>{ar ? "إغلاق" : "Close"}</button>
          </form>
        </div>
      )}
    </section>
  );
}
