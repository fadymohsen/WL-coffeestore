"use client";

import { useEffect } from "react";
import { useLangStore, type Lang } from "@/lib/i18n";

export default function LangSync({ lang }: { lang: Lang }) {
  const setLang = useLangStore((s) => s.setLang);

  useEffect(() => {
    setLang(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang, setLang]);

  return null;
}
