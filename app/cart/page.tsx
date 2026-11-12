"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import HeaderNav from "@/components/layout/HeaderNav";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import CartLines from "@/components/shop/CartLines";
import OrderSummary from "@/components/shop/OrderSummary";
import { LineSkeleton } from "@/components/shop/CartLines";
import { useBagReady, useCartLines } from "@/lib/cart";
import { useLocalized } from "@/lib/i18n";
import { SplitText } from "@/components/ui/motion";

export default function CartPage() {
  const l = useLocalized();
  const { lines, blocked } = useCartLines();
  const ready = useBagReady();

  return (
    <main id="main" className="page-in relative">
      <HeaderNav />
      <CartDrawer />
      <section className="mx-auto max-w-[1100px] px-5 pb-24 pt-32 md:px-10 md:pt-40">
        <SplitText as="h1" text={l({ en: "Your bag", ar: "سلتك" })} className="block font-editorial text-4xl font-semibold text-green md:text-6xl" />

        {!ready ? (
          <div className="mt-10 space-y-3"><LineSkeleton /><LineSkeleton /></div>
        ) : lines.length === 0 ? (
          <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-n200 bg-n100 px-6 py-20 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-green/10 text-green"><ShoppingBag className="h-7 w-7" /></span>
            <p className="font-editorial text-2xl font-semibold text-green">{l({ en: "Your bag is empty", ar: "السلة فارغة" })}</p>
            <Link href="/shop" className="btn btn-primary">{l({ en: "Browse the shop", ar: "تصفّح المتجر" })}</Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <CartLines />
            <aside className="h-fit rounded-2xl border border-n200 bg-n100 p-6 lg:sticky lg:top-28">
              <OrderSummary />
              {blocked && <p role="alert" className="mt-3 text-xs text-[#A8322F]">{l({ en: "Fix the highlighted items to continue.", ar: "راجع المنتجات المنبَّه عليها لتكمل الطلب." })}</p>}
              <Link href="/checkout" aria-disabled={blocked} className={`btn btn-primary mt-5 w-full ${blocked ? "pointer-events-none opacity-40" : ""}`}>
                {l({ en: "Checkout", ar: "إتمام الطلب" })}
              </Link>
              <Link href="/shop" className="mt-3 block text-center text-sm font-medium text-green hover:underline">{l({ en: "Continue shopping", ar: "متابعة التسوق" })}</Link>
            </aside>
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
