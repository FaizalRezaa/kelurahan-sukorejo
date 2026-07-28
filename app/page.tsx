import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

// Server Component (TIDAK ADA "use client" di sini)
export default async function BerandaPage() {
  // 1. Inisialisasi Supabase Server Client
  const supabase = await createClient();

  // 2. Query ke tabel berita mengikuti aturan PRD
  const { data: beritaTerbaru, error } = await supabase
    .from("berita")
    .select("id, slug, judul, kategori, ringkasan, tanggal_terbit")
    .eq("status", "terbit")
    .order("tanggal_terbit", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Gagal mengambil data berita:", error.message);
  }

  // 3. Render HTML langsung dari Server
  return (
    <main className="min-h-screen p-8 font-sans bg-gray-50 text-gray-900">
      <div className="max-w-4xl mx-auto">
        
        {/* Bagian Hero Sementara */}
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Website Resmi Kelurahan Sukorejo</h1>
          <p className="text-lg text-gray-600">
            Melayani warga dengan transparan, cepat, dan informatif.
          </p>
        </section>

        {/* Bagian Berita Terbaru */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-semibold">Kabar Terbaru</h2>
            <Link href="/berita" className="text-blue-600 hover:underline">
              Lihat Semua
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {beritaTerbaru && beritaTerbaru.length > 0 ? (
              beritaTerbaru.map((item) => (
                <div key={item.id} className="bg-white border rounded-lg p-5 shadow-sm">
                  <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded-full uppercase tracking-wider">
                    {item.kategori}
                  </span>
                  <h3 className="mt-3 text-lg font-bold leading-tight">
                    <Link href={`/berita/${item.slug}`} className="hover:text-blue-600">
                      {item.judul}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 mb-4">
                    {new Date(item.tanggal_terbit).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-gray-700 text-sm line-clamp-3">
                    {item.ringkasan}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic col-span-3">
                Belum ada berita yang diterbitkan.
              </p>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}