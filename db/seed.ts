import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./index";
import { categories, services } from "./schema";
import productsData from "../data/products.json";

interface ProductJSON {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  price: number;
  originalPrice?: number;
  category: string;
  categoryAr: string;
  categorySlug: string;
  images: string[];
  specs?: string[];
  tags?: string[];
  featured?: boolean;
  onSale?: boolean;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

async function seed() {
  console.log("Seeding categories...");

  const products = productsData as ProductJSON[];
  const categoryMap = new Map<
    string,
    { nameEn: string; nameAr: string; slug: string }
  >();

  for (const p of products) {
    if (!categoryMap.has(p.categorySlug)) {
      categoryMap.set(p.categorySlug, {
        nameEn: p.category,
        nameAr: p.categoryAr,
        slug: p.categorySlug,
      });
    }
  }

  const categoryList = Array.from(categoryMap.values());
  let sortOrder = 0;
  for (const cat of categoryList) {
    await db
      .insert(categories)
      .values({
        nameEn: cat.nameEn,
        nameAr: cat.nameAr,
        slug: cat.slug,
        sortOrder: sortOrder++,
      })
      .onConflictDoNothing({ target: categories.slug });
  }

  console.log(`Seeded ${categoryList.length} categories`);

  console.log("Seeding services...");
  let serviceOrder = 0;
  for (const p of products) {
    await db
      .insert(services)
      .values({
        nameEn: p.name,
        nameAr: p.nameAr,
        slug: p.slug,
        descriptionEn: p.description,
        descriptionAr: p.descriptionAr,
        price: String(p.price),
        originalPrice: p.originalPrice ? String(p.originalPrice) : null,
        categorySlug: p.categorySlug,
        images: p.images,
        specs: p.specs || [],
        tags: p.tags || [],
        featured: p.featured || false,
        onSale: p.onSale || false,
        inStock: p.inStock,
        rating: String(p.rating),
        reviewCount: p.reviewCount,
        sortOrder: serviceOrder++,
        status: "published",
      })
      .onConflictDoNothing({ target: services.slug });
  }

  console.log(`Seeded ${products.length} services`);
  console.log("Seed complete!");
}

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
