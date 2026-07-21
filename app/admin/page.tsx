"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { getServicesAction } from "@/app/admin/services/actions";
import { getCategoriesAction } from "@/app/admin/categories/actions";
import { Plus, FileText, FolderOpen, LayoutDashboard, ExternalLink } from "lucide-react";

export default function Dashboard() {
  const { locale } = useLocale();
  const [stats, setStats] = useState({
    totalServices: 0,
    published: 0,
    draft: 0,
    categories: 0,
  });

  useEffect(() => {
    async function load() {
      const [services, cats] = await Promise.all([
        getServicesAction(),
        getCategoriesAction(),
      ]);
      setStats({
        totalServices: services.length,
        published: services.filter((s: any) => s.status === "published").length,
        draft: services.filter((s: any) => s.status === "draft").length,
        categories: cats.length,
      });
    }
    load();
  }, []);

  const cards = [
    {
      label: t("dash.total-services", locale),
      value: stats.totalServices,
      icon: FileText,
      color: "text-secondary bg-secondary/10",
    },
    {
      label: t("dash.published", locale),
      value: stats.published,
      icon: LayoutDashboard,
      color: "text-success bg-success/10",
    },
    {
      label: t("dash.drafts", locale),
      value: stats.draft,
      icon: FileText,
      color: "text-text-muted bg-surface-light",
    },
    {
      label: t("dash.total-categories", locale),
      value: stats.categories,
      icon: FolderOpen,
      color: "text-secondary bg-secondary/10",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">
          {t("dash.title", locale)}
        </h1>
        <p className="text-sm text-text-muted mt-1">
          {t("dash.subtitle", locale)}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-surface rounded-2xl border border-border p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-text">{card.value}</p>
            <p className="text-sm text-text-muted mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-sm font-semibold text-text uppercase tracking-wider mb-3">
          {t("dash.quick-actions", locale)}
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <Link href="/admin/services/new">
            <div className="bg-surface rounded-2xl border border-border p-5 hover:border-secondary/30 transition-colors cursor-pointer">
              <Plus className="w-5 h-5 text-secondary mb-2" />
              <p className="text-sm font-medium text-text">
                {t("dash.add-service", locale)}
              </p>
            </div>
          </Link>
          <Link href="/admin/media">
            <div className="bg-surface rounded-2xl border border-border p-5 hover:border-secondary/30 transition-colors cursor-pointer">
              <ExternalLink className="w-5 h-5 text-secondary mb-2" />
              <p className="text-sm font-medium text-text">
                {t("dash.upload-media", locale)}
              </p>
            </div>
          </Link>
          <Link href="/admin/categories">
            <div className="bg-surface rounded-2xl border border-border p-5 hover:border-secondary/30 transition-colors cursor-pointer">
              <FolderOpen className="w-5 h-5 text-secondary mb-2" />
              <p className="text-sm font-medium text-text">
                {t("dash.manage-categories", locale)}
              </p>
            </div>
          </Link>
          <a href="/" target="_blank">
            <div className="bg-surface rounded-2xl border border-border p-5 hover:border-secondary/30 transition-colors cursor-pointer">
              <ExternalLink className="w-5 h-5 text-secondary mb-2" />
              <p className="text-sm font-medium text-text">
                {t("admin.view-site", locale)}
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
