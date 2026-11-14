import type { Metadata } from "next";
import HeaderNav from "@/components/layout/HeaderNav";
import CartDrawer from "@/components/layout/CartDrawer";
import Footer from "@/components/layout/Footer";
import PourPlayMasterScene from "@/components/scrollytelling/PourPlayMasterScene";

export const metadata: Metadata = {
  title: "DIWAN — Coffee for Every Culture | قهوة لكل ثقافة",
  description:
    "Discover DIWAN's signature coffee rituals — from bean to cup. Premium Egyptian coffee blends, specialty single-origins & Turkish coffee. | اكتشف طقوس قهوة ديوان — من الحبة للفنجان. خلطات قهوة مصرية فاخرة، قهوة مختصة، وقهوة تركي.",
  openGraph: {
    title: "DIWAN — Coffee for Every Culture | قهوة لكل ثقافة",
    description:
      "Discover DIWAN's signature coffee rituals — from bean to cup. Premium Egyptian blends, specialty & Turkish coffee. | اكتشف طقوس قهوة ديوان — من الحبة للفنجان.",
    url: "/",
    images: [
      {
        url: "/og-home.png",
        width: 1200,
        height: 630,
        alt: "DIWAN — Coffee for Every Culture | قهوة لكل ثقافة",
      },
    ],
  },
  twitter: {
    title: "DIWAN — Coffee for Every Culture | قهوة لكل ثقافة",
    description:
      "Discover DIWAN's signature coffee rituals — from bean to cup. | اكتشف طقوس قهوة ديوان — من الحبة للفنجان.",
    images: ["/og-home.png"],
  },
};

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
