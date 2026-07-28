"use client";

import { use, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { galleriItems } from "../../../components/artikel/data";

const ITEMS_PER_PAGE = 12;

// Collect unique categories
const allCategories = [
  "Semua",
  ...Array.from(new Set(galleriItems.map((g) => g.category))),
];

export default function GaleriPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = use(searchParams);
  const pageParam =
    typeof resolvedParams.page === "string" ? resolvedParams.page : "1";
  const initialPage = Math.max(1, parseInt(pageParam) || 1);

  const [activeCategory, setActiveCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    activeCategory === "Semua"
      ? galleriItems
      : galleriItems.filter((g) => g.category === activeCategory);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);
  const paginated = filtered.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE,
  );

  const handleCategory = (c: string) => {
    setActiveCategory(c);
    setCurrentPage(1);
  };

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const prevLightbox = () =>
    setLightboxIndex((i) =>
      i !== null ? (i - 1 + paginated.length) % paginated.length : null,
    );
  const nextLightbox = () =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % paginated.length : null));

  return (
    <main className="min-h-screen bg-[#f4f1ea]">
      {/* GALLERY GRID */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-12">
        {/* Count */}
        <p className="text-sm text-zinc-500 mb-8">
          Menampilkan{" "}
          <span className="font-semibold text-zinc-800">{filtered.length}</span>{" "}
          foto
          {activeCategory !== "Semua" && (
            <>
              {" "}
              dalam kategori{" "}
              <span className="font-semibold text-[#2d5e45]">
                {activeCategory}
              </span>
            </>
          )}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {paginated.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="group relative overflow-hidden rounded-xl bg-zinc-200 aspect-square focus:outline-none focus:ring-2 focus:ring-[#2d5e45] focus:ring-offset-2"
              aria-label={`Lihat foto: ${item.caption}`}
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Zoom icon */}
              <div className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                <ZoomIn className="w-4 h-4 text-white" />
              </div>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#e4c77d] mb-1">
                  {item.category}
                </span>
                <p className="text-xs text-white leading-snug line-clamp-2 font-medium">
                  {item.caption}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage === 1}
              className="p-2.5 rounded-full border border-zinc-200 bg-white text-zinc-600 hover:border-[#2d5e45] hover:text-[#2d5e45] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-full text-sm font-semibold transition-all ${
                  page === safeCurrentPage
                    ? "bg-[#2d5e45] text-white shadow-sm"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:border-[#2d5e45] hover:text-[#2d5e45]"
                }`}
                aria-label={`Halaman ${page}`}
                aria-current={page === safeCurrentPage ? "page" : undefined}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage === totalPages}
              className="p-2.5 rounded-full border border-zinc-200 bg-white text-zinc-600 hover:border-[#2d5e45] hover:text-[#2d5e45] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Halaman berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {totalPages > 1 && (
          <p className="text-center text-xs text-zinc-400 mt-4">
            Halaman {safeCurrentPage} dari {totalPages} &middot;{" "}
            {filtered.length} foto
          </p>
        )}
      </section>

      {/* LIGHTBOX */}
      {lightboxIndex !== null && paginated[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Foto detail"
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            aria-label="Tutup"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevLightbox();
            }}
            className="absolute left-4 sm:left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            aria-label="Foto sebelumnya"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Image */}
          <div
            className="relative w-full max-w-3xl mx-6 aspect-[4/3] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={paginated[lightboxIndex].image}
              alt={paginated[lightboxIndex].alt}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 px-6 py-5 bg-gradient-to-t from-black/70 to-transparent">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#e4c77d] block mb-1">
                {paginated[lightboxIndex].category} &middot;{" "}
                {paginated[lightboxIndex].date}
              </span>
              <p className="text-sm text-white font-medium">
                {paginated[lightboxIndex].caption}
              </p>
            </div>
          </div>

          {/* Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextLightbox();
            }}
            className="absolute right-4 sm:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            aria-label="Foto berikutnya"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Counter */}
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs text-white/60">
            {lightboxIndex + 1} / {paginated.length}
          </p>
        </div>
      )}
    </main>
  );
}
