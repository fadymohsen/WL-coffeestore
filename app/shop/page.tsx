import type { Metadata } from "next";
import ShopPageClient from "./ShopPageClient";

export const metadata: Metadata = {
  title: "Shop Coffee | تسوّق القهوة",
  description:
    "Browse DIWAN's curated coffee collection — premium blends, single-origin specialty, and authentic Turkish coffee. From 95 EGP. | تصفّح مجموعة قهوة ديوان — خلطات فاخرة، قهوة مختصة أحادية المصدر، وقهوة تركي أصيلة.",
  openGraph: {
    title: "Shop DIWAN Coffee | تسوّق قهوة ديوان",
    description:
      "Premium blends, single-origin specialty & Turkish coffee. Uns, Majlis, Rihla, Sultan — find your perfect cup. | خلطات فاخرة، قهوة مختصة وقهوة تركي. أُنس، مجلس، رحلة، سلطان — اختار فنجانك.",
    url: "/shop",
    images: [
      {
        url: "/og-shop.png",
        width: 1200,
        height: 630,
        alt: "Shop DIWAN Coffee | تسوّق قهوة ديوان",
      },
    ],
  },
  twitter: {
    title: "Shop DIWAN Coffee | تسوّق قهوة ديوان",
    description:
      "Premium blends, specialty & Turkish coffee — find your perfect cup. | خلطات فاخرة، قهوة مختصة وقهوة تركي — اختار فنجانك.",
    images: ["/og-shop.png"],
  },
  alternates: {
    canonical: "/shop",
  },
};

export default function ShopPage() {
  return <ShopPageClient />;
}
