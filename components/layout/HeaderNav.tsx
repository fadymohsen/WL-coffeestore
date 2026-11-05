"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { scrollToProgress } from "@/components/providers/SmoothScrollProvider";
import { useShopStore } from "@/store/useShopStore";

const NAV_LINKS = [
  { href: "/shop", label: "المتجر", labelEn: "Shop" },
  { href: "/our-story", label: "حكايتنا", labelEn: "Our Story" },
];

export default function HeaderNav() {
  const cart = useShopStore((s) => s.cart);
  const setCartOpen = useShopStore((s) => s.setCartOpen);
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4 md:px-12 lg:px-20">
        {/* Logo */}
        <Link
          href="/"
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              scrollToProgress(0);
            }
          }}
          className="flex items-baseline gap-2"
        >
          <span className="font-editorial text-xl font-bold tracking-tight text-green md:text-2xl">
            DIWAN
          </span>
          <span className="font-arabic text-sm text-green/70 md:text-base">ديوان</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink/70 transition hover:text-green"
            >
              {link.labelEn}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 md:gap-3">
          <button aria-label="Search" className="rounded-full p-2 transition hover:bg-green/10">
            <Search className="h-4 w-4 text-green" />
          </button>
          <button
            onClick={() => setCartOpen(true)}
            aria-label={`Shopping bag, ${totalItems} items`}
            className="relative rounded-full p-2 transition hover:bg-green/10"
          >
            <ShoppingBag className="h-4 w-4 text-green" />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-aqeeq text-[10px] font-bold text-sandy">
                {totalItems}
              </span>
            )}
          </button>
          <button
            aria-label="Menu"
            onClick={() => setMobileOpen(true)}
            className="rounded-full p-2 transition hover:bg-green/10 md:hidden"
          >
            <Menu className="h-4 w-4 text-green" />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-sandy">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="font-editorial text-xl font-bold text-green">DIWAN</span>
            <button onClick={() => setMobileOpen(false)} className="rounded-full p-2">
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
                {link.labelEn}
              </Link>
            ))}
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="mt-4 rounded-full border-2 border-green px-8 py-3 text-sm font-semibold text-green transition hover:bg-green hover:text-sandy"
            >
              Home
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
