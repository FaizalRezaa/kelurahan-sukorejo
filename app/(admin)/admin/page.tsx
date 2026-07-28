"use client";

import { useState } from "react";
import Link from "next/link";
import { TrendingUp, Plus, MoreVertical, Edit2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  profilStatistikData,
  artikelData,
  galeriData,
  heroSlidesData,
} from "@/components/admin/mock-data";

export default function AdminOverviewPage() {
  const [activeTab, setActiveTab] = useState<"3months" | "30days" | "7days">(
    "30days",
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const totalArticles = artikelData.length;
  const publishedArticles = artikelData.filter(
    (a) => a.status === "terbit",
  ).length;
  const activeSlides = heroSlidesData.filter((s) => s.aktif).length;

  const paginatedArticles = artikelData.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  return (
    <div className="space-y-6">
      {/* Top Header Summary */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Dashboard Utama
          </h1>
          <p className="text-xs text-slate-500">
            Ikhtisar data statistik, konten berita, layanan publik, dan
            pengunjung portal kelurahan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/artikel">
            <Button size="sm" className="gap-1.5 text-xs font-semibold">
              <Plus className="h-3.5 w-3.5" />
              Buat Artikel Baru
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stat KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Total Artikel
            </CardTitle>
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700">
              <TrendingUp className="h-3 w-3" /> +12.5%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {totalArticles}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {publishedArticles} artikel telah terbit dipublikasi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Estimasi Warga Terlayani
            </CardTitle>
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700">
              <TrendingUp className="h-3 w-3" /> +8.4%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">1,234</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Pengurusan dokumen online & offline bulan ini
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Foto Galeri & Hero
            </CardTitle>
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-700">
              {activeSlides} Slide Aktif
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {galeriData.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Dokumentasi foto kegiatan kelurahan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Indikator Statistik
            </CardTitle>
            <span className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-1.5 py-0.5 text-[11px] font-semibold text-sky-700">
              Perangkat Desa
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {profilStatistikData.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Angka profil demografi wilayah
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Data Table Section */}
      <Card className="p-0 overflow-hidden">
        <CardHeader className="px-6 pt-6 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900">
              Artikel & Berita Terbaru
            </CardTitle>
            <CardDescription>
              Daftar konten informasi publik beserta status terbit.
            </CardDescription>
          </div>
          <Link href="/admin/artikel">
            <Button variant="outline" size="sm" className="text-xs">
              Lihat Semua Artikel
            </Button>
          </Link>
        </CardHeader>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead className="font-semibold text-slate-700">
                  Judul Artikel
                </TableHead>
                <TableHead className="font-semibold text-slate-700">
                  Kategori
                </TableHead>
                <TableHead className="font-semibold text-slate-700">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-slate-700">
                  Tanggal Terbit
                </TableHead>
                <TableHead className="text-right font-semibold text-slate-700 pr-6">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedArticles.map((artikel) => (
                <TableRow
                  key={artikel.id}
                  className="hover:bg-slate-50/60 transition"
                >
                  <TableCell className="font-medium text-slate-900 max-w-[280px] truncate">
                    {artikel.judul}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        artikel.kategori === "Berita" ? "accent" : "success"
                      }
                    >
                      {artikel.kategori}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        artikel.status === "terbit" ? "success" : "warning"
                      }
                    >
                      {artikel.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {artikel.tanggal_terbit}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="h-4 w-4 text-slate-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Link
                            href="/admin/artikel"
                            className="flex items-center gap-2 w-full"
                          >
                            <Eye className="h-3.5 w-3.5" /> Detail Artikel
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link
                            href="/admin/artikel"
                            className="flex items-center gap-2 w-full"
                          >
                            <Edit2 className="h-3.5 w-3.5" /> Edit
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Data Table Pagination */}
        <TablePagination
          totalRows={artikelData.length}
          selectedRowsCount={0}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </Card>
    </div>
  );
}
