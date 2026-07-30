/**
 * storage.ts
 * Helper functions untuk Supabase Storage.
 * Menggunakan createClient() dari lib/supabase/client (browser client).
 */

import { createClient } from "@/lib/supabase/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type StorageBucket = "artikel" | "galeri" | "hero-slides" | "layanan";

// ---------------------------------------------------------------------------
// uploadFile
// ---------------------------------------------------------------------------

/**
 * Upload file ke bucket Supabase Storage.
 * @param bucket - Nama bucket (gunakan StorageBucket).
 * @param path   - Path tujuan di dalam bucket, misal: "thumbnails/abc.webp".
 * @param file   - Objek File dari input HTML.
 * @returns      Public URL dari file yang baru diupload.
 */
export async function uploadFile(
  bucket: StorageBucket,
  path: string,
  file: File
): Promise<string> {
  const supabase = createClient();

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true, cacheControl: "3600" });

  if (error) throw new Error(`Upload gagal: ${error.message}`);

  return getPublicUrl(bucket, path);
}

// ---------------------------------------------------------------------------
// deleteFile
// ---------------------------------------------------------------------------

/**
 * Hapus satu file dari bucket Supabase Storage.
 * @param bucket - Nama bucket.
 * @param path   - Path file di dalam bucket.
 */
export async function deleteFile(
  bucket: StorageBucket,
  path: string
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) throw new Error(`Hapus file gagal: ${error.message}`);
}

// ---------------------------------------------------------------------------
// getPublicUrl
// ---------------------------------------------------------------------------

/**
 * Ambil public URL dari file di Supabase Storage (sinkron, tanpa network call).
 * @param bucket - Nama bucket.
 * @param path   - Path file di dalam bucket.
 * @returns      Public URL string.
 */
export function getPublicUrl(bucket: StorageBucket, path: string): string {
  const supabase = createClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// ---------------------------------------------------------------------------
// extractPathFromUrl
// ---------------------------------------------------------------------------

/**
 * Utilitas: ekstrak storage path dari full public URL.
 * Berguna saat perlu menghapus file lama sebelum upload baru.
 *
 * Contoh:
 *   "https://xxx.supabase.co/storage/v1/object/public/galeri/foto.webp"
 *   → "foto.webp"
 */
export function extractPathFromUrl(publicUrl: string): string {
  const url = new URL(publicUrl);
  // Format: /storage/v1/object/public/<bucket>/<path>
  const parts = url.pathname.split("/storage/v1/object/public/");
  if (parts.length < 2) throw new Error("URL bukan Supabase Storage URL.");
  // Hapus prefix bucket
  const withBucket = parts[1];
  const slashIndex = withBucket.indexOf("/");
  if (slashIndex === -1) throw new Error("Path tidak ditemukan dalam URL.");
  return withBucket.slice(slashIndex + 1);
}
