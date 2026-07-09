"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, ShoppingBag, User } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/store";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/translations";

const navItems = [
  { href: "/", key: "nav.home", icon: Home },
  { href: "/products", key: "nav.shop", icon: Grid3X3 },
  { href: "/cart", key: "nav.cart", icon: ShoppingBag, cart: true },
  { href: "/checkout", key: "nav.checkout", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const { locale } = useLocale();
  const itemCount = useCartStore((s) => s.getItemCount());
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full rounded-xl transition-colors",
                active ? "text-secondary" : "text-text-muted hover:text-text"
              )}
            >
              <div className="relative">
                <item.icon className="w-5 h-5" />
                {mounted && item.cart && itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-secondary text-primary text-[11px] font-bold rounded-full flex items-center justify-center">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{t(item.key, locale)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
