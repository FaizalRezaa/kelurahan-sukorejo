"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type StorageBucket =
  | "hero-images"
  | "artikel-images"
  | "layanan-images"
  | "galeri-images";

const STORAGE_BASE =
  "https://kelurahan-sukorejo.supabase.co/storage/v1/object/public";

function buildStoragePath(bucket: StorageBucket, fileName: string) {
  const safeName = fileName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_.]/g, "");

  return `${STORAGE_BASE}/${bucket}/${Date.now()}-${safeName}`;
}

interface ImageUploadFieldProps {
  label?: string;
  bucket: StorageBucket;
  value: string;
  onChange: (imagePath: string) => void;
  /** Dipanggil dengan objek File asli setiap kali user memilih gambar baru. */
  onFileSelect?: (file: File) => void;
  required?: boolean;
  previewAlt?: string;
  hint?: string;
  previewClassName?: string;
}

export function ImageUploadField({
  label = "Upload Gambar",
  bucket,
  value,
  onChange,
  onFileSelect,
  required = false,
  previewAlt = "Pratinjau gambar",
  hint = "Format JPG, PNG, atau WebP. Maks. 5 MB.",
  previewClassName = "h-40",
}: ImageUploadFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const displaySrc = previewUrl || value;

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    if (previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(URL.createObjectURL(file));
    setFileName(file.name);
    onChange(buildStoragePath(bucket, file.name));
    onFileSelect?.(file);
  };

  const handleClear = () => {
    if (previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl("");
    setFileName("");
    onChange("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700">
        {label}
        {required ? <span className="text-rose-500"> *</span> : null}
      </label>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
        {displaySrc ? (
          <img
            src={displaySrc}
            alt={previewAlt}
            className={`w-full object-cover ${previewClassName}`}
          />
        ) : (
          <div
            className={`flex flex-col items-center justify-center gap-2 text-slate-400 ${previewClassName}`}
          >
            <ImagePlus className="h-8 w-8" />
            <span className="text-xs">Belum ada gambar dipilih</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/*"
          required={required && !value}
          className="sr-only"
          onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus className="h-3.5 w-3.5" />
          {displaySrc ? "Ganti Gambar" : "Pilih Gambar"}
        </Button>
        {displaySrc ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            onClick={handleClear}
          >
            <X className="h-3.5 w-3.5" />
            Hapus
          </Button>
        ) : null}
      </div>

      {fileName ? (
        <p className="text-xs text-slate-500">File dipilih: {fileName}</p>
      ) : (
        <p className="text-xs text-slate-500">{hint}</p>
      )}
    </div>
  );
}
