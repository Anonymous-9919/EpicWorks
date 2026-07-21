"use server";

import { db } from "@/db";
import { services, categories } from "@/db/schema";
import { eq, asc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const serviceSchema = z.object({
  nameEn: z.string().min(1),
  nameAr: z.string().min(1),
  slug: z.string().min(1),
  descriptionEn: z.string().optional(),
  descriptionAr: z.string().optional(),
  price: z.coerce.number().min(0),
  originalPrice: z.coerce.number().optional().nullable(),
  categorySlug: z.string().min(1),
  images: z.array(z.string()).optional(),
  specs: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  featured: z.coerce.boolean().optional(),
  onSale: z.coerce.boolean().optional(),
  inStock: z.coerce.boolean().optional(),
  status: z.string().optional(),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

export async function getCategoriesAction() {
  return db.select().from(categories).orderBy(asc(categories.sortOrder));
}

export async function getServiceAction(id: number) {
  const rows = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return rows[0] || null;
}

export async function getServicesAction(search?: string, categorySlug?: string, status?: string) {
  const conditions = [];

  if (search) {
    conditions.push(
      sql`(${services.nameEn} ILIKE ${`%${search}%`} OR ${services.nameAr} ILIKE ${`%${search}%`})`
    );
  }
  if (categorySlug && categorySlug !== "all") {
    conditions.push(eq(services.categorySlug, categorySlug));
  }
  if (status && status !== "all") {
    conditions.push(eq(services.status, status));
  }

  const query = db
    .select()
    .from(services)
    .orderBy(asc(services.sortOrder));

  const result = conditions.length > 0
    ? await query.where(sql.join(conditions, sql` AND `))
    : await query;

  return result;
}

export async function createServiceAction(data: ServiceFormData) {
  const parsed = serviceSchema.parse(data);

  const maxOrder = await db
    .select({ max: sql<number>`COALESCE(MAX(${services.sortOrder}), -1) + 1` })
    .from(services);

  const sortOrder = maxOrder[0]?.max ?? 0;

  await db.insert(services).values({
    ...parsed,
    originalPrice: parsed.originalPrice ? String(parsed.originalPrice) : null,
    price: String(parsed.price),
    featured: parsed.featured ?? false,
    onSale: parsed.onSale ?? false,
    inStock: parsed.inStock ?? true,
    images: parsed.images ?? [],
    specs: parsed.specs ?? [],
    tags: parsed.tags ?? [],
    status: parsed.status ?? "published",
    sortOrder,
    rating: "0",
    reviewCount: 0,
  });

  revalidatePath("/admin/services");
}

export async function updateServiceAction(id: number, data: ServiceFormData) {
  const parsed = serviceSchema.parse(data);

  await db
    .update(services)
    .set({
      ...parsed,
    originalPrice: parsed.originalPrice !== undefined ? String(parsed.originalPrice) : null,
      price: String(parsed.price),
      featured: parsed.featured ?? false,
      onSale: parsed.onSale ?? false,
      inStock: parsed.inStock ?? true,
      images: parsed.images ?? [],
      specs: parsed.specs ?? [],
      tags: parsed.tags ?? [],
      status: parsed.status ?? "published",
    })
    .where(eq(services.id, id));

  revalidatePath("/admin/services");
}

export async function deleteServiceAction(id: number) {
  await db.delete(services).where(eq(services.id, id));
  revalidatePath("/admin/services");
}

export async function duplicateServiceAction(id: number) {
  const original = await db
    .select()
    .from(services)
    .where(eq(services.id, id))
    .limit(1);

  if (original.length === 0) return;

  const s = original[0];
  const newSlug = `${s.slug}-copy`;

  const maxOrder = await db
    .select({ max: sql<number>`COALESCE(MAX(${services.sortOrder}), 0) + 1` })
    .from(services);

  await db.insert(services).values({
    nameEn: `${s.nameEn} (Copy)`,
    nameAr: `${s.nameAr} (نسخة)`,
    slug: newSlug,
    descriptionEn: s.descriptionEn,
    descriptionAr: s.descriptionAr,
    price: s.price,
    originalPrice: s.originalPrice,
    categorySlug: s.categorySlug,
    images: s.images,
    specs: s.specs,
    tags: s.tags,
    featured: false,
    onSale: false,
    inStock: s.inStock,
    rating: "0",
    reviewCount: 0,
    sortOrder: maxOrder[0]?.max ?? 0,
    status: "draft",
  });

  revalidatePath("/admin/services");
}

export async function reorderServicesAction(ids: number[]) {
  for (let i = 0; i < ids.length; i++) {
    await db
      .update(services)
      .set({ sortOrder: i })
      .where(eq(services.id, ids[i]));
  }

  revalidatePath("/admin/services");
}

export async function toggleStatusAction(id: number, status: string) {
  await db
    .update(services)
    .set({ status })
    .where(eq(services.id, id));

  revalidatePath("/admin/services");
}
