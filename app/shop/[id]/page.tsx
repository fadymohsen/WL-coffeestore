import { Suspense } from "react";
import type { Metadata } from "next";
import { PRODUCTS } from "@/data/products";
import ProductView from "@/components/shop/ProductView";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = PRODUCTS.find((x) => x.id === id);
  return {
    title: p ? `${p.nameEn} | DIWAN ديوان` : "DIWAN ديوان",
    description: p ? p.copyEn : undefined,
  };
}

async function Product({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductView id={id} />;
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<main id="main" className="min-h-screen bg-sandy" aria-busy="true" />}>
      <Product params={params} />
    </Suspense>
  );
}
