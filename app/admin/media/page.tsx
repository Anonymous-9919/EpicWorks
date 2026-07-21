"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import {
  getMediaAction,
  createMediaAction,
  deleteMediaAction,
  updateMediaAction,
} from "./actions";
import { uploadImageToRepo } from "@/lib/github";
import { toast } from "sonner";
import {
  Image,
  Search,
  Upload,
  Trash2,
  Copy,
  X,
  Check,
} from "lucide-react";

export default function MediaPage() {
  const { locale } = useLocale();
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any | null>(null);
  const [altEn, setAltEn] = useState("");
  const [altAr, setAltAr] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    const result = await getMediaAction(search || undefined);
    setFiles(result);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = Array.from(e.target.files || []);
    if (fileList.length === 0) return;

    setUploading(true);
    try {
      for (const file of fileList) {
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = "";
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);

        const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const result = await uploadImageToRepo(
          uniqueName,
          base64,
          file.type
        );

        await createMediaAction({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          storagePath: result.path,
          publicUrl: result.url,
        });

        toast.success(t("media.uploaded", locale));
      }
      fetchMedia();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("media.confirm-delete", locale))) return;
    try {
      await deleteMediaAction(id);
      toast.success(t("media.deleted", locale));
      setSelectedFile(null);
      fetchMedia();
    } catch {
      toast.error("Error deleting file");
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success(t("media.url-copied", locale));
  };

  const handleSaveAlt = async () => {
    if (!selectedFile) return;
    try {
      await updateMediaAction(selectedFile.id, { altEn, altAr });
      toast.success(t("settings.saved", locale));
      fetchMedia();
    } catch {
      toast.error("Error saving alt text");
    }
  };

  const openPreview = (file: any) => {
    setSelectedFile(file);
    setAltEn(file.altEn ?? "");
    setAltAr(file.altAr ?? "");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">
            {t("media.title", locale)}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {t("media.subtitle", locale)}
          </p>
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
          <Button
            variant="primary"
            size="md"
            loading={uploading}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-1.5" />
            {uploading
              ? t("media.uploading", locale)
              : t("media.upload", locale)}
          </Button>
        </div>
      </div>

      <div className="relative max-w-xs mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("media.search", locale)}
          className="w-full h-10 pl-9 pr-4 rounded-xl border border-border bg-surface text-text text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-6 gap-3">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl bg-surface animate-pulse"
            />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-16">
          <Image className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
          <p className="text-text-muted">{t("media.no-data", locale)}</p>
        </div>
      ) : (
        <div className="grid grid-cols-6 gap-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="group relative aspect-square rounded-xl border border-border bg-surface overflow-hidden cursor-pointer"
              onClick={() => openPreview(file)}
            >
              <img
                src={file.publicUrl}
                alt={file.altEn ?? ""}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyUrl(file.publicUrl);
                  }}
                  className="p-2 rounded-lg bg-white/90 text-text hover:bg-white"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(file.id);
                  }}
                  className="p-2 rounded-lg bg-accent/90 text-white hover:bg-accent"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {selectedFile && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-8"
          onClick={() => setSelectedFile(null)}
        >
          <div
            className="bg-surface rounded-2xl border border-border max-w-2xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="text-lg font-semibold text-text">
                {t("media.preview", locale)}
              </h3>
              <button
                onClick={() => setSelectedFile(null)}
                className="p-1 text-text-muted hover:text-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <img
                src={selectedFile.publicUrl}
                alt={selectedFile.altEn ?? ""}
                className="w-full rounded-xl max-h-80 object-contain bg-surface-light"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-text-muted mb-1">
                    {t("media.file-name", locale)}
                  </label>
                  <p className="text-sm text-text">
                    {selectedFile.fileName}
                  </p>
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1">
                    {t("media.file-size", locale)}
                  </label>
                  <p className="text-sm text-text">
                    {(selectedFile.fileSize / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-text-muted mb-1">
                    {t("media.alt-en", locale)}
                  </label>
                  <input
                    type="text"
                    value={altEn}
                    onChange={(e) => setAltEn(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-surface text-text text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1">
                    {t("media.alt-ar", locale)}
                  </label>
                  <input
                    type="text"
                    value={altAr}
                    onChange={(e) => setAltAr(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-surface text-text text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSaveAlt}
                >
                  <Check className="w-4 h-4 mr-1.5" />
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => handleCopyUrl(selectedFile.publicUrl)}
                >
                  <Copy className="w-4 h-4 mr-1.5" />
                  {t("media.copy-url", locale)}
                </Button>
                <Button
                  variant="danger"
                  size="md"
                  onClick={() => handleDelete(selectedFile.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  {t("media.delete", locale)}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
