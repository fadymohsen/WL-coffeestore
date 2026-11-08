"use client";

import { useEffect, useRef, useState } from "react";
import { BRAND_STORY, DEFERRED, PERSONAS, PILLARS, PRODUCTS, REELS } from "@/data/products";
import { scrollToId } from "./util";

/** Calm preparation ambience — synthesised noise, muted by default, no music. */
function useAmbience() {
  const ctx = useRef<AudioContext | null>(null);
  const gain = useRef<GainNode | null>(null);
  const [on, setOn] = useState(false);

  const toggle = () => {
    if (!ctx.current) {
      const ac = new AudioContext();
      const buf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
      const d = buf.getChannelData(0);
      let last = 0;
      for (let i = 0; i < d.length; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; }
      const src = ac.createBufferSource();
      src.buffer = buf; src.loop = true;
      const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 700;
      const g = ac.createGain(); g.gain.value = 0;
      src.connect(lp).connect(g).connect(ac.destination); src.start();
      ctx.current = ac; gain.current = g;
    }
    const next = !on;
    void ctx.current.resume();
    gain.current!.gain.setTargetAtTime(next ? 0.25 : 0, ctx.current.currentTime, 0.3);
    setOn(next);
  };
  useEffect(() => () => { void ctx.current?.close(); }, []);
  return { on, toggle };
}

export function Story({ onPick }: { onPick: (ids: string[]) => void }) {
  const [active, setActive] = useState<string | null>(null);
  const amb = useAmbience();
  const persona = PERSONAS.find((p) => p.id === active);

  return (
    <section id="story" className="arch-pattern py-24" aria-labelledby="story-h">
      <div className="wrap">
        <p className="font-latin text-sm tracking-[0.3em] text-carnelian">OUR STORY</p>
        <h2 id="story-h" className="font-serif text-4xl font-bold text-green">حكايتنا</h2>
        <div className="mt-6 grid items-stretch gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <blockquote className="rounded-[14px] bg-sand/90 p-8 font-serif text-2xl leading-loose text-green md:text-3xl">
            «{BRAND_STORY}»
          </blockquote>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/diwan/photo/friends-majlis.webp" alt="أربعة أصدقاء يتشاركون القهوة حول طاولة في مجلس مطل على القاهرة" loading="lazy" className="h-64 w-full rounded-[14px] object-cover lg:h-full" />
        </div>

        <h3 className="mt-16 font-serif text-3xl font-bold text-green">أي شخصية قهوة أنت؟</h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              aria-pressed={active === p.id}
              onClick={() => { setActive(p.id); onPick([...p.picks]); scrollToId("catalog"); }}
              className={`rounded-[14px] border p-5 text-start transition hover:-translate-y-1 ${active === p.id ? "border-carnelian bg-carnelian text-sand" : "border-green/30 bg-sand text-ink"}`}
            >
              <span className="font-serif text-2xl font-bold">{p.name}</span>
              <span className="mt-2 block text-sm leading-relaxed opacity-90">{p.desc}</span>
            </button>
          ))}
        </div>
        {persona && (
          <p className="mt-4 text-green" aria-live="polite">
            نرشّح لك: {persona.picks.map((id) => PRODUCTS.find((p) => p.id === id)!.name).join(" · ")}
            {persona.id === "gift" && " — مع تجربة البوكس الكاملة"}
            {persona.id === "explorer" && " (ليل 100% أرابيكا · طيف 80% أرابيكا)"}
          </p>
        )}
        <p className="measure mt-6 text-ink/80">لو تحب نرشح لك توليفة حسب طريقة التحضير والذوق، ابعت لنا وسنساعدك مباشرة.</p>

        <div className="mt-10 flex items-center gap-4 rounded-[14px] border border-green/30 bg-sand/90 p-4">
          <button className={`btn ${amb.on ? "btn-primary" : "btn-ghost"}`} aria-pressed={amb.on} onClick={amb.toggle}>
            {amb.on ? "إيقاف الأجواء" : "أجواء ديوان الصوتية"}
          </button>
          <span className="text-sm text-ink/70">صوت هادئ للتحضير، صامت افتراضياً، بلا موسيقى مضافة.</span>
        </div>
      </div>
    </section>
  );
}

export function Behind() {
  return (
    <section id="behind" className="py-24" aria-labelledby="behind-h">
      <div className="wrap">
        <p className="font-latin text-sm tracking-[0.3em] text-carnelian">BEHIND DIWAN</p>
        <h2 id="behind-h" className="font-serif text-4xl font-bold text-green">من داخل ديوان</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <ul className="space-y-4" aria-label="ركائز المحتوى">
            {PILLARS.map((p) => (
              <li key={p.name}>
                <div className="flex justify-between text-sm font-semibold text-green"><span>{p.name}</span><bdi>{p.pct}%</bdi></div>
                <div className="mt-1 h-3 rounded-full bg-sand-deep"><div className="h-full rounded-full bg-green" style={{ width: `${p.pct * 2}%` }} /></div>
              </li>
            ))}
          </ul>
          <div className="grid gap-4 sm:grid-cols-3">
            {REELS.map((r, i) => (
              <article key={r.title} className="relative flex aspect-[9/16] flex-col justify-end overflow-hidden rounded-[14px] p-4 text-sand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={["/assets/diwan/photo/unboxing-flatlay.webp", "/assets/diwan/photo/pour-turkish.webp", "/assets/diwan/photo/filming-beans.webp"][i]} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-green/95 via-green/40 to-transparent" aria-hidden="true" />
                <h3 className="relative font-serif text-xl font-bold">{r.title}</h3>
                <p className="relative mt-1 text-xs">{r.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Roadmap() {
  const [open, setOpen] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section id="soon" className="bg-sand-deep/40 py-24" aria-labelledby="soon-h">
      <div className="wrap">
        <p className="font-latin text-sm tracking-[0.3em] text-carnelian">COMING SOON</p>
        <h2 id="soon-h" className="font-serif text-4xl font-bold text-green">قريباً في ديوان</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEFERRED.map((d) => (
            <article key={d} className="rounded-[14px] border border-n200 bg-sand p-6">
              <span className="rounded-[6px] bg-sand-deep px-3 py-1 text-xs font-semibold text-green">قريباً — لم يتم تحديثها بعد</span>
              <h3 className="mt-4 font-serif text-2xl font-bold text-green">{d}</h3>
              <button className="btn btn-ghost mt-4 text-sm" onClick={() => { setOpen(d); setDone(false); }}>بلّغني عند الإطلاق</button>
            </article>
          ))}
        </div>

        <figure className="mt-12">
          <div className="grid gap-3 md:h-[30rem] md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:grid-rows-2">
            {/* eslint-disable @next/next/no-img-element */}
            <img src="/assets/diwan/photo/shopfront-exterior.webp" alt="تصور مستقبلي لواجهة مقهى ديوان بمظلة خضراء داكنة" loading="lazy" className="h-56 w-full rounded-[14px] object-cover md:row-span-2 md:h-full" />
            <img src="/assets/diwan/photo/shopfront-bar.webp" alt="بار القهوة والرفوف داخل مقهى ديوان المستقبلي" loading="lazy" className="h-40 w-full min-h-0 md:h-full rounded-[14px] object-cover" />
            <img src="/assets/diwan/photo/shopfront-seating.webp" alt="منطقة الجلوس داخل مقهى ديوان المستقبلي" loading="lazy" className="h-40 w-full min-h-0 md:h-full rounded-[14px] object-cover" />
            {/* eslint-enable @next/next/no-img-element */}
          </div>
          <figcaption className="mt-3 text-sm text-ink/70">اتجاه بيئي مستقبلي: مقهى ومحمصة ديوان، بمظلة خضراء داكنة وخشب دافئ وخامات طبيعية هادئة.</figcaption>
        </figure>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4" role="dialog" aria-modal="true">
          <form
            className="w-full max-w-sm rounded-[14px] bg-sand p-6"
            onSubmit={(e) => {
              e.preventDefault();
              const k = "diwan-notify";
              const list = JSON.parse(localStorage.getItem(k) ?? "[]");
              localStorage.setItem(k, JSON.stringify([...list, { category: open, email }]));
              setDone(true);
            }}
          >
            <h3 className="font-serif text-2xl font-bold text-green">{open}</h3>
            {done ? (
              <p className="mt-3 text-ui-success text-[#2E6B4F]">تم تسجيل اهتمامك. سنبلّغك عند الإطلاق.</p>
            ) : (
              <>
                <label className="mt-3 block text-sm font-semibold">البريد الإلكتروني
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-[6px] border border-n300 bg-n100 px-3 py-2" dir="ltr" />
                </label>
                <button className="btn btn-primary mt-4 w-full">بلّغني</button>
              </>
            )}
            <button type="button" className="mt-3 w-full text-sm text-green underline" onClick={() => setOpen(null)}>إغلاق</button>
          </form>
        </div>
      )}
    </section>
  );
}
