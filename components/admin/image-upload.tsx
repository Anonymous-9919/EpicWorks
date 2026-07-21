"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadImageToRepo } from "@/lib/github";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import { toast } from "sonner";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxFiles?: number;
}

export function ImageUpload({ images, onChange, maxFiles = 10 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { locale } = useLocale();
  const inputRef = useRef<HTMLInputElement>(null);

  const compressImage = async (file: File): Promise<File> => {
    if (file.size < 900 * 1024) return file;

    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        let { width, height } = img;
        const maxDim = 1920;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height / width) * maxDim);
            width = maxDim;
          } else {
            width = Math.round((width / height) * maxDim);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error("Canvas context unavailable"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl);
            if (blob) {
              resolve(new File([blob], file.name, { type: "image/jpeg" }));
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          0.8
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Failed to load image"));
      };

      img.src = objectUrl;
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (images.length + files.length > maxFiles) {
      toast.error(t("media.max-files", locale));
      return;
    }

    setUploading(true);
    const newUrls: string[] = [];
    try {
      for (const file of files) {
        const compressed = await compressImage(file);
        const base64 = await fileToBase64(compressed);
        const uniqueName = `${Date.now()}-${compressed.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const result = await uploadImageToRepo(uniqueName, base64, compressed.type);
        newUrls.push(result.url);
      }
      onChange([...images, ...newUrls]);
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error(t("media.error-upload", locale));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-3 mb-3">
        {images.map((url, i) => (
          <div key={url} className="relative group aspect-square rounded-xl border border-border bg-surface-light overflow-hidden">
            <img
              src={url}
              alt=""
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 end-1 p-1 rounded-lg bg-black/50 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {images.length < maxFiles && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-secondary/50 bg-surface-light/50 hover:bg-surface-light transition-all flex flex-col items-center justify-center gap-1 text-text-muted hover:text-secondary"
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
            <span className="text-xs">{t("media.upload", locale)}</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}

async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
