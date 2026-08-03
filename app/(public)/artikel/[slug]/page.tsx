import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { ShareButton } from "../../../../components/artikel/share-button";
import { fetchArtikelBySlug, fetchArtikelList } from "@/lib/query/fetcher";

// Agar selalu mengambil data terbaru dari database
export const revalidate = 0;

const categoryBadge: Record<string, string> = {
  Berita: "bg-emerald-100 text-emerald-800",
  Pengumuman: "bg-amber-100 text-amber-800",
  Kegiatan: "bg-sky-100 text-sky-800",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const artikel = await fetchArtikelBySlug(slug);

  if (!artikel) return { title: "Artikel Tidak Ditemukan" };

  return {
    title: `${artikel.judul} | Kelurahan Sukorejo`,
    description: artikel.ringkasan,
  };
}

export default async function ArticleSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artikel = await fetchArtikelBySlug(slug);

  if (!artikel) {
    notFound();
  }

  // Ambil artikel terkait (kategori sama, id berbeda) dari Supabase
  const allArtikel = await fetchArtikelList({ status: "terbit" });
  const related = allArtikel
    .filter((a) => a.kategori === artikel.kategori && a.id !== artikel.id)
    .slice(0, 3);

  // Fallback gambar jika tidak ada image_path
  const coverImage =
    artikel.image_path ||
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop";

  return (
    <main className="min-h-screen bg-[#f4f1ea] overflow-x-hidden">
      {/* HERO IMAGE */}
      <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[55vh] overflow-hidden bg-zinc-900">
        <Image
          src={coverImage}
          alt={artikel.judul}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-zinc-900/30 to-zinc-900/20" />

        {/* Back button */}
        <div className="absolute mt-12 top-0 left-0 right-0 pt-24 px-4 sm:px-6 md:px-10">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/artikel"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Kembali ke Artikel
            </Link>
          </div>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 md:px-10 pb-8">
          <div className="max-w-4xl mx-auto">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4 ${categoryBadge[artikel.kategori] || "bg-zinc-200 text-zinc-800"
                }`}
            >
              <Tag className="w-3 h-3" />
              {artikel.kategori}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl break-words">
              {artikel.judul}
            </h1>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 py-10 w-full overflow-hidden">
        {/* Meta Bar */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 mb-8 pb-6 border-b border-zinc-200">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#2d5e45]" />
            {artikel.tanggal_terbit || "-"}
          </span>

          <ShareButton title={artikel.judul} />
        </div>

        {/* Summary */}
        <p className="text-base sm:text-lg text-zinc-600 leading-relaxed mb-8 font-medium border-l-4 border-[#2d5e45] pl-5 italic break-words">
          {artikel.ringkasan}
        </p>

        {/* Article Body */}
        <div
          className="prose-artikel text-zinc-700 leading-relaxed space-y-4 break-words [overflow-wrap:anywhere] [&_img]:max-w-full [&_img]:h-auto [&_iframe]:max-w-full [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: artikel.konten }}
        />

        {/* Tags & Share */}
        <div className="mt-12 pt-8 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-4">

          <Link
            href="/artikel"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#2d5e45] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Semua Artikel
          </Link>
        </div>
      </div>
    </main>
  );
}