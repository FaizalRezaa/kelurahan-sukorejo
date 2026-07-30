"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit2, Check, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";

import { queryKeys } from "@/lib/query/keys";
import { fetchProfilStatistik, updateProfilStatistik } from "@/lib/query/fetcher";
import type { ProfilStatistik, ProfilStatistikUpdate } from "@/lib/query/schema";

export default function StatistikPage() {
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProfilStatistik | null>(null);
  const [formLabel, setFormLabel] = useState("");
  const [formValue, setFormValue] = useState("");

  const { data: statData = [], isLoading, isError, error } = useQuery({
    queryKey: queryKeys.profilStatistik.list(),
    queryFn: () => fetchProfilStatistik(),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: ProfilStatistikUpdate) => updateProfilStatistik(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profilStatistik.all() });
      setIsDialogOpen(false);
    },
  });

  const sorted = [...statData].sort((a, b) => a.urutan - b.urutan);

  const handleOpenEdit = (item: ProfilStatistik) => {
    setEditingItem(item);
    setFormLabel(item.label);
    setFormValue(String(item.value));
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !formLabel.trim() || !formValue.trim()) return;
    updateMutation.mutate({ id: editingItem.id, label: formLabel, value: formValue });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Profil Statistik Kelurahan</h1>
        <p className="text-xs text-slate-500 mt-1">
          Kelola 3 indikator statistik demografi yang ditampilkan di beranda publik (
          <code className="font-mono text-slate-700">profil_statistik</code>).
          Setiap indikator mewakili satu kolom di bagian profil halaman utama.
        </p>
      </div>

      <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700 flex items-start gap-2">
        <span className="mt-0.5 shrink-0 font-bold">ℹ</span>
        <span>
          Tabel ini memiliki <strong>3 baris tetap</strong> sesuai tampilan beranda publik. Klik tombol
          edit untuk memperbarui label dan nilai masing-masing indikator.
        </span>
      </div>

      {isError && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Gagal memuat data: {error instanceof Error ? error.message : "Terjadi kesalahan."}</span>
        </div>
      )}
      {updateMutation.isError && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Gagal menyimpan: {updateMutation.error instanceof Error ? updateMutation.error.message : "Terjadi kesalahan."}</span>
        </div>
      )}

      {/* Cards Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" /> Memuat data statistik...
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {sorted.map((item) => (
            <Card key={item.id} className="relative group">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs uppercase tracking-wide">
                  Statistik #{item.urutan}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-3xl font-bold tracking-tight text-slate-900">{item.value}</p>
                <p className="mt-1 text-sm text-slate-500">{item.label}</p>
              </CardContent>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleOpenEdit(item)}
                title="Edit"
                className="absolute top-3 right-3 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 className="h-3.5 w-3.5 text-slate-500" />
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Preview note */}
      {!isLoading && sorted.length > 0 && (
        <Card className="bg-slate-50 border-dashed">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">Pratinjau Tampilan Publik</CardTitle>
            <CardDescription className="text-xs">3 statistik di atas akan tampil seperti ini di halaman beranda:</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-3 gap-3 border-t border-slate-200 pt-5">
              {sorted.map((stat) => (
                <div key={stat.id}>
                  <dd className="text-2xl font-semibold tracking-tight text-[#173b2d]">{stat.value}</dd>
                  <dt className="mt-1 text-[10px] font-medium leading-snug text-zinc-500 uppercase tracking-wide">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          title="Edit Data Statistik"
          description={`Memperbarui statistik #${editingItem?.urutan} pada tabel profil_statistik.`}
        >
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Label Indikator</label>
              <Input type="text" required placeholder="Contoh: Jumlah Penduduk" value={formLabel} onChange={(e) => setFormLabel(e.target.value)} />
              <p className="mt-1 text-[11px] text-slate-400">Deskripsi singkat yang tampil di bawah angka statistik.</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nilai / Angka</label>
              <Input type="text" required placeholder="Contoh: 12.480" value={formValue} onChange={(e) => setFormValue(e.target.value)} />
              <p className="mt-1 text-[11px] text-slate-400">Gunakan format yang mudah dibaca (misalnya: 12.480, 3.965, 42).</p>
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
    </div>
  );
}
