"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ShoppingBag,
  X,
  Heart,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Check,
  Plus,
  Minus,
  Compass,
  Sliders,
  Coffee,
  RotateCcw,
} from "lucide-react";

interface ProductCard {
  id: string;
  category: "ORIGIN" | "ROAST" | "FLAVOR";
  name: string;
  subtitle: string;
  notes: string[];
  price: number;
  bagColor: string;
}

const COFFEE_PRODUCTS: ProductCard[] = [
  {
    id: "ethiopia-yirgacheffe",
    category: "ORIGIN",
    name: "Yirgacheffe Halo",
    subtitle: "Washed Heirloom · 2,150m",
    notes: ["Bergamot", "Jasmine", "White Peach"],
    price: 26,
    bagColor: "#89A7B1",
  },
  {
    id: "colombia-pink-bourbon",
    category: "ROAST",
    name: "Huila Pink Bourbon",
    subtitle: "Omni-Roast · Small Batch",
    notes: ["Caramel", "Blood Orange", "Praline"],
    price: 29,
    bagColor: "#C87D65",
  },
  {
    id: "kenya-aa-nyeri",
    category: "FLAVOR",
    name: "Nyeri Gatomboya",
    subtitle: "Double Fermented · SL28",
    notes: ["Blackcurrant", "Hibiscus", "Cacao"],
    price: 32,
    bagColor: "#D9C7B2",
  },
];

export default function PourPlayPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [grindSetting, setGrindSetting] = useState(4); // 1 (Fine) to 8 (Coarse)
  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    "colombia-pink-bourbon": true,
  });
  const [cart, setCart] = useState<Record<string, number>>({
    "ethiopia-yirgacheffe": 1,
  });
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // 1. Track normalized scroll progress (0.0 -> 1.0)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const maxScroll = Math.max(1, scrollHeight - clientHeight);
      setScrollProgress(Math.min(1, Math.max(0, scrollTop / maxScroll)));
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToStage = (targetProgress: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const maxScroll = container.scrollHeight - container.clientHeight;
    container.scrollTo({ top: maxScroll * targetProgress, behavior: "smooth" });
  };

  // 2. 60fps Scrollytelling Canvas (Grinder -> Exploded Burrs -> V60 Pour-Over -> Wave -> Cup)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let tick = 0;

    const renderScene = () => {
      tick += 0.025;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const p = scrollProgress;

      ctx.clearRect(0, 0, width, height);

      // STAGE 1 & 2: FALLING BEANS + GRINDER + EXPLODED BURRS (p: 0.00 -> 0.48)
      if (p < 0.5) {
        const grinderYOffset = p < 0.22 ? p * -260 : -57 - (p - 0.22) * 950;
        const opacity = p > 0.36 ? Math.max(0, 1 - (p - 0.36) / 0.12) : 1;

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(cx, cy + grinderYOffset);

        // Falling roasted coffee beans into the glass hopper
        for (let i = 0; i < 24; i++) {
          const seed = i * 137.5;
          const fallCycle = (tick * 0.45 + i * 0.17 + p * 3.2) % 1;
          const bx = Math.sin(seed) * (85 * (1 - fallCycle * 0.65));
          const by = -320 + fallCycle * 260;

          ctx.save();
          ctx.translate(bx, by);
          ctx.rotate(seed + fallCycle * 4);
          ctx.fillStyle = i % 3 === 0 ? "#4E2F1E" : "#361F13";
          ctx.beginPath();
          ctx.ellipse(0, 0, 11, 7.5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Glass Hopper Cone
        ctx.fillStyle = "rgba(255, 255, 255, 0.32)";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-115, -100);
        ctx.lineTo(115, -100);
        ctx.lineTo(78, 35);
        ctx.lineTo(-78, 35);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Exploded Grinder Housing & Burr Dial (0:02 in the video)
        const explodeSpread = Math.max(0, Math.min(1, (p - 0.12) / 0.16)) * 54;
        ctx.fillStyle = "#231E1B";
        ctx.beginPath();
        ctx.roundRect(-84, 34, 168, 34, 6);
        ctx.roundRect(-92 - explodeSpread, 72, 68, 175, 8);
        ctx.roundRect(24 + explodeSpread, 72, 68, 175, 8);
        ctx.fill();

        // Circular Grind Dial
        ctx.save();
        ctx.translate(0, 145);
        ctx.fillStyle = "#161311";
        ctx.beginPath();
        ctx.arc(0, 0, 56, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#C89D7C";
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Fresh Coffee Grounds Showering Downward (0:02 - 0:03)
        if (p > 0.1) {
          const groundCount = Math.floor(130 * Math.min(1, (p - 0.1) / 0.15));
          for (let g = 0; g < groundCount; g++) {
            const gyCycle = (tick * 0.9 + g * 0.07 + p * 6) % 1;
            const spreadX = Math.sin(g * 91.3 + tick) * (18 + gyCycle * 75);
            const gy = 195 + gyCycle * 290;
            ctx.fillStyle = g % 2 === 0 ? "#4A2A18" : "#6E4127";
            ctx.beginPath();
            ctx.arc(spreadX, gy, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      }

      // STAGE 2 & 3: GOOSENECK KETTLE + GLASS V60 POUR-OVER DRIPPER (p: 0.26 -> 0.80)
      if (p >= 0.26 && p <= 0.8) {
        const pourAlpha =
          p < 0.36 ? (p - 0.26) / 0.1 : p > 0.68 ? Math.max(0, 1 - (p - 0.68) / 0.12) : 1;
        const pourLift = p > 0.56 ? (p - 0.56) * -550 : 0;

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, pourAlpha));
        ctx.translate(cx, cy + 50 + pourLift);

        // Gooseneck Spout entering from Top-Right (0:04 - 0:06)
        ctx.strokeStyle = "#524B46";
        ctx.lineWidth = 14;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(280, -160);
        ctx.bezierCurveTo(220, -150, 195, -240, 110, -215);
        ctx.stroke();

        // Pouring Hot Water Stream
        if (p > 0.34) {
          ctx.strokeStyle = "rgba(235, 245, 255, 0.78)";
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.moveTo(110, -215);
          ctx.quadraticCurveTo(45, -180, 4 + Math.sin(tick * 2) * 4, -20);
          ctx.stroke();
        }

        // Ribbed Glass V60 Cone & Wet Coffee Bed
        ctx.fillStyle = "#5B341E";
        ctx.beginPath();
        ctx.moveTo(-92, -45);
        ctx.lineTo(92, -45);
        ctx.lineTo(22, 68);
        ctx.lineTo(-22, 68);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(-116, -75);
        ctx.lineTo(116, -75);
        ctx.lineTo(32, 74);
        ctx.lineTo(-32, 74);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Golden Extraction Stream (0:06 - 0:07)
        if (p > 0.42) {
          ctx.fillStyle = "#6E3012";
          ctx.fillRect(-4, 74, 8, 210);
        }
        ctx.restore();
      }

      // STAGE 3: LIQUID COFFEE WAVE TRANSITION (0:07 in the video, p: 0.52 -> 0.84)
      if (p >= 0.52 && p <= 0.84) {
        const waveBell = Math.sin(((p - 0.52) / 0.32) * Math.PI);
        const waveY = height * (0.78 - waveBell * 0.26);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, waveY);
        for (let x = 0; x <= width; x += 24) {
          const yOffset = Math.sin(x * 0.008 + tick * 2.2) * 18;
          ctx.lineTo(x, waveY + yOffset);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = "#2A1205";
        ctx.fill();
        ctx.restore();
      }

      // STAGE 4: TWO-TONE STONEWARE CERAMIC MUG (0:08 - 0:09, p >= 0.70)
      if (p >= 0.7) {
        const cupProgress = Math.min(1, (p - 0.7) / 0.18);
        const cupY = cy + 95 + (1 - cupProgress) * 140;

        ctx.save();
        ctx.globalAlpha = cupProgress;
        ctx.translate(cx, cupY);

        // Handle
        ctx.strokeStyle = "#C4AD94";
        ctx.lineWidth = 18;
        ctx.beginPath();
        ctx.arc(108, 2, 42, -Math.PI * 0.42, Math.PI * 0.42);
        ctx.stroke();

        // Two-Tone Ceramic Body (Cream glaze top + raw stoneware clay base)
        ctx.fillStyle = "#9C7A5B";
        ctx.beginPath();
        ctx.moveTo(-118, -58);
        ctx.lineTo(118, -58);
        ctx.quadraticCurveTo(115, 58, 68, 92);
        ctx.lineTo(-68, 92);
        ctx.quadraticCurveTo(-115, 58, -118, -58);
        ctx.closePath();
        ctx.fill();

        // Upper Creamy Glaze Drip
        ctx.fillStyle = "#F5EFE6";
        ctx.beginPath();
        ctx.moveTo(-118, -58);
        ctx.lineTo(118, -58);
        ctx.lineTo(112, 12);
        ctx.bezierCurveTo(50, 28, -20, -12, -112, 12);
        ctx.closePath();
        ctx.fill();

        // Coffee Crema Surface
        ctx.fillStyle = "#3B1C0B";
        ctx.beginPath();
        ctx.ellipse(0, -58, 110, 16, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(renderScene);
    };

    renderScene();
    return () => cancelAnimationFrame(animationFrameId);
  }, [scrollProgress, grindSetting]);

  const addToCart = (id: string, name: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    showToast(`Added ${name} to your bag`);
  };

  const totalCartItems = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#EAE3D2] text-[#2A1E17] select-none">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,800;9..144,900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .font-editorial { font-family: 'Fraunces', Georgia, serif; }
      `}</style>

      {/* LAYER 3 (z-40): FIXED NAVIGATION BAR */}
      <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-6 md:px-12 py-5 bg-[#EAE3D2]/80 backdrop-blur-xs">
        <button
          onClick={() => scrollToStage(0)}
          className="text-sm md:text-base font-bold tracking-tight"
        >
          POUR <span className="font-normal opacity-50">/</span> PLAY
        </button>

        <div className="flex items-center gap-3 md:gap-4">
          <button className="text-xs md:text-sm font-medium opacity-80 hover:opacity-100">
            Log In
          </button>
          <button className="px-4 py-1.5 rounded-full bg-[#2A1E17] text-[#EAE3D2] text-xs md:text-sm font-medium">
            Sign In
          </button>
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="relative p-2 rounded-full hover:bg-[#2A1E17]/10"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalCartItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#9E5231] text-white text-[10px] font-bold flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* LAYER 2 (z-10): STICKY 3D / CANVAS OVERLAY (Sits in front of giant titles, behind buttons) */}
      <div className="fixed inset-0 z-10 pointer-events-none flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={1280}
          height={820}
          className="w-full h-full object-contain"
        />
      </div>

      {/* SCROLLABLE STORY CONTAINER */}
      <div ref={scrollContainerRef} className="relative z-20 h-screen overflow-y-auto">
        {/* SECTION 1: GRIND PLAY (0:00 - 0:02) */}
        <section className="min-h-screen flex flex-col justify-center px-6 md:px-16 pt-16 max-w-6xl mx-auto">
          <div className="text-xs uppercase tracking-[0.22em] text-[#5C4332] font-semibold mb-2">
            POUR / PLAY • ARTISANAL EXTRACTION
          </div>
          <div className="flex flex-wrap items-baseline justify-between">
            <h1 className="font-editorial text-[15vw] md:text-[11rem] leading-[0.86] text-[#3B2112]">
              GRIND
            </h1>
            <h1 className="font-editorial text-[15vw] md:text-[11rem] leading-[0.86] text-[#C29576]">
              PLAY
            </h1>
          </div>

          <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-xs bg-[#EAE3D2]/85 backdrop-blur-xs p-4 rounded-2xl border border-[#2A1E17]/10">
              <p className="text-xs md:text-sm text-[#4A372B] mb-5">
                Engineered conical burrs that preserve delicate floral aromatics from
                whole roasted bean to uniform extraction bed.
              </p>
              <button
                onClick={() => scrollToStage(0.96)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2A1E17] text-[#EAE3D2] text-xs font-semibold uppercase tracking-widest"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-[#EAE3D2]/90 px-4 py-3 rounded-2xl border border-[#2A1E17]/15">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#5C4332] mb-1">
                Burr Dial Setting: #{grindSetting}
              </div>
              <input
                type="range"
                min={1}
                max={8}
                value={grindSetting}
                onChange={(e) => setGrindSetting(Number(e.target.value))}
                className="w-44 accent-[#3B2112]"
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: POUR (0:03 - 0:06) */}
        <section className="min-h-screen flex flex-col justify-center px-6 md:px-16 max-w-6xl mx-auto">
          <h2 className="font-editorial text-[16vw] md:text-[9.5rem] leading-[0.88] text-[#3B2112]">
            POUR
          </h2>
          <div className="font-editorial text-[11vw] md:text-[6.8rem] leading-[0.9] text-[#C89F81]/65 -mt-2">
            Ritual
          </div>
        </section>

        {/* SECTION 3: SIP / SIP WAVE TRANSITION (0:07) */}
        <section className="min-h-screen flex flex-col justify-between py-24 px-6 md:px-16 max-w-6xl mx-auto">
          <h2 className="font-editorial text-[15vw] md:text-[8.5rem] leading-none text-[#3B2112]">
            SIP
          </h2>
          <h2 className="font-editorial text-[15vw] md:text-[8.5rem] leading-none text-[#EAE3D2]">
            SIP
          </h2>
        </section>

        {/* SECTION 4: FIND YOUR CUP + FLOATING PRODUCT CARDS (0:08 - 0:09) */}
        <section className="min-h-screen flex flex-col justify-between pt-20 pb-12 px-6 md:px-16 max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="font-editorial text-5xl md:text-7xl leading-[0.92]">
              FIND
              <br />
              YOUR CUP
            </h2>
            <div className="mt-4 inline-flex gap-1.5 bg-[#2A1E17]/10 p-1 rounded-full">
              {["ALL", "ORIGIN", "ROAST", "FLAVOR"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedFilter(cat)}
                  className={`px-3.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                    selectedFilter === cat ? "bg-[#2A1E17] text-[#EAE3D2]" : ""
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-auto pt-8">
            {COFFEE_PRODUCTS.filter(
              (item) => selectedFilter === "ALL" || item.category === selectedFilter
            ).map((product, idx) => (
              <div
                key={product.id}
                className={`bg-[#F5EFE4]/95 backdrop-blur-md rounded-2xl p-4 border border-[#2A1E17]/12 shadow-xl transition-transform ${
                  idx === 0 ? "md:-rotate-2" : idx === 1 ? "md:mt-14 md:rotate-2" : "md:-rotate-1"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#6E4F3A]">
                    {product.category}
                  </span>
                  <button
                    onClick={() =>
                      setFavorites((prev) => ({
                        ...prev,
                        [product.id]: !prev[product.id],
                      }))
                    }
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        favorites[product.id] ? "fill-[#B85032] text-[#B85032]" : ""
                      }`}
                    />
                  </button>
                </div>

                <h3 className="font-editorial text-lg">{product.name}</h3>
                <p className="text-xs text-[#6E5644] mb-3">
                  {product.subtitle} · ${product.price}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(product.id, product.name)}
                    className="flex-1 py-2 px-3 rounded-full bg-[#2A1E17] text-[#EAE3D2] text-[11px] font-semibold"
                  >
                    Add to Bag ({cart[product.id] || 0})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#2A1E17] text-[#EAE3D2] text-xs font-medium shadow-xl">
          {toastMessage}
        </div>
      )}
    </div>
  );
}