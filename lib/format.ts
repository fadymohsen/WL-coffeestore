import type { Lang } from "@/lib/i18n";

export const money = (n: number, lang: Lang) => (lang === "ar" ? `${n} ج.م` : `EGP ${n}`);
