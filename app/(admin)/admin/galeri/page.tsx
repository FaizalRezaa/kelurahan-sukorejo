"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, Search, Check, Eye, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { ImageUploadField } from "@/components/admin/image-upload-field";

import { queryKeys } from "@/lib/query/keys";
import {
  fetchGaleri,
  insertGaleriWithImage,
  updateGaleriWithImage,
  deleteGaleriWithImage,
  type GaleriInsertFormPayload,
  type GaleriUpdateFormPayload,
} from "@/lib/query/fetcher";
import type { Galeri } from "@/lib/query/schema";

export default function GaleriPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Galeri | null>(null);
  const [previewItem, setPreviewItem] = useState<Galeri | null>(null);
  const [deletingItem, setDeletingItem] = useState<Galeri | null>(null);

  const [formImagePath, setFormImagePath] = useState("");
  const [formImageFile, setFormImageFile] = useState<File | null>(null);
  const [formAlt, setFormAlt] = useState("");
  const [formUrutan, setFormUrutan] = useState<number>(1);

  const { data: photos = [], isLoading, isError, error } = useQuery({
    queryKey: queryKeys.galeri.list(),
    queryFn: () => fetchGaleri(),
  });

  const insertMutation = useMutation({
    mutationFn: (payload: GaleriInsertFormPayload) => insertGaleriWithImage(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.galeri.all() });
      setIsDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: GaleriUpdateFormPayload) => updateGaleriWithImage(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.galeri.all() });
      setIsDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (galeri: Galeri) => deleteGaleriWithImage(galeri),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.galeri.all() });
      setIsDeleteDialogOpen(false);
      setDeletingItem(null);
    },
  });

  const filteredPhotos = photos.filter(
    (item) =>
      item.alt.toLowerCase().includes(search.toLowerCase()) ||
      item.image_path.toLowerCase().includes(search.toLowerCase())
  );
  const paginatedPhotos = filteredPhotos.slice((page - 1) * pageSize, page * pageSize);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormImagePath("");
    setFormImageFile(null);
    setFormAlt("");
    setFormUrutan(photos.length + 1);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: Galeri) => {
    setEditingItem(item);
    setFormImagePath(item.image_path);
    setFormImageFile(null);
    setFormAlt(item.alt);
    setFormUrutan(item.urutan);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAlt.trim()) return;
    if (editingItem) {
      updateMutation.mutate({
        id: editingItem.id,
        alt: formAlt,
        urutan: Number(formUrutan),
        imageFile: formImageFile ?? undefined,
        currentImagePath: editingItem.image_path,
      });
    } else {
      if (!formImageFile) return;
      insertMutation.mutate({ imageFile: formImageFile, alt: formAlt, urutan: Number(formUrutan) });
    }
  };

  const confirmDelete = () => {
    if (deletingItem) deleteMutation.mutate(deletingItem);
  };

  const isSaving = insertMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Kelola Galeri Foto</h1>
          <p className="text-xs text-slate-500">
            Dokumentasi foto kegiatan kelurahan (<code className="font-mono text-slate-700">galeri</code>).
          </p>
        </div>
        <Button onClick={handleOpenAdd} size="sm" className="gap-1.5 text-xs font-semibold">
          <Plus className="h-3.5 w-3.5" /> Upload Foto Baru
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
        <CardHeader className="px-6 pt-6 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900">Dokumentasi Foto Album</CardTitle>
            <CardDescription>Foto-foto acara dan kegiatan desa.</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari foto..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-8 text-xs h-8"
            />
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead className="w-16 font-semibold text-slate-700 text-center">Urutan</TableHead>
                <TableHead className="font-semibold text-slate-700">Foto</TableHead>
                <TableHead className="font-semibold text-slate-700">Alt / Keterangan Foto</TableHead>
                <TableHead className="font-semibold text-slate-700">Dibuat</TableHead>
                <TableHead className="text-right font-semibold text-slate-700 pr-6">Aksi (CRUD)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-sm text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Memuat data galeri...
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedPhotos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-xs text-slate-500">
                    Tidak ada foto ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPhotos.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/60 transition">
                    <TableCell className="text-center font-bold text-slate-700">#{item.urutan}</TableCell>
                    <TableCell>
                      <img src={item.image_path} alt={item.alt} className="h-12 w-16 rounded-md object-cover border border-slate-200" />
                    </TableCell>
                    <TableCell className="font-medium text-slate-900 text-xs max-w-[280px]">{item.alt}</TableCell>
                    <TableCell className="text-[11px] text-slate-400 font-mono">{item.created_at.split("T")[0]}</TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setPreviewItem(item); setIsPreviewOpen(true); }} title="Lihat Foto">
                          <Eye className="h-3.5 w-3.5 text-slate-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(item)} title="Edit Foto">
                          <Edit2 className="h-3.5 w-3.5 text-slate-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { setDeletingItem(item); setIsDeleteDialogOpen(true); }} title="Hapus Foto" className="hover:text-rose-600 hover:bg-rose-50">
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
          totalRows={filteredPhotos.length}
          selectedRowsCount={0}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          title={editingItem ? "Edit Detail Foto" : "Upload Foto Galeri Baru"}
          description="Formulir data foto dokumentasi galeri."
        >
          <form onSubmit={handleSave} className="space-y-3 pt-2">
            <ImageUploadField
              key={editingItem?.id ?? "new-galeri"}
              label="Upload Foto Galeri"
              bucket="galeri-images"
              value={formImagePath}
              onChange={(url, file) => { setFormImagePath(url); if (file) setFormImageFile(file); }}
              required={!editingItem}
              previewAlt={formAlt || "Foto galeri"}
              previewClassName="h-36"
            />
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Alt Text (Keterangan Foto)</label>
              <Input type="text" required placeholder="Contoh: Suasana bazar UMKM Sukorejo" value={formAlt} onChange={(e) => setFormAlt(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Urutan Tampil</label>
              <Input type="number" min={1} required value={formUrutan} onChange={(e) => setFormUrutan(Number(e.target.value))} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>Batal</Button>
              <Button type="submit" size="sm" className="gap-1.5" disabled={isSaving}>
                {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                {editingItem ? "Simpan Perubahan" : "Simpan Foto"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent title="Preview Foto" description={previewItem?.alt} className="max-w-2xl">
          {previewItem && (
            <div className="space-y-3 pt-2">
              <div className="h-64 w-full overflow-hidden rounded-md bg-black/90 flex items-center justify-center">
                <img src={previewItem.image_path} alt={previewItem.alt} className="h-full w-auto object-contain" />
              </div>
              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setIsPreviewOpen(false)}>Tutup</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent
          title="Hapus Foto"
          description={deletingItem ? `Apakah Anda yakin ingin menghapus foto "${deletingItem.alt}"? Tindakan ini tidak dapat dibatalkan.` : "Apakah Anda yakin ingin menghapus foto ini?"}
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
