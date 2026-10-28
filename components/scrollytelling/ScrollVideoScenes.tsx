"use client";

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";

const FPS = 24;

/**
 * One clip per scene (cut from the source by scripts/prepare-scene-clips.mjs).
 * `loopFrom` is the frame inside the clip it jumps back to when it ends; without it the clip holds its last frame.
 */
const CLIPS = [
  { name: "beans", loopFrom: 20, still: 52 }, // beans pour
  { name: "grind", loopFrom: null, still: 30 }, // grinder opens, holds on the falling grounds
  { name: "pour", loopFrom: 45, still: 50 }, // V60 pour
  { name: "finale", loopFrom: 34, still: 58 }, // espresso wave settles into the cup, steam keeps going
] as const;

export const SCENE_COUNT = CLIPS.length;

export interface ScrollVideoScenesHandle {
  /** Fade to scene `index` and play its clip from the start. */
  show: (index: number) => void;
}

interface ScrollVideoScenesProps {
  ref?: Ref<ScrollVideoScenesHandle>;
  className?: string;
  /** Show one still per scene instead of playing. */
  still?: boolean;
  /** Fires once the first clip can play. */
  onReady?: () => void;
  /** Fires when the first clip reaches its end for the first time (the bean pour is done). */
  onIntroEnd?: () => void;
}

export default function ScrollVideoScenes({
  ref,
  className = "",
  still = false,
  onReady,
  onIntroEnd,
}: ScrollVideoScenesProps) {
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const active = useRef(-1);
  const introEnded = useRef(false);
  const callbacks = useRef({ onReady, onIntroEnd });

  useEffect(() => {
    callbacks.current = { onReady, onIntroEnd };
  });

  const show = (index: number) => {
    if (index === active.current) return;
    const prev = active.current;
    active.current = index;
    videos.current.forEach((v, i) => {
      if (!v) return;
      v.style.opacity = i === index ? "1" : "0";
      v.style.zIndex = i === index ? "1" : "0";
    });
    const next = videos.current[index];
    if (next) {
      if (still) {
        next.pause();
        next.currentTime = CLIPS[index].still / FPS;
      } else {
        next.currentTime = 0;
        next.play().catch(() => {});
      }
    }
    // let the outgoing clip finish fading before it stops
    const old = videos.current[prev];
    if (old) window.setTimeout(() => active.current !== prev && old.pause(), 600);
  };

  useImperativeHandle(ref, () => ({ show }));

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    let readyFired = false;
    const cleanups: (() => void)[] = [];
    videos.current.forEach((v, i) => {
      if (!v) return;
      v.src = `/video/scenes/${CLIPS[i].name}${mobile ? "-m" : ""}.mp4`;
      v.load();
      if (i === 0) {
        const ready = () => {
          if (readyFired) return;
          readyFired = true;
          callbacks.current.onReady?.();
        };
        v.addEventListener("canplaythrough", ready, { once: true });
        cleanups.push(() => v.removeEventListener("canplaythrough", ready));
      }
    });

    // loop each clip back to its loop point just before it ends so there is no frozen last frame
    let raf = 0;
    const tick = () => {
      const i = active.current;
      const v = videos.current[i];
      if (v && !still && v.duration && !v.paused) {
        const loopFrom = CLIPS[i].loopFrom;
        if (v.currentTime >= v.duration - 1.5 / FPS) {
          if (i === 0 && !introEnded.current) {
            introEnded.current = true;
            callbacks.current.onIntroEnd?.();
          }
          if (loopFrom !== null) v.currentTime = loopFrom / FPS;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // safety net: never keep the page locked if the first clip cannot play
    const fallback = window.setTimeout(() => {
      if (!readyFired) {
        readyFired = true;
        callbacks.current.onReady?.();
      }
    }, 3500);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(fallback);
      cleanups.forEach((fn) => fn());
    };
  }, [still]);

  return (
    <div className={`absolute inset-0 ${className}`}>
      {CLIPS.map((clip, i) => (
        <video
          key={clip.name}
          ref={(el) => {
            videos.current[i] = el;
          }}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          style={{ opacity: i === 0 ? 1 : 0 }}
        />
      ))}
    </div>
  );
}
