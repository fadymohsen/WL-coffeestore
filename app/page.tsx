import HeaderNav from "@/components/layout/HeaderNav";
import CartDrawer from "@/components/layout/CartDrawer";
import PourPlayMasterScene from "@/components/scrollytelling/PourPlayMasterScene";

export default function HomePage() {
  return (
    <main id="top" className="relative">
      <HeaderNav />
      <PourPlayMasterScene />
      <CartDrawer />
    </main>
  );
}
