"use client";

import Link from "next/link";
import HeaderNav from "@/components/layout/HeaderNav";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import { useLocalized } from "@/lib/i18n";

export default function NotFound() {
  const l = useLocalized();
  return (
    <main id="main" data-header-solid className="relative bg-sandy">
      <HeaderNav />
      <CartDrawer />
      <section className="mx-auto flex min-h-[70svh] max-w-[720px] flex-col items-center justify-center px-5 pb-20 pt-40 text-center">
        <h1 className="font-editorial text-5xl font-semibold text-green md:text-7xl">{l({ en: "This page is not here", ar: "هذه الصفحة غير موجودة" })}</h1>
        <p className="mt-5 max-w-md text-base text-n500">{l({ en: "The link may be old, or the page has moved. The shop is a good place to start.", ar: "ربما الرابط قديم أو نُقلت الصفحة. يمكنك البدء من المتجر." })}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="btn btn-primary">{l({ en: "Go to the shop", ar: "اذهب إلى المتجر" })}</Link>
          <Link href="/" className="btn btn-ghost">{l({ en: "Back home", ar: "الرئيسية" })}</Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
