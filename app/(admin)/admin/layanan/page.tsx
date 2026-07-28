"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Search, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { layananData, LayananRecord } from "@/components/admin/mock-data";

export default function LayananPage() {
  const [layananList, setLayananList] = useState<LayananRecord[]>(layananData);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [editingItem, setEditingItem] = useState<LayananRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [formJudul, setFormJudul] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDeskripsi, setFormDeskripsi] = useState("");
  const [formImagePath, setFormImagePath] = useState("");
  const [formUrl, setFormUrl] = useState("");

  const filteredLayanan = layananList.filter(
    (item) =>
      item.judul.toLowerCase().includes(search.toLowerCase()) ||
      item.slug.toLowerCase().includes(search.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedLayanan = filteredLayanan.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleJudulChange = (val: string) => {
    setFormJudul(val);
    if (!editingItem) {
      setFormSlug(slugify(val));
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormJudul("");
    setFormSlug("");
    setFormDeskripsi("");
    setFormImagePath("https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop");
    setFormUrl("");
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: LayananRecord) => {
    setEditingItem(item);
    setFormJudul(item.judul);
    setFormSlug(item.slug);
    setFormDeskripsi(item.deskripsi);
    setFormImagePath(item.image_path);
    setFormUrl(item.url);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJudul.trim()) return;

    const today = new Date().toISOString().split("T")[0];

    if (editingItem) {
      setLayananList((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                judul: formJudul,
                slug: formSlug || slugify(formJudul),
                deskripsi: formDeskripsi,
                image_path: formImagePath,
                url: formUrl,
              }
            : item
        )
      );
    } else {
      const newItem: LayananRecord = {
        id: `layanan-${Date.now()}`,
        slug: formSlug || slugify(formJudul),
        judul: formJudul,
        deskripsi: formDeskripsi,
        image_path: formImagePath,
        url: formUrl,
        created_at: today,
      };
      setLayananList((prev) => [newItem, ...prev]);
    }

    setIsDialogOpen(false);
  };

  const handleOpenDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setLayananList((prev) => prev.filter((item) => item.id !== deletingId));
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
            Kelola Layanan Publik
          </h1>
          <p className="text-xs text-slate-500">
            Informasi administrasi kependudukan & pelayanan desa (<code className="font-mono text-slate-700">layanan</code>).
          </p>
        </div>
        <Button onClick={handleOpenAdd} size="sm" className="gap-1.5 text-xs font-semibold">
          <Plus className="h-3.5 w-3.5" />
          Tambah Layanan Baru
        </Button>
      </div>

      {/* Main Table Card */}
      <Card className="p-0 overflow-hidden">
        <CardHeader className="px-6 pt-6 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900">
              Daftar Layanan Publik
            </CardTitle>
            <CardDescription>
              Syarat dan panduan layanan administrasi warga.
            </CardDescription>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari layanan..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-8 text-xs h-8"
            />
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead className="font-semibold text-slate-700">Layanan</TableHead>
                <TableHead className="font-semibold text-slate-700">Deskripsi</TableHead>
                <TableHead className="font-semibold text-slate-700">URL</TableHead>
                <TableHead className="font-semibold text-slate-700">Dibuat</TableHead>
                <TableHead className="text-right font-semibold text-slate-700 pr-6">Aksi (CRUD)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLayanan.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-xs text-slate-500">
                    Tidak ada layanan ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLayanan.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/60 transition">
                    <TableCell className="max-w-[280px]">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image_path}
                          alt={item.judul}
                          className="h-10 w-10 rounded-md object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 text-xs truncate">{item.judul}</p>
                          <p className="text-[11px] text-slate-400 font-mono truncate">{item.slug}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[360px]">
                      <p className="text-xs text-slate-600 line-clamp-2">{item.deskripsi}</p>
                    </TableCell>
                    <TableCell className="max-w-[220px]">
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600 hover:underline truncate block"
                        >
                          {item.url}
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-[11px] text-slate-400 font-mono">
                      {item.created_at}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(item)}
                          title="Edit Layanan"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-slate-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDelete(item.id)}
                          title="Hapus Layanan"
                          className="hover:text-rose-600 hover:bg-rose-50"
                        >
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
          totalRows={filteredLayanan.length}
          selectedRowsCount={0}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          title={editingItem ? "Edit Layanan" : "Tambah Layanan Baru"}
          description="Formulir data layanan kependudukan."
        >
          <form onSubmit={handleSave} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Judul Layanan
              </label>
              <Input
                type="text"
                required
                placeholder="Contoh: Pelayanan Pembuatan KTP"
                value={formJudul}
                onChange={(e) => handleJudulChange(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Slug (URL)
              </label>
              <Input
                type="text"
                required
                placeholder="layanan-ktp"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                URL Tautan
              </label>
              <Input
                type="url"
                placeholder="https://..."
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Image Path / Sampul Gambar
              </label>
              <Input
                type="text"
                required
                placeholder="https://..."
                value={formImagePath}
                onChange={(e) => setFormImagePath(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Deskripsi Layanan
              </label>
              <Textarea
                rows={3}
                required
                placeholder="Jelaskan prosedur dan syarat dokumen..."
                value={formDeskripsi}
                onChange={(e) => setFormDeskripsi(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" size="sm" className="gap-1.5">
                <Check className="h-3.5 w-3.5" />
                {editingItem ? "Simpan Perubahan" : "Tambah Layanan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent
          title="Hapus Layanan"
          description="Apakah Anda yakin ingin menghapus layanan ini?"
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
