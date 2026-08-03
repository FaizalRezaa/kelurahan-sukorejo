import Link from "next/link";

import { Hero } from "../../components/home/hero";
import { ProfileSection } from "../../components/home/profile-section";
import { ResourceCard } from "../../components/home/resource-card";
import { BannerCard } from "../../components/home/banner-card";
import { NewsCard } from "../../components/home/news-card";
import { GalleryCard } from "../../components/home/gallery-card";

import {
  heroSlides as heroSlidesStatic,
  profileStatistics as profileStatisticsStatic,
  resourceItems as resourceItemsStatic, // Ubah nama biar jelas ini statis
  bannerItems as bannerItemsStatic, // Ubah nama biar jelas ini statis
  newsItems as newsItemsStatic,
  galleryItems as galleryItemsStatic,
} from "../../components/home/data";

import { createClient } from "@/lib/supabase/server";
import type { NewsItem, ProfileStatistic } from "../../components/home/types";

// ─── Type untuk baris dari tabel `artikel` ───────────────────────────────────
type ArtikelRow = {
  id: string;
  slug: string;
  judul: string;
  kategori: string;
  ringkasan: string | null;
  image_path: string | null;
  tanggal_terbit: string | null;
};

// ─── Type untuk baris dari tabel `profil_statistik` ──────────────────────────
type ProfilStatistikRow = {
  id: string;
  label: string;
  value: string;
  urutan: number | null;
};

// ─── Type untuk baris dari tabel `galeri` ────────────────────────────────────
type GaleriRow = {
  id: string;
  image_path: string;
  alt: string;
  urutan: number;
};

type HeroSlideShow = {
  id: string;
  image_path: string;
  title: string;
  urutan: number;
};

// ─── Type untuk baris dari tabel `layanan_publik` ────────────────────────────
type LayananPublikRow = {
  id: string;
  urutan: number;
  judul: string;
  deskripsi: string;
  image_path: string | null;
  href: string;
};

// ─── Type untuk baris dari tabel `banner_items` ──────────────────────────────
type BannerItemRow = {
  id: string;
  urutan: number;
  judul: string;
  button_text: string;
  image_path: string | null;
  href: string;
};

// ─── Helper: format tanggal ISO → "23 JULI 2026" ─────────────────────────────
function formatTanggal(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso)
    .toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();
}

// ─── Helper: normalisasi kategori ke union type NewsItem ─────────────────────
function normalizeKategori(raw: string): NewsItem["category"] {
  const lower = raw.toLowerCase();
  if (lower === "kegiatan") return "Kegiatan";
  if (lower === "pengumuman") return "Pengumuman";
  return "Berita";
}

export default async function Page() {
  const supabase = await createClient();

  // ── Fetch artikel terbaru ──────────────────────────────────────────────────
  const { data: artikelRows, error: artikelError } = await supabase
    .from("artikel")
    .select("id, slug, judul, kategori, ringkasan, image_path, tanggal_terbit")
    .eq("status", "terbit")
    .order("tanggal_terbit", { ascending: false })
    .limit(6);

  if (artikelError) {
    console.error("Gagal mengambil data artikel:", artikelError.message);
  }

  // ── Fetch profil statistik ────────────────────────────────────────────────
  const { data: statistikRows, error: statistikError } = await supabase
    .from("profil_statistik")
    .select("id, label, value, urutan")
    .order("urutan", { ascending: true });

  if (statistikError) {
    console.error(
      "Gagal mengambil data profil_statistik:",
      statistikError.message,
    );
  }

  // ── Fetch galeri foto ──────────────────────────────────────────────────────
  const { data: galeriRows, error: galeriError } = await supabase
    .from("galeri")
    .select("id, image_path, alt, urutan")
    .order("urutan", { ascending: true })
    .limit(7);

  if (galeriError) {
    console.error("Gagal mengambil data galeri:", galeriError.message);
  }

  // ── Fetch Hero Banner ──────────────────────────────────────────────────────
  const { data: heroRows, error: heroError } = await supabase
    .from("hero_slides")
    .select("*")
    .order("urutan", { ascending: true });

  if (heroError) {
    console.error("Gagal mengambil data hero banner:", heroError.message);
  }

  // ── Fetch Layanan Publik (6 Kotak) ─────────────────────────────────────────
  const { data: layananRows, error: layananError } = await supabase
    .from("layanan_publik")
    .select("*")
    .order("urutan", { ascending: true });

  if (layananError) {
    console.error("Gagal mengambil data layanan publik:", layananError.message);
  }

  // ── Fetch Banner CTA (2 Banner) ────────────────────────────────────────────
  const { data: bannerRows, error: bannerError } = await supabase
    .from("banner_items")
    .select("*")
    .order("urutan", { ascending: true });

  if (bannerError) {
    console.error("Gagal mengambil data banner items:", bannerError.message);
  }

  // ── Mapping Data dari Database (dengan fallback ke statis) ────────────────

  const mappedHeroSlides =
    heroRows && heroRows.length > 0
      ? (heroRows as HeroSlideShow[]).map((row) => ({
        id: row.id,
        image: row.image_path,
        alt: row.title,
        urutan: row.urutan,
      }))
      : heroSlidesStatic;

  const newsItems: NewsItem[] =
    artikelRows && artikelRows.length > 0
      ? (artikelRows as ArtikelRow[]).map((row) => ({
        id: row.id,
        date: formatTanggal(row.tanggal_terbit),
        category: normalizeKategori(row.kategori),
        title: row.judul,
        summary: row.ringkasan ?? "",
        image:
          row.image_path ??
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
        href: `/artikel/${row.slug}`,
      }))
      : newsItemsStatic;

  const profileStatistics: ProfileStatistic[] =
    statistikRows && statistikRows.length > 0
      ? (statistikRows as ProfilStatistikRow[]).map((row) => ({
        value: row.value,
        label: row.label,
      }))
      : profileStatisticsStatic;

  const galleryStyles = [
    "col-span-2 aspect-[16/10] sm:col-span-1 sm:aspect-[4/5] md:col-span-4 md:row-span-2 md:aspect-auto",
    "col-span-2 aspect-[16/10] sm:col-span-1 sm:aspect-[4/5] md:col-span-2 md:row-span-2 md:aspect-auto",
    "col-span-1 aspect-[4/5] md:col-span-3 md:row-span-2 md:aspect-auto",
    "col-span-1 aspect-[4/5] md:col-span-3 md:row-span-2 md:aspect-auto",
    "col-span-2 aspect-[16/10] sm:col-span-1 sm:aspect-[4/5] md:col-span-2 md:row-span-2 md:aspect-auto",
    "col-span-1 aspect-[4/5] md:col-span-4 md:row-span-2 md:aspect-auto",
  ];

  const hasMoreGaleriDb = galeriRows && galeriRows.length > 6;
  const displayGaleriDb = hasMoreGaleriDb ? galeriRows.slice(0, 6) : galeriRows;

  const hasMoreGaleriStatic = galleryItemsStatic.length > 6;
  const displayGaleriStatic = hasMoreGaleriStatic ? galleryItemsStatic.slice(0, 6) : galleryItemsStatic;

  const mappedGalleryItems =
    displayGaleriDb && displayGaleriDb.length > 0
      ? (displayGaleriDb as GaleriRow[]).map((row, index) => {
        const isLast = index === 5 && hasMoreGaleriDb;
        return {
          id: row.id,
          image: row.image_path,
          alt: row.alt,
          caption: row.alt,
          category: "Dokumentasi",
          className: galleryStyles[index % galleryStyles.length],
          overlayText: isLast ? "Lihat galeri lainnya" : undefined,
          overlayHref: isLast ? "/galeri" : undefined,
        };
      })
      : displayGaleriStatic.map((item, index) => {
        const isLast = index === 5 && hasMoreGaleriStatic;
        return isLast
          ? { ...item, overlayText: "Lihat galeri lainnya", overlayHref: "/galeri" }
          : item;
      });

  // Map Layanan Publik
  const mappedResourceItems =
    layananRows && layananRows.length > 0
      ? (layananRows as LayananPublikRow[]).map((row) => ({
        title: row.judul,
        description: row.deskripsi,
        icon: "FileText" as const,
        href: row.href,
        // Berikan fallback gambar default jika image_path kosong atau null
        image:
          row.image_path && row.image_path.trim() !== ""
            ? row.image_path
            : "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
      }))
      : resourceItemsStatic;

  // Map Banner CTA
  const mappedBannerItems =
    bannerRows && bannerRows.length > 0
      ? (bannerRows as BannerItemRow[]).map((row) => ({
        title: row.judul,
        buttonText: row.button_text,
        image: row.image_path ?? "",
        href: row.href,
      }))
      : bannerItemsStatic;

  return (
    <>
      <main className="w-full min-h-screen bg-[#f4f1ea] font-sans space-y-20 md:space-y-28">
        <Hero heroSlides={mappedHeroSlides} />

        <ProfileSection profileStatistics={profileStatistics} />

        {/* SECTION 1: RESOURCE GRID (Layanan Publik dari Database) */}
        <section
          id="layanan"
          className="px-3 sm:px-6 md:px-10 max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.75 overflow-hidden rounded-lg shadow-sm">
            {mappedResourceItems.map((item, index) => (
              <ResourceCard key={index} {...item} />
            ))}
          </div>
        </section>

        {/* SECTION 2: BANNER CALL-TO-ACTION (Dari Database) */}
        <section className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 w-full">
            {mappedBannerItems.map((item, index) => (
              <BannerCard key={index} {...item} />
            ))}
          </div>
        </section>

        {/* SECTION 3: BERITA & KEGIATAN TERBARU */}
        <section className="w-full bg-[#f4f1ea] text-zinc-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10">
            <div className="text-center mb-10 sm:mb-14">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-2">
                Baca Artikel Terbaru Kami
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 font-medium max-w-xl mx-auto mb-4">
                Informasi terkini tentang kegiatan dan program pemerintah
                kelurahan
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12">
              {newsItems.map((news) => (
                <NewsCard key={news.id} {...news} />
              ))}
            </div>

            <div className="flex justify-center">
              <Link
                href="/artikel"
                className="inline-flex items-center justify-center rounded-full border-2 border-[#2d5e45] bg-transparent px-8 py-3 text-base font-bold text-[#2d5e45] transition-all duration-300 hover:bg-[#2d5e45] hover:text-white active:scale-95 shadow-sm"
              >
                Lihat Semua Artikel
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 4: GALERI FOTO */}
        <section id="galeri" className="w-full bg-[#f4f1ea] pb-16 sm:pb-24">
          <div className="mx-auto max-w-7xl px-2 sm:px-3 md:px-4">
            <div className="mb-6 flex flex-col gap-3 px-1 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#2d5e45]">
                  Cerita Warga
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl md:text-5xl">
                  Galeri Foto
                </h2>
              </div>
              <p className="max-w-52 text-sm leading-relaxed text-zinc-600 sm:text-right">
                Merekam momen kebersamaan dan keindahan Sukorejo.
              </p>
            </div>

            <div className="grid auto-rows-auto grid-cols-2 gap-1.5 sm:gap-2 md:grid-cols-6 md:grid-flow-dense md:auto-rows-40 lg:auto-rows-48">
              {mappedGalleryItems.map((item) => (
                <GalleryCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
