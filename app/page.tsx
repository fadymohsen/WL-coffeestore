import HeaderNav from "@/components/layout/HeaderNav";
import CartDrawer from "@/components/layout/CartDrawer";
import Footer from "@/components/layout/Footer";
import DiwanSections from "@/components/diwan/DiwanSections";
import PourPlayMasterScene from "@/components/scrollytelling/PourPlayMasterScene";

export default function HomePage() {
  return (
    <main id="top" className="relative">
      <HeaderNav />
      <PourPlayMasterScene />
      <DiwanSections />
      <Footer />
      <CartDrawer />
    </main>
  );
}
