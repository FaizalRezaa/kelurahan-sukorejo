import Image from "next/image";
import Link from "next/link";
import { BannerItem } from "./types";

export function BannerCard({ title, buttonText, image, href }: BannerItem) {
  return (
    <div className="group relative isolate flex h-48 sm:h-72 md:h-96 flex-col items-center justify-center overflow-hidden p-6 text-center w-full">
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="absolute inset-0 -z-20 object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />

      <div className="absolute inset-0 -z-10 bg-black/50 transition-opacity duration-300 group-hover:bg-black/40" />

      <div className="relative z-10 flex flex-col items-center justify-center gap-4 sm:gap-6">
        <h2 className="text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-white drop-shadow-md max-w-md">
          {title}
        </h2>

        <Link
          href={href}
          className="rounded-full border-2 border-white/90 bg-white/10 px-5 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-black active:scale-95"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}
