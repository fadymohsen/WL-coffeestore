"use client";

import { useCallback, useState } from "react";
import type { Product } from "@/data/products";
import Unboxing from "./Unboxing";
import Brewing from "./Brewing";
import { Showroom, Configurator } from "./Showroom";
import { Story, Behind, Roadmap } from "./Sections";

/** The DIWAN brand material, shown below the POUR / PLAY scroll scene. */
export default function DiwanSections() {
  const [highlight, setHighlight] = useState<string[]>([]);
  const [open, setOpen] = useState<Product | null>(null);
  const close = useCallback(() => setOpen(null), []);
  return (
    <div className="diwan" dir="rtl" lang="ar">
      <Unboxing />
      <div className="arch-band" aria-hidden="true" />
      <Showroom highlight={highlight} onOpen={setOpen} />
      <Brewing />
      <Story onPick={setHighlight} />
      <Behind />
      <Roadmap />
      <Configurator product={open} onClose={close} />
    </div>
  );
}
