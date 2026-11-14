import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import LangSync from "@/components/providers/LangSync";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const notoArabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-arabic",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://diwancoffee.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DIWAN — Coffee for Every Culture | قهوة لكل ثقافة",
    template: "%s | DIWAN Coffee",
  },
  description:
    "DIWAN — premium Egyptian coffee crafted for every culture. Reliable taste, clear choice, and an experience with character. | ديوان — قهوة مصرية فاخرة لكل ثقافة. طعم يعتمد عليه، واختيار واضح، وتجربة لها شخصية.",
  keywords: [
    "DIWAN", "ديوان", "coffee", "قهوة", "Egyptian coffee", "قهوة مصرية",
    "specialty coffee", "Turkish coffee", "قهوة تركي", "blend", "بن",
    "Cairo", "القاهرة", "Egypt", "مصر",
  ],
  authors: [{ name: "DIWAN Coffee" }],
  creator: "DIWAN Coffee",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "ar_EG",
    siteName: "DIWAN Coffee | ديوان قهوة",
    title: "DIWAN — Coffee for Every Culture | قهوة لكل ثقافة",
    description:
      "Premium Egyptian coffee crafted for every culture. Reliable taste, clear choice, and an experience with character. | قهوة مصرية فاخرة لكل ثقافة. طعم يعتمد عليه، واختيار واضح، وتجربة لها شخصية.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "DIWAN — Coffee for Every Culture | قهوة لكل ثقافة",
    description:
      "Premium Egyptian coffee crafted for every culture. | قهوة مصرية فاخرة لكل ثقافة.",
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en": SITE_URL,
      "ar": SITE_URL,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning className={`${playfair.variable} ${jakarta.variable} ${notoArabic.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased">
        <LangSync />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
