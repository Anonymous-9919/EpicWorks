import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  integer,
  decimal,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    nameEn: varchar("name_en", { length: 255 }).notNull(),
    nameAr: varchar("name_ar", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("categories_slug_idx").on(table.slug)]
);

export const services = pgTable(
  "services",
  {
    id: serial("id").primaryKey(),
    nameEn: varchar("name_en", { length: 255 }).notNull(),
    nameAr: varchar("name_ar", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    descriptionEn: text("description_en"),
    descriptionAr: text("description_ar"),
    price: decimal("price", { precision: 10, scale: 3 }).notNull(),
    originalPrice: decimal("original_price", { precision: 10, scale: 3 }),
    categorySlug: varchar("category_slug", { length: 255 }).notNull(),
    images: jsonb("images").default([]).$type<string[]>().notNull(),
    specs: jsonb("specs").default([]).$type<string[]>().notNull(),
    tags: jsonb("tags").default([]).$type<string[]>().notNull(),
    featured: boolean("featured").default(false).notNull(),
    onSale: boolean("on_sale").default(false).notNull(),
    inStock: boolean("in_stock").default(true).notNull(),
    rating: decimal("rating", { precision: 3, scale: 2 }).default("0").notNull(),
    reviewCount: integer("review_count").default(0).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    status: varchar("status", { length: 20 }).default("published").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("services_slug_idx").on(table.slug),
    index("services_category_idx").on(table.categorySlug),
    index("services_status_idx").on(table.status),
    index("services_sort_idx").on(table.sortOrder),
  ]
);

export const media = pgTable(
  "media",
  {
    id: serial("id").primaryKey(),
    fileName: varchar("file_name", { length: 255 }).notNull(),
    fileType: varchar("file_type", { length: 100 }).notNull(),
    fileSize: integer("file_size"),
    storagePath: varchar("storage_path", { length: 500 }).notNull(),
    publicUrl: varchar("public_url", { length: 1000 }).notNull(),
    altEn: varchar("alt_en", { length: 500 }),
    altAr: varchar("alt_ar", { length: 500 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("media_file_name_idx").on(table.fileName)]
);

export const settings = pgTable("settings", {
  key: varchar("key", { length: 255 }).primaryKey(),
  valueEn: text("value_en"),
  valueAr: text("value_ar"),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  services: many(services),
}));

export const servicesRelations = relations(services, ({ one }) => ({
  category: one(categories, {
    fields: [services.categorySlug],
    references: [categories.slug],
  }),
}));

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;
export type Setting = typeof settings.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
