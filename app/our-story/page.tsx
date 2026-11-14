import type { Metadata } from "next";
import OurStoryClient from "./OurStoryClient";

export const metadata: Metadata = {
  title: "Our Story | قصتنا",
  description:
    "The story behind DIWAN — an Egyptian coffee brand rooted in culture, crafted with purpose. Discover our values, our promise, and who we brew for. | قصة ديوان — علامة قهوة مصرية متجذرة في الثقافة، مصنوعة بهدف. اكتشف قيمنا، وعدنا، ولمين بنحضّر القهوة.",
  openGraph: {
    title: "Our Story — DIWAN Coffee | قصتنا — ديوان قهوة",
    description:
      "An Egyptian coffee brand rooted in culture, crafted with purpose. Discover our values and our promise. | علامة قهوة مصرية متجذرة في الثقافة. اكتشف قيمنا ووعدنا.",
    url: "/our-story",
    images: [
      {
        url: "/og-story.png",
        width: 1200,
        height: 630,
        alt: "Our Story — DIWAN Coffee | قصتنا — ديوان قهوة",
      },
    ],
  },
  twitter: {
    title: "Our Story — DIWAN Coffee | قصتنا — ديوان قهوة",
    description:
      "An Egyptian coffee brand rooted in culture, crafted with purpose. | علامة قهوة مصرية متجذرة في الثقافة.",
    images: ["/og-story.png"],
  },
  alternates: {
    canonical: "/our-story",
  },
};

export default function OurStoryPage() {
  return <OurStoryClient />;
}
