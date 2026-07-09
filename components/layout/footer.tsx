"use client";

import Link from "next/link";
import { Instagram, Linkedin, Shield } from "lucide-react";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/translations";

export function Footer() {
  const { locale } = useLocale();
  return (
    <footer className="bg-primary-light border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="Epic Works" className="h-9 w-auto" />
              <span className="font-bold text-lg text-text">
                Epic <span className="text-secondary">Works</span>
              </span>
            </div>
            <p className="text-sm text-text-muted max-w-md mb-4">
              {t("footer.desc", locale)}
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-11 h-11 rounded-xl bg-surface-light flex items-center justify-center hover:bg-secondary/20 transition-colors">
                <Instagram className="w-4 h-4 text-text-muted" />
              </a>
              <a href="#" className="w-11 h-11 rounded-xl bg-surface-light flex items-center justify-center hover:bg-secondary/20 transition-colors">
                <Linkedin className="w-4 h-4 text-text-muted" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-text mb-4">{t("footer.quick-links", locale)}</h3>
            <div className="space-y-2.5 text-sm">
              <Link href="/products" className="block text-text-muted hover:text-secondary transition-colors">{t("product.all", locale)}</Link>
              <Link href="/products?category=car-wash" className="block text-text-muted hover:text-secondary transition-colors">{t("nav.car-wash", locale)}</Link>
              <Link href="/products?category=ppf" className="block text-text-muted hover:text-secondary transition-colors">{t("nav.ppf", locale)}</Link>
              <Link href="/products?category=solar-tinting" className="block text-text-muted hover:text-secondary transition-colors">{t("nav.tinting", locale)}</Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-text mb-4">{t("footer.support", locale)}</h3>
            <div className="space-y-2.5 text-sm">
              <span className="block text-text-muted">{t("footer.contact", locale)}</span>
              <span className="block text-text-muted">{t("footer.service-area", locale)}</span>
              <span className="block text-text-muted">{t("footer.returns", locale)}</span>
              <div className="flex items-center gap-2 text-text-muted pt-2">
                <Shield className="w-4 h-4 text-secondary" />
                <span className="text-xs">{t("footer.secure", locale)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-text-muted">
          <p>&copy; {new Date().getFullYear()} {t("footer.copyright", locale)}</p>
        </div>
      </div>
    </footer>
  );
}
