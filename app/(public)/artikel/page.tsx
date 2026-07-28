"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Calendar, Clock, Tag } from "lucide-react";
import { artikelItems } from "../../../components/artikel/data";
import type { ArtikelCategory } from "../../../components/artikel/types";

const ITEMS_PER_PAGE = 6;

const categoryColors: Record<ArtikelCategory | "all", string> = {
  all: "bg-[#2d5e45] text-white",
  Berita: "bg-emerald-100 text-emerald-800",
  Pengumuman: "bg-amber-100 text-amber-800",
  Kegiatan: "bg-sky-100 text-sky-800",
};

const categoryBadge: Record<ArtikelCategory, string> = {
  Berita: "bg-emerald-100 text-emerald-800",
  Pengumuman: "bg-amber-100 text-amber-800",
  Kegiatan: "bg-sky-100 text-sky-800",
};

type FilterCategory = ArtikelCategory | "Semua";

const filters: FilterCategory[] = ["Semua", "Berita", "Pengumuman", "Kegiatan"];

export default function ArtikelPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = use(searchParams);
  const pageParam =
    typeof resolvedParams.page === "string" ? resolvedParams.page : "1";
  const initialPage = Math.max(1, parseInt(pageParam) || 1);

  const [activeFilter, setActiveFilter] = useState<FilterCategory>("Semua");
  const [currentPage, setCurrentPage] = useState(initialPage);

  const filtered =
    activeFilter === "Semua"
      ? artikelItems
      : artikelItems.filter((a) => a.category === activeFilter);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);
  const paginated = filtered.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE,
  );

  const handleFilter = (f: FilterCategory) => {
    setActiveFilter(f);
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-[#f4f1ea]">
      {/* FILTER TABS */}
      <section className="sticky top-0 z-20 w-full bg-[#f4f1ea]/95 backdrop-blur-sm border-b border-zinc-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-4 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => handleFilter(f)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                activeFilter === f
                  ? "bg-[#2d5e45] text-white border-[#2d5e45] shadow-sm"
                  : "bg-white text-zinc-600 border-zinc-200 hover:border-[#2d5e45] hover:text-[#2d5e45]"
              }`}
            >
              {f}
              {f !== "Semua" && (
                <span
                  className={`ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                    activeFilter === f
                      ? "bg-white/20 text-white"
                      : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  {artikelItems.filter((a) => a.category === f).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ARTIKEL LIST */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-12">
        {/* Count */}
        <p className="text-sm text-zinc-500 mb-8">
          Menampilkan{" "}
          <span className="font-semibold text-zinc-800">{filtered.length}</span>{" "}
          artikel
          {activeFilter !== "Semua" && (
            <>
              {" "}
              dalam kategori{" "}
              <span className="font-semibold text-[#2d5e45]">
                {activeFilter}
              </span>
            </>
          )}
        </p>

        {/* Articles */}
        <div className="space-y-0 divide-y divide-zinc-200/80 border border-zinc-200/80 rounded-2xl overflow-hidden bg-white shadow-sm">
          {paginated.length === 0 ? (
            <div className="text-center py-20 text-zinc-400">
              Tidak ada artikel ditemukan.
            </div>
          ) : (
            paginated.map((artikel, idx) => (
              <Link
                key={artikel.id}
                href={`/artikel/${artikel.slug}`}
                className="group flex flex-col sm:flex-row gap-0 hover:bg-zinc-50/80 transition-colors duration-200"
                aria-label={`Baca artikel: ${artikel.title}`}
              >
                {/* Number */}
                <div className="hidden sm:flex items-center justify-center w-16 shrink-0 text-2xl font-bold text-zinc-200 group-hover:text-zinc-300 transition-colors border-r border-zinc-100 px-4">
                  {String(
                    (safeCurrentPage - 1) * ITEMS_PER_PAGE + idx + 1,
                  ).padStart(2, "0")}
                </div>

                {/* Image */}
                <div className="relative w-full sm:w-44 h-48 sm:h-auto shrink-0 overflow-hidden bg-zinc-100">
                  <Image
                    src={artikel.image}
                    alt={artikel.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 176px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent" />
                </div>

                {/* Content */}
                <div className="flex-1 px-6 py-5 flex flex-col justify-between min-w-0">
                  <div>
                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${categoryBadge[artikel.category]}`}
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {artikel.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-zinc-400">
                        <Calendar className="w-3 h-3" />
                        {artikel.date}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-zinc-400">
                        <Clock className="w-3 h-3" />
                        {artikel.readTime} baca
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-base sm:text-lg font-bold text-zinc-900 leading-snug group-hover:text-[#2d5e45] transition-colors line-clamp-2 mb-2">
                      {artikel.title}
                    </h2>

                    {/* Summary */}
                    <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">
                      {artikel.summary}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-zinc-400">
                      Oleh {artikel.author}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2d5e45] group-hover:underline">
                      Baca selengkapnya
                      <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
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

        {/* Page info */}
        {totalPages > 1 && (
          <p className="text-center text-xs text-zinc-400 mt-4">
            Halaman {safeCurrentPage} dari {totalPages}
          </p>
        )}
      </section>
    </main>
  );
}
