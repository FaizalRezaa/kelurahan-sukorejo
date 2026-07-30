/**
 * keys.ts
 * TanStack Query key factory untuk seluruh tabel.
 * Semua key adalah tuple agar mudah di-invalidate secara granular.
 *
 * Pola penggunaan:
 *   queryKey: queryKeys.artikel.all()         → invalidate semua artikel
 *   queryKey: queryKeys.artikel.list(params)  → invalidate list tertentu
 *   queryKey: queryKeys.artikel.detail(id)    → invalidate satu artikel
 */

// ---------------------------------------------------------------------------
// profil_statistik
// ---------------------------------------------------------------------------

const profilStatistik = {
  all: () => ["profil_statistik"] as const,
  lists: () => [...profilStatistik.all(), "list"] as const,
  list: () => [...profilStatistik.lists()] as const,
} as const;

// ---------------------------------------------------------------------------
// hero_slides
// ---------------------------------------------------------------------------

const heroSlides = {
  all: () => ["hero_slides"] as const,
  lists: () => [...heroSlides.all(), "list"] as const,
  list: (filter?: { aktif?: boolean }) =>
    [...heroSlides.lists(), filter ?? {}] as const,
  detail: (id: string) => [...heroSlides.all(), "detail", id] as const,
} as const;

// ---------------------------------------------------------------------------
// artikel
// ---------------------------------------------------------------------------

const artikel = {
  all: () => ["artikel"] as const,
  lists: () => [...artikel.all(), "list"] as const,
  list: (params?: {
    kategori?: string;
    status?: "draft" | "terbit";
    limit?: number;
    offset?: number;
  }) => [...artikel.lists(), params ?? {}] as const,
  detail: (id: string) => [...artikel.all(), "detail", id] as const,
  bySlug: (slug: string) => [...artikel.all(), "slug", slug] as const,
} as const;

// ---------------------------------------------------------------------------
// layanan_publik
// ---------------------------------------------------------------------------

const layananPublik = {
  all: () => ["layanan_publik"] as const,
  lists: () => [...layananPublik.all(), "list"] as const,
  list: () => [...layananPublik.lists()] as const,
  detail: (id: string) => [...layananPublik.all(), "detail", id] as const,
} as const;

// ---------------------------------------------------------------------------
// banner_items
// ---------------------------------------------------------------------------

const bannerItems = {
  all: () => ["banner_items"] as const,
  lists: () => [...bannerItems.all(), "list"] as const,
  list: () => [...bannerItems.lists()] as const,
  detail: (id: string) => [...bannerItems.all(), "detail", id] as const,
} as const;

// ---------------------------------------------------------------------------
// galeri
// ---------------------------------------------------------------------------

const galeri = {
  all: () => ["galeri"] as const,
  lists: () => [...galeri.all(), "list"] as const,
  list: () => [...galeri.lists()] as const,
  detail: (id: string) => [...galeri.all(), "detail", id] as const,
} as const;

// ---------------------------------------------------------------------------
// profiles (admin)
// ---------------------------------------------------------------------------

const profiles = {
  all: () => ["profiles"] as const,
  current: () => [...profiles.all(), "current"] as const,
} as const;

// ---------------------------------------------------------------------------
// Export tunggal
// ---------------------------------------------------------------------------

export const queryKeys = {
  profilStatistik,
  heroSlides,
  artikel,
  layananPublik,
  bannerItems,
  galeri,
  profiles,
} as const;
