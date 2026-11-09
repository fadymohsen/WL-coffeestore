"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useToastStore } from "@/store/useToastStore";
import { useLocalized } from "@/lib/i18n";

/** Short confirmations at the bottom of the screen. Announced to screen readers, never steals focus. */
export default function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  const l = useLocalized();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex flex-col items-center gap-2 px-4" role="status" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto flex max-w-md items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-xl ${t.tone === "error" ? "bg-[#8e0b21]" : "bg-[#1a1a1a]"}`}
          >
            {t.tone === "ok" && <Check className="h-4 w-4 shrink-0" />}
            <span>{t.text}</span>
            {t.action && (
              <button
                onClick={() => { t.action?.run(); dismiss(t.id); }}
                className="rounded-md px-2 py-1 font-semibold underline underline-offset-4 hover:bg-white/10"
              >
                {t.action.label}
              </button>
            )}
            <button onClick={() => dismiss(t.id)} aria-label={l({ en: "Dismiss", ar: "إغلاق" })} className="-me-1 rounded-md p-1 text-white/70 hover:bg-white/10 hover:text-white">
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
