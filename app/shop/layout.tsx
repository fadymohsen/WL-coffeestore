import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shop | DIWAN ديوان", description: "Nine coffee blends in three categories, 200 g each, priced in Egyptian pounds." };

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
