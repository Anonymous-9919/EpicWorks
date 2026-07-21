"use server";

import { db } from "@/db";
import { settings } from "@/db/schema";
import { revalidatePath } from "next/cache";

const SETTING_KEYS = [
  "company_name",
  "tagline",
  "phone",
  "email",
  "whatsapp",
  "address",
  "instagram",
  "linkedin",
  "twitter",
  "tiktok",
  "youtube",
  "working_hours",
  "seo_title",
  "seo_description",
] as const;

export type SettingsMap = Record<string, string>;

export async function getSettingsAction(): Promise<SettingsMap> {
  const rows = await db.select().from(settings);
  const map: SettingsMap = {};
  for (const row of rows) {
    map[`${row.key}_en`] = row.valueEn ?? "";
    map[`${row.key}_ar`] = row.valueAr ?? "";
  }
  return map;
}

export async function saveSettingsAction(data: Record<string, string>) {
  for (const [fullKey, value] of Object.entries(data)) {
    const match = fullKey.match(/^(.+)_(en|ar)$/);
    if (!match) continue;

    const key = match[1];
    const lang = match[2] as "en" | "ar";

    await db
      .insert(settings)
      .values({
        key,
        valueEn: lang === "en" ? value : undefined,
        valueAr: lang === "ar" ? value : undefined,
      })
      .onConflictDoUpdate({
        target: settings.key,
        set: {
          valueEn: lang === "en" ? value : undefined,
          valueAr: lang === "ar" ? value : undefined,
          updatedAt: new Date(),
        },
      });
  }
}
