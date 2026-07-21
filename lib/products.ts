import { db } from "@/db";
import { services, categories } from "@/db/schema";
import { eq, asc, desc, sql, and, or, like } from "drizzle-orm";
import type { Product, Category } from "@/types";
import type { Locale } from "@/lib/translations";

type CategoryMap = Record<string, { nameEn: string; nameAr: string }>;

async function getCategoryMap(): Promise<CategoryMap> {
  const rows = await db
    .select({
      slug: categories.slug,
      nameEn: categories.nameEn,
      nameAr: categories.nameAr,
    })
    .from(categories);
  const map: CategoryMap = {};
  for (const r of rows) {
    map[r.slug] = { nameEn: r.nameEn, nameAr: r.nameAr };
  }
  return map;
}

function toProduct(s: any, catMap: CategoryMap, locale?: Locale): Product {
  const name = locale === "ar" ? (s.nameAr || s.nameEn) : s.nameEn;
  const description = locale === "ar" ? (s.descriptionAr || s.descriptionEn) : s.descriptionEn;
  const cat = catMap[s.categorySlug];

  return {
    id: s.slug,
    name,
    nameAr: s.nameAr,
    slug: s.slug,
    description,
    descriptionAr: s.descriptionAr,
    price: Number(s.price),
    originalPrice: s.originalPrice ? Number(s.originalPrice) : undefined,
    category: locale === "ar" ? (cat?.nameAr || cat?.nameEn || name) : (cat?.nameEn || name),
    categoryAr: cat?.nameAr || cat?.nameEn || s.nameAr,
    categorySlug: s.categorySlug,
    images: s.images || [],
    specs: s.specs || [],
    tags: s.tags || [],
    featured: s.featured,
    onSale: s.onSale,
    inStock: s.inStock,
    rating: Number(s.rating) || 0,
    reviewCount: s.reviewCount || 0,
    createdAt: s.createdAt?.toISOString?.() || new Date().toISOString(),
  };
}

function localizeCategory(c: any, locale?: Locale): Category {
  return {
    name: locale === "ar" ? c.nameAr : c.nameEn,
    nameAr: c.nameAr || c.nameEn,
    slug: c.slug,
    count: 0,
  };
}

export async function getProducts(locale?: Locale): Promise<Product[]> {
  const [rows, catMap] = await Promise.all([
    db
      .select()
      .from(services)
      .where(eq(services.status, "published"))
      .orderBy(asc(services.sortOrder)),
    getCategoryMap(),
  ]);

  return rows.map((s) => toProduct(s, catMap, locale));
}

export async function getProductBySlug(
  slug: string,
  locale?: Locale
): Promise<Product | undefined> {
  const [rows, catMap] = await Promise.all([
    db
      .select()
      .from(services)
      .where(and(eq(services.slug, slug), eq(services.status, "published")))
      .limit(1),
    getCategoryMap(),
  ]);

  return rows[0] ? toProduct(rows[0], catMap, locale) : undefined;
}

export async function getCategories(locale?: Locale): Promise<Category[]> {
  const catRows = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.sortOrder));

  const serviceCounts: Record<string, number> = {};
  const servicesResult = await db
    .select({
      categorySlug: services.categorySlug,
      count: sql<number>`COUNT(*)`,
    })
    .from(services)
    .where(eq(services.status, "published"))
    .groupBy(services.categorySlug);

  for (const row of servicesResult) {
    serviceCounts[row.categorySlug] = Number(row.count);
  }

  return catRows.map((c) => ({
    ...localizeCategory(c, locale),
    count: serviceCounts[c.slug] || 0,
  }));
}

export async function getProductsByCategory(
  slug: string,
  locale?: Locale
): Promise<Product[]> {
  const [rows, catMap] = await Promise.all([
    db
      .select()
      .from(services)
      .where(
        and(eq(services.categorySlug, slug), eq(services.status, "published"))
      )
      .orderBy(asc(services.sortOrder)),
    getCategoryMap(),
  ]);

  return rows.map((s) => toProduct(s, catMap, locale));
}

export async function getFeaturedProducts(locale?: Locale): Promise<Product[]> {
  const [rows, catMap] = await Promise.all([
    db
      .select()
      .from(services)
      .where(
        and(eq(services.featured, true), eq(services.status, "published"))
      )
      .orderBy(asc(services.sortOrder))
      .limit(8),
    getCategoryMap(),
  ]);

  return rows.map((s) => toProduct(s, catMap, locale));
}

export async function getNewArrivals(locale?: Locale): Promise<Product[]> {
  const [rows, catMap] = await Promise.all([
    db
      .select()
      .from(services)
      .where(eq(services.status, "published"))
      .orderBy(desc(services.createdAt))
      .limit(8),
    getCategoryMap(),
  ]);

  return rows.map((s) => toProduct(s, catMap, locale));
}

export async function searchProducts(
  query: string,
  locale?: Locale
): Promise<Product[]> {
  const q = `%${query}%`;
  const [rows, catMap] = await Promise.all([
    db
      .select()
      .from(services)
      .where(
        and(
          eq(services.status, "published"),
          or(
            like(services.nameEn, q),
            like(services.nameAr, q),
            like(services.descriptionEn, q),
            like(services.descriptionAr, q),
            like(services.categorySlug, q)
          )
        )
      )
      .orderBy(asc(services.sortOrder)),
    getCategoryMap(),
  ]);

  return rows.map((s) => toProduct(s, catMap, locale));
}
