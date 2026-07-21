"use server";

import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, asc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const categorySchema = z.object({
  nameEn: z.string().min(1),
  nameAr: z.string().min(1),
  slug: z.string().min(1),
});

export async function getCategoriesAction() {
  return db.select().from(categories).orderBy(asc(categories.sortOrder));
}

export async function createCategoryAction(data: z.infer<typeof categorySchema>) {
  const parsed = categorySchema.parse(data);

  const maxOrder = await db
    .select({ max: sql<number>`COALESCE(MAX(sort_order), -1) + 1` })
    .from(categories);

  await db.insert(categories).values({
    ...parsed,
    sortOrder: maxOrder[0]?.max ?? 0,
  });

  revalidatePath("/admin/categories");
}

export async function updateCategoryAction(
  id: number,
  data: z.infer<typeof categorySchema>
) {
  const parsed = categorySchema.parse(data);
  await db.update(categories).set(parsed).where(eq(categories.id, id));
  revalidatePath("/admin/categories");
}

export async function deleteCategoryAction(id: number) {
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/admin/categories");
}

export async function reorderCategoriesAction(ids: number[]) {
  for (let i = 0; i < ids.length; i++) {
    await db
      .update(categories)
      .set({ sortOrder: i })
      .where(eq(categories.id, ids[i]));
  }
  revalidatePath("/admin/categories");
}
