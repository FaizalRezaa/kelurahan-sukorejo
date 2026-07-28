import Image from "next/image";
import Link from "next/link";
import { ResourceItem } from "./types";

export function ResourceCard({
  title,
  description,
  image,
  href,
}: ResourceItem) {
  return (
    <Link
      href={href}
      className="group relative isolate flex h-20 sm:h-auto sm:aspect-[4/3] lg:aspect-[16/10] flex-col items-center justify-center overflow-hidden bg-[#2d5e45] p-3 sm:p-7 md:p-8 text-center transition-all duration-500"
    >
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="absolute inset-0 -z-20 object-cover opacity-60 transition-opacity duration-500 ease-out group-hover:opacity-100 group-active:opacity-100"
      />

      <div className="absolute inset-0 -z-10 bg-[#2d5e45] opacity-75 transition-opacity duration-500 ease-out group-hover:opacity-0 group-active:opacity-0" />
      <div className="absolute inset-0 -z-10 bg-black/40 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-active:opacity-100" />

      <div className="relative z-10 flex flex-col items-center justify-center transition-transform duration-500 ease-out">
        <h3 className="text-sm sm:text-xl md:text-2xl font-bold leading-tight text-white transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-active:-translate-y-0.5 drop-shadow-sm">
          {title}
        </h3>

        {description && (
          <p className="mt-1 max-w-xs text-[11px] sm:text-sm leading-snug text-white/90 max-h-0 opacity-0 overflow-hidden transition-all duration-500 ease-out group-hover:max-h-24 group-hover:opacity-100 group-active:max-h-24 group-active:opacity-100">
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}
