"use client";

import { Menu, Search, ShoppingBag } from "lucide-react";
import { scrollToProgress } from "@/components/providers/SmoothScrollProvider";
import { useShopStore } from "@/store/useShopStore";

export default function HeaderNav() {
  const cart = useShopStore((s) => s.cart);
  const setCartOpen = useShopStore((s) => s.setCartOpen);
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 md:px-12">
      <button
        onClick={() => scrollToProgress(0)}
        className="text-sm font-bold tracking-tight text-espresso md:text-base"
      >
        POUR <span className="font-normal opacity-50">/</span> PLAY
      </button>

      <div className="flex items-center gap-2 md:gap-4">
        <button className="hidden text-xs font-medium text-espresso/80 hover:text-espresso sm:block md:text-sm">
          Log In
        </button>
        <button className="hidden rounded-full bg-espresso px-4 py-1.5 text-xs font-medium text-cream transition hover:bg-[#3e2a1e] sm:block md:text-sm">
          Sign In
        </button>
        <button aria-label="Search" className="rounded-full p-2 transition hover:bg-espresso/10">
          <Search className="h-4 w-4" />
        </button>
        <button
          onClick={() => setCartOpen(true)}
          aria-label={`Shopping bag, ${totalItems} items`}
          className="relative rounded-full p-2 transition hover:bg-espresso/10"
        >
          <ShoppingBag className="h-4 w-4" />
          {totalItems > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#a86448] text-[10px] font-bold text-white">
              {totalItems}
            </span>
          )}
        </button>
        <button aria-label="Menu" className="rounded-full p-2 transition hover:bg-espresso/10">
          <Menu className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
