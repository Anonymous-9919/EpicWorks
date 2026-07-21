"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/locale";
import { t, type Locale } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Pencil,
  Copy,
  Trash2,
  GripVertical,
  FileText,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import {
  getServicesAction,
  deleteServiceAction,
  duplicateServiceAction,
  reorderServicesAction,
  toggleStatusAction,
} from "./actions";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function SortableRow({
  service,
  locale,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleStatus,
}: {
  service: any;
  locale: Locale;
  onEdit: (id: number) => void;
  onDuplicate: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number, status: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: service.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isPublished = service.status === "published";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 px-4 py-3 bg-surface rounded-xl border border-border ${
        isDragging ? "shadow-lg z-10" : ""
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="text-text-muted hover:text-text cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="w-10 h-10 rounded-lg bg-surface-light shrink-0 flex items-center justify-center overflow-hidden">
        {service.images?.[0] ? (
          <img
            src={service.images[0]}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <FileText className="w-4 h-4 text-text-muted" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-text truncate">
            {locale === "ar" ? service.nameAr : service.nameEn}
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              isPublished
                ? "bg-success/10 text-success"
                : "bg-text-muted/10 text-text-muted"
            }`}
          >
            {isPublished ? t("services.published", locale) : t("services.draft", locale)}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-text-muted mt-0.5">
          <span>{service.categorySlug}</span>
          <span>
            {service.price} KWD
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onToggleStatus(service.id, isPublished ? "draft" : "published")}
          className={`p-2 rounded-lg text-xs font-medium transition-colors ${
            isPublished
              ? "text-text-muted hover:text-text hover:bg-surface-light"
              : "text-success hover:bg-success/10"
          }`}
        >
          {isPublished ? t("services.draft", locale) : t("services.publish", locale) || "Publish"}
        </button>
        <button
          onClick={() => onEdit(service.id)}
          className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-light transition-colors"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDuplicate(service.id)}
          className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-light transition-colors"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(service.id)}
          className="p-2 rounded-lg text-accent hover:bg-accent/10 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const { locale } = useLocale();
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const fetchServices = useCallback(async (term?: string, status?: string) => {
    setLoading(true);
    try {
      const result = await getServicesAction(term || undefined, undefined, status && status !== "all" ? status : undefined);
      setServices(result);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices("", "all");
  }, [fetchServices]);

  const handleSearch = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchServices(value, statusFilter);
    }, 300);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    fetchServices(search, value);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = services.findIndex((s) => s.id === active.id);
    const newIndex = services.findIndex((s) => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = [...services];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    setServices(reordered);

    try {
      await reorderServicesAction(reordered.map((s) => s.id));
      toast.success(t("services.reordered", locale));
    } catch {
      fetchServices(search, statusFilter);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("services.confirm-delete", locale))) return;
    try {
      await deleteServiceAction(id);
      toast.success(t("services.deleted", locale));
      fetchServices(search, statusFilter);
    } catch {
      toast.error(t("services.error-delete", locale));
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      await duplicateServiceAction(id);
      toast.success(t("services.duplicated", locale));
      fetchServices(search, statusFilter);
    } catch {
      toast.error(t("services.error-duplicate", locale));
    }
  };

  const handleToggleStatus = async (id: number, newStatus: string) => {
    try {
      await toggleStatusAction(id, newStatus);
      toast.success(t("services.updated", locale));
      fetchServices(search, statusFilter);
    } catch {
      toast.error(t("services.error-status", locale));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">
            {t("services.title", locale)}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {t("services.subtitle", locale)}
          </p>
        </div>
        <Link href="/admin/services/new">
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1.5" />
            {t("services.add", locale)}
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t("services.search", locale)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-border bg-surface text-text text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => handleStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors"
        >
          <option value="all">{t("services.all", locale)}</option>
          <option value="published">{t("services.published", locale)}</option>
          <option value="draft">{t("services.draft", locale)}</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-xl bg-surface animate-pulse"
            />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
          <p className="text-text-muted">
            {search || statusFilter !== "all"
              ? t("services.no-results", locale)
              : t("services.empty", locale)}
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={services.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {services.map((service) => (
                <SortableRow
                  key={service.id}
                  service={service}
                  locale={locale}
                  onEdit={(id) => router.push(`/admin/services/${id}/edit`)}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
