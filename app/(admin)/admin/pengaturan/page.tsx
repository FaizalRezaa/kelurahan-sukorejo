"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Search, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { adminUsersData, AdminUserRecord } from "@/components/admin/mock-data";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRecord[]>(adminUsersData);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [editingItem, setEditingItem] = useState<AdminUserRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [formNama, setFormNama] = useState("");
  const [formRole, setFormRole] = useState("Admin Konten");

  const filteredUsers = users.filter(
    (item) =>
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.role.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormNama("");
    setFormRole("Admin Konten");
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: AdminUserRecord) => {
    setEditingItem(item);
    setFormNama(item.nama);
    setFormRole(item.role);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama.trim()) return;

    const today = new Date().toISOString().split("T")[0];

    if (editingItem) {
      setUsers((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                nama: formNama,
                role: formRole,
              }
            : item
        )
      );
    } else {
      const newUser: AdminUserRecord = {
        id: `user-usr-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString(36)}`,
        nama: formNama,
        role: formRole,
        created_at: today,
      };
      setUsers((prev) => [...prev, newUser]);
    }

    setIsDialogOpen(false);
  };

  const handleOpenDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setUsers((prev) => prev.filter((item) => item.id !== deletingId));
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
            Pengguna & Hak Akses (Profiles)
          </h1>
          <p className="text-xs text-slate-500">
            Kelola pengguna administrator pengelola CMS (<code className="font-mono text-slate-700">profiles</code>).
          </p>
        </div>
        <Button onClick={handleOpenAdd} size="sm" className="gap-1.5 text-xs font-semibold">
          <Plus className="h-3.5 w-3.5" />
          Tambah Admin Baru
        </Button>
      </div>

      {/* Main Table Card */}
      <Card className="p-0 overflow-hidden">
        <CardHeader className="px-6 pt-6 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900">
              Daftar Administrator Panel
            </CardTitle>
            <CardDescription>
              Wewenang dan akun terdaftar pengelola portal desa.
            </CardDescription>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari admin..."
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
                <TableHead className="font-semibold text-slate-700">Nama Pengguna</TableHead>
                <TableHead className="font-semibold text-slate-700">Role Wewenang</TableHead>
                <TableHead className="font-semibold text-slate-700 font-mono">auth.users.id (UUID)</TableHead>
                <TableHead className="font-semibold text-slate-700">Terdaftar</TableHead>
                <TableHead className="text-right font-semibold text-slate-700 pr-6">Aksi (CRUD)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-xs text-slate-500">
                    Tidak ada administrator ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/60 transition">
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-700 text-[11px]">
                          {item.nama.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-900 text-xs">{item.nama}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.role === "Super Admin"
                            ? "default"
                            : item.role === "Admin Konten"
                            ? "accent"
                            : "secondary"
                        }
                      >
                        {item.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-[11px] text-slate-400">
                      {item.id}
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
                          title="Edit Admin"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-slate-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDelete(item.id)}
                          title="Hapus Hak Akses"
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
          totalRows={filteredUsers.length}
          selectedRowsCount={0}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </Card>

      {/* Form Add / Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          title={editingItem ? "Edit Data Administrator" : "Tambah Admin Baru"}
          description="Atur nama dan peranan pengguna admin di database profiles."
        >
          <form onSubmit={handleSave} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap
              </label>
              <Input
                type="text"
                required
                placeholder="Contoh: Nina Rahma, S.STP"
                value={formNama}
                onChange={(e) => setFormNama(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Role Wewenang
              </label>
              <Select value={formRole} onChange={(e) => setFormRole(e.target.value)}>
                <option value="Super Admin">Super Admin</option>
                <option value="Admin Konten">Admin Konten</option>
                <option value="Admin Pelayanan">Admin Pelayanan</option>
                <option value="Admin Statistik">Admin Statistik</option>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" size="sm" className="gap-1.5">
                <Check className="h-3.5 w-3.5" />
                {editingItem ? "Simpan Perubahan" : "Tambah Admin"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent
          title="Hapus Hak Akses Admin"
          description="Apakah Anda yakin ingin menghapus administrator ini?"
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
