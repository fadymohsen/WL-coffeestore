"use client";

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";

export interface ScrollVideoCanvasHandle {
  /**
   * Draw a (fractional) frame index in 0..totalFrames-1.
   * `overlay` cross-fades a second frame on top, used for the seamless steam loop.
   */
  draw: (frame: number, overlay?: { frame: number; alpha: number }) => void;
}

interface ScrollVideoCanvasProps {
  ref?: Ref<ScrollVideoCanvasHandle>;
  totalFrames?: number;
  className?: string;
  /** Fires once the frames needed for the intro have loaded. */
  onHeroReady?: () => void;
}

const HERO_FRAMES = 56;
const CHUNK = 12;

export default function ScrollVideoCanvas({
  ref,
  totalFrames = 240,
  className = "",
  onHeroReady,
}: ScrollVideoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | undefined)[]>([]);
  const frameRef = useRef(0);
  const overlayRef = useRef<{ frame: number; alpha: number } | undefined>(undefined);
  const drawnKeyRef = useRef("");
  const heroReadyRef = useRef(onHeroReady);

  useEffect(() => {
    heroReadyRef.current = onHeroReady;
  });

  const pick = (index: number) => {
    const images = imagesRef.current;
    const target = Math.min(totalFrames - 1, Math.max(0, Math.round(index)));
    for (let d = 0; d < totalFrames; d++) {
      const img = images[target - d] ?? images[target + d];
      if (img) return img;
    }
    return undefined;
  };

  const render = (force = false) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx) return;

    const vw = canvas.clientWidth;
    const vh = canvas.clientHeight;
    if (!vw || !vh) return;

    const main = pick(frameRef.current);
    if (!main) return;
    const overlay = overlayRef.current;
    const over = overlay && overlay.alpha > 0.004 ? pick(overlay.frame) : undefined;

    // skip identical repaints (scrub fires many updates per displayed frame)
    const key = `${vw}x${vh}|${main.src}|${over?.src ?? ""}|${over ? overlay!.alpha.toFixed(2) : ""}`;
    if (!force && key === drawnKeyRef.current) return;
    drawnKeyRef.current = key;

    // the source is 1280 wide, so a backing store past ~1.25x only costs fill rate
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    const bw = Math.round(vw * dpr);
    const bh = Math.round(vh * dpr);
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw;
      canvas.height = bh;
    }

    // cover-fit, centred
    const place = (img: HTMLImageElement) => {
      const aspect = img.naturalWidth / img.naturalHeight;
      let w = bw;
      let h = bw / aspect;
      if (h < bh) {
        h = bh;
        w = bh * aspect;
      }
      ctx.drawImage(img, (bw - w) / 2, (bh - h) / 2, w, h);
    };

    ctx.globalAlpha = 1;
    place(main);
    if (over) {
      ctx.globalAlpha = overlay!.alpha;
      place(over);
      ctx.globalAlpha = 1;
    }
  };

  useImperativeHandle(ref, () => ({
    draw: (frame, overlay) => {
      frameRef.current = frame;
      overlayRef.current = overlay;
      render();
    },
  }));

  useEffect(() => {
    const basePath = window.innerWidth < 768 ? "/frames/mobile" : "/frames";
    let cancelled = false;

    const loadFrame = (index: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (cancelled) return resolve();
          imagesRef.current[index] = img;
          render();
          resolve();
        };
        img.onerror = () => resolve();
        img.src = `${basePath}/frame_${String(index + 1).padStart(4, "0")}.webp`;
      });

    (async () => {
      const hero = Math.min(HERO_FRAMES, totalFrames);
      await Promise.all(Array.from({ length: hero }, (_, i) => loadFrame(i)));
      if (!cancelled) heroReadyRef.current?.();
      for (let i = hero; i < totalFrames && !cancelled; i += CHUNK) {
        const n = Math.min(CHUNK, totalFrames - i);
        await Promise.all(Array.from({ length: n }, (_, k) => loadFrame(i + k)));
      }
    })();

    const onResize = () => render(true);
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalFrames]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`block h-full w-full ${className}`}
    />
  );
}
