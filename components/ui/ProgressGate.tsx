"use client";

import { usePathname } from "next/navigation";
import { ScrollProgress } from "@/components/ui/motion";

export default function ProgressGate() {
  const path = usePathname();
  if (path.startsWith("/admin")) return null;
  return <ScrollProgress />;
}
