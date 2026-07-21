"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Image,
  Settings,
  LogOut,
  Moon,
  Sun,
  Globe,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  Store,
} from "lucide-react";
import { logoutAction } from "@/app/admin/logout/actions";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", key: "admin.nav-dashboard", icon: LayoutDashboard },
  { href: "/admin/services", key: "admin.nav-services", icon: FileText },
  { href: "/admin/categories", key: "admin.nav-categories", icon: FolderOpen },
  { href: "/admin/media", key: "admin.nav-media", icon: Image },
  { href: "/admin/settings", key: "admin.nav-settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { locale, setLocale } = useLocale();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLogout = async () => {
    await logoutAction();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      <aside
        className={`fixed top-0 start-0 z-40 h-screen bg-surface border-e border-border transition-all duration-300 flex flex-col ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        <div className="flex items-center h-14 px-4 border-b border-border">
          <Link
            href="/admin"
            className={`flex items-center gap-2 font-bold text-text ${
              collapsed ? "justify-center w-full" : ""
            }`}
          >
            <Store className="w-5 h-5 text-secondary shrink-0" />
            {!collapsed && <span className="text-sm">Epic Works</span>}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ms-auto text-text-muted hover:text-text transition-colors shrink-0"
          >
            {collapsed ? (
              <PanelLeft className="w-4 h-4 rtl-flip" />
            ) : (
              <PanelLeftClose className="w-4 h-4 rtl-flip" />
            )}
          </button>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-secondary/10 text-secondary"
                    : "text-text-muted hover:text-text hover:bg-surface-light"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <item.icon className="w-4.5 h-4.5 shrink-0" />
                {!collapsed && <span>{t(item.key, locale)}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border py-3 px-2 space-y-1">
          {!collapsed && (
            <div className="flex items-center gap-2 px-3 py-2">
              <button
                onClick={() => setLocale(locale === "en" ? "ar" : "en")}
                className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>{locale === "en" ? "العربية" : "English"}</span>
              </button>
            </div>
          )}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-muted hover:text-text hover:bg-surface-light transition-all w-full ${
              collapsed ? "justify-center" : ""
            }`}
          >
            {mounted && theme === "dark" ? (
              <Sun className="w-4.5 h-4.5 shrink-0" />
            ) : (
              <Moon className="w-4.5 h-4.5 shrink-0" />
            )}
            {!collapsed && (
              <span>
                {mounted && theme === "dark"
                  ? t("admin.light-mode", locale)
                  : t("admin.dark-mode", locale)}
              </span>
            )}
          </button>
          {collapsed && (
            <button
              onClick={() => setLocale(locale === "en" ? "ar" : "en")}
              className="flex items-center justify-center w-full px-3 py-2.5 rounded-xl text-text-muted hover:text-text hover:bg-surface-light transition-all"
            >
              <Globe className="w-4.5 h-4.5" />
            </button>
          )}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-accent hover:bg-accent/10 transition-all w-full ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="w-4.5 h-4.5 shrink-0" />
            {!collapsed && <span>{t("admin.logout", locale)}</span>}
          </button>
        </div>
      </aside>

      <div className={`transition-all duration-300 ${collapsed ? "ms-16" : "ms-60"}`}>
        <div className="sticky top-0 z-30 h-14 bg-surface/80 backdrop-blur-md border-b border-border flex items-center px-6">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-text-muted hover:text-text transition-colors"
          >
            <Store className="w-3.5 h-3.5" />
            <ChevronRight className="w-3.5 h-3.5 rtl-flip" />
            <span>{t("admin.view-site", locale)}</span>
          </Link>
        </div>
      </div>
    </>
  );
}
