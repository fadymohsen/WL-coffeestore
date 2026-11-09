import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Our story | DIWAN ديوان", description: "A Cairo roastery built on one idea: a cup is better with people around it." };

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
