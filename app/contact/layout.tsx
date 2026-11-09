import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact | DIWAN ديوان", description: "Ask us for a blend recommendation or help with an order." };

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
