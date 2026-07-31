"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn, X } from "lucide-react";
import type { Galeri } from "@/lib/query/schema";

interface GaleriClientProps {
  photos: Galeri[];
}

export default function GaleriClient({ photos }: GaleriClientProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Galeri | null>(null);

  // Jika tidak ada foto
  if (photos.length === 0) {
    return (
      <div className="col-span-full text-center py-20 text-zinc-400">
        Tidak ada foto ditemukan di database.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {photos.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-xl bg-zinc-200 aspect-square cursor-pointer"
            onClick={() => setSelectedPhoto(item)}
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
        ))}
      </div>

      {/* Image Preview Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="absolute inset-0"
            onClick={() => setSelectedPhoto(null)}
          />
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white transition-colors bg-black/50 hover:bg-black/70 rounded-full"
            aria-label="Tutup preview"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative z-10 w-full max-w-5xl aspect-video max-h-[85vh] rounded-lg overflow-hidden flex flex-col items-center justify-center pointer-events-none">
            <div className="relative w-full h-full pointer-events-auto">
              <Image
                src={selectedPhoto.image_path}
                alt={selectedPhoto.alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
            {selectedPhoto.alt && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-auto">
                <p className="text-white text-center text-sm md:text-base font-medium">
                  {selectedPhoto.alt}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
