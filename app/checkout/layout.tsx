import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Checkout | DIWAN ديوان", description: "Place your order. Cash on delivery.", robots: { index: false, follow: false } };

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
