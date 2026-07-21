import AdminSidebar from "@/components/admin/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-primary-light">
      <AdminSidebar />
      <div className="ml-60 transition-all duration-300">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
