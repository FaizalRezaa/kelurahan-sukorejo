"use client";

import Link from "next/link";
import {
  BarChart3,
  ChevronRight,
  FileText,
  Image as ImageIcon,
  Layers,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  profilStatistikData,
  artikelData,
  galeriData,
  heroSlidesData,
  layananData,
} from "@/components/admin/mock-data";

const schemaModules = [
  {
    href: "/admin/statistik",
    table: "profil_statistik",
    title: "Profil Statistik",
    description: "Angka demografi dan indikator wilayah kelurahan.",
    count: profilStatistikData.length,
    countLabel: "indikator",
    icon: BarChart3,
  },
  {
    href: "/admin/hero-slides",
    table: "hero_slides",
    title: "Hero Slides",
    description: "Banner gambar utama di halaman beranda.",
    count: heroSlidesData.length,
    countLabel: "slide",
    extra: `${heroSlidesData.filter((s) => s.aktif).length} aktif`,
    icon: Layers,
  },
  {
    href: "/admin/artikel",
    table: "artikel",
    title: "Artikel & Berita",
    description: "Konten berita dan kegiatan kelurahan.",
    count: artikelData.length,
    countLabel: "artikel",
    extra: `${artikelData.filter((a) => a.status === "terbit").length} terbit`,
    icon: FileText,
  },
  {
    href: "/admin/layanan",
    table: "layanan",
    title: "Layanan Publik",
    description: "Informasi pelayanan administrasi kependudukan.",
    count: layananData.length,
    countLabel: "layanan",
    icon: Sparkles,
  },
  {
    href: "/admin/galeri",
    table: "galeri",
    title: "Galeri Foto",
    description: "Dokumentasi foto kegiatan dan acara desa.",
    count: galeriData.length,
    countLabel: "foto",
    icon: ImageIcon,
  },
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Dashboard CMS
        </h1>
        <p className="text-xs text-slate-500">
          Kelola data konten sesuai skema database kelurahan — pilih modul di
          bawah untuk mulai mengelola.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {schemaModules.map((module) => {
          const Icon = module.icon;

          return (
            <Link key={module.table} href={module.href} className="group">
              <Card className="h-full transition hover:border-slate-300 hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition group-hover:bg-slate-900 group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:text-slate-600" />
                  </div>
                  <div className="space-y-1 pt-2">
                    <CardTitle className="text-base font-semibold text-slate-900">
                      {module.title}
                    </CardTitle>
                    <CardDescription className="text-xs leading-relaxed">
                      {module.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-900">
                      {module.count}
                    </span>
                    <span className="text-xs text-slate-500">
                      {module.countLabel}
                    </span>
                    {module.extra ? (
                      <span className="ml-auto text-[11px] font-medium text-emerald-700">
                        {module.extra}
                      </span>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
