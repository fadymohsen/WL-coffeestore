import type { Metadata } from "next";
import HeaderNav from "@/components/layout/HeaderNav";
import CartDrawer from "@/components/layout/CartDrawer";
import Footer from "@/components/layout/Footer";
import PourPlayMasterScene from "@/components/scrollytelling/PourPlayMasterScene";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wl-coffeestore-o0vd8l50t-veliq.vercel.app";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isAr = lang === "ar";

  return {
    title: isAr
      ? "ديوان — قهوة لكل ثقافة"
      : "DIWAN — Coffee for Every Culture",
    description: isAr
      ? "اكتشف طقوس قهوة ديوان — من الحبة للفنجان. خلطات قهوة مصرية فاخرة، قهوة مختصة، وقهوة تركي."
      : "Discover DIWAN's signature coffee rituals — from bean to cup. Premium Egyptian coffee blends, specialty single-origins & Turkish coffee.",
    openGraph: {
      title: isAr ? "ديوان — قهوة لكل ثقافة" : "DIWAN — Coffee for Every Culture",
      description: isAr
        ? "اكتشف طقوس قهوة ديوان — من الحبة للفنجان."
        : "Discover DIWAN's signature coffee rituals — from bean to cup.",
      url: `${SITE_URL}/${lang}`,
      images: [{ url: "/og-home.png", width: 1200, height: 630 }],
    },
    twitter: {
      title: isAr ? "ديوان — قهوة لكل ثقافة" : "DIWAN — Coffee for Every Culture",
      description: isAr
        ? "اكتشف طقوس قهوة ديوان — من الحبة للفنجان."
        : "Discover DIWAN's signature coffee rituals — from bean to cup.",
      images: ["/og-home.png"],
    },
    alternates: {
      canonical: `${SITE_URL}/${lang}`,
      languages: { en: `${SITE_URL}/en`, ar: `${SITE_URL}/ar` },
    },
  };
}

export default function HomePage() {
  return (
    <main id="top" className="relative">
      <HeaderNav />
      <PourPlayMasterScene />
      <Footer />
      <CartDrawer />
    </main>
  );
}
