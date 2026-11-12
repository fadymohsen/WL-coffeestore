import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Your bag", description: "Review the blends in your bag.", robots: { index: false, follow: false } };

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
