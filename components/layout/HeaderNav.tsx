"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Globe, Menu, ShoppingBag, X } from "lucide-react";
import { scrollToProgress } from "@/components/providers/SmoothScrollProvider";
import { useShopStore } from "@/store/useShopStore";
import { useTrap } from "@/lib/useTrap";
import { useLangStore, useLocalized, translations } from "@/lib/i18n";

const t = translations.nav;

export default function HeaderNav() {
  const cart = useShopStore((s) => s.cart);
  const setCartOpen = useShopStore((s) => s.setCartOpen);
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuTrap = useTrap(() => setMobileOpen(false));
  // once the page reaches the DIWAN sections the header gets its own sand bar so it never sits on green
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const check = () => {
      if (pathname !== "/") {
        setSolid(window.scrollY > 24 || !!document.querySelector("[data-header-solid]"));
        return;
      }
      const el = document.querySelector(".diwan");
      setSolid(!!el && el.getBoundingClientRect().top <= 72);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [pathname]);

  const lang = useLangStore((s) => s.lang);
  const toggle = useLangStore((s) => s.toggle);
  const l = useLocalized();

  const NAV_LINKS = [
    { href: "/shop", label: l(t.shop) },
    { href: "/our-story", label: l(t.ourStory) },
    { href: "/#blends", label: l({ en: "The Nine Blends", ar: "التوليفات التسع" }) },
    { href: "/#brew", label: l({ en: "Brewing", ar: "التحضير" }) },
    { href: "/contact", label: l({ en: "Contact", ar: "تواصل معنا" }) },
  ];

  return (
    <>
      <motion.header initial={{ y: -24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className={`fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-3 transition-colors duration-300 md:px-12 lg:px-20 ${solid ? "border-b border-n200 bg-sandy/90 backdrop-blur" : ""}`}>
        {/* Logo */}
        <Link
          href="/"
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              scrollToProgress(0);
            }
          }}
          className="flex items-center"
          aria-label={l({ en: "DIWAN, home", ar: "ديوان، الرئيسية" })}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/diwan/Diwan_Logo_Colour_tight.png" alt={l({ en: "DIWAN", ar: "ديوان" })} className="h-12 w-auto md:h-14" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink/70 transition hover:text-green"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 md:gap-3">
          <button
            onClick={toggle}
            aria-label={lang === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"}
            className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] font-semibold text-green transition hover:bg-green/10"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{lang === "en" ? "عربي" : "EN"}</span>
          </button>
          <button
            data-cart-icon
            onClick={() => setCartOpen(true)}
            aria-label={l({ en: `Shopping bag, ${totalItems} items`, ar: `السلة، ${totalItems} منتجات` })}
            className="relative rounded-full p-2.5 transition hover:bg-green/10"
          >
            <ShoppingBag className="h-4 w-4 text-green" />
            {totalItems > 0 && (
              <motion.span
                key={totalItems}
                initial={{ scale: 1.6 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 18 }}
                className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-aqeeq px-1 text-[10px] font-bold text-sandy"
              >
                <bdi>{totalItems}</bdi>
              </motion.span>
            )}
          </button>
          <button
            aria-label={l({ en: "Menu", ar: "القائمة" })}
            onClick={() => setMobileOpen(true)}
            className="rounded-full p-2.5 transition hover:bg-green/10 md:hidden"
          >
            <Menu className="h-4 w-4 text-green" />
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div ref={menuTrap} role="dialog" aria-modal="true" aria-label={l({ en: "Menu", ar: "القائمة" })} className="fixed inset-0 z-50 flex flex-col bg-sandy">
          <div className="flex items-center justify-between px-5 py-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/diwan/Diwan_Logo_Colour_tight.png" alt={l({ en: "DIWAN", ar: "ديوان" })} className="h-12 w-auto" />
            <button onClick={() => setMobileOpen(false)} aria-label={l({ en: "Close menu", ar: "إغلاق القائمة" })} className="rounded-full p-2.5">
              <X className="h-5 w-5 text-green" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col items-center justify-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-editorial text-3xl font-bold text-green"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="mt-4 rounded-full border-2 border-green px-8 py-3 text-sm font-semibold text-green transition hover:bg-green hover:text-sandy"
            >
              {l(t.home)}
            </Link>
            <button
              onClick={() => { toggle(); setMobileOpen(false); }}
              className="flex items-center gap-2 rounded-full bg-green/10 px-6 py-3 text-sm font-semibold text-green"
            >
              <Globe className="h-4 w-4" />
              {lang === "en" ? "عربي" : "English"}
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
