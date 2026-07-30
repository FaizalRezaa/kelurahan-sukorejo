import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Calendar, Clock, Tag } from "lucide-react";
import { fetchArtikelList } from "@/lib/query/fetcher"; // Ambil dari fetcher Supabase
import type { ArtikelCategory } from "../../../components/artikel/types";

export const revalidate = 0; // Agar selalu mengambil data terbaru

const categoryBadge: Record<string, string> = {
  Berita: "bg-emerald-100 text-emerald-800",
  Pengumuman: "bg-amber-100 text-amber-800",
  Kegiatan: "bg-sky-100 text-sky-800",
};

export default async function ArtikelPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const kategoriParam = typeof resolvedParams.kategori === "string" ? resolvedParams.kategori : "Semua";

  // Ambil data langsung dari Supabase berdasarkan status terbit
  const artikelRows = await fetchArtikelList({ status: "terbit" });

  // Filter berdasarkan kategori jika dipilih
  const filtered = kategoriParam === "Semua" 
    ? artikelRows 
    : artikelRows.filter((a) => a.kategori === kategoriParam);

  return (
    <main className="min-h-screen bg-[#f4f1ea]">
      {/* FILTER TABS */}
      <section className="sticky top-0 z-20 w-full bg-[#f4f1ea]/95 backdrop-blur-sm border-b border-zinc-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-4 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {["Semua", "Berita", "Pengumuman", "Kegiatan"].map((cat) => (
            <Link
              key={cat}
              href={cat === "Semua" ? "/artikel" : `/artikel?kategori=${cat}`}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                kategoriParam === cat
                  ? "bg-[#2d5e45] text-white border-[#2d5e45] shadow-sm"
                  : "bg-white text-zinc-600 border-zinc-200 hover:border-[#2d5e45] hover:text-[#2d5e45]"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* ARTIKEL LIST */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-12">
        <p className="text-sm text-zinc-500 mb-8">
          Menampilkan <span className="font-semibold text-zinc-800">{filtered.length}</span> artikel
        </p>

        <div className="space-y-0 divide-y divide-zinc-200/80 border border-zinc-200/80 rounded-2xl overflow-hidden bg-white shadow-sm">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-zinc-400">
              Tidak ada artikel ditemukan di database.
            </div>
          ) : (
            filtered.map((artikel, idx) => (
              <Link
                key={artikel.id}
                href={`/artikel/${artikel.slug}`}
                className="group flex flex-col sm:flex-row gap-0 hover:bg-zinc-50/80 transition-colors duration-200"
              >
                <div className="hidden sm:flex items-center justify-center w-16 shrink-0 text-2xl font-bold text-zinc-200 group-hover:text-zinc-300 transition-colors border-r border-zinc-100 px-4">
                  {String(idx + 1).padStart(2, "0")}
                </div>

                {/* Gambar dari Supabase atau Placeholder aman */}
                <div className="relative w-full sm:w-44 h-48 sm:h-auto shrink-0 overflow-hidden bg-zinc-100">
                  <Image
                    src={artikel.image_path || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop"}
                    alt={artikel.judul}
                    fill
                    sizes="(max-width: 640px) 100vw, 176px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex-1 px-6 py-5 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${categoryBadge[artikel.kategori] || "bg-zinc-100 text-zinc-800"}`}>
                        <Tag className="w-2.5 h-2.5" />
                        {artikel.kategori}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-zinc-400">
                        <Calendar className="w-3 h-3" />
                        {artikel.tanggal_terbit ?? "-"}
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-zinc-900 leading-snug group-hover:text-[#2d5e45] transition-colors line-clamp-2 mb-2">
                      {artikel.judul}
                    </h2>

                    <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">
                      {artikel.ringkasan}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Kelurahan Sukorejo</span>
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
      </section>
    </main>
  );
}