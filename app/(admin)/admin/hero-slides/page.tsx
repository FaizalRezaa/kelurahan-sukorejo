"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { heroSlidesData, HeroSlideRecord } from "@/components/admin/mock-data";

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlideRecord[]>(heroSlidesData);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [editingSlide, setEditingSlide] = useState<HeroSlideRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form Fields
  const [formImagePath, setFormImagePath] = useState("");
  const [formAlt, setFormAlt] = useState("");
  const [formUrutan, setFormUrutan] = useState<number>(1);
  const [formAktif, setFormAktif] = useState<boolean>(true);

  const sortedSlides = [...slides].sort((a, b) => a.urutan - b.urutan);
  const paginatedSlides = sortedSlides.slice((page - 1) * pageSize, page * pageSize);

  const handleOpenAdd = () => {
    setEditingSlide(null);
    setFormImagePath("");
    setFormAlt("");
    setFormUrutan(slides.length + 1);
    setFormAktif(true);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (slide: HeroSlideRecord) => {
    setEditingSlide(slide);
    setFormImagePath(slide.image_path);
    setFormAlt(slide.alt);
    setFormUrutan(slide.urutan);
    setFormAktif(slide.aktif);
    setIsDialogOpen(true);
  };

  const handleToggleAktif = (id: string, currentStatus: boolean) => {
    setSlides((prev) =>
      prev.map((slide) => (slide.id === id ? { ...slide, aktif: !currentStatus } : slide))
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formImagePath.trim() || !formAlt.trim()) return;

    if (editingSlide) {
      setSlides((prev) =>
        prev.map((item) =>
          item.id === editingSlide.id
            ? {
                ...item,
                image_path: formImagePath,
                alt: formAlt,
                urutan: Number(formUrutan),
                aktif: formAktif,
              }
            : item
        )
      );
    } else {
      const newSlide: HeroSlideRecord = {
        id: `slide-${Date.now()}`,
        image_path: formImagePath,
        alt: formAlt,
        urutan: Number(formUrutan),
        aktif: formAktif,
      };
      setSlides((prev) => [...prev, newSlide]);
    }

    setIsDialogOpen(false);
  };

  const handleOpenDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setSlides((prev) => prev.filter((item) => item.id !== deletingId));
    }
    setIsDeleteDialogOpen(false);
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Kelola Hero Banner Slides
          </h1>
          <p className="text-xs text-slate-500">
            Slide gambar utama yang tampil di beranda kelurahan (<code className="font-mono text-slate-700">hero_slides</code>).
          </p>
        </div>
        <Button onClick={handleOpenAdd} size="sm" className="gap-1.5 text-xs font-semibold">
          <Plus className="h-3.5 w-3.5" />
          Tambah Slide Baru
        </Button>
      </div>

      {/* Main Table Card */}
      <Card className="p-0 overflow-hidden">
        <CardHeader className="px-6 pt-6 pb-4">
          <CardTitle className="text-base font-semibold text-slate-900">
            Daftar Slide Banner
          </CardTitle>
          <CardDescription>
            Atur urutan dan aktifkan slide banner yang ingin ditampilkan.
          </CardDescription>
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
              {paginatedSlides.map((slide) => (
                <TableRow key={slide.id} className="hover:bg-slate-50/60 transition">
                  <TableCell className="text-center font-bold text-slate-700">
                    #{slide.urutan}
                  </TableCell>
                  <TableCell>
                    <img
                      src={slide.image_path}
                      alt={slide.alt}
                      className="h-12 w-24 rounded-md object-cover border border-slate-200"
                    />
                  </TableCell>
                  <TableCell className="font-medium text-slate-900 text-xs max-w-[280px]">
                    {slide.alt}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={slide.aktif}
                        onCheckedChange={() => handleToggleAktif(slide.id, slide.aktif)}
                      />
                      <Badge variant={slide.aktif ? "success" : "secondary"}>
                        {slide.aktif ? "Aktif" : "Non-Aktif"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(slide)}
                        title="Edit Slide"
                      >
                        <Edit2 className="h-3.5 w-3.5 text-slate-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDelete(slide.id)}
                        title="Hapus Slide"
                        className="hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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

      {/* Form Dialog */}
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
              required
              previewAlt={formAlt || "Banner hero"}
              previewClassName="h-32"
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alt Text (Deskripsi Foto / Judul Banner)
              </label>
              <Input
                type="text"
                required
                placeholder="Contoh: Selamat Datang di Portal Resmi Kelurahan Sukorejo"
                value={formAlt}
                onChange={(e) => setFormAlt(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Urutan Tampil
                </label>
                <Input
                  type="number"
                  min={1}
                  required
                  value={formUrutan}
                  onChange={(e) => setFormUrutan(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status Slide
                </label>
                <div className="flex items-center gap-2 pt-1.5">
                  <Switch checked={formAktif} onCheckedChange={setFormAktif} />
                  <span className="text-xs text-slate-600 font-medium">
                    {formAktif ? "Aktif" : "Non-Aktif"}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" size="sm" className="gap-1.5">
                <Check className="h-3.5 w-3.5" />
                {editingSlide ? "Simpan Perubahan" : "Tambah Slide"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent
          title="Hapus Hero Slide"
          description="Apakah Anda yakin ingin menghapus slide ini?"
        >
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" size="sm" onClick={confirmDelete}>
              Ya, Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
