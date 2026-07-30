import { z } from "zod";

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

const uuidSchema = z.string().uuid();
const timestampSchema = z.string().datetime({ offset: true });

// ---------------------------------------------------------------------------
// profil_statistik
// ---------------------------------------------------------------------------

export const ProfilStatistikSchema = z.object({
  id: uuidSchema,
  label: z.string().min(1, "Label tidak boleh kosong"),
  value: z.string().min(1, "Nilai tidak boleh kosong"),
  urutan: z.number().int().min(1).max(3),
});

export const ProfilStatistikInsertSchema = ProfilStatistikSchema.omit({
  id: true,
});

export const ProfilStatistikUpdateSchema = ProfilStatistikSchema.partial().required({
  id: true,
});

export type ProfilStatistik = z.infer<typeof ProfilStatistikSchema>;
export type ProfilStatistikInsert = z.infer<typeof ProfilStatistikInsertSchema>;
export type ProfilStatistikUpdate = z.infer<typeof ProfilStatistikUpdateSchema>;

// ---------------------------------------------------------------------------
// hero_slides
// ---------------------------------------------------------------------------

export const HeroSlideSchema = z.object({
  id: uuidSchema,
  image_path: z.string().min(1, "Path gambar tidak boleh kosong"),
  alt: z.string().min(1, "Alt text tidak boleh kosong"),
  urutan: z.number().int().min(1),
  aktif: z.boolean(),
});

export const HeroSlideInsertSchema = HeroSlideSchema.omit({ id: true });

export const HeroSlideUpdateSchema = HeroSlideSchema.partial().required({
  id: true,
});

export type HeroSlide = z.infer<typeof HeroSlideSchema>;
export type HeroSlideInsert = z.infer<typeof HeroSlideInsertSchema>;
export type HeroSlideUpdate = z.infer<typeof HeroSlideUpdateSchema>;

// ---------------------------------------------------------------------------
// artikel
// ---------------------------------------------------------------------------

export const ArtikelKategoriEnum = z.enum(["Berita", "Kegiatan", "Pengumuman"]);
export const ArtikelStatusEnum = z.enum(["draft", "terbit"]);

export const ArtikelSchema = z.object({
  id: uuidSchema,
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung"),
  judul: z.string().min(1, "Judul tidak boleh kosong").max(255),
  kategori: ArtikelKategoriEnum,
  ringkasan: z.string().min(1, "Ringkasan tidak boleh kosong").max(500),
  konten: z.string().min(1, "Konten tidak boleh kosong"),
  image_path: z.string().nullable(),
  status: ArtikelStatusEnum,
  tanggal_terbit: z.string().date().nullable(),
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

export const ArtikelInsertSchema = ArtikelSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const ArtikelUpdateSchema = ArtikelSchema
  .omit({ created_at: true, updated_at: true })
  .partial()
  .required({ id: true });

/** Shape untuk form (sebelum upload gambar diproses) */
export const ArtikelFormSchema = ArtikelInsertSchema.extend({
  image_path: z.string().nullable().optional(),
  tanggal_terbit: z.string().date().nullable().optional(),
});

export type Artikel = z.infer<typeof ArtikelSchema>;
export type ArtikelInsert = z.infer<typeof ArtikelInsertSchema>;
export type ArtikelUpdate = z.infer<typeof ArtikelUpdateSchema>;
export type ArtikelKategori = z.infer<typeof ArtikelKategoriEnum>;
export type ArtikelStatus = z.infer<typeof ArtikelStatusEnum>;

// ---------------------------------------------------------------------------
// layanan_publik
// ---------------------------------------------------------------------------

export const LayananPublikSchema = z.object({
  id: uuidSchema,
  urutan: z.number().int().min(1).max(6),
  judul: z.string().min(1, "Judul tidak boleh kosong").max(100),
  deskripsi: z.string().min(1, "Deskripsi tidak boleh kosong").max(500),
  image_path: z.string().nullable(),
  href: z.string().min(1, "Link tujuan tidak boleh kosong"),
  created_at: timestampSchema,
});

export const LayananPublikInsertSchema = LayananPublikSchema.omit({
  id: true,
  created_at: true,
});

export const LayananPublikUpdateSchema = LayananPublikSchema
  .omit({ created_at: true })
  .partial()
  .required({ id: true });

export type LayananPublik = z.infer<typeof LayananPublikSchema>;
export type LayananPublikInsert = z.infer<typeof LayananPublikInsertSchema>;
export type LayananPublikUpdate = z.infer<typeof LayananPublikUpdateSchema>;

// ---------------------------------------------------------------------------
// banner_items
// ---------------------------------------------------------------------------

export const BannerItemSchema = z.object({
  id: uuidSchema,
  urutan: z.number().int().min(1).max(2),
  judul: z.string().min(1, "Judul tidak boleh kosong").max(255),
  button_text: z.string().min(1, "Teks tombol tidak boleh kosong").max(50),
  image_path: z.string().nullable(),
  href: z.string().min(1, "Link tujuan tidak boleh kosong"),
  created_at: timestampSchema,
});

export const BannerItemInsertSchema = BannerItemSchema.omit({
  id: true,
  created_at: true,
});

export const BannerItemUpdateSchema = BannerItemSchema
  .omit({ created_at: true })
  .partial()
  .required({ id: true });

export type BannerItem = z.infer<typeof BannerItemSchema>;
export type BannerItemInsert = z.infer<typeof BannerItemInsertSchema>;
export type BannerItemUpdate = z.infer<typeof BannerItemUpdateSchema>;

// ---------------------------------------------------------------------------
// galeri
// ---------------------------------------------------------------------------

export const GaleriSchema = z.object({
  id: uuidSchema,
  image_path: z.string().min(1, "Path gambar tidak boleh kosong"),
  alt: z.string().min(1, "Alt text tidak boleh kosong"),
  urutan: z.number().int().min(1),
  created_at: timestampSchema,
});

export const GaleriInsertSchema = GaleriSchema.omit({
  id: true,
  created_at: true,
});

export const GaleriUpdateSchema = GaleriSchema
  .omit({ created_at: true })
  .partial()
  .required({ id: true });

export type Galeri = z.infer<typeof GaleriSchema>;
export type GaleriInsert = z.infer<typeof GaleriInsertSchema>;
export type GaleriUpdate = z.infer<typeof GaleriUpdateSchema>;

// ---------------------------------------------------------------------------
// profiles (admin)
// ---------------------------------------------------------------------------

export const ProfileRoleEnum = z.enum(["admin"]);

export const ProfileSchema = z.object({
  id: uuidSchema,
  nama: z.string().min(1, "Nama tidak boleh kosong").max(100),
  role: ProfileRoleEnum,
  created_at: timestampSchema,
});

export type Profile = z.infer<typeof ProfileSchema>;
export type ProfileRole = z.infer<typeof ProfileRoleEnum>;

// ---------------------------------------------------------------------------
// Storage — upload payload shapes
// ---------------------------------------------------------------------------

export const StorageUploadPayloadSchema = z.object({
  bucket: z.enum(["hero-images", "artikel-images", "layanan-images", "galeri-images"]),
  file: z.instanceof(File),
  /** Path relatif di dalam bucket, misal: "slides/my-image.webp" */
  path: z.string().min(1),
});

export type StorageUploadPayload = z.infer<typeof StorageUploadPayloadSchema>;
