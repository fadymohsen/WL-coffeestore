"use client";

import { useCallback, useEffect, useRef } from "react";

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Keeps keyboard focus inside a dialog: moves focus in when it opens, wraps Tab at both ends,
 * closes on Escape, and returns focus to whatever opened it.
 * Spread the returned ref onto the dialog panel.
 */
export function useTrap(onClose: () => void) {
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  });

  return useCallback((node: HTMLElement | null) => {
    if (!node) return;
    const opener = document.activeElement as HTMLElement | null;
    const items = () => [...node.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
    if (!node.hasAttribute("tabindex")) node.setAttribute("tabindex", "-1");
    // focus the first field if there is one, otherwise the panel itself
    const first = node.querySelector<HTMLElement>("input,select,textarea") ?? items()[0] ?? node;
    first.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close.current();
        return;
      }
      if (e.key !== "Tab") return;
      const list = items();
      if (list.length === 0) return;
      const a = list[0];
      const z = list[list.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    };
    node.addEventListener("keydown", onKey);
    return () => {
      node.removeEventListener("keydown", onKey);
      opener?.focus?.({ preventScroll: true });
    };
  }, []);
}
