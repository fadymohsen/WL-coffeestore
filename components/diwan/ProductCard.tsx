"use client";

import { useEffect, useState } from "react";
import { CATEGORY_META, ROAST_EN, SLOGAN, SPICE_EN, type Product, type Roast, type Spice } from "@/data/products";
import { useLangStore } from "@/lib/i18n";
import CardArt from "./CardArt";

const DARK = new Set(["ons", "zad", "tayf", "layl", "chocolate"]);

function logoFor(id: string) {
  if (id === "fransawy") return "/assets/diwan/Diwan_Logo_Colour_tight.png";
  if (DARK.has(id)) return "/assets/diwan/Diwan_Logo_Reverse_tight.png";
  return "/assets/diwan/Diwan_Logo_Mono_Sand_tight.png";
}

function Box({ checked, label, color }: { checked: boolean; label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1" style={{ fontSize: "3.6cqw" }}>
      <span
        className="inline-grid place-items-center border"
        style={{ width: "4.4cqw", height: "4.4cqw", borderColor: color, color, borderRadius: 2, lineHeight: 1 }}
      >
        {checked ? "✓" : ""}
      </span>
      {label}
    </span>
  );
}

export default function ProductCard({
  product,
  roast,
  spice,
  flipped,
  onFlip,
  onOpen,
}: {
  product: Product;
  roast?: Roast;
  spice?: Spice;
  flipped?: boolean;
  onFlip?: (v: boolean) => void;
  onOpen?: () => void;
}) {
  const lang = useLangStore((s) => s.lang);
  const ar = lang === "ar";
  const [inner, setInner] = useState(false);
  const isFlipped = flipped ?? inner;
  const flip = (v: boolean) => (onFlip ? onFlip(v) : setInner(v));
  const [note, setNote] = useState("");
  const key = `diwan-note-${product.id}`;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNote(localStorage.getItem(key) ?? "");
  }, [key]);

  const dark = product.id !== "fransawy";
  const fg = dark ? "#F4ECDC" : "#563326";
  const stripFg = product.id === "fransawy" ? "#563326" : "#16211E";
  const accentRule = product.hex === "#A8432C" ? "#F4ECDC" : "#A8432C";

  return (
    <div className="flip-scene aspect-[3/4] w-full" style={{ containerType: "inline-size" }}>
      <div className={`flip-inner ${isFlipped ? "is-flipped" : ""}`}>
        {/* FRONT — الوش */}
        <div className="flip-face flex flex-col shadow-[0_8px_24px_rgba(22,33,30,.18)]" style={{ background: "#F4ECDC", border: product.id === "fransawy" ? "1px solid #E4D9C3" : undefined }}>
          <div className="relative" style={{ height: "75%", background: product.hex, color: fg }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoFor(product.id)} alt={ar ? "ديوان" : "DIWAN"} className="absolute" style={{ top: "6cqw", insetInlineStart: "6cqw", width: "11cqw" }} />
            <div className="absolute" style={{ insetInlineStart: "7cqw", bottom: "8cqw" }}>
              <h3 className="font-serif font-bold leading-none" style={{ fontSize: "17cqw" }}>{ar ? product.name : product.nameEn}</h3>
              <p className="mt-2 font-medium opacity-90" style={{ fontSize: "4.4cqw" }}>{CATEGORY_META[product.categoryId].label[lang]}</p>
            </div>
            <div className="absolute" style={{ insetInlineEnd: "5cqw", top: "14cqw", width: "46cqw", height: "52cqw" }}>
              <CardArt kind={product.illustration} color={product.art} />
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-center gap-1 px-[6cqw]" style={{ color: stripFg }}>
            <div className="flex items-center justify-between font-semibold" style={{ fontSize: "4.4cqw" }}>
              <bdi>{ar ? product.weight : product.weightEn}</bdi>
              {product.roasts && (
                <span className="flex gap-2">
                  {(["فاتح", "وسط", "غامق"] as Roast[]).map((r) =>
                    product.roasts!.includes(r) ? <Box key={r} label={ar ? r : ROAST_EN[r]} checked={roast === r} color={stripFg} /> : null,
                  )}
                </span>
              )}
              {product.ratio && <bdi className="font-medium">{ar ? product.ratio.label : product.ratio.labelEn}</bdi>}
              {product.type && <span className="font-medium" style={{ fontSize: "3.8cqw" }}>{ar ? product.type : product.typeEn}</span>}
            </div>
            {product.roasts && (
              <div className="flex gap-3">
                {(["سادة", "محوج"] as Spice[]).map((s) => <Box key={s} label={ar ? s : SPICE_EN[s]} checked={spice === s} color={stripFg} />)}
              </div>
            )}
          </div>
          {/* actions */}
          <div className="absolute bottom-2 start-2 flex gap-2">
            {onOpen && <button type="button" onClick={onOpen} className="rounded-[6px] bg-green px-3 py-1 text-xs font-semibold text-sand">{ar ? "عرض" : "Choose"}</button>}
            <button type="button" onClick={() => flip(true)} className="rounded-[6px] border border-green/60 bg-sand/90 px-3 py-1 text-xs font-semibold text-green">{ar ? "طريقة التحضير" : "How to brew"}</button>
          </div>
        </div>

        {/* BACK — الظهر */}
        <div className="flip-back flip-face flex" style={{ background: "#F4ECDC", border: "1px solid #E4D9C3", color: "#16211E" }}>
          <div style={{ width: "4cqw", background: product.hex }} aria-hidden="true" />
          <div className="flex flex-1 flex-col" style={{ padding: "5cqw" }}>
            <h4 className="font-serif font-bold text-green" style={{ fontSize: "7cqw" }}>{ar ? "حضّرها على ذوقك" : "Brew it your way"}</h4>
            <p className="font-medium opacity-70" style={{ fontSize: "3.6cqw" }}>{CATEGORY_META[product.categoryId].label[lang]} · {ar ? product.name : product.nameEn}</p>
            <ol className="mt-2 flex flex-1 flex-col justify-around">
              {(ar ? product.steps : product.stepsEn).map((s, i) => (
                <li key={i} className="flex items-start gap-2" style={{ fontSize: "3.8cqw" }}>
                  <span className="grid shrink-0 place-items-center rounded-full font-bold" style={{ width: "6cqw", height: "6cqw", background: product.hex, color: fg, fontSize: "3.4cqw" }}>
                    <bdi>{i + 1}</bdi>
                  </span>
                  <span className="leading-snug">{s}</span>
                  {i < product.steps.length - 1 && <span className="sr-only">{ar ? "ثم" : "then"}</span>}
                </li>
              ))}
            </ol>
            {product.note && <p className="italic" style={{ fontSize: "3.2cqw", color: accentRule }}>({ar ? product.note : product.noteEn})</p>}
            <label className="mt-1 flex items-end gap-2" style={{ fontSize: "3.6cqw" }}>
              <span className="font-semibold">{ar ? "ملاحظاتك:" : "Your notes:"}</span>
              <input
                value={note}
                onChange={(e) => { setNote(e.target.value); localStorage.setItem(key, e.target.value); }}
                className="min-w-0 flex-1 border-b border-ink/40 bg-transparent outline-none"
                aria-label={ar ? "ملاحظاتك" : "Your notes"}
              />
            </label>
            <div className="mt-2 flex items-center justify-between" style={{ fontSize: "3cqw" }}>
              <span className="font-serif" style={{ color: "#A8432C" }}>{SLOGAN[lang]}</span>
              <bdi>@diwan_eg</bdi>
              <button type="button" onClick={() => flip(false)} className="rounded-[6px] border border-green/60 px-2 py-0.5 font-semibold text-green">{ar ? "الوش" : "Front"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

