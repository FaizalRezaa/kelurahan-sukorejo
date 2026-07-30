"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  Eye,
  MoreVertical,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { QuillEditor } from "@/components/admin/quill-editor";

import { queryKeys } from "@/lib/query/keys";
import {
  fetchArtikelList,
  insertArtikelWithImage,
  updateArtikelWithImage,
  deleteArtikelWithImage,
  type ArtikelInsertFormPayload,
  type ArtikelUpdateFormPayload,
} from "@/lib/query/fetcher";
import type { Artikel, ArtikelKategori } from "@/lib/query/schema";

// ---------------------------------------------------------------------------
// Types & Helpers
// ---------------------------------------------------------------------------

type Kategori = ArtikelKategori;

function getKategoriBadgeVariant(kategori: Kategori) {
  if (kategori === "Berita") return "accent" as const;
  if (kategori === "Kegiatan") return "success" as const;
  return "purple" as const;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  return dateStr;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ArtikelPage() {
  const queryClient = useQueryClient();

  // ── UI State ──────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [editingItem, setEditingItem] = useState<Artikel | null>(null);
  const [previewItem, setPreviewItem] = useState<Artikel | null>(null);
  const [deletingItem, setDeletingItem] = useState<Artikel | null>(null);

  // ── Form State ────────────────────────────────────────────────────────────
  const [formJudul, setFormJudul] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formKategori, setFormKategori] = useState<Kategori>("Berita");
  const [formRingkasan, setFormRingkasan] = useState("");
  const [formKonten, setFormKonten] = useState("");
  const [formImagePath, setFormImagePath] = useState("");
  const [formStatus, setFormStatus] = useState<"draft" | "terbit">("terbit");
  const [formTanggalTerbit, setFormTanggalTerbit] = useState("");

  // ── Query: Fetch daftar artikel ───────────────────────────────────────────
  const {
    data: artikels = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.artikel.list(),
    queryFn: () => fetchArtikelList(),
  });

  // ── Mutation: Insert ──────────────────────────────────────────────────────
  const insertMutation = useMutation({
    mutationFn: (payload: ArtikelInsertFormPayload) =>
      insertArtikelWithImage(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.artikel.all() });
      setIsDialogOpen(false);
    },
  });

  // ── Mutation: Update ──────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: (payload: ArtikelUpdateFormPayload) =>
      updateArtikelWithImage(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.artikel.all() });
      setIsDialogOpen(false);
    },
  });

  // ── Mutation: Delete ──────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (artikel: Artikel) => deleteArtikelWithImage(artikel),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.artikel.all() });
      setIsDeleteDialogOpen(false);
      setDeletingItem(null);
    },
  });

  // ── Derived / Filtered Data ───────────────────────────────────────────────
  const filteredArtikels = artikels.filter((item) => {
    const matchSearch =
      item.judul.toLowerCase().includes(search.toLowerCase()) ||
      item.slug.toLowerCase().includes(search.toLowerCase()) ||
      item.ringkasan.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      categoryFilter === "ALL" || item.kategori === categoryFilter;
    const matchStatus =
      statusFilter === "ALL" || item.status === statusFilter;

    return matchSearch && matchCategory && matchStatus;
  });

  const paginatedArtikels = filteredArtikels.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleJudulChange = (val: string) => {
    setFormJudul(val);
    if (!editingItem) {
      setFormSlug(slugify(val));
    }
  };

  const handleOpenAdd = () => {
    const today = new Date().toISOString().split("T")[0];
    setEditingItem(null);
    setFormJudul("");
    setFormSlug("");
    setFormKategori("Berita");
    setFormRingkasan("");
    setFormKonten("");
    setFormImagePath("");
    setFormStatus("terbit");
    setFormTanggalTerbit(today);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: Artikel) => {
    setEditingItem(item);
    setFormJudul(item.judul);
    setFormSlug(item.slug);
    setFormKategori(item.kategori as Kategori);
    setFormRingkasan(item.ringkasan);
    setFormKonten(item.konten ?? "");
    setFormImagePath(item.image_path ?? "");
    setFormStatus(item.status);
    setFormTanggalTerbit(
      item.tanggal_terbit
        ? item.tanggal_terbit
        : new Date().toISOString().split("T")[0]
    );
    setIsDialogOpen(true);
  };

  const handleOpenPreview = (item: Artikel) => {
    setPreviewItem(item);
    setIsPreviewOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJudul.trim()) return;

    const tanggal_terbit =
      formStatus === "terbit" ? formTanggalTerbit || null : null;

    if (editingItem) {
      const payload: ArtikelUpdateFormPayload = {
        id: editingItem.id,
        judul: formJudul,
        slug: formSlug || slugify(formJudul),
        kategori: formKategori,
        ringkasan: formRingkasan,
        konten: formKonten,
        status: formStatus,
        tanggal_terbit,
        currentImagePath: editingItem.image_path,
      };
      updateMutation.mutate(payload);
    } else {
      const payload: ArtikelInsertFormPayload = {
        judul: formJudul,
        slug: formSlug || slugify(formJudul),
        kategori: formKategori,
        ringkasan: formRingkasan,
        konten: formKonten,
        status: formStatus,
        tanggal_terbit,
      };
      insertMutation.mutate(payload);
    }
  };

  const handleOpenDelete = (item: Artikel) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingItem) {
      deleteMutation.mutate(deletingItem);
    }
  };

  const isSaving = insertMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Kelola Artikel &amp; Berita
          </h1>
          <p className="text-sm text-slate-500">
            Publikasi berita, kegiatan &amp; pengumuman kelurahan (
            <code className="font-mono text-slate-700">artikel</code>).
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          size="sm"
          className="gap-2 text-sm font-semibold px-4 py-2"
        >
          <Plus className="h-4 w-4" />
          Buat Artikel Baru
        </Button>
      </div>

      {/* Error Banner: Fetch */}
      {isError && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            Gagal memuat data:{" "}
            {error instanceof Error ? error.message : "Terjadi kesalahan."}
          </span>
        </div>
      )}

      {/* Error Banner: Insert */}
      {insertMutation.isError && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            Gagal menyimpan:{" "}
            {insertMutation.error instanceof Error
              ? insertMutation.error.message
              : "Terjadi kesalahan."}
          </span>
        </div>
      )}

      {/* Error Banner: Update */}
      {updateMutation.isError && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            Gagal mengupdate:{" "}
            {updateMutation.error instanceof Error
              ? updateMutation.error.message
              : "Terjadi kesalahan."}
          </span>
        </div>
      )}

      {/* Error Banner: Delete */}
      {deleteMutation.isError && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            Gagal menghapus:{" "}
            {deleteMutation.error instanceof Error
              ? deleteMutation.error.message
              : "Terjadi kesalahan."}
          </span>
        </div>
      )}

      {/* Main Table Card */}
      <Card className="p-0 overflow-hidden">
        <CardHeader className="px-6 pt-6 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900">
              Daftar Artikel &amp; Berita
            </CardTitle>
            <CardDescription>
              Menampilkan seluruh artikel terbit dan draf tulisan.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="w-44 text-sm h-10"
            >
              <option value="ALL">Kategori: Semua</option>
              <option value="Berita">Berita</option>
              <option value="Kegiatan">Kegiatan</option>
              <option value="Pengumuman">Pengumuman</option>
            </Select>

            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-40 text-sm h-10"
            >
              <option value="ALL">Status: Semua</option>
              <option value="terbit">Terbit</option>
              <option value="draft">Draft</option>
            </Select>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Cari judul..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-11 text-sm h-11"
              />
            </div>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead className="font-semibold text-slate-700 text-sm">
                  Judul Artikel
                </TableHead>
                <TableHead className="font-semibold text-slate-700 text-sm">
                  Kategori
                </TableHead>
                <TableHead className="font-semibold text-slate-700 text-sm">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-slate-700 text-sm">
                  Tanggal Terbit
                </TableHead>
                <TableHead className="font-semibold text-slate-700 text-sm">
                  Dibuat
                </TableHead>
                <TableHead className="text-right font-semibold text-slate-700 text-sm pr-6">
                  Aksi (CRUD)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-sm text-slate-500"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Memuat data artikel...
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedArtikels.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-sm text-slate-500"
                  >
                    Tidak ada artikel ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedArtikels.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-slate-50/60 transition"
                  >
                    <TableCell className="max-w-[300px]">
                      <div className="flex items-center gap-3">
                        {item.image_path ? (
                          <img
                            src={item.image_path}
                            alt={item.judul}
                            className="h-12 w-12 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center text-slate-400 text-xs">
                            N/A
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 text-sm truncate">
                            {item.judul}
                          </p>
                          <p className="text-sm text-slate-500 font-mono truncate">
                            {item.slug}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getKategoriBadgeVariant(item.kategori as Kategori)}
                      >
                        {item.kategori}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={item.status === "terbit" ? "success" : "warning"}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-700 font-medium">
                      {formatDate(item.tanggal_terbit)}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 font-mono">
                      {item.created_at.split("T")[0]}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical className="h-4 w-4 text-slate-500" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleOpenPreview(item)}>
                            <Eye className="h-3.5 w-3.5" /> Detail Artikel
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenEdit(item)}>
                            <Edit2 className="h-3.5 w-3.5" /> Edit Artikel
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleOpenDelete(item)}
                            className="text-rose-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <TablePagination
          totalRows={filteredArtikels.length}
          selectedRowsCount={0}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </Card>

      {/* ── Form Dialog ─────────────────────────────────────────────────── */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          title={editingItem ? "Edit Artikel" : "Buat Artikel Baru"}
          description="Formulir pengelolaan konten berita, kegiatan, dan pengumuman kelurahan."
          className="max-w-2xl"
        >
          <form
            onSubmit={handleSave}
            className="space-y-3 pt-2 max-h-[75vh] overflow-y-auto pr-1"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Judul Artikel
                </label>
                <Input
                  type="text"
                  required
                  placeholder="Judul artikel..."
                  value={formJudul}
                  onChange={(e) => handleJudulChange(e.target.value)}
                  className="text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Slug (URL)
                </label>
                <Input
                  type="text"
                  required
                  placeholder="slug-artikel"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Kategori
                </label>
                <Select
                  value={formKategori}
                  onChange={(e) => setFormKategori(e.target.value as Kategori)}
                  className="text-sm h-11"
                >
                  <option value="Berita">Berita</option>
                  <option value="Kegiatan">Kegiatan</option>
                  <option value="Pengumuman">Pengumuman</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Status Publikasi
                </label>
                <Select
                  value={formStatus}
                  onChange={(e) =>
                    setFormStatus(e.target.value as "draft" | "terbit")
                  }
                  className="text-sm h-11"
                >
                  <option value="terbit">Terbit</option>
                  <option value="draft">Draft</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Tanggal Terbit
                </label>
                <Input
                  type="date"
                  value={formTanggalTerbit}
                  onChange={(e) => setFormTanggalTerbit(e.target.value)}
                  className="text-sm h-11"
                />
              </div>
            </div>

            <ImageUploadField
              key={editingItem?.id ?? "new-artikel"}
              label="Sampul Foto Artikel"
              bucket="artikel-images"
              value={formImagePath}
              onChange={setFormImagePath}
              previewAlt={formJudul || "Sampul artikel"}
              previewClassName="h-48"
            />

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Ringkasan Artikel
              </label>
              <Textarea
                rows={2}
                required
                placeholder="Ringkasan singkat yang tampil di kartu berita..."
                value={formRingkasan}
                onChange={(e) => setFormRingkasan(e.target.value)}
                className="text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Isi Konten Lengkap
              </label>
              <QuillEditor
                value={formKonten}
                onChange={setFormKonten}
                placeholder="Tulis isi artikel lengkap di sini. Gunakan toolbar untuk format teks..."
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSaving}
              >
                Batal
              </Button>
              <Button
                type="submit"
                size="sm"
                className="gap-1.5"
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
                {editingItem ? "Simpan Perubahan" : "Publikasikan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Preview Dialog ──────────────────────────────────────────────── */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent
          title="Detail Artikel"
          description={`Slug: ${previewItem?.slug}`}
          className="max-w-xl"
        >
          {previewItem && (
            <div className="space-y-3 pt-2">
              <div className="relative h-44 w-full overflow-hidden rounded-md bg-slate-100">
                {previewItem.image_path ? (
                  <img
                    src={previewItem.image_path}
                    alt={previewItem.judul}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-400 text-sm">
                    Tidak ada gambar
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={getKategoriBadgeVariant(
                    previewItem.kategori as Kategori
                  )}
                >
                  {previewItem.kategori}
                </Badge>
                <Badge
                  variant={
                    previewItem.status === "terbit" ? "success" : "warning"
                  }
                >
                  {previewItem.status}
                </Badge>
                <span className="text-xs text-slate-500">
                  Terbit: {formatDate(previewItem.tanggal_terbit)}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                {previewItem.judul}
              </h2>
              <div className="bg-slate-50 p-3 rounded-md border border-slate-100 text-xs text-slate-700 leading-relaxed">
                {previewItem.ringkasan}
              </div>
              {previewItem.konten && (
                <div
                  className="text-xs text-slate-800 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewItem.konten }}
                />
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPreviewOpen(false)}
                >
                  Tutup
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation Dialog ──────────────────────────────────── */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent
          title="Hapus Artikel"
          description={
            deletingItem
              ? `Apakah Anda yakin ingin menghapus artikel "${deletingItem.judul}"? Tindakan ini tidak dapat dibatalkan.`
              : "Apakah Anda yakin ingin menghapus artikel ini?"
          }
        >
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="gap-1.5"
            >
              {isDeleting && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              Ya, Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
