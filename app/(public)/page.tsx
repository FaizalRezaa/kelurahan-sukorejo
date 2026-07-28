"use client";

import Link from "next/link";

import { Hero } from "../../components/home/hero";
import { ProfileSection } from "../../components/home/profile-section";
import { ResourceCard } from "../../components/home/resource-card";
import { BannerCard } from "../../components/home/banner-card";
import { NewsCard } from "../../components/home/news-card";
import { GalleryCard } from "../../components/home/gallery-card";

import {
  heroSlides,
  profileStatistics,
  resourceItems,
  bannerItems,
  newsItems,
  galleryItems,
} from "../../components/home/data";

export default function Page() {
  return (
    <>
      <main className="w-full min-h-screen bg-[#f4f1ea] font-sans space-y-20 md:space-y-28">
        <Hero heroSlides={heroSlides} />

        <ProfileSection profileStatistics={profileStatistics} />

        {/* SECTION 1: RESOURCE GRID */}
        <section
          id="layanan"
          className="px-3 sm:px-6 md:px-10 max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.75 overflow-hidden rounded-lg shadow-sm">
            {resourceItems.map((item) => (
              <ResourceCard key={item.title} {...item} />
            ))}
          </div>
        </section>

        {/* SECTION 2: BANNER CALL-TO-ACTION (FULL WIDTH) */}
        <section className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 w-full">
            {bannerItems.map((item, index) => (
              <BannerCard key={index} {...item} />
            ))}
          </div>
        </section>

        {/* SECTION 3: BERITA & KEGIATAN TERBARU */}
        <section className="w-full bg-[#f4f1ea] text-zinc-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10">
            <div className="text-center mb-10 sm:mb-14">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-2">
                Berita & Kegiatan Terbaru
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 font-medium max-w-xl mx-auto mb-4">
                Informasi terkini tentang kegiatan dan program pemerintah
                kelurahan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-6 lg:gap-8 mb-12">
              {newsItems.map((news) => (
                <NewsCard key={news.id} {...news} />
              ))}
            </div>

            <div className="flex justify-center">
              <Link
                href="/artikel"
                className="inline-flex items-center justify-center rounded-full border-2 border-[#2d5e45] bg-transparent px-8 py-3 text-base font-bold text-[#2d5e45] transition-all duration-300 hover:bg-[#2d5e45] hover:text-white active:scale-95 shadow-sm"
              >
                Lihat Semua Berita & Kegiatan
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 4: GALERI FOTO */}
        <section id="galeri" className="w-full bg-[#f4f1ea] pb-16 sm:pb-24">
          <div className="mx-auto max-w-7xl px-2 sm:px-3 md:px-4">
            <div className="mb-6 flex flex-col gap-3 px-1 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#2d5e45]">
                  Cerita Warga
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl md:text-5xl">
                  Galeri Foto
                </h2>
              </div>
              <p className="max-w-52 text-sm leading-relaxed text-zinc-600 sm:text-right">
                Merekam momen kebersamaan dan keindahan Sukorejo.
              </p>
            </div>

            <div className="grid auto-rows-auto grid-cols-2 gap-1.5 sm:gap-2 md:grid-cols-6 md:grid-flow-dense md:auto-rows-36 lg:auto-rows-44">
              {galleryItems.map((item) => (
                <GalleryCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
