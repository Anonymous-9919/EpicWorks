"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/sidebar";

const AUTH_ROUTES = ["/admin/login"];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuth = AUTH_ROUTES.includes(pathname);

  if (isAuth) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-primary-light">
      <AdminSidebar />
      <div className="ms-60 transition-all duration-300">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
