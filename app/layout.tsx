import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Noto_Naskh_Arabic, Amiri, IBM_Plex_Sans_Arabic, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import LangSync from "@/components/providers/LangSync";
import StoreHydrator from "@/components/providers/StoreHydrator";
import Toaster from "@/components/ui/Toaster";
import ConfirmHost from "@/components/ui/ConfirmHost";
import SkipLink from "@/components/ui/SkipLink";
import ProgressGate from "@/components/ui/ProgressGate";

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

const amiri = Amiri({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-amiri", display: "swap" });
const plex = IBM_Plex_Sans_Arabic({ subsets: ["arabic", "latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-plex", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-cormorant", display: "swap" });

export const metadata: Metadata = {
  title: { default: "DIWAN ديوان | Coffee for every culture", template: "%s | DIWAN ديوان" },
  description: "Cairo coffee roastery. Nine blends: Turkish, espresso and flavored. قهوة ديوان.",
  applicationName: "DIWAN",
  openGraph: { siteName: "DIWAN ديوان", type: "website", images: ["/assets/diwan/Diwan_OpenGraph_Green_1200x630.png"] },
  twitter: { card: "summary_large_image" },
};

export const viewport = { themeColor: "#0E3A33" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning className={`${playfair.variable} ${jakarta.variable} ${notoArabic.variable} ${amiri.variable} ${plex.variable} ${cormorant.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased">
        <SkipLink />
        <ProgressGate />
        <LangSync />
        <StoreHydrator />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <Toaster />
        <ConfirmHost />
      </body>
    </html>
  );
}
