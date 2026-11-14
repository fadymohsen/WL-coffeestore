import type { Metadata } from "next";
import ShopPageClient from "./ShopPageClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wl-coffeestore-o0vd8l50t-veliq.vercel.app";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isAr = lang === "ar";

  return {
    title: isAr ? "تسوّق القهوة" : "Shop Coffee",
    description: isAr
      ? "تصفّح مجموعة قهوة ديوان — خلطات فاخرة، قهوة مختصة أحادية المصدر، وقهوة تركي أصيلة."
      : "Browse DIWAN's curated coffee collection — premium blends, single-origin specialty, and authentic Turkish coffee. From 95 EGP.",
    openGraph: {
      title: isAr ? "تسوّق قهوة ديوان" : "Shop DIWAN Coffee",
      description: isAr
        ? "خلطات فاخرة، قهوة مختصة وقهوة تركي. أُنس، مجلس، رحلة، سلطان — اختار فنجانك."
        : "Premium blends, single-origin specialty & Turkish coffee. Uns, Majlis, Rihla, Sultan — find your perfect cup.",
      url: `${SITE_URL}/${lang}/shop`,
      images: [{ url: "/og-shop.png", width: 1200, height: 630 }],
    },
    twitter: {
      title: isAr ? "تسوّق قهوة ديوان" : "Shop DIWAN Coffee",
      description: isAr
        ? "خلطات فاخرة، قهوة مختصة وقهوة تركي — اختار فنجانك."
        : "Premium blends, specialty & Turkish coffee — find your perfect cup.",
      images: ["/og-shop.png"],
    },
    alternates: {
      canonical: `${SITE_URL}/${lang}/shop`,
      languages: { en: `${SITE_URL}/en/shop`, ar: `${SITE_URL}/ar/shop` },
    },
  };
}

export default function ShopPage() {
  return <ShopPageClient />;
}
