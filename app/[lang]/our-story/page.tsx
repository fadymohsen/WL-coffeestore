import type { Metadata } from "next";
import OurStoryClient from "./OurStoryClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wl-coffeestore-o0vd8l50t-veliq.vercel.app";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isAr = lang === "ar";

  return {
    title: isAr ? "قصتنا" : "Our Story",
    description: isAr
      ? "قصة ديوان — علامة قهوة مصرية متجذرة في الثقافة، مصنوعة بهدف. اكتشف قيمنا، وعدنا، ولمين بنحضّر القهوة."
      : "The story behind DIWAN — an Egyptian coffee brand rooted in culture, crafted with purpose. Discover our values, our promise, and who we brew for.",
    openGraph: {
      title: isAr ? "قصتنا — ديوان قهوة" : "Our Story — DIWAN Coffee",
      description: isAr
        ? "علامة قهوة مصرية متجذرة في الثقافة. اكتشف قيمنا ووعدنا."
        : "An Egyptian coffee brand rooted in culture, crafted with purpose. Discover our values and our promise.",
      url: `${SITE_URL}/${lang}/our-story`,
      images: [{ url: "/og-story.png", width: 1200, height: 630 }],
    },
    twitter: {
      title: isAr ? "قصتنا — ديوان قهوة" : "Our Story — DIWAN Coffee",
      description: isAr
        ? "علامة قهوة مصرية متجذرة في الثقافة."
        : "An Egyptian coffee brand rooted in culture, crafted with purpose.",
      images: ["/og-story.png"],
    },
    alternates: {
      canonical: `${SITE_URL}/${lang}/our-story`,
      languages: { en: `${SITE_URL}/en/our-story`, ar: `${SITE_URL}/ar/our-story` },
    },
  };
}

export default function OurStoryPage() {
  return <OurStoryClient />;
}
