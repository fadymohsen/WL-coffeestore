import type { Metadata } from "next";
import type { Lang } from "@/lib/i18n";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import LangSync from "@/components/providers/LangSync";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wl-coffeestore-o0vd8l50t-veliq.vercel.app";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ar" }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isAr = lang === "ar";

  return {
    title: {
      default: isAr
        ? "ديوان — قهوة لكل ثقافة"
        : "DIWAN — Coffee for Every Culture",
      template: isAr ? "%s | ديوان قهوة" : "%s | DIWAN Coffee",
    },
    description: isAr
      ? "ديوان — قهوة مصرية فاخرة لكل ثقافة. طعم يعتمد عليه، واختيار واضح، وتجربة لها شخصية."
      : "DIWAN — premium Egyptian coffee crafted for every culture. Reliable taste, clear choice, and an experience with character.",
    keywords: isAr
      ? ["ديوان", "قهوة", "قهوة مصرية", "قهوة مختصة", "قهوة تركي", "بن", "القاهرة", "مصر"]
      : ["DIWAN", "coffee", "Egyptian coffee", "specialty coffee", "Turkish coffee", "blend", "Cairo", "Egypt"],
    openGraph: {
      type: "website",
      locale: isAr ? "ar_EG" : "en_US",
      alternateLocale: isAr ? "en_US" : "ar_EG",
      siteName: isAr ? "ديوان قهوة" : "DIWAN Coffee",
      images: [{ url: "/og-home.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-home.png"],
    },
    alternates: {
      canonical: `${SITE_URL}/${lang}`,
      languages: {
        en: `${SITE_URL}/en`,
        ar: `${SITE_URL}/ar`,
      },
    },
  };
}

export default async function LangLayout({ children, params }: Props) {
  const { lang: rawLang } = await params;
  const lang = (rawLang === "ar" ? "ar" : "en") as Lang;

  return (
    <>
      <LangSync lang={lang} />
      <SmoothScrollProvider>{children}</SmoothScrollProvider>
    </>
  );
}
