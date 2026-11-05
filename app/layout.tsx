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

export const metadata: Metadata = {
  title: "DIWAN — قهوة لكل ثقافة",
  description:
    "ديوان قهوة للذوق المصري. طعم يعتمد عليه، واختيار واضح، وتجربة لها شخصية. Coffee for every culture.",
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
