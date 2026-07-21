"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale } from "@/lib/locale";
import { t, type Locale } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  FolderOpen,
  Check,
  X,
} from "lucide-react";
import {
  getCategoriesAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  reorderCategoriesAction,
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

function SortableCategoryRow({
  category,
  locale,
  editingId,
  editForm,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  onEditFormChange,
}: {
  category: any;
  locale: Locale;
  editingId: number | null;
  editForm: { nameEn: string; nameAr: string; slug: string };
  onStartEdit: (cat: any) => void;
  onCancelEdit: () => void;
  onSaveEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onEditFormChange: (field: string, value: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isEditing = editingId === category.id;

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

      <FolderOpen className="w-5 h-5 text-secondary shrink-0" />

      {isEditing ? (
        <div className="flex-1 flex items-center gap-2">
          <input
            value={editForm.nameEn}
            onChange={(e) => onEditFormChange("nameEn", e.target.value)}
            className="flex-1 h-9 px-3 rounded-lg border border-border bg-surface text-text text-sm"
            placeholder="English name"
          />
          <span className="text-text-muted text-xs">/</span>
          <input
            value={editForm.nameAr}
            onChange={(e) => onEditFormChange("nameAr", e.target.value)}
            className="flex-1 h-9 px-3 rounded-lg border border-border bg-surface text-text text-sm"
            placeholder="Arabic name"
          />
          <button
            onClick={() => onSaveEdit(category.id)}
            className="p-1.5 text-success hover:bg-success/10 rounded-lg transition-colors"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={onCancelEdit}
            className="p-1.5 text-accent hover:bg-accent/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex-1 flex items-center gap-3">
          <span className="text-sm font-medium text-text">
            {locale === "ar" ? category.nameAr : category.nameEn}
          </span>
          <span className="text-xs text-text-muted">({category.slug})</span>
          <span className="text-xs text-text-muted">—</span>
          <span className="text-xs text-text-muted">
            {category.nameEn} / {category.nameAr}
          </span>
        </div>
      )}

      {!isEditing && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onStartEdit(category)}
            className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-light transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="p-2 rounded-lg text-accent hover:bg-accent/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  const { locale } = useLocale();
  const [cats, setCats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ nameEn: "", nameAr: "", slug: "" });
  const [showAdd, setShowAdd] = useState(false);
  const [newNameEn, setNewNameEn] = useState("");
  const [newNameAr, setNewNameAr] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getCategoriesAction();
      setCats(result);
    } catch {
      toast.error(t("categories.error-load", locale));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = cats.findIndex((c) => c.id === active.id);
    const newIndex = cats.findIndex((c) => c.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = [...cats];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    setCats(reordered);

    try {
      await reorderCategoriesAction(reordered.map((c) => c.id));
      toast.success(t("categories.reordered", locale));
    } catch {
      fetchCategories();
    }
  };

  const handleAdd = async () => {
    if (!newNameEn || !newNameAr) return;
    const slug = newNameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    try {
      await createCategoryAction({ nameEn: newNameEn, nameAr: newNameAr, slug });
      toast.success(t("categories.created", locale));
      setShowAdd(false);
      setNewNameEn("");
      setNewNameAr("");
      fetchCategories();
    } catch {
      toast.error(t("categories.error-create", locale));
    }
  };

  const handleSaveEdit = async (id: number) => {
    try {
      await updateCategoryAction(id, editForm);
      toast.success(t("categories.updated", locale));
      setEditingId(null);
      fetchCategories();
    } catch {
      toast.error(t("categories.error-update", locale));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("categories.confirm-delete", locale))) return;
    try {
      await deleteCategoryAction(id);
      toast.success(t("categories.deleted", locale));
      fetchCategories();
    } catch {
      toast.error(t("categories.error-delete", locale));
    }
  };

  const handleEditFormChange = (field: string, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">
            {t("categories.title", locale)}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {t("categories.subtitle", locale)}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => setShowAdd(!showAdd)}
        >
          <Plus className="w-4 h-4 mr-1.5" />
          {t("categories.add", locale)}
        </Button>
      </div>

      {showAdd && (
        <div className="bg-surface rounded-2xl border border-border p-4 mb-4 flex items-center gap-3">
          <input
            value={newNameEn}
            onChange={(e) => setNewNameEn(e.target.value)}
            placeholder={t("categories.name-en", locale)}
            className="flex-1 h-10 px-3 rounded-xl border border-border bg-surface text-text text-sm"
          />
          <input
            value={newNameAr}
            onChange={(e) => setNewNameAr(e.target.value)}
            placeholder={t("categories.name-ar", locale)}
            className="flex-1 h-10 px-3 rounded-xl border border-border bg-surface text-text text-sm"
          />
          <Button variant="primary" size="md" onClick={handleAdd}>
            {t("categories.save", locale)}
          </Button>
          <Button variant="ghost" size="md" onClick={() => setShowAdd(false)}>
            {t("categories.cancel", locale)}
          </Button>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-surface animate-pulse rounded-xl" />
          ))}
        </div>
      ) : cats.length === 0 ? (
        <div className="text-center py-16">
          <FolderOpen className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
          <p className="text-text-muted">{t("categories.no-data", locale)}</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={cats.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {cats.map((cat) => (
                <SortableCategoryRow
                  key={cat.id}
                  category={cat}
                  locale={locale}
                  editingId={editingId}
                  editForm={editForm}
                  onStartEdit={(cat) => {
                    setEditingId(cat.id);
                    setEditForm({
                      nameEn: cat.nameEn,
                      nameAr: cat.nameAr,
                      slug: cat.slug,
                    });
                  }}
                  onCancelEdit={() => setEditingId(null)}
                  onSaveEdit={() => handleSaveEdit(cat.id)}
                  onDelete={handleDelete}
                  onEditFormChange={handleEditFormChange}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
