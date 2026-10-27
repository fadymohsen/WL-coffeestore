# POUR / PLAY — A-to-Z Frontend Engineering & Scrollytelling Implementation Plan

This engineering specification details the complete production architecture required to transform `gemini_generated_video_93485268.mp4` into the interactive, award-winning **POUR / PLAY** artisanal coffee scrollytelling web application inspired by the [enkywebstudio Instagram Reel](https://www.instagram.com/reel/DeAP-bpsvy3/), built on the [Next.js App Router](https://nextjs.org/docs/app/getting-started) (`v15+`).

---

## 1. Source Video Technical Telemetry & Beat Map

Before writing any frontend code, the scroll timeline must be calibrated to the exact physical frames and lighting colors of your uploaded source video (`gemini_generated_video_93485268.mp4`).

### 1.1 Inspected Video Stream Specifications
| Parameter | Inspected Value | Production Engineering Implication |
| :--- | :--- | :--- |
| **Source File** | `gemini_generated_video_93485268.mp4` | Raw input for the FFmpeg dual-delivery pipeline |
| **Native Resolution** | `1280 × 720` (`16:9` widescreen) | Fits desktop viewports natively; requires center-subject scaling on portrait mobile |
| **Frame Rate (`r_frame_rate`)** | `24 fps` (`24/1`) | Every `1.0s` of video equals exactly `24` discrete frames |
| **Duration** | `10.000000 seconds` | Total timeline duration mapped across `500vh` of scroll distance |
| **Exact Frame Count (`nb_frames`)** | `240 frames` (`000` to `239`) | Ideal count for zero-latency `<canvas>` `.webp` preloading (`~14 MB` total) |
| **Sampled Background Palette** | `#E9DCC7` (Sunlit Cream) → `#C9B294` (Shadowed Sand) | Base CSS page background (`#E9DCC7`) matches the video's sunlit backdrop |

### 1.2 Frame-by-Frame Scroll Beat Map (`240` Frames Across `500vh`)
Every scroll percentage (`0.00` to `1.00`) maps deterministically to a specific frame index and mechanical action inside the video:

| Scroll Progress | Video Time | Frame Range | Visual Action in `gemini_generated_video_93485268.mp4` | Synchronized Next.js UI & Typography Action |
| :--- | :--- | :--- | :--- | :--- |
| **`0.00 – 0.22`** | `0.0s – 2.2s` | `000 – 053` | Glossy roasted Arabica beans pour into the conical glass hopper above the matte-black grinder and silver dial. | Giant split display headline **`GRIND`** (left) and **`PLAY`** (right) sits behind the hopper; left editorial paragraph and **`SHOP NOW`** pill button are interactive. |
| **`0.22 – 0.45`** | `2.2s – 4.5s` | `054 – 108` | The matte-black cylindrical grinder housing splits open horizontally (exploded view), showering fine dark coffee grounds downward. | `GRIND / PLAY` translates upward (`y: -140px, opacity: 0`); kinetic background typography **`Wuourg`** / **`GRIND`** tracks horizontally as grounds fall through the center. |
| **`0.45 – 0.55`** | `4.5s – 5.5s` | `109 – 132` | Camera tracks down as the falling coffee grounds land inside the spiral-ribbed glass Hario V60 cone; terracotta pitcher enters on the bottom-left. | Chapter `02` header **`POUR`** (in dark espresso `#3B2112`) and **`Ritual`** (in warm terracotta `#C29576`) slide in from the left column. |
| **`0.55 – 0.75`** | `5.5s – 7.5s` | `133 – 180` | Polished stainless-steel gooseneck kettle enters from top-right, pouring a steady arc of hot water into the V60 cone as golden coffee drips below. | `POUR` specs badge (`93°C · 1:16 Ratio · 2m 45s`) fades in; interactive recipe trigger appears below the headline. |
| **`0.75 – 0.86`** | `7.5s – 8.6s` | `181 – 206` | A glossy dark-espresso liquid wave with golden crema surges across the full width of the frame, wiping the V60 view and revealing the steaming ceramic mug behind it. | Dual-masked **`SIP` / `SIP`** typography triggers: solid dark `#3B2112` `SIP` above the wave crest and outlined cream `#E9DCC7` `SIP` submerged inside the dark coffee wave. |
| **`0.86 – 1.00`** | `8.6s – 10.0s` | `207 – 239` | The espresso wave recedes completely, settling on the centered two-tone stoneware ceramic mug (wavy white top glaze over speckled clay base) with rising steam. | Centered **`FIND YOUR CUP`** display header and `CLAIM NOW` button reveal at top; three 3D tilt product cards (**`ORIGIN`**, **`ROAST`**, **`FLAVOR`**) float into orbit around the mug. |

---

## 2. Production Tech Stack & Dependencies

| Layer | Package / Tool | Role in Architecture |
| :--- | :--- | :--- |
| **Core Framework** | [Next.js](https://nextjs.org/) (`15.x` App Router, TypeScript) | Server/Client component architecture, font optimization (`next/font/google`), static asset serving |
| **Styling System** | [Tailwind CSS](https://tailwindcss.com/) (`v4` / `v3.4`) | Responsive grid, sticky viewport pinning, glassmorphism (`backdrop-blur`), custom color tokens |
| **Scroll Choreography** | [GSAP](https://gsap.com/docs/v3/) + [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) + `@gsap/react` | Scrubbing the 240-frame playhead (`scrub: 0.35`) and orchestrating multi-stage timeline transitions |
| **Smooth Scroll Engine** | [Lenis](https://lenis.dev/) ([GitHub](https://github.com/darkroomengineering/lenis)) | Sub-pixel scroll inertia coupled directly to `gsap.ticker` so frame scrubbing never stutters |
| **Micro-Interactions** | [Motion for React](https://motion.dev/docs/react) | Spring-driven 3D mouse-tilt physics (`useMotionValue`, `useSpring`) on the floating product cards |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) | Lightweight global state for the Tasting Bag drawer, wishlist hearts, and active scroll stage |
| **Icons** | [Lucide React](https://lucide.dev/) | Crisp minimalist stroke icons (`ShoppingBag`, `Search`, `Heart`, `ArrowRight`, `Compass`) |

---

## 3. Phase 1: Video Asset Processing & Frame Extraction Pipeline

Standard `.mp4` files use inter-frame compression (P-frames and B-frames), which causes severe decoding lag on Safari and mobile browsers when scrubbing backward. To achieve **instant 60fps bi-directional scrubbing**, extract the `240` frames into optimized `.webp` images and generate a fallback keyframe-only `.mp4`.

### 3.1 Automated Shell Pipeline (`scripts/prepare-video-assets.sh`)
Create and run this script from your project root before starting the Next.js server:

```bash
#!/usr/bin/env bash
set -euo pipefail

INPUT_VIDEO="gemini_generated_video_93485268.mp4"
FRAMES_DIR="public/frames"
VIDEO_DIR="public/video"

mkdir -p "$FRAMES_DIR" "$VIDEO_DIR"

echo "1/3 Extracting 240 WebP frames (1280x720, quality 82) for HTML5 Canvas scrubbing..."
ffmpeg -y -i "$INPUT_VIDEO" \
  -vf "fps=24,scale=1280:720:flags=lanczos" \
  -vcodec libwebp \
  -lossless 0 \
  -compression_level 6 \
  -q:v 82 \
  "$FRAMES_DIR/frame_%04d.webp"

echo "2/3 Generating ultra-light mobile WebP frames (720p center-cropped or 960x540)..."
mkdir -p "$FRAMES_DIR/mobile"
ffmpeg -y -i "$INPUT_VIDEO" \
  -vf "fps=24,scale=960:540:flags=lanczos" \
  -vcodec libwebp \
  -lossless 0 \
  -compression_level 6 \
  -q:v 78 \
  "$FRAMES_DIR/mobile/frame_%04d.webp"

echo "3/3 Generating all-intra keyframe MP4 (-g 1) as fallback video stream..."
ffmpeg -y -i "$INPUT_VIDEO" \
  -vf "scale=1280:720" \
  -movflags +faststart \
  -vcodec libx264 \
  -pix_fmt yuv420p \
  -profile:v main \
  -crf 20 \
  -g 1 \
  -an \
  "$VIDEO_DIR/pour-play-scrub.mp4"

echo "Done! Generated $(ls -1 "$FRAMES_DIR"/*.webp | wc -l) desktop frames and $(ls -1 "$FRAMES_DIR/mobile"/*.webp | wc -l) mobile frames."
```

---

## 4. Phase 2: Next.js Project Structure & Design System Setup

### 4.1 Directory Architecture
```text
pour-play/
├── public/
│   ├── frames/
│   │   ├── frame_0001.webp ... frame_0240.webp
│   │   └── mobile/
│   │       └── frame_0001.webp ... frame_0240.webp
│   ├── products/
│   │   ├── pouch-origin.png
│   │   ├── pouch-roast.png
│   │   └── pouch-flavor.png
│   └── video/
│       └── pour-play-scrub.mp4
├── scripts/
│   └── prepare-video-assets.sh
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── HeaderNav.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   └── StageCompassHUD.tsx
│   │   ├── providers/
│   │   │   └── SmoothScrollProvider.tsx
│   │   ├── scrollytelling/
│   │   │   ├── PourPlayMasterScene.tsx
│   │   │   ├── ScrollVideoCanvas.tsx
│   │   │   ├── Stage1GrindHero.tsx
│   │   │   ├── Stage2PourRitual.tsx
│   │   │   ├── Stage3SipWave.tsx
│   │   │   └── Stage4FindYourCup.tsx
│   │   └── ui/
│   │       └── TiltProductCard.tsx
│   ├── data/
│   │   └── products.ts
│   └── store/
│       └── useShopStore.ts
├── package.json
└── tailwind.config.ts
```

### 4.2 Installation Command
```bash
npx create-next-app@latest pour-play --typescript --tailwind --eslint --app --src-dir
cd pour-play
npm install gsap @gsap/react lenis motion zustand lucide-react clsx tailwind-merge
```

### 4.3 Typography & Color Tokens (`src/app/layout.tsx` & `src/app/globals.css`)
Load **`Fraunces`** (variable high-contrast vintage serif that matches the thick-thin strokes of `GRIND PLAY`, `POUR`, `SIP`, and `FIND YOUR CUP`) alongside **`Plus Jakarta Sans`** for clean geometric UI labels:

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-editorial",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "POUR / PLAY — Artisanal Coffee Extraction",
  description: "Interactive scrollytelling experience from whole roasted bean to ceramic cup.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jakarta.variable}`}>
      <body className="bg-[#E9DCC7] text-[#2A1E17] font-sans antialiased selection:bg-[#3B2112] selection:text-[#E9DCC7] overflow-x-hidden">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
```

### 4.4 Seamless Video-to-Page Blending (`src/app/globals.css`)
Because `gemini_generated_video_93485268.mp4` already features warm dappled sunlight and leaf shadows on a `#E9DCC7` / `#DBC8AD` backdrop, applying a radial vignette mask around the `<canvas>` merges the video edges invisibly into the `#E9DCC7` HTML background—while allowed CSS blend modes (`mix-blend-multiply`) let the dark coffee grinder and V60 glass composite directly over background typography:

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-cream: #E9DCC7;
  --bg-sand: #DBC8AD;
  --ink-espresso: #2A1E17;
  --ink-roast: #3B2112;
  --accent-terracotta: #B8866B;
  --accent-clay: #A86448;
}

.font-editorial {
  font-family: var(--font-editorial), Georgia, serif;
  font-feature-settings: "liga" 1, "swsh" 1;
}

/* Feathered edge mask so the 16:9 video canvas blends seamlessly into ultrawide screens */
.video-canvas-mask {
  -webkit-mask-image: radial-gradient(
    ellipse 88% 86% at 50% 50%,
    #000000 68%,
    rgba(0, 0, 0, 0.85) 82%,
    transparent 100%
  );
  mask-image: radial-gradient(
    ellipse 88% 86% at 50% 50%,
    #000000 68%,
    rgba(0, 0, 0, 0.85) 82%,
    transparent 100%
  );
}

/* Outlined editorial display text for the submerged SIP wave section */
.text-stroke-cream {
  -webkit-text-stroke: 2px #F5EFE6;
  color: transparent;
}
```

---

## 5. Phase 3: Smooth Scroll & Frame-Scrubbing Canvas Engine

### 5.1 Coupled Lenis + GSAP Ticker Provider (`src/components/providers/SmoothScrollProvider.tsx`)
Connecting [Lenis](https://lenis.dev/) to the [GSAP](https://gsap.com/docs/v3/) ticker guarantees that scroll position updates and canvas frame redraws run inside the exact same `requestAnimationFrame` tick:

```tsx
// src/components/providers/SmoothScrollProvider.tsx
"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.075,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

### 5.2 High-DPI Priority Frame Preloader & Scrubber (`src/components/scrollytelling/ScrollVideoCanvas.tsx`)
Instead of waiting for all `240` frames to download before rendering, this component uses **Two-Stage Priority Preloading**:
1. **Immediate Boot (Frames `0001` to `0040`)**: Loads the first `1.6 seconds` of the grinder animation immediately so the hero screen is interactive in under `400ms`.
2. **Background Streaming (Frames `0041` to `0240`)**: Streams the remaining frames in the background while the user inspects the hero section.
3. **Cover/Contain Smart Scaling**: Draws the `1280×720` frame centered on the viewport using `devicePixelRatio` scaling so the grinder, V60 cone, and ceramic mug stay razor-sharp on Retina/4K MacBook Pro displays.

```tsx
// src/components/scrollytelling/ScrollVideoCanvas.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollVideoCanvasProps {
  frameIndex: number; // Float from 0 to 239 driven by GSAP ScrollTrigger
  totalFrames?: number;
  onInitialLoadComplete?: () => void;
}

export default function ScrollVideoCanvas({
  frameIndex,
  totalFrames = 240,
  onInitialLoadComplete,
}: ScrollVideoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);

  // 1. Preload all 240 WebP frames with priority on the first 40 hero frames
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const basePath = isMobile ? "/frames/mobile" : "/frames";
    const images: HTMLImageElement[] = new Array(totalFrames);
    let count = 0;

    const loadFrame = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        const padded = String(index + 1).padStart(4, "0");
        img.src = `${basePath}/frame_${padded}.webp`;
        img.onload = () => {
          images[index] = img;
          count += 1;
          setLoadedCount(count);
          if (count === 40 && onInitialLoadComplete) {
            onInitialLoadComplete();
          }
          resolve();
        };
        img.onerror = () => resolve();
      });
    };

    // Priority batch: frames 0..39 first, then 40..239
    (async () => {
      const heroBatch = Array.from({ length: Math.min(40, totalFrames) }, (_, i) =>
        loadFrame(i)
      );
      await Promise.all(heroBatch);

      for (let i = 40; i < totalFrames; i += 10) {
        const chunk = Array.from(
          { length: Math.min(10, totalFrames - i) },
          (_, k) => loadFrame(i + k)
        );
        await Promise.all(chunk);
      }
    })();

    imagesRef.current = images;
  }, [totalFrames, onInitialLoadComplete]);

  // 2. Draw the exact active frame whenever frameIndex or window size changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const render = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      if (canvas.width !== vw * dpr || canvas.height !== vh * dpr) {
        canvas.width = vw * dpr;
        canvas.height = vh * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Fill seamless sunlit cream base color sampled from gemini_generated_video_93485268.mp4
      ctx.fillStyle = "#E9DCC7";
      ctx.fillRect(0, 0, vw, vh);

      const clampedIndex = Math.min(
        totalFrames - 1,
        Math.max(0, Math.round(frameIndex))
      );
      const img = imagesRef.current[clampedIndex] || imagesRef.current[0];

      if (img && img.complete && img.naturalWidth > 0) {
        const imgAspect = img.naturalWidth / img.naturalHeight; // 1280 / 720 = 1.777
        const viewAspect = vw / vh;

        let drawW = vw;
        let drawH = vh;
        let offsetX = 0;
        let offsetY = 0;

        // Cover viewport while keeping central coffee apparatus centered
        if (viewAspect > imgAspect) {
          drawW = vw;
          drawH = vw / imgAspect;
          offsetY = (vh - drawH) * 0.5;
        } else {
          drawH = vh;
          drawW = vh * imgAspect;
          offsetX = (vw - drawW) * 0.5;
        }

        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
      }

      ctx.restore();
    };

    render();
    window.addEventListener("resize", render);
    return () => window.removeEventListener("resize", render);
  }, [frameIndex, totalFrames, loadedCount]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#E9DCC7]">
      <canvas
        ref={canvasRef}
        className="w-full h-full block video-canvas-mask"
      />
    </div>
  );
}
```

---

## 6. Phase 4: The Z-Index Sandwich & Editorial Typography Illusion

In the [enkywebstudio Instagram Reel](https://www.instagram.com/reel/DeAP-bpsvy3/), the giant serif words **`GRIND PLAY`** and **`POUR`** appear tucked *behind* the dark coffee grinder and glass V60 cone, even though our uploaded video (`gemini_generated_video_93485268.mp4`) has an opaque `#E9DCC7` cream background.

### How to Achieve the "Text Behind the Video Subject" Illusion Without Alpha Channel
You have two production ways to achieve this in Next.js:
1. **Zero-Effort CSS Blend Mode (`mix-blend-mode: multiply` / `darken`)**:
   Because the background of `gemini_generated_video_93485268.mp4` is light sunlit cream (`#E9DCC7`) and the coffee grinder, roasted beans, and coffee grounds are dark espresso/charcoal (`#1D1917`), placing the `<canvas>` at `z-10` with `mix-blend-mode: multiply` (or placing the typography at `z-10` with `mix-blend-mode: color-burn` / `multiply`) causes the dark coffee grinder and falling beans to **visually occlude** the warm terracotta/brown typography, while the cream background lets the typography shine right through!
2. **Optional Rembg / Matting Alpha Pass (For 100% Opaque White Highlights)**:
   If you want the glossy white glare on the glass hopper and white glaze on the ceramic mug to sit 100% opaquely over the background text, run `rembg` or Runway Green Screen once on the video to output transparent `.webp` frames, and place:
   * **Layer 0 (`z-0`)**: Sunlit cream background + Giant `Fraunces` headlines (`GRIND PLAY`, `POUR`, `SIP`).
   * **Layer 1 (`z-10`, `pointer-events-none`)**: Transparent `<ScrollVideoCanvas />`.
   * **Layer 2 (`z-20`)**: Interactive buttons (`SHOP NOW`), Navigation Bar, and 3D Floating Product Cards.

---

## 7. Phase 5: Master GSAP Timeline & All 4 Scrollytelling Sections

### 7.1 Product Catalog & Zustand Store (`src/store/useShopStore.ts`)
```tsx
// src/store/useShopStore.ts
import { create } from "zustand";

export interface CoffeeProduct {
  id: string;
  category: "ORIGIN" | "ROAST" | "FLAVOR";
  title: string;
  region: string;
  tastingNotes: string[];
  price: number;
  weight: string;
  bagColor: string;
  accentColor: string;
}

export const COFFEE_CATALOG: CoffeeProduct[] = [
  {
    id: "origin-ethiopia",
    category: "ORIGIN",
    title: "Halo Beriti",
    region: "Yirgacheffe · 2,150m",
    tastingNotes: ["Bergamot", "Jasmine", "Peach"],
    price: 26,
    weight: "250g",
    bagColor: "#8FA9B3",
    accentColor: "#2F4852",
  },
  {
    id: "roast-colombia",
    category: "ROAST",
    title: "Pink Bourbon",
    region: "Huila · Small Lot",
    tastingNotes: ["Panela", "Blood Orange", "Praline"],
    price: 29,
    weight: "250g",
    bagColor: "#C87D64",
    accentColor: "#6E3523",
  },
  {
    id: "flavor-kenya",
    category: "FLAVOR",
    title: "Gatomboya AA",
    region: "Nyeri · Washed SL28",
    tastingNotes: ["Blackcurrant", "Hibiscus", "Cacao"],
    price: 32,
    weight: "250g",
    bagColor: "#D8C5AE",
    accentColor: "#5C4735",
  },
];

interface ShopState {
  cart: Record<string, number>;
  wishlist: Record<string, boolean>;
  isCartOpen: boolean;
  activeFilter: "ALL" | "ORIGIN" | "ROAST" | "FLAVOR";
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  toggleWishlist: (id: string) => void;
  setCartOpen: (open: boolean) => void;
  setActiveFilter: (filter: "ALL" | "ORIGIN" | "ROAST" | "FLAVOR") => void;
}

export const useShopStore = create<ShopState>((set) => ({
  cart: { "origin-ethiopia": 1 },
  wishlist: { "roast-colombia": true },
  isCartOpen: false,
  activeFilter: "ALL",
  addToCart: (id) =>
    set((s) => ({ cart: { ...s.cart, [id]: (s.cart[id] || 0) + 1 } })),
  removeFromCart: (id) =>
    set((s) => {
      const next = { ...s.cart };
      if ((next[id] || 0) <= 1) delete next[id];
      else next[id] -= 1;
      return { cart: next };
    }),
  toggleWishlist: (id) =>
    set((s) => ({ wishlist: { ...s.wishlist, [id]: !s.wishlist[id] } })),
  setCartOpen: (open) => set({ isCartOpen: open }),
  setActiveFilter: (filter) => set({ activeFilter: filter }),
}));
```

### 7.2 3D Mouse-Tilt Floating Product Card (`src/components/ui/TiltProductCard.tsx`)
At `0:08–0:09` in the Instagram Reel, three tactile cards (`ORIGIN`, `ROAST`, `FLAVOR`) float around the central ceramic cup with subtle 3D rotation and dual pill buttons:

```tsx
// src/components/ui/TiltProductCard.tsx
"use client";

import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Heart, Plus } from "lucide-react";
import { CoffeeProduct, useShopStore } from "@/store/useShopStore";

interface TiltProductCardProps {
  product: CoffeeProduct;
  defaultRotation: number;
  className?: string;
}

export default function TiltProductCard({
  product,
  defaultRotation,
  className = "",
}: TiltProductCardProps) {
  const { cart, wishlist, addToCart, toggleWishlist, setCartOpen } = useShopStore();
  const isLiked = !!wishlist[product.id];
  const qty = cart[product.id] || 0;

  // 3D Tilt Physics on Mouse Move
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 220, damping: 22 });
  const smoothY = useSpring(y, { stiffness: 220, damping: 22 });

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [9, -9]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-9, 9]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        rotateZ: defaultRotation,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.03, rotateZ: 0 }}
      className={`w-64 sm:w-72 rounded-2xl bg-[#F6EFE2]/90 backdrop-blur-md p-4 border border-[#2A1E17]/12 shadow-[0_24px_48px_-12px_rgba(42,30,23,0.18)] select-none ${className}`}
    >
      {/* Top Category Tag & Wishlist Heart */}
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#5C4332]">
          {product.category}
        </span>
        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label={`Save ${product.title}`}
          className="p-1.5 rounded-full hover:bg-[#2A1E17]/10 transition"
        >
          <Heart
            className={`w-3.5 h-3.5 transition ${
              isLiked ? "fill-[#B85032] text-[#B85032]" : "text-[#2A1E17]/50"
            }`}
          />
        </button>
      </div>

      {/* 3D Coffee Pouch Showcase Box */}
      <div className="relative h-28 rounded-xl bg-[#E5D7C3]/75 flex items-center justify-center mb-3 overflow-hidden">
        <div
          className="w-16 h-22 rounded-lg shadow-lg flex flex-col items-center justify-between p-2 border border-white/30 transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundColor: product.bagColor }}
        >
          <div className="w-full h-1 bg-black/15 rounded-full" />
          <div className="bg-[#FAF6F0] px-1.5 py-1 rounded text-[7px] font-bold tracking-wider uppercase text-[#2A1E17] text-center shadow-xs">
            POUR/PLAY
            <div className="text-[5px] font-normal opacity-70">{product.category}</div>
          </div>
          <span className="text-[7px] font-semibold text-white/90">{product.weight}</span>
        </div>
        <span className="absolute bottom-2 right-2.5 px-2 py-0.5 rounded-full bg-[#2A1E17]/85 text-[#E9DCC7] text-[10px] font-bold">
          ${product.price}
        </span>
      </div>

      {/* Title & Region */}
      <h3 className="font-editorial text-lg text-[#2A1E17] leading-tight">
        {product.title}
      </h3>
      <p className="text-[11px] text-[#6E5644] mb-2">{product.region}</p>

      {/* Tasting Note Pills */}
      <div className="flex flex-wrap gap-1 mb-3.5">
        {product.tastingNotes.map((note) => (
          <span
            key={note}
            className="px-2 py-0.5 rounded-md bg-[#2A1E17]/8 text-[10px] font-medium text-[#3B2112]"
          >
            {note}
          </span>
        ))}
      </div>

      {/* Dual Action Pill Buttons matching 0:09 in the Reel */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => addToCart(product.id)}
          className="flex-1 py-2 px-3 rounded-full bg-[#2A1E17] text-[#E9DCC7] text-[11px] font-semibold hover:bg-[#3E2A1E] transition flex items-center justify-center gap-1"
        >
          <Plus className="w-3 h-3" />
          <span>{qty > 0 ? `In Bag (${qty})` : "Buy Now"}</span>
        </button>
        <button
          onClick={() => setCartOpen(true)}
          className="py-2 px-3 rounded-full border border-[#2A1E17]/25 text-[11px] font-semibold text-[#2A1E17] hover:bg-[#2A1E17]/10 transition"
        >
          View Bag
        </button>
      </div>
    </motion.div>
  );
}
```

### 7.3 Master Scrollytelling Orchestrator (`src/components/scrollytelling/PourPlayMasterScene.tsx`)
This component binds a single `550vh` scroll container (`#scroll-stage`) to both the `240` frames of `gemini_generated_video_93485268.mp4` and the 4 choreographed HTML UI overlays so the typography never drifts out of sync with the video physics:

```tsx
// src/components/scrollytelling/PourPlayMasterScene.tsx
"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Compass, RotateCcw } from "lucide-react";
import ScrollVideoCanvas from "./ScrollVideoCanvas";
import TiltProductCard from "../ui/TiltProductCard";
import { COFFEE_CATALOG, useShopStore } from "@/store/useShopStore";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 240;

export default function PourPlayMasterScene() {
  const masterContainerRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [scrollFraction, setScrollFraction] = useState(0);

  // Refs for the 4 stage HTML overlay layers
  const stage1Ref = useRef<HTMLDivElement>(null);
  const stage2KineticRef = useRef<HTMLDivElement>(null);
  const stage2PourRef = useRef<HTMLDivElement>(null);
  const stage3SipRef = useRef<HTMLDivElement>(null);
  const stage4CupRef = useRef<HTMLDivElement>(null);

  const { activeFilter, setActiveFilter, setCartOpen } = useShopStore();

  useGSAP(
    () => {
      const playhead = { frame: 0 };

      // 1. Scrub the 240 video frames across the full 550vh container
      gsap.to(playhead, {
        frame: TOTAL_FRAMES - 1,
        ease: "none",
        scrollTrigger: {
          trigger: masterContainerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35, // Smooth 0.35s catch-up damping
          onUpdate: (self) => {
            setCurrentFrame(playhead.frame);
            setScrollFraction(self.progress);
          },
        },
      });

      // 2. Choreographed UI Timeline synced to the exact same scroll range
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: masterContainerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35,
        },
      });

      // --- 0.00 -> 0.20: Stage 1 ("GRIND PLAY") holds, then lifts & fades as grinder explodes ---
      tl.to(
        stage1Ref.current,
        { y: -130, opacity: 0, duration: 0.14, ease: "power2.in" },
        0.16
      );

      // --- 0.20 -> 0.42: Stage 2A Kinetic Exploded Burr Typography ("Wuourg / GRIND") ---
      tl.fromTo(
        stage2KineticRef.current,
        { y: 90, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.1, ease: "power2.out" },
        0.21
      ).to(
        stage2KineticRef.current,
        { y: -110, opacity: 0, duration: 0.1, ease: "power2.in" },
        0.38
      );

      // --- 0.44 -> 0.72: Stage 2B Gooseneck Kettle & V60 Pour-Over ("POUR") ---
      tl.fromTo(
        stage2PourRef.current,
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.1, ease: "power2.out" },
        0.44
      ).to(
        stage2PourRef.current,
        { y: -90, opacity: 0, duration: 0.08, ease: "power2.in" },
        0.68
      );

      // --- 0.72 -> 0.85: Stage 3 Rising Espresso Wave ("SIP / SIP") ---
      tl.fromTo(
        stage3SipRef.current,
        { y: 70, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.07, ease: "power2.out" },
        0.71
      ).to(
        stage3SipRef.current,
        { y: -80, opacity: 0, duration: 0.07, ease: "power2.in" },
        0.82
      );

      // --- 0.85 -> 1.00: Stage 4 Ceramic Mug Showcase ("FIND YOUR CUP" + Floating Cards) ---
      tl.fromTo(
        stage4CupRef.current,
        { y: 60, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.12, ease: "power3.out" },
        0.85
      );
    },
    { scope: masterContainerRef }
  );

  const scrollToFraction = (fraction: number) => {
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: maxScroll * fraction, behavior: "smooth" });
  };

  return (
    <div ref={masterContainerRef} className="relative h-[550vh] w-full">
      {/* LAYER 0: Sticky 240-Frame Canvas (gemini_generated_video_93485268.mp4) */}
      <ScrollVideoCanvas frameIndex={currentFrame} totalFrames={TOTAL_FRAMES} />

      {/* LAYER 1: Sticky Full-Viewport UI & Editorial Typography Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden z-10 pointer-events-none">
        {/* =======================================================
            STAGE 1 (Frames 000 - 053): GRIND PLAY HERO
        ======================================================= */}
        <div
          ref={stage1Ref}
          className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 max-w-7xl mx-auto"
        >
          <div className="flex items-center gap-3 text-[11px] md:text-xs uppercase tracking-[0.22em] text-[#5C4332] font-semibold mb-2">
            <span>POUR / PLAY</span>
            <span>•</span>
            <span>SINGLE ORIGIN EXTRACTION</span>
          </div>

          {/* Split Giant Serif Header Framing the Center Glass Hopper */}
          <div className="flex items-baseline justify-between w-full mix-blend-multiply">
            <h1 className="font-editorial text-[14vw] lg:text-[10.5rem] leading-[0.85] tracking-tight text-[#3B2112]">
              GRIND
            </h1>
            <h1 className="font-editorial text-[14vw] lg:text-[10.5rem] leading-[0.85] tracking-tight text-[#C29576]">
              PLAY
            </h1>
          </div>

          {/* Left Editorial Paragraph & Interactive SHOP NOW Pill */}
          <div className="mt-8 max-w-xs pointer-events-auto">
            <p className="text-xs md:text-sm text-[#4A372B] leading-relaxed mb-5">
              Precision-milled conical burrs engineered to preserve delicate
              floral aromatics from whole roasted bean to uniform extraction bed.
            </p>
            <button
              onClick={() => scrollToFraction(0.95)}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#2A1E17] text-[#E9DCC7] text-xs font-semibold uppercase tracking-widest hover:bg-[#3E2A1E] transition shadow-lg"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* =======================================================
            STAGE 2A (Frames 054 - 108): EXPLODED BURRS & GROUNDS SHOWER
        ======================================================= */}
        <div
          ref={stage2KineticRef}
          className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 max-w-7xl mx-auto opacity-0"
        >
          <div className="max-w-xs mb-6 pointer-events-auto">
            <p className="text-xs text-[#4A372B] leading-relaxed mb-4">
              Zero-retention vertical chute disperses grounds directly into your
              filter cone with micrometer consistency.
            </p>
            <button
              onClick={() => scrollToFraction(0.55)}
              className="px-5 py-2.5 rounded-full bg-[#2A1E17] text-[#E9DCC7] text-[11px] font-semibold uppercase tracking-widest"
            >
              Explore Burrs
            </button>
          </div>

          <h2 className="font-editorial text-[16vw] lg:text-[12rem] leading-[0.82] tracking-tight text-[#B8866B]/75 mix-blend-multiply select-none">
            Aroma
          </h2>
        </div>

        {/* =======================================================
            STAGE 2B (Frames 109 - 180): V60 POUR-OVER & GOOSENECK KETTLE
        ======================================================= */}
        <div
          ref={stage2PourRef}
          className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 max-w-7xl mx-auto opacity-0"
        >
          <div className="max-w-md">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#6E4F3A]">
              CHAPTER 02 · THERMAL BLOOM
            </span>
            <h2 className="font-editorial text-[13vw] lg:text-[8.5rem] leading-[0.86] text-[#3B2112] mt-1">
              POUR
            </h2>
            <div className="font-editorial text-[12vw] lg:text-[7.5rem] leading-[0.88] text-[#C89B7B]/75 -mt-2 mix-blend-multiply">
              Ritual
            </div>
            <p className="mt-4 text-xs md:text-sm text-[#4A372B] max-w-xs leading-relaxed">
              Spiral borosilicate ribs channel 93°C water through the blooming
              coffee bed for a clean, sweet extraction.
            </p>
          </div>
        </div>

        {/* =======================================================
            STAGE 3 (Frames 181 - 206): ESPRESSO WAVE WIPE ("SIP / SIP")
        ======================================================= */}
        <div
          ref={stage3SipRef}
          className="absolute inset-0 flex flex-col justify-between py-24 px-6 md:px-16 max-w-7xl mx-auto opacity-0"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#5C4332]">
              CHAPTER 03 · GOLDEN CREMA
            </span>
            <h2 className="font-editorial text-[14vw] lg:text-[9rem] leading-none text-[#3B2112]">
              SIP
            </h2>
          </div>

          <div className="flex items-end justify-between">
            <h2 className="font-editorial text-[14vw] lg:text-[9rem] leading-none text-stroke-cream drop-shadow-[0_6px_24px_rgba(0,0,0,0.45)]">
              SIP
            </h2>
          </div>
        </div>

        {/* =======================================================
            STAGE 4 (Frames 207 - 239): CERAMIC CUP & FLOATING CARDS
        ======================================================= */}
        <div
          ref={stage4CupRef}
          className="absolute inset-0 flex flex-col justify-between pt-20 pb-10 px-6 md:px-14 max-w-7xl mx-auto opacity-0 pointer-events-auto"
        >
          {/* Top Centered "FIND YOUR CUP" Header & Claim Button (Matches 0:08 - 0:09) */}
          <div className="text-center max-w-md mx-auto">
            <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl leading-[0.9] text-[#2A1E17]">
              FIND
              <br />
              YOUR CUP
            </h2>
            <button
              onClick={() => setCartOpen(true)}
              className="mt-3 px-5 py-2 rounded-full bg-[#2A1E17] text-[#E9DCC7] text-[11px] font-bold uppercase tracking-widest shadow-md hover:bg-[#3E2A1E] transition"
            >
              Claim Now
            </button>
          </div>

          {/* Left & Right Orbiting Product Cards Framing the Centered Stoneware Mug */}
          <div className="relative flex-1 w-full flex flex-col md:flex-row items-center justify-between gap-6 my-auto py-4">
            {/* Left Stack: ORIGIN & ROAST */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-4 z-20">
              <TiltProductCard
                product={COFFEE_CATALOG[0]}
                defaultRotation={-3}
              />
              <TiltProductCard
                product={COFFEE_CATALOG[1]}
                defaultRotation={2}
                className="md:ml-12"
              />
            </div>

            {/* Center Spacer (Leaves clear view for the steaming ceramic mug on canvas) */}
            <div className="hidden lg:block w-72 h-72 pointer-events-none" />

            {/* Right Stack: FLAVOR */}
            <div className="z-20">
              <TiltProductCard
                product={COFFEE_CATALOG[2]}
                defaultRotation={-2}
              />
            </div>
          </div>

          {/* Bottom Replay Bar */}
          <div className="flex items-center justify-between text-xs text-[#5C4332] pt-2 border-t border-[#2A1E17]/10">
            <span>
              Frame <strong>{Math.round(currentFrame) + 1}</strong> / {TOTAL_FRAMES}
            </span>
            <button
              onClick={() => scrollToFraction(0)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2A1E17]/10 hover:bg-[#2A1E17]/20 text-[#2A1E17] font-semibold transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom-Right Floating Compass Icon (Matches bottom-right badge in the Reel) */}
      <div className="fixed bottom-5 right-6 z-40 flex items-center gap-2">
        <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-[#2A1E17]/85 text-[#E9DCC7] text-[11px] font-medium backdrop-blur-md">
          {Math.round(scrollFraction * 100)}%
        </span>
        <button
          onClick={() => scrollToFraction(scrollFraction > 0.9 ? 0 : scrollFraction + 0.25)}
          aria-label="Advance stage"
          className="w-10 h-10 rounded-full bg-[#2A1E17] text-[#E9DCC7] flex items-center justify-center shadow-xl hover:scale-105 transition"
        >
          <Compass className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
```

---

## 8. Phase 6: Navigation Header & Slide-Over Tasting Bag (`src/app/page.tsx`)

Assemble the top fixed header (`POUR / PLAY`, `Log In`, `Sign In`, `Search`, `ShoppingBag`) and the master scene inside `src/app/page.tsx`:

```tsx
// src/app/page.tsx
"use client";

import React from "react";
import { Search, ShoppingBag, Menu, X, Plus, Minus } from "lucide-react";
import PourPlayMasterScene from "@/components/scrollytelling/PourPlayMasterScene";
import { COFFEE_CATALOG, useShopStore } from "@/store/useShopStore";

export default function HomePage() {
  const { cart, isCartOpen, setCartOpen, addToCart, removeFromCart } = useShopStore();
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = COFFEE_CATALOG.reduce(
    (sum, p) => sum + (cart[p.id] || 0) * p.price,
    0
  );

  return (
    <main className="relative min-h-screen bg-[#E9DCC7] text-[#2A1E17]">
      {/* Fixed Minimalist Header Matching the Reel */}
      <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-6 md:px-12 py-5 bg-gradient-to-b from-[#E9DCC7]/90 to-transparent backdrop-blur-[2px]">
        <a
          href="#top"
          className="text-sm md:text-base font-bold tracking-tight text-[#2A1E17]"
        >
          POUR <span className="font-normal opacity-50">/</span> PLAY
        </a>

        <div className="flex items-center gap-3 md:gap-4">
          <button className="text-xs md:text-sm font-medium text-[#2A1E17]/80 hover:text-[#2A1E17]">
            Log In
          </button>
          <button className="px-4 py-1.5 rounded-full bg-[#2A1E17] text-[#E9DCC7] text-xs md:text-sm font-medium shadow-xs hover:bg-[#3E2A1E] transition">
            Sign In
          </button>
          <button
            aria-label="Search"
            className="p-2 rounded-full hover:bg-[#2A1E17]/10 transition"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCartOpen(true)}
            aria-label="Shopping Bag"
            className="relative p-2 rounded-full hover:bg-[#2A1E17]/10 transition"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#A86448] text-white text-[10px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          <button
            aria-label="Menu"
            className="p-2 rounded-full hover:bg-[#2A1E17]/10 transition"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Master 550vh Video Scrollytelling Scene */}
      <PourPlayMasterScene />

      {/* Slide-Over Shopping Bag Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-[#F6EFE2] h-full p-6 flex flex-col justify-between shadow-2xl border-l border-[#2A1E17]/15">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#2A1E17]/15">
                <h3 className="font-editorial text-2xl">Your Bag ({totalItems})</h3>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 rounded-full hover:bg-[#2A1E17]/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {COFFEE_CATALOG.filter((p) => cart[p.id]).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-[#E9DCC7]/70 p-3 rounded-xl border border-[#2A1E17]/10"
                  >
                    <div>
                      <div className="font-semibold text-sm">{item.title}</div>
                      <div className="text-xs text-[#6E5644]">
                        {item.region} · ${item.price}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 rounded-full bg-[#2A1E17]/10"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold w-5 text-center">
                        {cart[item.id]}
                      </span>
                      <button
                        onClick={() => addToCart(item.id)}
                        className="p-1 rounded-full bg-[#2A1E17]/10"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#2A1E17]/15">
              <div className="flex items-center justify-between text-sm font-bold mb-4">
                <span>Subtotal</span>
                <span>${subtotal}.00</span>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="w-full py-3 rounded-full bg-[#2A1E17] text-[#E9DCC7] text-xs font-bold uppercase tracking-widest"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
```

---

## 9. Phase 7: Performance, Caching & Production QA Checklist

1. **Immutable Caching for the `240` WebP Frames (`next.config.ts`)**:
   Configure aggressive `Cache-Control` headers so returning visitors load all `240` frames instantaneously from disk cache:
   ```ts
   // next.config.ts
   import type { NextConfig } from "next";

   const nextConfig: NextConfig = {
     async headers() {
       return [
         {
           source: "/frames/:path*",
           headers: [
             {
               key: "Cache-Control",
               value: "public, max-age=31536000, immutable",
             },
           ],
         },
       ];
     },
   };

   export default nextConfig;
   ```
2. **Memory & Canvas Guardrails**:
   * Keep desktop `.webp` frames at `1280×720` (`~55–65 KB` per frame, `~14 MB` total across all `240` frames) and mobile frames at `960×540` (`~28 KB` per frame, `~6.7 MB` total).
   * Always cap `devicePixelRatio` at `2` (`Math.min(window.devicePixelRatio, 2)`) inside `ScrollVideoCanvas.tsx` to avoid 5K GPU fill-rate bottlenecks.
3. **Accessibility (`prefers-reduced-motion`)**:
   * Detect `window.matchMedia("(prefers-reduced-motion: reduce)").matches` and snap cleanly between key static frames (`0`, `72`, `155`, `235`) rather than scrubbing all intermediate frames for motion-sensitive users.
