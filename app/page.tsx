import HeaderNav from "@/components/layout/HeaderNav";
import CartDrawer from "@/components/layout/CartDrawer";
import Footer from "@/components/layout/Footer";
import DiwanSections from "@/components/diwan/DiwanSections";
import PourPlayMasterScene from "@/components/scrollytelling/PourPlayMasterScene";

export const metadata = { title: { absolute: "DIWAN ديوان | Coffee for every culture" }, description: "Cairo coffee roastery. Nine blends: Turkish, espresso and flavored." };

export default function HomePage() {
  return (
    <main id="main" className="relative">
      <HeaderNav />
      <PourPlayMasterScene />
      <DiwanSections />
      <Footer />
      <CartDrawer />
    </main>
  );
}
