"use client";

import { useEffect, useRef, useState } from "react";
import { PRODUCTS } from "@/data/products";
import Reveal from "@/components/ui/Reveal";
import { useLangStore } from "@/lib/i18n";

type Method = "turkish" | "espresso" | "flavored";
const METHODS: { id: Method; label: { ar: string; en: string }; steps: string[]; stepsEn: string[] }[] = [
  { id: "turkish", label: { ar: "التركي", en: "Turkish" }, steps: PRODUCTS[0].steps, stepsEn: PRODUCTS[0].stepsEn },
  { id: "espresso", label: { ar: "الإسبريسو", en: "Espresso" }, steps: PRODUCTS[3].steps, stepsEn: PRODUCTS[3].stepsEn },
  { id: "flavored", label: { ar: "المنكهة", en: "Flavored" }, steps: PRODUCTS[6].steps, stepsEn: PRODUCTS[6].stepsEn },
];

function Flame({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 40 52" className={`h-14 w-11 transition-opacity ${on ? "opacity-100" : "opacity-25"}`} aria-hidden="true">
      <path className={on ? "animate-pulse" : ""} d="M20 4c4 10 14 14 14 28a14 14 0 0 1-28 0c0-8 4-10 6-16 2 4 4 6 6 6-2-6-2-12 2-18z" fill="#A8432C" />
      <path className={on ? "animate-pulse" : ""} d="M20 26c3 5 7 7 7 13a7 7 0 0 1-14 0c0-4 3-6 7-13z" fill="#CDA76C" />
    </svg>
  );
}

function ShotTimer() {
  const ar = useLangStore((s) => s.lang) === "ar";
  const [t, setT] = useState(0);
  const [run, setRun] = useState(false);
  const id = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!run) return;
    id.current = setInterval(() => setT((v) => +(v + 0.1).toFixed(1)), 100);
    return () => { if (id.current) clearInterval(id.current); };
  }, [run]);
  const inWindow = t >= 25 && t <= 30;
  const pct = Math.min(100, (t / 30) * 100);
  const grams = Math.min(36, Math.round((t / 27.5) * 36));
  return (
    <div className="rounded-[14px] bg-green p-6 text-sand">
      <div className="flex items-end justify-between">
        <span className="font-latin text-6xl font-semibold tabular-nums"><bdi>{t.toFixed(1)}</bdi><small className="text-2xl">s</small></span>
        <span className="text-sm"><bdi>{grams}</bdi> / <bdi>36</bdi> {ar ? "جم" : "g"}</span>
      </div>
      <div className="relative mt-4 h-3 rounded-full bg-sand/20">
        <div className="absolute inset-y-0 start-0 rounded-full" style={{ width: `${pct}%`, background: inWindow ? "#CDA76C" : "#F4ECDC" }} />
        <div className="absolute inset-y-[-4px] w-[2px] bg-gold" style={{ insetInlineStart: `${(25 / 30) * 100}%` }} />
      </div>
      <p className="mt-2 text-xs opacity-80">{ar ? "المدة المناسبة" : "Ideal window"} <bdi>25–30</bdi> {ar ? "ثانية · نقطة بداية لضبط الطحنة" : "s · a starting point for dialling in the grind"}</p>
      <div className="mt-4 flex gap-3">
        <button className="btn bg-sand text-green" onClick={() => setRun((r) => !r)}>{run ? (ar ? "إيقاف" : "Stop") : ar ? "ابدأ التحضير" : "Start the shot"}</button>
        <button className="btn border-sand text-sand" onClick={() => { setRun(false); setT(0); }}>{ar ? "إعادة" : "Reset"}</button>
      </div>
    </div>
  );
}

export default function Brewing() {
  const lang = useLangStore((s) => s.lang);
  const ar = lang === "ar";
  const [m, setM] = useState<Method>("turkish");
  const [cups, setCups] = useState(1);
  const [step, setStep] = useState(0);
  const cur = METHODS.find((x) => x.id === m)!;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStep(0);
    const t = setInterval(() => setStep((s) => (s + 1) % cur.steps.length), 2600);
    return () => clearInterval(t);
  }, [m, cur.steps.length]);

  const g = ar ? "جم" : "g";
  const ml = ar ? "مل" : "ml";
  const qty = m === "turkish"
    ? [`${8 * cups} ${g} ${ar ? "بن" : "coffee"}`, `${80 * cups} ${ml} ${ar ? "ماء" : "water"}`]
    : m === "flavored"
      ? [`${10 * cups} ${g} ${ar ? "قهوة" : "coffee"}`, `${80 * cups} ${ml} ${ar ? "حليب" : "milk"}`, `${40 * cups} ${ml} ${ar ? "ماء" : "water"}`]
      : [`18 ${g} ${ar ? "بن" : "coffee"}`, `36 ${g} ${ar ? "مشروب (1:2)" : "in the cup (1:2)"}`];
  const steps = ar ? cur.steps : cur.stepsEn;

  return (
    <section id="brew" className="bg-sand-deep/40 py-24" aria-labelledby="brew-h">
      <div className="wrap">
        <p className="font-latin text-sm tracking-[0.3em] text-carnelian">{ar ? "طقس التحضير" : "THE BREWING RITUAL"}</p>
        <Reveal>
          <h2 id="brew-h" className="font-serif text-4xl font-bold text-green">{ar ? "حضّرها على ذوقك" : "Brew it your way"}</h2>
        </Reveal>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/diwan/photo/table-kanaka-v60.webp" alt={ar ? "ركوة نحاسية وV60 وفنجان على طاولة رخامية" : "A copper cezve, a V60 and a cup on a marble table"} loading="lazy" className="mt-6 h-44 w-full rounded-[14px] object-cover object-[50%_60%] md:h-64" />

        <div role="tablist" className="mt-6 flex gap-2">
          {METHODS.map((x) => (
            <button key={x.id} role="tab" aria-selected={m === x.id} onClick={() => setM(x.id)}
              className={`rounded-[10px] border px-5 py-2 font-semibold ${m === x.id ? "border-green bg-green text-sand" : "border-green/40 text-green"}`}>
              {x.label[lang]}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <ol className="space-y-3">
            {steps.map((s, i) => (
              <li key={s} className={`flex items-center gap-4 rounded-[14px] border p-4 transition ${i === step ? "border-carnelian bg-sand shadow-md" : "border-n200 bg-sand/60"}`}>
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-bold ${i === step ? "bg-carnelian text-sand" : "bg-green text-sand"}`}><bdi>{i + 1}</bdi></span>
                <span className="flex-1">{s}</span>
                {m === "turkish" && i === 3 && <Flame on={i === step} />}
              </li>
            ))}
          </ol>

          <div className="space-y-5">
            {m === "espresso" ? (
              <ShotTimer />
            ) : (
              <div className="rounded-[14px] bg-green p-6 text-sand">
                <label className="flex items-center justify-between text-sm font-semibold">
                  {ar ? "عدد الفناجين" : "Number of cups"}
                  <bdi className="font-latin text-3xl">{cups}</bdi>
                </label>
                <input type="range" min={1} max={6} value={cups} onChange={(e) => setCups(+e.target.value)} className="mt-2 w-full accent-[#CDA76C]" aria-label={ar ? "عدد الفناجين" : "Number of cups"} />
                {m === "flavored" && (
                  <div className="mt-5">
                    <div className="flex h-8 overflow-hidden rounded-[6px] text-xs font-semibold" role="img" aria-label={ar ? "ثلثان حليب وثلث ماء" : "Two thirds milk, one third water"}>
                      <div className="grid place-items-center bg-sand text-green" style={{ width: "66.6%" }}>{ar ? "حليب" : "Milk"} · ⅔</div>
                      <div className="grid place-items-center bg-gold text-ink" style={{ width: "33.4%" }}>{ar ? "ماء" : "Water"} · ⅓</div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <ul className="grid grid-cols-2 gap-3">
              {qty.map((q) => (
                <li key={q} className="rounded-[10px] border border-green/30 bg-sand p-3 text-center font-semibold text-green"><bdi>{q}</bdi></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

