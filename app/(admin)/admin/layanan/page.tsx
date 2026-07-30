"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit2, Search, Check, ExternalLink, Layout, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { ImageUploadField } from "@/components/admin/image-upload-field";

import { queryKeys } from "@/lib/query/keys";
import {
  fetchLayananPublik,
  updateLayananPublik,
  fetchBannerItems,
  updateBannerItem,
} from "@/lib/query/fetcher";
import type { LayananPublik, LayananPublikUpdate, BannerItem, BannerItemUpdate } from "@/lib/query/schema";

// ─────────────────────────────────────────────────────────────────────────────
// Section A — 6 Kotak Layanan Publik
// ─────────────────────────────────────────────────────────────────────────────

function LayananPublikSection() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LayananPublik | null>(null);

  const [formJudul, setFormJudul] = useState("");
  const [formDeskripsi, setFormDeskripsi] = useState("");
  const [formImagePath, setFormImagePath] = useState("");
  const [formHref, setFormHref] = useState("");

  const { data: items = [], isLoading, isError, error } = useQuery({
    queryKey: queryKeys.layananPublik.list(),
    queryFn: () => fetchLayananPublik(),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: LayananPublikUpdate) => updateLayananPublik(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.layananPublik.all() });
      setIsDialogOpen(false);
    },
  });

  const filtered = items
    .filter(
      (item) =>
        item.judul.toLowerCase().includes(search.toLowerCase()) ||
        item.deskripsi.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.urutan - b.urutan);

  const handleOpenEdit = (item: LayananPublik) => {
    setEditingItem(item);
    setFormJudul(item.judul);
    setFormDeskripsi(item.deskripsi);
    setFormImagePath(item.image_path ?? "");
    setFormHref(item.href);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !formJudul.trim()) return;
    updateMutation.mutate({
      id: editingItem.id,
      judul: formJudul,
      deskripsi: formDeskripsi,
      image_path: formImagePath || null,
      href: formHref,
    });
  };

  return (
    <>
      <Card className="p-0 overflow-hidden">
        <CardHeader className="px-6 pt-6 pb-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Layout className="h-4 w-4 text-slate-500" />
              <CardTitle className="text-base font-semibold text-slate-900">6 Kotak Layanan Beranda</CardTitle>
            </div>
            <CardDescription>
              Grid 6 kotak hijau di halaman publik beranda (
              <code className="font-mono text-[11px]">layanan_publik</code>). Setiap kotak
              memiliki judul, deskripsi, gambar latar, dan link tujuan.
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input type="text" placeholder="Cari layanan..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 text-xs h-8" />
          </div>
        </CardHeader>

        {isError && (
          <div className="mx-6 mb-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Gagal memuat data: {error instanceof Error ? error.message : "Terjadi kesalahan."}</span>
          </div>
        )}
        {updateMutation.isError && (
          <div className="mx-6 mb-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Gagal menyimpan: {updateMutation.error instanceof Error ? updateMutation.error.message : "Terjadi kesalahan."}</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead className="w-12 font-semibold text-slate-700 text-center">#</TableHead>
                <TableHead className="font-semibold text-slate-700">Layanan</TableHead>
                <TableHead className="font-semibold text-slate-700">Deskripsi</TableHead>
                <TableHead className="font-semibold text-slate-700">Link (href)</TableHead>
                <TableHead className="text-right font-semibold text-slate-700 pr-6">Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-xs text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Memuat data layanan...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-xs text-slate-500">Tidak ada layanan ditemukan.</TableCell>
                </TableRow>
              ) : (
                filtered.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/60 transition">
                    <TableCell className="text-center font-bold text-slate-500 text-xs">{item.urutan}</TableCell>
                    <TableCell className="max-w-[220px]">
                      <div className="flex items-center gap-3">
                        {item.image_path && (
                          <img src={item.image_path} alt={item.judul} className="h-10 w-10 rounded-md object-cover border border-slate-200 shrink-0" />
                        )}
                        <p className="font-medium text-slate-900 text-xs truncate">{item.judul}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <p className="text-xs text-slate-600 line-clamp-2">{item.deskripsi}</p>
                    </TableCell>
                    <TableCell>
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-600 font-mono hover:underline">
                        {item.href} <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(item)} title="Edit Layanan">
                        <Edit2 className="h-3.5 w-3.5 text-slate-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50">
          <p className="text-[11px] text-slate-400">6 baris tetap · Tidak dapat ditambah atau dihapus · Hanya bisa diedit</p>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          title="Edit Kotak Layanan Beranda"
          description={`Memperbarui kotak #${editingItem?.urutan}: "${editingItem?.judul}"`}
        >
          <form onSubmit={handleSave} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Layanan</label>
              <Input type="text" required placeholder="Contoh: Layanan Surat & Administrasi" value={formJudul} onChange={(e) => setFormJudul(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Link Tujuan (href)</label>
              <Input type="text" required placeholder="Contoh: /layanan atau https://..." value={formHref} onChange={(e) => setFormHref(e.target.value)} />
              <p className="mt-1 text-[11px] text-slate-400">Path relatif (contoh: /layanan) atau URL absolut.</p>
            </div>
            <ImageUploadField
              key={editingItem?.id ?? "new-lpub"}
              label="Gambar Latar Kotak"
              bucket="layanan-images"
              value={formImagePath}
              onChange={(url) => setFormImagePath(url)}
              previewAlt={formJudul || "Gambar layanan"}
            />
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Layanan</label>
              <Textarea rows={3} required placeholder="Deskripsi singkat yang tampil saat hover..." value={formDeskripsi} onChange={(e) => setFormDeskripsi(e.target.value)} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsDialogOpen(false)} disabled={updateMutation.isPending}>Batal</Button>
              <Button type="submit" size="sm" className="gap-1.5" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section B — 2 Banner CTA
// ─────────────────────────────────────────────────────────────────────────────

function BannerSection() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BannerItem | null>(null);

  const [formJudul, setFormJudul] = useState("");
  const [formButtonText, setFormButtonText] = useState("");
  const [formImagePath, setFormImagePath] = useState("");
  const [formHref, setFormHref] = useState("");

  const { data: items = [], isLoading, isError, error } = useQuery({
    queryKey: queryKeys.bannerItems.list(),
    queryFn: () => fetchBannerItems(),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: BannerItemUpdate) => updateBannerItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bannerItems.all() });
      setIsDialogOpen(false);
    },
  });

  const handleOpenEdit = (item: BannerItem) => {
    setEditingItem(item);
    setFormJudul(item.judul);
    setFormButtonText(item.button_text);
    setFormImagePath(item.image_path ?? "");
    setFormHref(item.href);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !formJudul.trim()) return;
    updateMutation.mutate({
      id: editingItem.id,
      judul: formJudul,
      button_text: formButtonText,
      image_path: formImagePath || null,
      href: formHref,
    });
  };

  const sortedItems = [...items].sort((a, b) => a.urutan - b.urutan);

  return (
    <>
      <Card className="p-0 overflow-hidden">
        <CardHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <Layout className="h-4 w-4 text-slate-500" />
            <CardTitle className="text-base font-semibold text-slate-900">2 Banner Call-to-Action Beranda</CardTitle>
          </div>
          <CardDescription>
            Dua banner gambar penuh di bawah grid layanan (
            <code className="font-mono text-[11px]">banner_items</code>). Masing-masing berisi
            judul, teks tombol, gambar latar, dan link tujuan.
          </CardDescription>
        </CardHeader>

        {isError && (
          <div className="mx-6 mb-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Gagal memuat data: {error instanceof Error ? error.message : "Terjadi kesalahan."}</span>
          </div>
        )}
        {updateMutation.isError && (
          <div className="mx-6 mb-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Gagal menyimpan: {updateMutation.error instanceof Error ? updateMutation.error.message : "Terjadi kesalahan."}</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead className="w-12 font-semibold text-slate-700 text-center">#</TableHead>
                <TableHead className="font-semibold text-slate-700">Banner</TableHead>
                <TableHead className="font-semibold text-slate-700">Teks Tombol</TableHead>
                <TableHead className="font-semibold text-slate-700">Link (href)</TableHead>
                <TableHead className="text-right font-semibold text-slate-700 pr-6">Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-xs text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Memuat data banner...
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sortedItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/60 transition">
                    <TableCell className="text-center font-bold text-slate-500 text-xs">{item.urutan}</TableCell>
                    <TableCell className="max-w-[220px]">
                      <div className="flex items-center gap-3">
                        {item.image_path && (
                          <img src={item.image_path} alt={item.judul} className="h-10 w-16 rounded-md object-cover border border-slate-200 shrink-0" />
                        )}
                        <p className="font-medium text-slate-900 text-xs">{item.judul}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                        {item.button_text}
                      </span>
                    </TableCell>
                    <TableCell>
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-600 font-mono hover:underline">
                        {item.href} <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(item)} title="Edit Banner">
                        <Edit2 className="h-3.5 w-3.5 text-slate-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50">
          <p className="text-[11px] text-slate-400">2 baris tetap · Tidak dapat ditambah atau dihapus · Hanya bisa diedit</p>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          title="Edit Banner CTA"
          description={`Memperbarui banner #${editingItem?.urutan}: "${editingItem?.judul}"`}
        >
          <form onSubmit={handleSave} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Banner</label>
              <Input type="text" required placeholder="Contoh: Cari Produk Hukum?" value={formJudul} onChange={(e) => setFormJudul(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Teks Tombol</label>
              <Input type="text" required placeholder="Contoh: Lihat Produk Hukum" value={formButtonText} onChange={(e) => setFormButtonText(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Link Tujuan (href)</label>
              <Input type="text" required placeholder="Contoh: /produk-hukum atau https://..." value={formHref} onChange={(e) => setFormHref(e.target.value)} />
            </div>
            <ImageUploadField
              key={editingItem?.id ?? "new-banner"}
              label="Gambar Latar Banner"
              bucket="layanan-images"
              value={formImagePath}
              onChange={(url) => setFormImagePath(url)}
              previewAlt={formJudul || "Gambar banner"}
              previewClassName="h-36"
            />
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsDialogOpen(false)} disabled={updateMutation.isPending}>Batal</Button>
              <Button type="submit" size="sm" className="gap-1.5" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function LayananPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Kelola Layanan Publik Beranda</h1>
        <p className="text-xs text-slate-500 mt-1">
          Atur tampilan dua bagian interaktif di halaman beranda publik: grid 6 kotak layanan dan 2
          banner call-to-action.
        </p>
      </div>

      <div className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700 flex items-start gap-2">
        <span className="mt-0.5 shrink-0 font-bold">⚠</span>
        <span>
          Perubahan yang disimpan di sini akan langsung tercermin di halaman beranda publik. Pastikan
          gambar, teks, dan link sudah benar sebelum dipublikasikan.
        </span>
      </div>

      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[11px] font-bold text-white">A</span>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-600">Grid 6 Kotak Layanan</h2>
        </div>
        <LayananPublikSection />
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[11px] font-bold text-white">B</span>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-600">Banner Call-to-Action (2 Bagian)</h2>
        </div>
        <BannerSection />
      </section>
    </div>
  );
}
