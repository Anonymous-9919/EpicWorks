"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { getSettingsAction, saveSettingsAction } from "./actions";
import { toast } from "sonner";
import { Save, Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  const { locale } = useLocale();
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSettingsAction();
        setForm(data);
      } catch {
        toast.error(t("settings.error-saving", locale));
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSettingsAction(form);
      toast.success(t("settings.saved", locale));
    } catch {
      toast.error(t("settings.error-saving", locale));
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-surface animate-pulse rounded-lg" />
        <div className="h-[400px] bg-surface animate-pulse rounded-2xl" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
          <SettingsIcon className="w-5 h-5 text-secondary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text">
            {t("settings.title", locale)}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {t("settings.subtitle", locale)}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Business Details */}
        <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-text">
              {t("settings.business", locale)}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              {t("settings.business-desc", locale)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                {t("settings.company-name-en", locale)}
              </label>
              <input
                type="text"
                value={form["company_name_en"] ?? ""}
                onChange={(e) => updateField("company_name_en", e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                {t("settings.company-name-ar", locale)}
              </label>
              <input
                type="text"
                value={form["company_name_ar"] ?? ""}
                onChange={(e) => updateField("company_name_ar", e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                {t("settings.tagline-en", locale)}
              </label>
              <input
                type="text"
                value={form["tagline_en"] ?? ""}
                onChange={(e) => updateField("tagline_en", e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                {t("settings.tagline-ar", locale)}
              </label>
              <input
                type="text"
                value={form["tagline_ar"] ?? ""}
                onChange={(e) => updateField("tagline_ar", e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-text">
              {t("settings.contact", locale)}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              {t("settings.contact-desc", locale)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                {t("settings.phone", locale)} (EN)
              </label>
              <input
                type="text"
                value={form["phone_en"] ?? ""}
                onChange={(e) => updateField("phone_en", e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                {t("settings.phone", locale)} (AR)
              </label>
              <input
                type="text"
                value={form["phone_ar"] ?? ""}
                onChange={(e) => updateField("phone_ar", e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                {t("settings.email", locale)} (EN)
              </label>
              <input
                type="email"
                value={form["email_en"] ?? ""}
                onChange={(e) => updateField("email_en", e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                {t("settings.email", locale)} (AR)
              </label>
              <input
                type="email"
                value={form["email_ar"] ?? ""}
                onChange={(e) => updateField("email_ar", e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                {t("settings.whatsapp", locale)} (EN)
              </label>
              <input
                type="text"
                value={form["whatsapp_en"] ?? ""}
                onChange={(e) => updateField("whatsapp_en", e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                {t("settings.whatsapp", locale)} (AR)
              </label>
              <input
                type="text"
                value={form["whatsapp_ar"] ?? ""}
                onChange={(e) => updateField("whatsapp_ar", e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                {t("settings.address", locale)} (EN)
              </label>
              <input
                type="text"
                value={form["address_en"] ?? ""}
                onChange={(e) => updateField("address_en", e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                {t("settings.address", locale)} (AR)
              </label>
              <input
                type="text"
                value={form["address_ar"] ?? ""}
                onChange={(e) => updateField("address_ar", e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-text">
              {t("settings.social", locale)}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              {t("settings.social-desc", locale)}
            </p>
          </div>
          {["instagram", "linkedin", "twitter", "tiktok", "youtube"].map(
            (social) => (
              <div key={social} className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5 capitalize">
                    {social} (EN)
                  </label>
                  <input
                    type="url"
                    value={form[`${social}_en`] ?? ""}
                    onChange={(e) =>
                      updateField(`${social}_en`, e.target.value)
                    }
                    placeholder={`https://${social}.com/...`}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5 capitalize">
                    {social} (AR)
                  </label>
                  <input
                    type="url"
                    value={form[`${social}_ar`] ?? ""}
                    onChange={(e) =>
                      updateField(`${social}_ar`, e.target.value)
                    }
                    placeholder={`https://${social}.com/...`}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors"
                  />
                </div>
              </div>
            )
          )}
        </div>

        {/* Working Hours */}
        <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-text">
              {t("settings.hours", locale)}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              {t("settings.hours-desc", locale)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                {t("settings.hours", locale)} (EN)
              </label>
              <textarea
                value={form["working_hours_en"] ?? ""}
                onChange={(e) => updateField("working_hours_en", e.target.value)}
                rows={4}
                placeholder={`Sat-Thu: 8:00 AM - 8:00 PM\nFri: Closed`}
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                {t("settings.hours", locale)} (AR)
              </label>
              <textarea
                value={form["working_hours_ar"] ?? ""}
                onChange={(e) => updateField("working_hours_ar", e.target.value)}
                rows={4}
                placeholder={`السبت-الخميس: ٨:٠٠ صباحاً - ٨:٠٠ مساءً\nالجمعة: مغلق`}
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-text">
              {t("settings.seo", locale)}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              {t("settings.seo-desc", locale)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                {t("settings.seo-title", locale)} (EN)
              </label>
              <input
                type="text"
                value={form["seo_title_en"] ?? ""}
                onChange={(e) => updateField("seo_title_en", e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                {t("settings.seo-title", locale)} (AR)
              </label>
              <input
                type="text"
                value={form["seo_title_ar"] ?? ""}
                onChange={(e) => updateField("seo_title_ar", e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                {t("settings.seo-description", locale)} (EN)
              </label>
              <textarea
                value={form["seo_description_en"] ?? ""}
                onChange={(e) => updateField("seo_description_en", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                {t("settings.seo-description", locale)} (AR)
              </label>
              <textarea
                value={form["seo_description_ar"] ?? ""}
                onChange={(e) => updateField("seo_description_ar", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={saving}
          >
            <Save className="w-4 h-4 mr-1.5" />
            {saving
              ? t("settings.saving", locale)
              : t("settings.save", locale)}
          </Button>
        </div>
      </form>
    </div>
  );
}
