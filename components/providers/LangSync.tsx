"use client";

import { useEffect } from "react";
import { useLangStore } from "@/lib/i18n";

export default function LangSync() {
  const lang = useLangStore((s) => s.lang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  return null;
}
