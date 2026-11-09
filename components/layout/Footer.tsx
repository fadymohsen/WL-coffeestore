"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { Magnetic, SplitText } from "@/components/ui/motion";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/ui/SocialIcons";
import { CATEGORY_IDS, CATEGORY_META, CLOSING_LINE } from "@/data/products";
import { useLangStore, useLocalized } from "@/lib/i18n";
import { useCatalogStore } from "@/store/useCatalogStore";

const SOCIAL = [
  { name: "Instagram", href: "https://instagram.com/diwan_eg", Icon: InstagramIcon },
  { name: "Facebook", href: "https://facebook.com/diwan_eg", Icon: FacebookIcon },
  { name: "TikTok", href: "https://tiktok.com/@diwan_eg", Icon: TikTokIcon },
];

export default function Footer() {
  const l = useLocalized();
  const lang = useLangStore((s) => s.lang);
  const settings = useCatalogStore((s) => s.settings);

  const col = "mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-sandy/70";
  const link = "group inline-flex items-center gap-1 text-sm text-sandy/80 transition hover:text-sandy";

  return (
    <footer className="bg-green text-sandy">
      <div className="mx-auto max-w-[1440px] px-5 pb-8 pt-20 md:px-20">
        <Reveal>
          <SplitText as="p" text={CLOSING_LINE[lang]} className="block max-w-3xl font-editorial text-3xl font-medium leading-snug md:text-5xl" />
          <Magnetic className="mt-8 inline-block"><Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-sandy px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-green transition hover:bg-white active:scale-[0.97]"
          >
            {l({ en: "Shop the nine blends", ar: "تسوق التوليفات التسع" })}
            <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
          </Link></Magnetic>
        </Reveal>

        <div className="mt-16 grid gap-12 border-t border-sandy/15 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/diwan/Diwan_Logo_Slogan_Reverse_tight.png" alt={l({ en: "DIWAN, the story begins with a cup", ar: "ديوان، الحكاية تبدأ بفنجان" })} className="w-32" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-sandy/70">
              {l({
                en: "A place to gather. We bring that feeling to everyday coffee: familiar rituals, measured details and blends that are easy to choose.",
                ar: "الديوان هو مجلس ومكان اجتماع. نأخذ هذا الإحساس إلى القهوة اليومية: طقوس مألوفة، تفاصيل محسوبة، وتوليفات سهلة الاختيار.",
              })}
            </p>
          </div>

          <nav aria-label={l({ en: "Shop", ar: "المتجر" })}>
            <h3 className={col}>{l({ en: "Shop", ar: "المتجر" })}</h3>
            <ul className="space-y-3">
              {CATEGORY_IDS.map((c) => (
                <li key={c}>
                  <Link href={`/shop?category=${c}`} className={link}>{CATEGORY_META[c].label[lang]}</Link>
                </li>
              ))}
              <li><Link href="/shop" className={link}>{l({ en: "All blends", ar: "كل التوليفات" })}</Link></li>
            </ul>
          </nav>

          <nav aria-label={l({ en: "DIWAN", ar: "ديوان" })}>
            <h3 className={col}>DIWAN</h3>
            <ul className="space-y-3">
              <li><Link href="/our-story" className={link}>{l({ en: "Our Story", ar: "حكايتنا" })}</Link></li>
              <li><Link href="/#brew" className={link}>{l({ en: "Brewing guide", ar: "دليل التحضير" })}</Link></li>
              <li><Link href="/contact" className={link}>{l({ en: "Contact", ar: "تواصل معنا" })}</Link></li>
            </ul>
          </nav>

          <div>
            <h3 className={col}>{l({ en: "Follow", ar: "تابعنا" })}</h3>
            <ul className="flex gap-3">
              {SOCIAL.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.name}
                    className="grid h-11 w-11 place-items-center rounded-full border border-sandy/25 text-sandy transition duration-300 hover:-translate-y-1 hover:border-sandy hover:bg-sandy hover:text-green"
                  >
                    <s.Icon className="h-5 w-5" />
                  </a>
                </li>
              ))}
            </ul>
            {(settings.phone || settings.supportEmail) && (
              <ul className="mt-5 space-y-1 text-sm text-sandy/80">
                {settings.phone && <li><a href={`tel:${settings.phone}`} dir="ltr" className="hover:text-sandy">{settings.phone}</a></li>}
                {settings.supportEmail && <li><a href={`mailto:${settings.supportEmail}`} dir="ltr" className="hover:text-sandy">{settings.supportEmail}</a></li>}
              </ul>
            )}
            <p className="mt-5 text-sm text-sandy/70"><bdi>@diwan_eg</bdi> · {l({ en: "Cairo, Egypt", ar: "القاهرة، مصر" })}</p>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-sandy/15 pt-6 text-xs text-sandy/70 md:flex-row">
          <p>&copy; 2026 DIWAN ROASTERY · CAIRO</p>
          <p className="font-latin tracking-[0.2em]">{l({ en: "COFFEE FOR EVERY CULTURE", ar: "قهوة لكل ثقافة" })}</p>
        </div>
      </div>
    </footer>
  );
}
