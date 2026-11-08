"use client";

import Link from "next/link";
import { useLocalized, translations } from "@/lib/i18n";

const t = translations.footer;
const tNav = translations.nav;

export default function Footer() {
  const l = useLocalized();

  const LINKS = [
    { href: "/shop", label: l(tNav.shop) },
    { href: "/our-story", label: l(tNav.ourStory) },
  ];

  return (
    <footer className="border-t border-n200 bg-green text-sandy">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-20">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/diwan/Diwan_Logo_Slogan_Reverse_tight.png" alt="ديوان، الحكاية تبدأ بفنجان" className="w-40" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-sandy/70">
              {l(t.brandDesc)}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-sandy/50">
              {l(t.links)}
            </h4>
            <nav className="flex flex-col gap-3">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-sandy/70 transition hover:text-sandy"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-sandy/50">
              {l(t.contactUs)}
            </h4>
            <div className="space-y-2 text-sm text-sandy/70">
              <a href="https://instagram.com/diwan_eg" target="_blank" rel="noreferrer" className="hover:text-sandy">@diwan_eg · Instagram · Facebook · TikTok</a>
              <p>{l(t.location)}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-sandy/15 pt-6 text-xs text-sandy/40 md:flex-row">
          <p>&copy; 2026 DIWAN ROASTERY · CAIRO · @diwan_eg</p>
          <p>{l(t.tagline)}</p>
        </div>
      </div>
    </footer>
  );
}
