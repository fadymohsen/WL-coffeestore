"use client";

import Unboxing from "./Unboxing";
import Brewing from "./Brewing";
import { Featured } from "./Featured";
import { Story, Behind, Roadmap } from "./Sections";

/** The DIWAN brand material, shown below the POUR / PLAY scroll scene. */
export default function DiwanSections() {
  return (
    <div className="diwan">
      <Featured />
      <Unboxing />
      <div className="arch-band" aria-hidden="true" />
      <Brewing />
      <Story />
      <Behind />
      <Roadmap />
    </div>
  );
}
