import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { fetchGaleri } from "@/lib/query/fetcher";

export const revalidate = 0; // Agar selalu mengambil data terbaru dari database

export default async function GaleriPage() {
  // Ambil data langsung dari tabel database "galeri" di Supabase
  const photos = await fetchGaleri();

  return (
    <main className="min-h-screen bg-[#f4f1ea]">
      {/* GALLERY GRID */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-12">
        {/* Count */}
        <p className="text-sm text-zinc-500 mb-8">
          Menampilkan{" "}
          <span className="font-semibold text-zinc-800">{photos.length}</span>{" "}
          foto
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.length === 0 ? (
            <div className="col-span-full text-center py-20 text-zinc-400">
              Tidak ada foto ditemukan di database.
            </div>
          ) : (
            photos.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-xl bg-zinc-200 aspect-square"
              >
                <Image
                  src={item.image_path}
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

                {/* Caption / Alt */}
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-xs text-white leading-snug line-clamp-2 font-medium">
                    {item.alt}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}