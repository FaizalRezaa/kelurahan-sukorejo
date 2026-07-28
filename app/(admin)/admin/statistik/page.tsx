"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Search, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { profilStatistikData, ProfilStatistikRecord } from "@/components/admin/mock-data";

export default function StatistikPage() {
  const [data, setData] = useState<ProfilStatistikRecord[]>(profilStatistikData);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [editingItem, setEditingItem] = useState<ProfilStatistikRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form Fields
  const [formLabel, setFormLabel] = useState("");
  const [formValue, setFormValue] = useState("");
  const [formUrutan, setFormUrutan] = useState<number>(1);

  const filteredData = data.filter(
    (item) =>
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      String(item.value).toLowerCase().includes(search.toLowerCase())
  );

  const paginatedData = filteredData
    .sort((a, b) => a.urutan - b.urutan)
    .slice((page - 1) * pageSize, page * pageSize);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormLabel("");
    setFormValue("");
    setFormUrutan(data.length + 1);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: ProfilStatistikRecord) => {
    setEditingItem(item);
    setFormLabel(item.label);
    setFormValue(String(item.value));
    setFormUrutan(item.urutan);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLabel.trim() || !formValue.trim()) return;

    if (editingItem) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? { ...item, label: formLabel, value: formValue, urutan: Number(formUrutan) }
            : item
        )
      );
    } else {
      const newItem: ProfilStatistikRecord = {
        id: `stat-${Date.now()}`,
        label: formLabel,
        value: formValue,
        urutan: Number(formUrutan),
      };
      setData((prev) => [...prev, newItem]);
    }

    setIsDialogOpen(false);
  };

  const handleOpenDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setData((prev) => prev.filter((item) => item.id !== deletingId));
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
            Profil Statistik Kelurahan
          </h1>
          <p className="text-xs text-slate-500">
            Kelola indikator statistik demografi desa (<code className="font-mono text-slate-700">profil_statistik</code>).
          </p>
        </div>
        <Button onClick={handleOpenAdd} size="sm" className="gap-1.5 text-xs font-semibold">
          <Plus className="h-3.5 w-3.5" />
          Tambah Indikator
        </Button>
      </div>

      {/* Main Table Card */}
      <Card className="p-0 overflow-hidden">
        <CardHeader className="px-6 pt-6 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900">
              Daftar Statistik Demografi
            </CardTitle>
            <CardDescription>
              Angka yang ditampilkan di halaman publik beranda kelurahan.
            </CardDescription>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari label..."
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
                <TableHead className="w-16 font-semibold text-slate-700 text-center">Urutan</TableHead>
                <TableHead className="font-semibold text-slate-700">Label Statistik</TableHead>
                <TableHead className="font-semibold text-slate-700">Nilai / Value</TableHead>
                <TableHead className="font-semibold text-slate-700 font-mono">ID</TableHead>
                <TableHead className="text-right font-semibold text-slate-700 pr-6">Aksi (CRUD)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-xs text-slate-500">
                    Tidak ada data statistik ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/60 transition">
                    <TableCell className="text-center font-bold text-slate-700">
                      #{item.urutan}
                    </TableCell>
                    <TableCell className="font-medium text-slate-900 text-xs">
                      {item.label}
                    </TableCell>
                    <TableCell className="font-bold text-slate-900 text-xs font-mono">
                      {item.value}
                    </TableCell>
                    <TableCell className="font-mono text-[11px] text-slate-400">
                      {item.id}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(item)}
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-slate-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDelete(item.id)}
                          title="Hapus"
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
          totalRows={filteredData.length}
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
          title={editingItem ? "Edit Data Statistik" : "Tambah Data Statistik"}
          description="Form pembaruan data profil_statistik kelurahan."
        >
          <form onSubmit={handleSave} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Label Indikator (misal: Total Penduduk)
              </label>
              <Input
                type="text"
                required
                placeholder="Contoh: Jumlah RT / RW"
                value={formLabel}
                onChange={(e) => setFormLabel(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nilai / Angka
              </label>
              <Input
                type="text"
                required
                placeholder="Contoh: 14,250"
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
              />
            </div>

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

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" size="sm" className="gap-1.5">
                <Check className="h-3.5 w-3.5" />
                {editingItem ? "Simpan Perubahan" : "Tambah Data"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent
          title="Hapus Data Statistik"
          description="Apakah Anda yakin ingin menghapus data ini?"
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
