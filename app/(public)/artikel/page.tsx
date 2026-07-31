import Link from "next/link";
import { fetchArtikelList, fetchArtikelCount } from "@/lib/query/fetcher"; // Ambil dari fetcher Supabase
import { NewsCard } from "../../../components/home/news-card";
import type { NewsItem } from "../../../components/home/types";
import type { ArtikelKategori } from "@/lib/query/schema";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

function normalizeKategori(raw: string): NewsItem["category"] {
  const lower = raw.toLowerCase();
  if (lower === "kegiatan") return "Kegiatan";
  if (lower === "pengumuman") return "Pengumuman";
  return "Berita";
}

export const revalidate = 0; // Agar selalu mengambil data terbaru

export default async function ArtikelPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const kategoriParam =
    typeof resolvedParams.kategori === "string"
      ? resolvedParams.kategori
      : "Semua";

  const pageParam =
    typeof resolvedParams.page === "string"
      ? parseInt(resolvedParams.page, 10)
      : 1;
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const pageSize = 6;
  const offset = (currentPage - 1) * pageSize;

  const kategoriFilter =
    kategoriParam !== "Semua" ? (kategoriParam as ArtikelKategori) : undefined;

  // Ambil data langsung dari Supabase berdasarkan status terbit
  const [artikelRows, totalCount] = await Promise.all([
    fetchArtikelList({
      status: "terbit",
      kategori: kategoriFilter,
      limit: pageSize,
      offset,
    }),
    fetchArtikelCount({ status: "terbit", kategori: kategoriFilter }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const tabs = ["Semua", "Berita", "Kegiatan", "Pengumuman"];

  return (
    <main className="min-h-screen bg-[#f4f1ea]">
      {/* ARTIKEL LIST */}
      <section className="pt-32 max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-12">
        {/* TAB FILTER */}
        <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-zinc-200 pb-4">
          {tabs.map((tab) => {
            const isActive = tab === kategoriParam;
            return (
              <Link
                key={tab}
                href={`/artikel?kategori=${tab}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#18181b] text-white"
                    : "bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200"
                }`}
              >
                {tab}
              </Link>
            );
          })}
        </div>

        <p className="text-sm text-zinc-500 mb-8">
          Menampilkan{" "}
          <span className="font-semibold text-zinc-800">
            {artikelRows.length}
          </span>{" "}
          dari <span className="font-semibold text-zinc-800">{totalCount}</span>{" "}
          artikel
        </p>

        {artikelRows.length === 0 ? (
          <div className="text-center py-20 text-zinc-400 bg-white border border-zinc-200/80 rounded-2xl shadow-sm">
            Tidak ada artikel ditemukan di database.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12">
              {artikelRows.map((artikel) => (
                <NewsCard
                  key={artikel.id}
                  id={artikel.id}
                  date={formatTanggal(artikel.tanggal_terbit)}
                  category={normalizeKategori(artikel.kategori)}
                  title={artikel.judul}
                  summary={artikel.ringkasan ?? ""}
                  image={
                    artikel.image_path ||
                    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop"
                  }
                  href={`/artikel/${artikel.slug}`}
                />
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Link
                  href={`/artikel?kategori=${kategoriParam}&page=${Math.max(1, currentPage - 1)}`}
                  className={`p-2 rounded-lg border border-zinc-200 flex items-center justify-center transition-colors ${
                    currentPage <= 1
                      ? "opacity-50 pointer-events-none bg-zinc-50"
                      : "bg-white hover:bg-zinc-50 text-zinc-700"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Link>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <Link
                        key={p}
                        href={`/artikel?kategori=${kategoriParam}&page=${p}`}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                          currentPage === p
                            ? "bg-[#18181b] border-[#18181b] text-white"
                            : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                        }`}
                      >
                        {p}
                      </Link>
                    ),
                  )}
                </div>

                <Link
                  href={`/artikel?kategori=${kategoriParam}&page=${Math.min(totalPages, currentPage + 1)}`}
                  className={`p-2 rounded-lg border border-zinc-200 flex items-center justify-center transition-colors ${
                    currentPage >= totalPages
                      ? "opacity-50 pointer-events-none bg-zinc-50"
                      : "bg-white hover:bg-zinc-50 text-zinc-700"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
