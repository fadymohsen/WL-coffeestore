"use client";

import { useLocalized } from "@/lib/i18n";

/** First tab stop on every page: jumps past the header straight to the content. */
export default function SkipLink() {
  const l = useLocalized();
  return (
    <a
      href="#main"
      className="sr-only fixed start-4 top-4 z-[100] rounded-lg bg-green px-4 py-2 text-sm font-semibold text-sandy focus:not-sr-only"
    >
      {l({ en: "Skip to content", ar: "تخطَّ إلى المحتوى" })}
    </a>
  );
}
