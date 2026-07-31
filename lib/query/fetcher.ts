/**
 * fetcher.ts
 * Operasi CRUD Supabase untuk seluruh tabel dan storage bucket.
 * Semua fungsi adalah pure async — tidak ada state, hanya data fetching/mutating.
 * Gunakan di dalam TanStack Query hooks (hooks.ts).
 */

import { createClient } from "@/lib/supabase/client";
import {
  uploadFile,
  deleteFile,
  extractPathFromUrl,
  type StorageBucket,
} from "@/lib/supabase/storage";
import type {
  Artikel,
  ArtikelInsert,
  ArtikelUpdate,
  ArtikelKategori,
  BannerItem,
  BannerItemInsert,
  BannerItemUpdate,
  Galeri,
  GaleriInsert,
  GaleriUpdate,
  HeroSlide,
  HeroSlideInsert,
  HeroSlideUpdate,
  LayananPublik,
  LayananPublikInsert,
  LayananPublikUpdate,
  Profile,
  ProfilStatistik,
  ProfilStatistikUpdate,
} from "./schema";
import { supabase } from "../supabase";

// ---------------------------------------------------------------------------
// Helper: throw on Supabase error
// ---------------------------------------------------------------------------

function assertNoError<T>(data: T | null, error: { message: string } | null): T {
  if (error) throw new Error(error.message);
  if (data === null) throw new Error("Data tidak ditemukan.");
  return data;
}

// ---------------------------------------------------------------------------
// Helper: generate storage path
// ---------------------------------------------------------------------------

/** Buat path unik di storage: "{prefix}/{timestamp}-{filename}" */
function buildStoragePath(prefix: string, file: File): string {
  const ext = file.name.split(".").pop() ?? "bin";
  return `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
}

// Re-export storage helpers agar konsumen fetcher tidak perlu import ganda
export { uploadFile, deleteFile, extractPathFromUrl } from "@/lib/supabase/storage";

// ---------------------------------------------------------------------------
// profil_statistik
// ---------------------------------------------------------------------------

export async function fetchProfilStatistik(): Promise<ProfilStatistik[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profil_statistik")
    .select("*")
    .order("urutan", { ascending: true });
  return assertNoError(data, error);
}

export async function updateProfilStatistik(
  payload: ProfilStatistikUpdate
): Promise<ProfilStatistik> {
  const supabase = createClient();
  const { id, ...rest } = payload;
  const { data, error } = await supabase
    .from("profil_statistik")
    .update(rest)
    .eq("id", id)
    .select()
    .single();
  return assertNoError(data, error);
}

// ---------------------------------------------------------------------------
// hero_slides
// ---------------------------------------------------------------------------

export async function fetchHeroSlides(): Promise<HeroSlide[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .order("urutan", { ascending: true });
  return assertNoError(data, error);
}

export async function fetchHeroSlidesAktif(): Promise<HeroSlide[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .eq("aktif", true)
    .order("urutan", { ascending: true });
  return assertNoError(data, error);
}

export async function insertHeroSlide(payload: HeroSlideInsert): Promise<HeroSlide> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("hero_slides")
    .insert(payload)
    .select()
    .single();
  return assertNoError(data, error);
}

export async function updateHeroSlide(payload: HeroSlideUpdate): Promise<HeroSlide> {
  const supabase = createClient();
  const { id, ...rest } = payload;
  const { data, error } = await supabase
    .from("hero_slides")
    .update(rest)
    .eq("id", id)
    .select()
    .single();
  return assertNoError(data, error);
}

export async function deleteHeroSlide(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("hero_slides").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// --- Form-level mutations HeroSlide (DB + Storage terintegrasi) ---

/** Payload form insert hero slide. imageFile wajib untuk slide baru. */
export type HeroSlideInsertFormPayload = Omit<HeroSlideInsert, "image_path"> & {
  imageFile: File;
};

/**
 * Insert hero slide dengan upload gambar ke storage.
 * Flow: upload gambar → dapatkan URL → insert DB.
 */
export async function insertHeroSlideWithImage(
  payload: HeroSlideInsertFormPayload
): Promise<HeroSlide> {
  const { imageFile, ...dbPayload } = payload;
  const BUCKET = "hero-images" as any;

  const storagePath = buildStoragePath("slides", imageFile);
  const image_path = await uploadFile(BUCKET, storagePath, imageFile);

  return insertHeroSlide({ ...dbPayload, image_path });
}

/** Payload form update hero slide. imageFile opsional — jika ada, ganti gambar lama. */
export type HeroSlideUpdateFormPayload = Omit<HeroSlideUpdate, "image_path"> & {
  imageFile?: File | null;
  /** URL gambar saat ini, dibutuhkan untuk delete file lama. */
  currentImagePath?: string | null;
};

/**
 * Update hero slide dengan penggantian gambar opsional.
 * Flow: (opsional) hapus lama → upload baru → update DB.
 */
export async function updateHeroSlideWithImage(
  payload: HeroSlideUpdateFormPayload
): Promise<HeroSlide> {
  const { imageFile, currentImagePath, ...dbPayload } = payload;
  const BUCKET = "hero-images" as any;

  let image_path: string | undefined = undefined;

  if (imageFile) {
    if (currentImagePath) {
      try {
        const oldPath = extractPathFromUrl(currentImagePath);
        await deleteFile(BUCKET, oldPath);
      } catch {
        // Lanjut meski hapus gagal
      }
    }
    const storagePath = buildStoragePath("slides", imageFile);
    image_path = await uploadFile(BUCKET, storagePath, imageFile);
  }

  const updatePayload: HeroSlideUpdate =
    image_path !== undefined
      ? { ...dbPayload, image_path }
      : dbPayload;

  return updateHeroSlide(updatePayload);
}

/**
 * Hapus hero slide beserta file gambarnya dari storage.
 * Gunakan di admin untuk clean delete.
 */
export async function deleteHeroSlideWithImage(slide: HeroSlide): Promise<void> {
  const BUCKET = "hero-images" as any;

  if (slide.image_path) {
    try {
      const storagePath = extractPathFromUrl(slide.image_path);
      await deleteFile(BUCKET, storagePath);
    } catch {
      // Lanjut meski hapus storage gagal
    }
  }

  await deleteHeroSlide(slide.id);
}

// ---------------------------------------------------------------------------
// artikel
// ---------------------------------------------------------------------------

/**
 * Ambil daftar artikel dengan filter opsional.
 * Default sort: tanggal_terbit DESC (sesuai aturan PROJECT.md).
 */
export async function fetchArtikelList(params?: {
  kategori?: ArtikelKategori;
  status?: "draft" | "terbit";
  limit?: number;
  offset?: number;
}): Promise<Artikel[]> {
  const supabase = createClient();
  let query = supabase
    .from("artikel")
    .select("*")
    .order("tanggal_terbit", { ascending: false });

  if (params?.kategori) query = query.eq("kategori", params.kategori);
  if (params?.status)   query = query.eq("status", params.status);
  if (params?.limit)    query = query.limit(params.limit);
  if (params?.offset !== undefined)
    query = query.range(params.offset, params.offset + (params.limit ?? 10) - 1);

  const { data, error } = await query;
  return assertNoError(data, error);
}

/**
 * Hanya artikel dengan status='terbit'. Untuk halaman publik.
 * Sort: tanggal_terbit DESC (sesuai aturan PROJECT.md).
 */
export async function fetchArtikelPublik(params?: {
  kategori?: ArtikelKategori;
  limit?: number;
  offset?: number;
}): Promise<Artikel[]> {
  return fetchArtikelList({ ...params, status: "terbit" });
}

/**
 * Ambil artikel berdasarkan slug. Bisa dipakai di admin (draft) maupun publik.
 * Untuk halaman publik, pastikan RLS Supabase hanya izinkan 'terbit'.
 */
export async function fetchArtikelBySlug(slug: string): Promise<Artikel | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("artikel")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data;
}

/** Ambil satu artikel berdasarkan id (untuk form edit admin). */
export async function fetchArtikelById(id: string): Promise<Artikel> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("artikel")
    .select("*")
    .eq("id", id)
    .single();
  return assertNoError(data, error);
}

/**
 * Ambil artikel terkait untuk halaman detail.
 * Aturan (PROJECT.md):
 *   1. Kategori sama, sort tanggal_terbit DESC, limit 4, exclude current id.
 *   2. Jika kurang dari 4, backfill dari semua kategori.
 */
export async function fetchArtikelRelated(
  currentId: string,
  kategori: ArtikelKategori,
  limit = 4
): Promise<Artikel[]> {
  const supabase = createClient();

  // Step 1 — same kategori
  const { data: sameKategori, error: e1 } = await supabase
    .from("artikel")
    .select("*")
    .eq("status", "terbit")
    .eq("kategori", kategori)
    .neq("id", currentId)
    .order("tanggal_terbit", { ascending: false })
    .limit(limit);

  if (e1) throw new Error(e1.message);

  const results = sameKategori ?? [];

  // Step 2 — backfill jika kurang dari limit
  if (results.length < limit) {
    const excludeIds = [currentId, ...results.map((a) => a.id)];
    const remaining = limit - results.length;

    const { data: backfill, error: e2 } = await supabase
      .from("artikel")
      .select("*")
      .eq("status", "terbit")
      .not("id", "in", `(${excludeIds.join(",")})`)
      .order("tanggal_terbit", { ascending: false })
      .limit(remaining);

    if (e2) throw new Error(e2.message);
    results.push(...(backfill ?? []));
  }

  return results;
}

// --- Operasi DB murni (tanpa file handling) ---

/** Insert artikel ke DB. Gunakan insertArtikelWithImage jika ada gambar dari form. */
export async function insertArtikel(payload: ArtikelInsert): Promise<Artikel> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("artikel")
    .insert(payload)
    .select()
    .single();
  return assertNoError(data, error);
}

/** Update artikel di DB. Gunakan updateArtikelWithImage jika ada gambar baru dari form. */
export async function updateArtikel(payload: ArtikelUpdate): Promise<Artikel> {
  const supabase = createClient();
  const { id, ...rest } = payload;
  const { data, error } = await supabase
    .from("artikel")
    .update({ ...rest, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  return assertNoError(data, error);
}

/**
 * Hapus artikel dari DB.
 * Catatan: hapus gambar dari storage secara terpisah jika diperlukan
 * (gunakan deleteFile dari lib/supabase/storage).
 */
export async function deleteArtikel(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("artikel").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// --- Form-level mutations (DB + Storage terintegrasi) ---

/**
 * Payload form insert artikel.
 * Jika imageFile diberikan, file akan di-upload ke bucket 'artikel-images'
 * dan URL-nya disimpan ke field image_path.
 */
export type ArtikelInsertFormPayload = Omit<ArtikelInsert, "image_path"> & {
  imageFile?: File | null;
};

/**
 * Insert artikel dengan upload gambar opsional.
 * Flow: upload gambar → dapatkan URL → insert DB.
 */
export async function insertArtikelWithImage(
  payload: ArtikelInsertFormPayload
): Promise<Artikel> {
  const { imageFile, ...dbPayload } = payload;
  const BUCKET = "artikel-images" as any;

  let image_path: string | null = null;
  if (imageFile) {
    const storagePath = buildStoragePath("thumbnails", imageFile);
    image_path = await uploadFile(BUCKET, storagePath, imageFile);
  }

  return insertArtikel({ ...dbPayload, image_path });
}

/**
 * Payload form update artikel.
 * Jika imageFile diberikan, gambar lama dihapus dan gambar baru di-upload.
 * Jika imageFile null/undefined, image_path tidak berubah (kecuali eksplisit di-override).
 */
export type ArtikelUpdateFormPayload = Omit<ArtikelUpdate, "image_path"> & {
  imageFile?: File | null;
  /** URL/path gambar saat ini — dibutuhkan untuk menghapus file lama jika ada gambar baru. */
  currentImagePath?: string | null;
};

/**
 * Update artikel dengan upload gambar opsional.
 * Flow: (opsional) hapus gambar lama → upload gambar baru → update DB.
 */
export async function updateArtikelWithImage(
  payload: ArtikelUpdateFormPayload
): Promise<Artikel> {
  const { imageFile, currentImagePath, ...dbPayload } = payload;
  const BUCKET = "artikel-images" as any;

  let image_path: string | null | undefined = undefined; // undefined = tidak berubah

  if (imageFile) {
    // Hapus gambar lama dari storage jika ada
    if (currentImagePath) {
      try {
        const oldPath = extractPathFromUrl(currentImagePath);
        await deleteFile(BUCKET, oldPath);
      } catch {
        // Lanjut meski hapus gagal — file mungkin sudah tidak ada
      }
    }
    const storagePath = buildStoragePath("thumbnails", imageFile);
    image_path = await uploadFile(BUCKET, storagePath, imageFile);
  }

  // Hanya sertakan image_path jika ada perubahan
  const updatePayload: ArtikelUpdate =
    image_path !== undefined
      ? { ...dbPayload, image_path }
      : dbPayload;

  return updateArtikel(updatePayload);
}

/**
 * Hapus artikel beserta gambar thumbnail-nya dari storage.
 * Gunakan fungsi ini di admin untuk clean delete.
 */
export async function deleteArtikelWithImage(artikel: Artikel): Promise<void> {
  const BUCKET = "artikel-images" as any;

  if (artikel.image_path) {
    try {
      const storagePath = extractPathFromUrl(artikel.image_path);
      await deleteFile(BUCKET, storagePath);
    } catch {
      // Lanjut meski hapus storage gagal
    }
  }

  await deleteArtikel(artikel.id);
}

// ---------------------------------------------------------------------------
// layanan_publik
// ---------------------------------------------------------------------------

export async function fetchLayananPublik(): Promise<LayananPublik[]> {
  const { data, error } = await supabase
    .from("layanan_publik")
    .select("*")
    .order("urutan", { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function updateLayananPublik(payload: LayananPublikUpdate) {
  const { id, ...updates } = payload;
  const { data, error } = await supabase
    .from("layanan_publik")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function insertLayananPublik(
  payload: LayananPublikInsert
): Promise<LayananPublik> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("layanan_publik")
    .insert(payload)
    .select()
    .single();
  return assertNoError(data, error);
}

export async function deleteLayananPublik(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("layanan_publik").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// --- Form-level mutations LayananPublik (DB + Storage terintegrasi) ---

/**
 * Payload form insert layanan publik.
 * Jika imageFile diberikan, file akan di-upload ke bucket 'layanan-images'
 * dan URL-nya disimpan ke field image_path.
 */
export type LayananPublikInsertFormPayload = Omit<LayananPublikInsert, "image_path"> & {
  imageFile?: File | null;
};

/**
 * Insert layanan publik dengan upload gambar opsional.
 * Flow: upload gambar → dapatkan URL → insert DB.
 */
export async function insertLayananPublikWithImage(
  payload: LayananPublikInsertFormPayload
): Promise<LayananPublik> {
  const { imageFile, ...dbPayload } = payload;
  const BUCKET = "layanan-images" as any;

  let image_path: string | null = null;
  if (imageFile) {
    const storagePath = buildStoragePath("icons", imageFile);
    image_path = await uploadFile(BUCKET, storagePath, imageFile);
  }

  return insertLayananPublik({ ...dbPayload, image_path });
}

/**
 * Payload form update layanan publik.
 * Jika imageFile diberikan, gambar lama dihapus dan gambar baru di-upload.
 * Jika imageFile null/undefined, image_path tidak berubah.
 */
export type LayananPublikUpdateFormPayload = Omit<LayananPublikUpdate, "image_path"> & {
  imageFile?: File | null;
  /** URL/path gambar saat ini — dibutuhkan untuk menghapus file lama jika ada gambar baru. */
  currentImagePath?: string | null;
};

/**
 * Update layanan publik dengan upload gambar opsional.
 * Flow: (opsional) hapus gambar lama → upload gambar baru → update DB.
 */
export async function updateLayananPublikWithImage(
  payload: LayananPublikUpdateFormPayload
): Promise<LayananPublik> {
  const { imageFile, currentImagePath, ...dbPayload } = payload;
  const BUCKET = "layanan-images" as any;

  let image_path: string | null | undefined = undefined; // undefined = tidak berubah

  if (imageFile) {
    if (currentImagePath) {
      try {
        const oldPath = extractPathFromUrl(currentImagePath);
        await deleteFile(BUCKET, oldPath);
      } catch {
        // Lanjut meski hapus gagal — file mungkin sudah tidak ada
      }
    }
    const storagePath = buildStoragePath("icons", imageFile);
    image_path = await uploadFile(BUCKET, storagePath, imageFile);
  }

  // Hanya sertakan image_path jika ada perubahan
  const updatePayload: LayananPublikUpdate =
    image_path !== undefined
      ? { ...dbPayload, image_path }
      : dbPayload;

  return updateLayananPublik(updatePayload);
}

/**
 * Hapus layanan publik beserta file gambarnya dari storage.
 * Gunakan di admin untuk clean delete.
 */
export async function deleteLayananPublikWithImage(layanan: LayananPublik): Promise<void> {
  const BUCKET = "layanan-images" as any;

  if (layanan.image_path) {
    try {
      const storagePath = extractPathFromUrl(layanan.image_path);
      await deleteFile(BUCKET, storagePath);
    } catch {
      // Lanjut meski hapus storage gagal
    }
  }

  await deleteLayananPublik(layanan.id);
}

// ---------------------------------------------------------------------------
// banner_items
// ---------------------------------------------------------------------------

export async function fetchBannerItems(): Promise<BannerItem[]> {
  const { data, error } = await supabase
    .from("banner_items")
    .select("*")
    .order("urutan", { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function updateBannerItem(payload: BannerItemUpdate) {
  const { id, ...updates } = payload;
  const { data, error } = await supabase
    .from("banner_items")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function insertBannerItem(payload: BannerItemInsert): Promise<BannerItem> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("banner_items")
    .insert(payload)
    .select()
    .single();
  return assertNoError(data, error);
}

export async function deleteBannerItem(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("banner_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// --- Form-level mutations BannerItem (DB + Storage terintegrasi) ---

/**
 * Payload form update banner item.
 * Jika imageFile diberikan, gambar lama dihapus dan gambar baru di-upload.
 * Jika imageFile null/undefined, image_path tidak berubah.
 */
export type BannerItemUpdateFormPayload = Omit<BannerItemUpdate, "image_path"> & {
  imageFile?: File | null;
  /** URL/path gambar saat ini — dibutuhkan untuk menghapus file lama jika ada gambar baru. */
  currentImagePath?: string | null;
};

/**
 * Update banner item dengan upload gambar opsional.
 * Flow: (opsional) hapus gambar lama → upload gambar baru → update DB.
 */
export async function updateBannerItemWithImage(
  payload: BannerItemUpdateFormPayload
): Promise<BannerItem> {
  const { imageFile, currentImagePath, ...dbPayload } = payload;
  const BUCKET = "layanan-images" as any;

  let image_path: string | null | undefined = undefined; // undefined = tidak berubah

  if (imageFile) {
    if (currentImagePath) {
      try {
        const oldPath = extractPathFromUrl(currentImagePath);
        await deleteFile(BUCKET, oldPath);
      } catch {
        // Lanjut meski hapus gagal — file mungkin sudah tidak ada
      }
    }
    const storagePath = buildStoragePath("banners", imageFile);
    image_path = await uploadFile(BUCKET, storagePath, imageFile);
  }

  // Hanya sertakan image_path jika ada perubahan
  const updatePayload: BannerItemUpdate =
    image_path !== undefined
      ? { ...dbPayload, image_path }
      : dbPayload;

  return updateBannerItem(updatePayload);
}

// ---------------------------------------------------------------------------
// galeri
// ---------------------------------------------------------------------------

/**
 * Ambil semua foto galeri, sort urutan ASC.
 * Untuk halaman publik, sertakan parameter limit/offset jika diperlukan.
 */
export async function fetchGaleri(params?: {
  limit?: number;
  offset?: number;
}): Promise<Galeri[]> {
  const supabase = createClient();
  let query = supabase
    .from("galeri")
    .select("*")
    .order("urutan", { ascending: true });

  if (params?.limit)             query = query.limit(params.limit);
  if (params?.offset !== undefined)
    query = query.range(params.offset, params.offset + (params.limit ?? 20) - 1);

  const { data, error } = await query;
  return assertNoError(data, error);
}

// --- Operasi DB murni ---

/** Insert satu foto galeri ke DB. Gunakan insertGaleriWithImage jika ada file baru. */
export async function insertGaleri(payload: GaleriInsert): Promise<Galeri> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("galeri")
    .insert(payload)
    .select()
    .single();
  return assertNoError(data, error);
}

/** Update data foto galeri di DB. */
export async function updateGaleri(payload: GaleriUpdate): Promise<Galeri> {
  const supabase = createClient();
  const { id, ...rest } = payload;
  const { data, error } = await supabase
    .from("galeri")
    .update(rest)
    .eq("id", id)
    .select()
    .single();
  return assertNoError(data, error);
}

/** Hapus foto galeri dari DB saja (tanpa hapus storage). */
export async function deleteGaleri(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("galeri").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// --- Form-level mutations (DB + Storage terintegrasi) ---

/** Payload form insert foto galeri. imageFile wajib untuk item baru. */
export type GaleriInsertFormPayload = Omit<GaleriInsert, "image_path"> & {
  imageFile: File;
};

/**
 * Insert foto galeri dengan upload ke storage.
 * Flow: upload gambar → dapatkan URL → insert DB.
 */
export async function insertGaleriWithImage(
  payload: GaleriInsertFormPayload
): Promise<Galeri> {
  const { imageFile, ...dbPayload } = payload;
  const BUCKET = "galeri-images" as any;

  const storagePath = buildStoragePath("photos", imageFile);
  const image_path = await uploadFile(BUCKET, storagePath, imageFile);

  return insertGaleri({ ...dbPayload, image_path });
}

/** Payload form update foto galeri. imageFile opsional — jika ada, ganti gambar lama. */
export type GaleriUpdateFormPayload = Omit<GaleriUpdate, "image_path"> & {
  imageFile?: File | null;
  /** URL gambar saat ini, dibutuhkan untuk delete file lama. */
  currentImagePath?: string | null;
};

/**
 * Update foto galeri dengan penggantian gambar opsional.
 * Flow: (opsional) hapus lama → upload baru → update DB.
 */
export async function updateGaleriWithImage(
  payload: GaleriUpdateFormPayload
): Promise<Galeri> {
  const { imageFile, currentImagePath, ...dbPayload } = payload;
  const BUCKET = "galeri-images" as any;

  let image_path: string | undefined = undefined;

  if (imageFile) {
    if (currentImagePath) {
      try {
        const oldPath = extractPathFromUrl(currentImagePath);
        await deleteFile(BUCKET, oldPath);
      } catch {
        // Lanjut meski hapus gagal
      }
    }
    const storagePath = buildStoragePath("photos", imageFile);
    image_path = await uploadFile(BUCKET, storagePath, imageFile);
  }

  const updatePayload: GaleriUpdate =
    image_path !== undefined
      ? { ...dbPayload, image_path }
      : dbPayload;

  return updateGaleri(updatePayload);
}

/**
 * Hapus foto galeri beserta file-nya dari storage.
 * Gunakan di admin untuk clean delete.
 */
export async function deleteGaleriWithImage(galeri: Galeri): Promise<void> {
  const BUCKET = "galeri-images" as any;

  if (galeri.image_path) {
    try {
      const storagePath = extractPathFromUrl(galeri.image_path);
      await deleteFile(BUCKET, storagePath);
    } catch {
      // Lanjut meski hapus storage gagal
    }
  }

  await deleteGaleri(galeri.id);
}

// ---------------------------------------------------------------------------
// profiles
// ---------------------------------------------------------------------------

export async function fetchCurrentProfile(): Promise<Profile | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  return assertNoError(data, error);
}
