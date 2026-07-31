import Image from "next/image";
import Link from "next/link";
import { NewsItem } from "./types";

export function NewsCard({
  title,
  date,
  category,
  summary,
  image,
  href,
}: NewsItem) {
  const isBerita = category === "Berita";
  const isPengumuman = category === "Pengumuman";

  return (
    <article className="flex flex-col justify-between group h-full bg-white rounded-xl overflow-hidden border border-zinc-200/80 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      <div>
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-zinc-100">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>

        <div className="p-5 sm:p-6 flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold tracking-wider text-zinc-500 uppercase">
              {date}
            </span>
            <span
              className={`inline-block px-3 py-0.5 text-[11px] font-semibold rounded-full ${
                isBerita
                  ? "bg-emerald-100 text-emerald-800"
                  : isPengumuman
                  ? "bg-purple-100 text-purple-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {category}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-sans font-bold leading-snug text-zinc-900 mb-3 group-hover:text-[#2d5e45] transition-colors line-clamp-2">
            {title}
          </h3>

          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed line-clamp-3 mb-6">
            {summary}
          </p>
        </div>
      </div>

      <div className="px-5 pb-6 sm:px-6">
        <Link
          href={href}
          className="inline-flex items-center justify-center rounded-full bg-[#2d5e45] px-5 py-2.5 text-xs sm:text-sm font-medium text-white transition-all duration-300 hover:bg-[#214633] hover:shadow-md active:scale-95"
        >
          Baca selengkapnya
        </Link>
      </div>
    </article>
  );
}
