import { scrollToY } from "@/components/providers/SmoothScrollProvider";

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  scrollToY(el.getBoundingClientRect().top + window.scrollY);
}
