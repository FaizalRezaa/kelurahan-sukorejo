"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, Check, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { ImageUploadField } from "@/components/admin/image-upload-field";

import { queryKeys } from "@/lib/query/keys";
import {
  fetchHeroSlides,
  insertHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
} from "@/lib/query/fetcher";
import type { HeroSlide, HeroSlideInsert, HeroSlideUpdate } from "@/lib/query/schema";

export default function HeroSlidesPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [deletingItem, setDeletingItem] = useState<HeroSlide | null>(null);

  const [formImagePath, setFormImagePath] = useState("");
  const [formImageFile, setFormImageFile] = useState<File | null>(null);
  const [formAlt, setFormAlt] = useState("");
  const [formUrutan, setFormUrutan] = useState<number>(1);
  const [formAktif, setFormAktif] = useState<boolean>(true);

  const { data: slides = [], isLoading, isError, error } = useQuery({
    queryKey: queryKeys.heroSlides.list(),
    queryFn: () => fetchHeroSlides(),
  });

  const insertMutation = useMutation({
    mutationFn: (payload: HeroSlideInsert) => insertHeroSlide(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.heroSlides.all() });
      setIsDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: HeroSlideUpdate) => updateHeroSlide(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.heroSlides.all() });
      setIsDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteHeroSlide(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.heroSlides.all() });
      setIsDeleteDialogOpen(false);
      setDeletingItem(null);
    },
  });

  const paginatedSlides = slides.slice((page - 1) * pageSize, page * pageSize);

  const handleOpenAdd = () => {
    setEditingSlide(null);
    setFormImagePath("");
    setFormImageFile(null);
    setFormAlt("");
    setFormUrutan(slides.length + 1);
    setFormAktif(true);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormImagePath(slide.image_path);
    setFormImageFile(null);
    setFormAlt(slide.alt);
    setFormUrutan(slide.urutan);
    setFormAktif(slide.aktif);
    setIsDialogOpen(true);
  };

  const handleToggleAktif = (slide: HeroSlide) => {
    updateMutation.mutate({ id: slide.id, aktif: !slide.aktif });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAlt.trim()) return;

    if (editingSlide) {
      const payload: HeroSlideUpdate = {
        id: editingSlide.id,
        alt: formAlt,
        urutan: Number(formUrutan),
        aktif: formAktif,
      };
      if (formImageFile) {
        // image_path harus berupa URL string, upload perlu dilakukan manual
        // atau tambahkan integrasi storage di sini jika diperlukan
        // Untuk sekarang hanya update metadata tanpa ganti gambar via file picker
      }
      if (formImagePath !== editingSlide.image_path) {
        (payload as HeroSlideUpdate).image_path = formImagePath;
      }
      updateMutation.mutate(payload);
    } else {
      if (!formImagePath.trim()) return;
      const payload: HeroSlideInsert = {
        image_path: formImagePath,
        alt: formAlt,
        urutan: Number(formUrutan),
        aktif: formAktif,
      };
      insertMutation.mutate(payload);
    }
  };

  const confirmDelete = () => {
    if (deletingItem) deleteMutation.mutate(deletingItem.id);
  };

  const isSaving = insertMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Kelola Hero Banner Slides</h1>
          <p className="text-xs text-slate-500">
            Slide gambar utama yang tampil di beranda kelurahan (<code className="font-mono text-slate-700">hero_slides</code>).
          </p>
        </div>
        <Button onClick={handleOpenAdd} size="sm" className="gap-1.5 text-xs font-semibold">
          <Plus className="h-3.5 w-3.5" /> Tambah Slide Baru
        </Button>
      </div>

      {isError && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Gagal memuat data: {error instanceof Error ? error.message : "Terjadi kesalahan."}</span>
        </div>
      )}
      {insertMutation.isError && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Gagal menyimpan: {insertMutation.error instanceof Error ? insertMutation.error.message : "Terjadi kesalahan."}</span>
        </div>
      )}
      {updateMutation.isError && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Gagal mengupdate: {updateMutation.error instanceof Error ? updateMutation.error.message : "Terjadi kesalahan."}</span>
        </div>
      )}
      {deleteMutation.isError && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Gagal menghapus: {deleteMutation.error instanceof Error ? deleteMutation.error.message : "Terjadi kesalahan."}</span>
        </div>
      )}

      <Card className="p-0 overflow-hidden">
        <CardHeader className="px-6 pt-6 pb-4">
          <CardTitle className="text-base font-semibold text-slate-900">Daftar Slide Banner</CardTitle>
          <CardDescription>Atur urutan dan aktifkan slide banner yang ingin ditampilkan.</CardDescription>
        </CardHeader>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead className="w-16 font-semibold text-slate-700 text-center">Urutan</TableHead>
                <TableHead className="font-semibold text-slate-700">Preview Gambar</TableHead>
                <TableHead className="font-semibold text-slate-700">Alt / Deskripsi Slide</TableHead>
                <TableHead className="font-semibold text-slate-700">Status Aktif</TableHead>
                <TableHead className="text-right font-semibold text-slate-700 pr-6">Aksi (CRUD)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-sm text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Memuat data slides...
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedSlides.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-xs text-slate-500">
                    Belum ada slide. Klik "Tambah Slide Baru" untuk memulai.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedSlides.map((slide) => (
                  <TableRow key={slide.id} className="hover:bg-slate-50/60 transition">
                    <TableCell className="text-center font-bold text-slate-700">#{slide.urutan}</TableCell>
                    <TableCell>
                      <img src={slide.image_path} alt={slide.alt} className="h-12 w-24 rounded-md object-cover border border-slate-200" />
                    </TableCell>
                    <TableCell className="font-medium text-slate-900 text-xs max-w-[280px]">{slide.alt}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={slide.aktif}
                          onCheckedChange={() => handleToggleAktif(slide)}
                          disabled={updateMutation.isPending}
                        />
                        <Badge variant={slide.aktif ? "success" : "secondary"}>
                          {slide.aktif ? "Aktif" : "Non-Aktif"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(slide)} title="Edit Slide">
                          <Edit2 className="h-3.5 w-3.5 text-slate-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { setDeletingItem(slide); setIsDeleteDialogOpen(true); }} title="Hapus Slide" className="hover:text-rose-600 hover:bg-rose-50">
                          <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <TablePagination
          totalRows={slides.length}
          selectedRowsCount={0}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          title={editingSlide ? "Edit Hero Slide" : "Tambah Hero Slide Baru"}
          description="Atur gambar banner hero untuk diperbarui di database hero_slides."
        >
          <form onSubmit={handleSave} className="space-y-3 pt-2">
            <ImageUploadField
              key={editingSlide?.id ?? "new-hero-slide"}
              label="Gambar Banner Hero"
              bucket="hero-images"
              value={formImagePath}
              onChange={setFormImagePath}
              required={!editingSlide}
              previewAlt={formAlt || "Banner hero"}
              previewClassName="h-32"
            />
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alt Text (Deskripsi Foto / Judul Banner)
              </label>
              <Input type="text" required placeholder="Contoh: Selamat Datang di Portal Resmi Kelurahan Sukorejo" value={formAlt} onChange={(e) => setFormAlt(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Urutan Tampil</label>
                <Input type="number" min={1} required value={formUrutan} onChange={(e) => setFormUrutan(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status Slide</label>
                <div className="flex items-center gap-2 pt-1.5">
                  <Switch checked={formAktif} onCheckedChange={setFormAktif} />
                  <span className="text-xs text-slate-600 font-medium">{formAktif ? "Aktif" : "Non-Aktif"}</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>Batal</Button>
              <Button type="submit" size="sm" className="gap-1.5" disabled={isSaving}>
                {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                {editingSlide ? "Simpan Perubahan" : "Tambah Slide"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent
          title="Hapus Hero Slide"
          description={deletingItem ? `Apakah Anda yakin ingin menghapus slide "${deletingItem.alt}"? Tindakan ini tidak dapat dibatalkan.` : "Apakah Anda yakin ingin menghapus slide ini?"}
        >
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>Batal</Button>
            <Button variant="destructive" size="sm" onClick={confirmDelete} disabled={isDeleting} className="gap-1.5">
              {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Ya, Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
