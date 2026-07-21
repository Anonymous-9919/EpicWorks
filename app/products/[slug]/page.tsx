import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import ProductDetailClient from "./detail-client";

export const dynamic = "force-dynamic";

function ProductDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
      <div className="h-5 bg-surface-light rounded w-32 mb-6 animate-pulse" />
      <div className="grid md:grid-cols-2 gap-6 md:gap-12">
        <div>
          <div className="aspect-[4/3] bg-surface-light rounded-2xl animate-pulse" />
          <div className="flex gap-2 mt-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-16 h-16 rounded-xl bg-surface-light animate-pulse" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-5 bg-surface-light rounded w-20 animate-pulse" />
          <div className="h-8 bg-surface-light rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-surface-light rounded w-24 animate-pulse" />
          <div className="h-20 bg-surface-light rounded animate-pulse" />
          <div className="h-10 bg-surface-light rounded w-40 animate-pulse" />
          <div className="h-14 bg-surface-light rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.categorySlug, product.slug);

  return (
    <Suspense fallback={<ProductDetailLoading />}>
      <ProductDetailClient
        product={JSON.parse(JSON.stringify(product))}
        related={JSON.parse(JSON.stringify(related))}
      />
    </Suspense>
  );
}
