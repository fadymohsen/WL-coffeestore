"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import HeaderNav from "@/components/layout/HeaderNav";
import CartDrawer from "@/components/layout/CartDrawer";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/ui/Reveal";
import { Magnetic, SplitText } from "@/components/ui/motion";
import { BRAND_STORY } from "@/data/products";
import { useLangStore, useLocalized } from "@/lib/i18n";

const P = "/assets/diwan/photo";

/** Each word lights up as the reader scrolls through the statement. */
function Word({ children, range, progress }: { children: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return <motion.span style={{ opacity }} className="inline-block">{children}&nbsp;</motion.span>;
}

function Statement({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.4"] });
  const words = text.split(/\s+/);
  return (
    <div ref={ref}>
      <p className="font-editorial text-[clamp(1.75rem,4.6vw,3.75rem)] font-medium leading-[1.35] text-green">
        {words.map((w, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, Math.min(1, (i + 1.5) / words.length)]}>{w}</Word>
        ))}
      </p>
    </div>
  );
}

function Parallax({ src, alt, className = "", speed = 60 }: { src: string; alt: string; className?: string; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-speed, speed]);
  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      whileInView={{ clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.img src={src} alt={alt} loading="lazy" style={{ y, scale: 1.15 }} className="absolute inset-0 h-full w-full object-cover" />
    </motion.div>
  );
}

function Chapter({ flip, title, body, media }: { flip?: boolean; title: string; body: ReactNode; media: ReactNode }) {
  return (
    <section className="mx-auto grid max-w-[1320px] items-center gap-10 px-5 py-16 md:grid-cols-2 md:gap-20 md:px-12 md:py-28">
      <Reveal className={flip ? "md:order-2" : ""}>{media}</Reveal>
      <Reveal delay={0.1}>
        <SplitText as="h2" text={title} className="block font-editorial text-4xl font-semibold leading-tight text-green md:text-6xl" />
        <div className="mt-6 max-w-[34rem] space-y-4 text-base leading-[1.8] text-n500 md:text-lg">{body}</div>
      </Reveal>
    </section>
  );
}

export default function OurStoryPage() {
  const l = useLocalized();
  const lang = useLangStore((s) => s.lang);
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const heroFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const values = [
    { t: l({ en: "Attention to detail", ar: "العناية بالتفاصيل" }), d: l({ en: "From choosing the bean to closing the box, every step is measured.", ar: "من اختيار الحبة إلى إغلاق البوكس، كل خطوة محسوبة." }) },
    { t: l({ en: "Honesty in description", ar: "الصدق في الوصف" }), d: l({ en: "What we say about a blend is exactly what you will find in the cup.", ar: "ما نكتبه عن التوليفة هو ما ستجده في الفنجان." }) },
    { t: l({ en: "Warm hospitality", ar: "كرم الاستقبال" }), d: l({ en: "A host in how we treat you, a craftsman in the details.", ar: "نستقبلك كمضيف، ونصنع كحرفي." }) },
    { t: l({ en: "Simplicity", ar: "البساطة" }), d: l({ en: "We respect your time: a clear choice, with no complication.", ar: "نحترم وقتك: اختيار واضح بلا تعقيد." }) },
  ];

  const people = [
    { t: l({ en: "The calm ritualist", ar: "الهادئ" }), d: l({ en: "Loves the ritual and the simplicity.", ar: "يحب الطقس والبساطة." }) },
    { t: l({ en: "The daily drinker", ar: "اليومي" }), d: l({ en: "Wants the same good cup, every day.", ar: "يريد الفنجان الجيد نفسه كل يوم." }) },
    { t: l({ en: "The gift buyer", ar: "الهدية" }), d: l({ en: "Cares about how it arrives.", ar: "يهتم بشكل الهدية وطريقة تقديمها." }) },
    { t: l({ en: "The explorer", ar: "المستكشف" }), d: l({ en: "Reads the details before choosing.", ar: "يقرأ التفاصيل قبل أن يختار." }) },
  ];

  return (
    <main id="main" data-header-solid className="page-in relative bg-sandy">
      <HeaderNav />
      <CartDrawer />

      {/* Opening */}
      <section ref={hero} className="relative flex min-h-[100svh] items-end overflow-hidden bg-green">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${P}/majlis-sofa.webp`} alt={l({ en: "A calm majlis with sofas, a low table and a view over Cairo", ar: "مجلس هادئ بكنبات وطاولة منخفضة وإطلالة على القاهرة" })} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-green via-green/55 to-green/10" aria-hidden="true" />
        </motion.div>
        <motion.div style={{ opacity: heroFade }} className="relative mx-auto w-full max-w-[1320px] px-5 pb-16 md:px-12 md:pb-24">
          <SplitText as="h1" delay={0.2} stagger={0.1} text={l({ en: "The story begins with a cup", ar: "الحكاية تبدأ بفنجان" })} className="block max-w-4xl font-editorial text-[clamp(3rem,9vw,8rem)] font-semibold leading-[0.95] text-sandy" />
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-sandy/85">
            {l({ en: "DIWAN is a Cairo roastery built on one idea: coffee is a reason to sit together.", ar: "ديوان محمصة قهوة في القاهرة. نؤمن أن الفنجان أجمل حين يجتمع حوله الناس." })}
          </p>
        </motion.div>
      </section>

      {/* The statement */}
      <section className="mx-auto max-w-[1100px] px-5 py-28 md:px-12 md:py-44">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/diwan/Diwan_Arch_Green_tight.png" alt="" aria-hidden="true" className="mb-10 h-12 w-auto" />
        <Statement text={BRAND_STORY[lang]} />
      </section>

      <Chapter
        title={l({ en: "A diwan is where people sit", ar: "الديوان هو غرفة الضيوف" })}
        body={
          <>
            <p>{l({ en: "In Egyptian homes the diwan is the room kept for guests. Someone always puts the kettle on before anyone asks.", ar: "في البيوت المصرية القديمة، الديوان هو الغرفة التي يجلس فيها الضيوف. وهناك دائماً من يضع الركوة على النار قبل أن يطلب أحد." })}</p>
            <p>{l({ en: "We took that feeling and put it into a pouch of coffee you can open on an ordinary morning.", ar: "حملنا هذا الإحساس إلى كيس قهوة تفتحه في أي صباح." })}</p>
          </>
        }
        media={<Parallax src={`${P}/friends-majlis.webp`} alt={l({ en: "Four friends sharing coffee in a majlis", ar: "أربعة أصدقاء يتشاركون القهوة في مجلس" })} className="aspect-[4/3] rounded-[14px]" />}
      />

      {/* Seed to cup, on green */}
      <section className="bg-green py-20 text-sandy md:py-32">
        <div className="mx-auto grid max-w-[1320px] items-center gap-12 px-5 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-20 md:px-12">
          <Reveal>
            <h2 className="font-editorial text-4xl font-semibold leading-tight md:text-6xl">{l({ en: "From a seed to your cup", ar: "من البذرة إلى الفنجان" })}</h2>
            <p className="mt-6 max-w-md text-base leading-[1.8] text-sandy/80 md:text-lg">
              {l({ en: "A seed, the picking, the drying, the roast and the grind. Then one line splits into three ways to brew, and they all end around the same table.", ar: "تبدأ بالبذرة، ثم القطف والتجفيف والتحميص والطحن. بعدها يتفرع الخط إلى ثلاث طرق للتحضير، وكلها تنتهي حول الطاولة نفسها." })}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${P}/lid-story.webp`} alt={l({ en: "Line drawing from seed to cup, ending with three friends in a majlis", ar: "رسم خطي من البذرة إلى الفنجان، ينتهي بثلاثة أصدقاء في مجلس" })} loading="lazy" className="w-full rounded-[14px]" />
          </Reveal>
        </div>
      </section>

      <Chapter
        flip
        title={l({ en: "Every coffee culture, as it is", ar: "نحترم كل قهوة كما هي" })}
        body={
          <>
            <p>{l({ en: "We do not look down on Turkish coffee because it has Robusta, and we do not worship specialty because it is single origin.", ar: "لا نقلل من شأن القهوة التركي لأن فيها روبوستا، ولا نبالغ في مدح المختصة لأنها من منشأ واحد." })}</p>
            <p>{l({ en: "So there are three families: Turkish, espresso and flavored. Each one is described honestly, with its roast and its ratio.", ar: "لهذا قسمنا قهوتنا إلى ثلاثة أنواع: تركي وإسبريسو ومنكهة، ووصفنا كل توليفة بدرجة تحميصها ونسبتها." })}</p>
            <p><Link href="/shop" className="font-semibold text-green underline underline-offset-4 transition hover:text-aqeeq">{l({ en: "See the nine blends", ar: "تصفح التوليفات التسع" })}</Link></p>
          </>
        }
        media={<Parallax src={`${P}/pour-turkish.webp`} alt={l({ en: "Turkish coffee poured from a copper cezve", ar: "سكب القهوة التركي من الركوة النحاسية" })} className="aspect-[4/3] rounded-[14px]" />}
      />

      {/* Values: set as type, not cards */}
      <section className="border-y border-n200 py-20 md:py-32">
        <div className="mx-auto max-w-[1100px] px-5 md:px-12">
          <Reveal><h2 className="font-editorial text-4xl font-semibold text-green md:text-6xl">{l({ en: "What we hold to", ar: "قيمنا" })}</h2></Reveal>
          <dl className="mt-12 divide-y divide-n200 border-t border-n200">
            {values.map((v, i) => (
              <Reveal key={v.t} delay={i * 0.05}>
                <div className="grid gap-2 py-7 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-12 md:py-9">
                  <dt className="font-editorial text-2xl font-semibold text-green md:text-4xl">{v.t}</dt>
                  <dd className="self-center text-base leading-relaxed text-n500 md:text-lg">{v.d}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* The promise */}
      <section className="mx-auto max-w-[1320px] px-5 py-20 md:px-12 md:py-32">
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] md:gap-20">
          <Reveal>
            <h2 className="font-editorial text-4xl font-semibold leading-tight text-green md:text-6xl">{l({ en: "A taste you can rely on", ar: "طعم يعتمد عليه" })}</h2>
            <p className="mt-6 max-w-xl text-base leading-[1.8] text-n500 md:text-lg">
              {l({ en: "A taste made for the Egyptian palate, a clear choice, and the same experience in the product and in the service. If something is not right, we review it with you quickly, fix the cause and suggest a better option.", ar: "طعم مناسب للذوق المصري، واختيار واضح، وتجربة واحدة في المنتج والخدمة. وإذا حدث ما لا يرضيك، نراجعه معك بسرعة، ونصحح السبب، ونقترح البديل." })}
            </p>
          </Reveal>
          <Reveal delay={0.1}><Parallax src={`${P}/table-kanaka-v60.webp`} alt={l({ en: "A copper cezve, a V60 and a cup on a marble table", ar: "ركوة نحاسية وV60 وفنجان على طاولة رخامية" })} className="aspect-[5/4] rounded-[14px]" speed={40} /></Reveal>
        </div>
      </section>

      {/* People */}
      <section className="bg-sand-deep/50 py-16 md:py-24">
        <div className="mx-auto max-w-[1320px] px-5 md:px-12">
          <Reveal><h2 className="font-editorial text-3xl font-semibold text-green md:text-5xl">{l({ en: "Who we pour for", ar: "لمن نُعدّ القهوة" })}</h2></Reveal>
          <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {people.map((p, i) => (
              <Reveal key={p.t} delay={i * 0.06}>
                <li className="border-t-2 border-green pt-4">
                  <p className="font-editorial text-2xl font-semibold text-green">{p.t}</p>
                  <p className="mt-2 text-sm leading-relaxed text-n500">{p.d}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* The box */}
      <section className="relative overflow-hidden">
        <Parallax src={`${P}/unboxing-flatlay.webp`} alt={l({ en: "The DIWAN box open on a table: a card, a pouch and a wax-sealed tissue paper", ar: "بوكس ديوان مفتوح على طاولة: كارت وكيس وورق زبدة بختم شمعي" })} className="h-[70svh] min-h-[28rem]" speed={90} />
        <div className="absolute inset-0 bg-gradient-to-t from-green/90 via-green/30 to-transparent" aria-hidden="true" />
        <Reveal className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-[1320px] px-5 pb-12 md:px-12 md:pb-16">
            <h2 className="max-w-2xl font-editorial text-4xl font-semibold leading-tight text-sandy md:text-6xl">{l({ en: "Every order opens like a story", ar: "كل طلب يصلك في بوكس" })}</h2>
            <Link href="/#unboxing" className="mt-6 inline-flex rounded-full bg-sandy px-7 py-3.5 text-sm font-semibold text-green transition hover:bg-white active:scale-[0.97]">{l({ en: "See how it opens", ar: "شاهد فتح البوكس" })}</Link>
          </div>
        </Reveal>
      </section>

      {/* What's next */}
      <section className="mx-auto max-w-[1320px] px-5 py-20 md:px-12 md:py-32">
        <Reveal>
          <h2 className="max-w-3xl font-editorial text-4xl font-semibold leading-tight text-green md:text-6xl">{l({ en: "And one day, a door you can walk through", ar: "ومستقبلاً: مقهى تزورنا فيه" })}</h2>
          <p className="mt-5 max-w-xl text-base leading-[1.8] text-n500 md:text-lg">{l({ en: "A café and roastery is a future direction for DIWAN: a deep green awning, warm wood, and calm natural materials.", ar: "مقهى ومحمصة ديوان فكرة للمستقبل: مظلة خضراء داكنة وخشب دافئ وخامات طبيعية هادئة." })}</p>
        </Reveal>
        <div className="mt-10 grid gap-3 md:h-[30rem] md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:grid-rows-2">
          {/* eslint-disable @next/next/no-img-element */}
          <Reveal className="md:row-span-2"><img src={`${P}/shopfront-exterior.webp`} alt={l({ en: "Concept: the DIWAN café front", ar: "تصور: واجهة مقهى ديوان" })} loading="lazy" className="h-64 w-full rounded-[14px] object-cover md:h-full" /></Reveal>
          <Reveal delay={0.08}><img src={`${P}/shopfront-bar.webp`} alt={l({ en: "Concept: the coffee bar", ar: "تصور: بار القهوة" })} loading="lazy" className="h-44 w-full rounded-[14px] object-cover md:h-full" /></Reveal>
          <Reveal delay={0.16}><img src={`${P}/shopfront-seating.webp`} alt={l({ en: "Concept: the seating area", ar: "تصور: منطقة الجلوس" })} loading="lazy" className="h-44 w-full rounded-[14px] object-cover md:h-full" /></Reveal>
          {/* eslint-enable @next/next/no-img-element */}
        </div>
      </section>

      {/* Close */}
      <section className="bg-green py-24 text-center text-sandy md:py-36">
        <Reveal>
          <h2 className="mx-auto max-w-3xl px-5 font-editorial text-4xl font-semibold leading-tight md:text-7xl">{l({ en: "There is always room for a cup", ar: "هناك دائماً مساحة لفنجان" })}</h2>
          <Magnetic className="mt-10 inline-block"><Link href="/shop" className="inline-flex rounded-full bg-sandy px-8 py-4 text-sm font-semibold text-green transition hover:bg-white active:scale-[0.97]">{l({ en: "Choose your blend", ar: "اختر توليفتك" })}</Link></Magnetic>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
