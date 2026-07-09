import productsData from "@/data/products.json";
import type { Product, Category } from "@/types";
import type { Locale } from "@/lib/translations";

function localize(p: Product, locale: Locale): Product {
  return {
    ...p,
    name: locale === "ar" && p.nameAr ? p.nameAr : p.name,
    description: locale === "ar" && p.descriptionAr ? p.descriptionAr : p.description,
    category: locale === "ar" && p.categoryAr ? p.categoryAr : p.category,
  };
}

export function getProducts(locale?: Locale): Product[] {
  const products = productsData as Product[];
  return locale ? products.map((p) => localize(p, locale)) : products;
}

export function getProductBySlug(slug: string, locale?: Locale): Product | undefined {
  return getProducts(locale).find((p) => p.slug === slug);
}

export function getCategories(locale?: Locale): Category[] {
  const products = getProducts(locale);
  const map = new Map<string, Category>();
  for (const p of products) {
    if (!map.has(p.category)) {
      map.set(p.category, { name: p.category, slug: p.categorySlug, count: 0 });
    }
    map.get(p.category)!.count++;
  }
  return Array.from(map.values());
}

export function getProductsByCategory(slug: string, locale?: Locale): Product[] {
  return getProducts(locale).filter((p) => p.categorySlug === slug);
}

export function getFeaturedProducts(locale?: Locale): Product[] {
  return getProducts(locale).filter((p) => p.featured);
}

export function getNewArrivals(locale?: Locale): Product[] {
  return [...getProducts(locale)].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 8);
}

export function searchProducts(query: string, locale?: Locale): Product[] {
  const q = query.toLowerCase();
  return getProducts(locale).filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q))
  );
}
