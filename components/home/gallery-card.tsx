import Image from "next/image";
import Link from "next/link";
import { GalleryItem } from "./types";

type GalleryCardProps = {
  item: GalleryItem;
};

export function GalleryCard({ item }: GalleryCardProps) {
  const innerContent = (
    <>
      <Image
        src={item.image}
        alt={item.alt}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 17vw"
        className={`object-cover transition-transform duration-500 ease-out ${
          item.overlayText ? "" : "group-hover:scale-105"
        }`}
      />
      {item.overlayText ? (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center transition-colors duration-300 hover:bg-black/70">
          <span className="text-white font-bold text-base sm:text-lg text-center px-2">{item.overlayText}</span>
        </div>
      ) : (
        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
    </>
  );

  if (item.overlayHref) {
    return (
      <Link
        href={item.overlayHref}
        className={`group relative overflow-hidden rounded-[0.55rem] bg-zinc-200 block ${item.className}`}
      >
        {innerContent}
      </Link>
    );
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-[0.55rem] bg-zinc-200 ${item.className}`}
    >
      {innerContent}
    </div>
  );
}
