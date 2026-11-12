import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Our story", description: "A Cairo roastery built on one idea: coffee tastes better together." };

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
