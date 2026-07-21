"use client";

import { useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import type { Product, Category } from "@/types";

export function ProductsContent({
  initialProducts,
  initialCategories,
}: {
  initialProducts: Product[];
  initialCategories: Category[];
}) {
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const categoryFilter = searchParams.get("category");

  const sortOptions = [
    { label: t("product.sort-latest", locale), value: "latest" },
    { label: t("product.sort-price-asc", locale), value: "price-asc" },
    { label: t("product.sort-price-desc", locale), value: "price-desc" },
    { label: t("product.sort-rating", locale), value: "rating" },
  ];
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || "");

  const allProducts = useMemo(() => {
    return initialProducts.map((p) => ({
      ...p,
      name: locale === "ar" ? (p.nameAr || p.name) : p.name,
      description: locale === "ar" ? (p.descriptionAr || p.description) : p.description,
      category: locale === "ar" ? (p.categoryAr || p.category) : p.category,
    }));
  }, [initialProducts, locale]);

  const categories = useMemo(() => {
    return initialCategories.map((c) => ({
      ...c,
      name: locale === "ar" ? (c.nameAr || c.name) : c.name,
    }));
  }, [initialCategories, locale]);

  const filtered = useMemo(() => {
    let result = [...allProducts];

    if (selectedCategory) {
      result = result.filter((p) => p.categorySlug === selectedCategory);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    return result;
  }, [selectedCategory, search, sort, allProducts]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-4xl font-bold text-text mb-2">{t("product.all", locale)}</h1>
        <p className="text-text-muted text-sm mb-6">
          {filtered.length} {t("product.found", locale)}
        </p>
      </motion.div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder={t("product.search", locale)}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-surface-light/50 border border-border pl-10 pr-4 py-3 text-sm text-text placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-secondary/50"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl bg-surface-light/50 border border-border px-3 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/50"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden p-2.5 rounded-xl bg-surface-light/50 border border-border"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden sm:block w-48 shrink-0 space-y-1">
          <button
            onClick={() => setSelectedCategory("")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !selectedCategory ? "bg-secondary/15 text-secondary font-medium" : "text-text-muted hover:text-text hover:bg-surface-light/50"
            }`}
          >
            {t("product.all", locale)}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === cat.slug ? "bg-secondary/15 text-secondary font-medium" : "text-text-muted hover:text-text hover:bg-surface-light/50"
              }`}
            >
              {cat.name}
              <span className="float-right text-xs opacity-60">{cat.count}</span>
            </button>
          ))}
        </aside>

        {/* Mobile Filter Drawer */}
        {showFilters && (
          <div className="fixed inset-0 z-50 sm:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowFilters(false)} />
            <div className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-3xl p-5 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{t("section.shop-by-category", locale)}</h3>
                <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => { setSelectedCategory(""); setShowFilters(false); }}
                  className={`w-full text-left px-3 py-3 rounded-lg text-sm ${!selectedCategory ? "bg-secondary/15 text-secondary font-medium" : "text-text-muted"}`}
                >
                  {t("product.all", locale)}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => { setSelectedCategory(cat.slug); setShowFilters(false); }}
                    className={`w-full text-left px-3 py-3 rounded-lg text-sm ${selectedCategory === cat.slug ? "bg-secondary/15 text-secondary font-medium" : "text-text-muted"}`}
                  >
                    {cat.name} ({cat.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          {selectedCategory && (
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="category">{categories.find((c) => c.slug === selectedCategory)?.name}</Badge>
              <button
                onClick={() => setSelectedCategory("")}
                className="text-xs text-text-muted hover:text-text"
              >
                {t("product.clear-filter", locale)}
              </button>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-muted">{t("product.not-found", locale)}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
