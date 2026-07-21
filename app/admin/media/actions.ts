"use server";

import { db } from "@/db";
import { media } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { deleteImageFromRepo } from "@/lib/github";

export async function getMediaAction(search?: string) {
  if (search) {
    return db
      .select()
      .from(media)
      .where(sql`${media.fileName} ILIKE ${`%${search}%`}`)
      .orderBy(desc(media.createdAt));
  }
  return db.select().from(media).orderBy(desc(media.createdAt));
}

export async function createMediaAction(data: {
  fileName: string;
  fileType: string;
  fileSize: number;
  storagePath: string;
  publicUrl: string;
  altEn?: string;
  altAr?: string;
}) {
  await db.insert(media).values(data);
  revalidatePath("/admin/media");
}

export async function deleteMediaAction(id: number) {
  const rows = await db.select().from(media).where(eq(media.id, id)).limit(1);
  if (rows.length > 0) {
    await deleteImageFromRepo(rows[0].storagePath);
  }
  await db.delete(media).where(eq(media.id, id));
  revalidatePath("/admin/media");
}

export async function updateMediaAction(
  id: number,
  data: { altEn?: string; altAr?: string }
) {
  await db.update(media).set(data).where(eq(media.id, id));
  revalidatePath("/admin/media");
}
