"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X, Search, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/translations";

const navLinks = [
  { href: "/", key: "nav.home" },
  { href: "/products", key: "nav.services" },
  { href: "/products?category=car-wash", key: "nav.car-wash" },
  { href: "/products?category=ppf", key: "nav.ppf" },
  { href: "/products?category=solar-tinting", key: "nav.tinting" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { locale, setLocale } = useLocale();
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <img src="/logo.png" alt="Epic Works" className="h-9 w-auto" />
          <span className="font-bold text-lg text-text hidden sm:block">
            Epic <span className="text-secondary">Works</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-text-muted hover:text-secondary transition-colors rounded-lg hover:bg-surface-light/50"
            >
              {t(link.key, locale)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setLocale(locale === "en" ? "ar" : "en")}
            className="p-3 rounded-xl hover:bg-surface-light/50 transition-colors"
            aria-label={t("aria.toggle-language", locale)}
          >
            <Globe className="w-5 h-5 text-text-muted" />
            <span className="text-xs font-bold text-text-muted ml-0.5">{locale === "en" ? t("lang.ar", locale) : t("lang.en", locale)}</span>
          </button>

          <button
            onClick={() => { setSearchOpen(!searchOpen); setOpen(false); }}
            className="p-3 rounded-xl hover:bg-surface-light/50 transition-colors"
            aria-label={t("aria.search", locale)}
          >
            <Search className="w-5 h-5 text-text-muted" />
          </button>

          <button
            onClick={() => useCartStore.getState().setCartDrawerOpen(true)}
            className="relative p-3 rounded-xl hover:bg-surface-light/50 transition-colors"
            aria-label={t("aria.cart", locale)}
          >
            <ShoppingBag className="w-5 h-5 text-text-muted" />
            {mounted && itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-secondary text-primary text-xs font-bold rounded-full flex items-center justify-center">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>

          <button
            onClick={() => { setOpen(!open); setSearchOpen(false); }}
            className="md:hidden p-3 rounded-xl hover:bg-surface-light/50 transition-colors"
            aria-label={t("aria.menu", locale)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border px-4 py-3">
          <div className="max-w-7xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder={t("search.placeholder", locale)}
              className="w-full rounded-xl bg-surface-light/50 border border-border pl-10 pr-4 py-3 text-sm text-text placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-secondary/50"
              autoFocus
            />
          </div>
        </div>
      )}

      {open && (
        <div className="md:hidden border-t border-border">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-3 text-sm font-medium text-text-muted hover:text-secondary rounded-lg hover:bg-surface-light/50 transition-colors"
              >
                {t(link.key, locale)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
