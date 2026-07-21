"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/image-upload";
import { getCategoriesAction, createServiceAction } from "../actions";
import { toast } from "sonner";
import { Save, ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";

export default function NewServicePage() {
  const { locale } = useLocale();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [catList, setCatList] = useState<any[]>([]);

  const [form, setForm] = useState({
    nameEn: "",
    nameAr: "",
    slug: "",
    descriptionEn: "",
    descriptionAr: "",
    price: "",
    originalPrice: "",
    categorySlug: "",
    featured: false,
    onSale: false,
    inStock: true,
    status: "published",
  });

  const [specs, setSpecs] = useState<string[]>([""]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      const cats = await getCategoriesAction();
      setCatList(cats);
    }
    load();
  }, []);

  const generateSlug = useCallback(
    (name: string) =>
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    []
  );

  const handleNameEnChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      nameEn: value,
      slug: generateSlug(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await createServiceAction({
        nameEn: form.nameEn,
        nameAr: form.nameAr,
        slug: form.slug,
        descriptionEn: form.descriptionEn,
        descriptionAr: form.descriptionAr,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        categorySlug: form.categorySlug,
        images,
        specs: specs.filter(Boolean),
        tags,
        featured: form.featured,
        onSale: form.onSale,
        inStock: form.inStock,
        status: form.status,
      });
      toast.success(t("services.created", locale));
      router.push("/admin/services");
    } catch (err) {
      toast.error("Error creating service");
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/services"
          className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-light transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text">
            {t("services.new", locale)}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
          <h2 className="text-sm font-semibold text-text uppercase tracking-wider">
            {locale === "ar" ? "الإنجليزية" : "English"}
          </h2>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              {t("services.name-en", locale)}
            </label>
            <input
              type="text"
              value={form.nameEn}
              onChange={(e) => handleNameEnChange(e.target.value)}
              required
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Description
            </label>
            <textarea
              value={form.descriptionEn}
              onChange={(e) =>
                setForm({ ...form, descriptionEn: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors resize-none"
            />
          </div>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
          <h2 className="text-sm font-semibold text-text uppercase tracking-wider">
            {locale === "ar" ? "العربية" : "Arabic"}
          </h2>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              {t("services.name-ar", locale)}
            </label>
            <input
              type="text"
              value={form.nameAr}
              onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
              required
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              الوصف
            </label>
            <textarea
              value={form.descriptionAr}
              onChange={(e) =>
                setForm({ ...form, descriptionAr: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors resize-none"
            />
          </div>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                {t("services.price", locale)} (KWD)
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                {t("services.price", locale)} ({locale === "ar" ? "السعر الأصلي" : "Original"})
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={form.originalPrice}
                onChange={(e) =>
                  setForm({ ...form, originalPrice: e.target.value })
                }
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              {t("services.category", locale)}
            </label>
            <select
              value={form.categorySlug}
              onChange={(e) => setForm({ ...form, categorySlug: e.target.value })}
              required
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors"
            >
              <option value="">{locale === "ar" ? "اختر فئة" : "Select category"}</option>
              {catList.map((cat: any) => (
                <option key={cat.slug} value={cat.slug}>
                  {locale === "ar" ? cat.nameAr : cat.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
          <h2 className="text-sm font-semibold text-text uppercase tracking-wider">
            {t("services.specs", locale)}
          </h2>
          {specs.map((spec, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={spec}
                onChange={(e) => {
                  const next = [...specs];
                  next[i] = e.target.value;
                  setSpecs(next);
                }}
                className="flex-1 h-11 px-4 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors"
                placeholder={locale === "ar" ? "مواصفة" : "Specification"}
              />
              <button
                type="button"
                onClick={() => setSpecs(specs.filter((_, j) => j !== i))}
                className="p-2 text-text-muted hover:text-accent transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setSpecs([...specs, ""])}
            className="flex items-center gap-1.5 text-sm text-secondary hover:text-secondary-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            {locale === "ar" ? "إضافة مواصفة" : "Add specification"}
          </button>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
          <h2 className="text-sm font-semibold text-text uppercase tracking-wider">
            {t("services.images", locale)}
          </h2>
          <ImageUpload images={images} onChange={setImages} />
        </div>

        <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
          <h2 className="text-sm font-semibold text-text uppercase tracking-wider">
            {t("services.tags", locale)}
          </h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              className="flex-1 h-11 px-4 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors"
              placeholder={locale === "ar" ? "أضف علامة ثم Enter" : "Type tag and press Enter"}
            />
            <Button type="button" variant="secondary" size="md" onClick={addTag}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-light text-text text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-text-muted hover:text-accent"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  setForm({ ...form, featured: e.target.checked })
                }
                className="w-4 h-4 rounded accent-secondary"
              />
              <span className="text-sm text-text">{t("services.featured", locale)}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.onSale}
                onChange={(e) =>
                  setForm({ ...form, onSale: e.target.checked })
                }
                className="w-4 h-4 rounded accent-secondary"
              />
              <span className="text-sm text-text">{t("services.on-sale", locale)}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.inStock}
                onChange={(e) =>
                  setForm({ ...form, inStock: e.target.checked })
                }
                className="w-4 h-4 rounded accent-secondary"
              />
              <span className="text-sm text-text">{t("services.in-stock", locale)}</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              {t("services.status", locale)}
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors"
            >
              <option value="published">{t("services.published", locale)}</option>
              <option value="draft">{t("services.draft", locale)}</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" variant="primary" size="lg" loading={saving}>
            <Save className="w-4 h-4 mr-1.5" />
            {saving ? t("services.saving", locale) : t("services.save", locale)}
          </Button>
          <Link href="/admin/services">
            <Button type="button" variant="ghost" size="lg">
              {t("services.cancel", locale)}
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
