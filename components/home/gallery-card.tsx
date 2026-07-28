import Image from "next/image";
import { GalleryItem } from "./types";

type GalleryCardProps = {
  item: GalleryItem;
};

export function GalleryCard({ item }: GalleryCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[0.55rem] bg-zinc-200 ${item.className}`}
    >
      <Image
        src={item.image}
        alt={item.alt}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 17vw"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}
