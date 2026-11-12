import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shop", description: "Nine coffee blends, 200 g each, in Egyptian pounds." };

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
