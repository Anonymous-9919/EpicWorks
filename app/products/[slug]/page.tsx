import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/products";
import ProductDetailClient from "./detail-client";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const allProducts = await getProducts();
  const related = allProducts
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  return (
    <ProductDetailClient
      product={JSON.parse(JSON.stringify(product))}
      related={JSON.parse(JSON.stringify(related))}
    />
  );
}
