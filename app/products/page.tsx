import { Suspense } from "react";
import { ProductsContent } from "./content";
import { getProducts, getCategories } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-6 md:py-10"><div className="h-8 bg-surface-light rounded-lg w-48 mb-6 animate-pulse" /><div className="grid grid-cols-2 md:grid-cols-3 gap-4"><div className="aspect-[3/4] bg-surface-light rounded-2xl animate-pulse" /><div className="aspect-[3/4] bg-surface-light rounded-2xl animate-pulse" /><div className="aspect-[3/4] bg-surface-light rounded-2xl animate-pulse" /></div></div>}>
      <ProductsContent
        initialProducts={JSON.parse(JSON.stringify(products))}
        initialCategories={JSON.parse(JSON.stringify(categories))}
      />
    </Suspense>
  );
}
