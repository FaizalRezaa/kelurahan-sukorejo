import { fetchGaleri } from "@/lib/query/fetcher";
import GaleriClient from "./galeri-client";

export const revalidate = 0; // Agar selalu mengambil data terbaru dari database

export default async function GaleriPage() {
  // Ambil data langsung dari tabel database "galeri" di Supabase
  const photos = await fetchGaleri();

  return (
    <main className="min-h-screen bg-[#f4f1ea]">
      {/* GALLERY GRID */}
      <section className="pt-32 max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-12">
        {/* Count */}
        <p className="text-sm text-zinc-500 mb-8">
          Menampilkan{" "}
          <span className="font-semibold text-zinc-800">{photos.length}</span>{" "}
          foto
        </p>

        <GaleriClient photos={photos} />
      </section>
    </main>
  );
}
