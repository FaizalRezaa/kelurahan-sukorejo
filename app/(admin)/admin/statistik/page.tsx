"use client";

import { useState } from "react";
import { Edit2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { profilStatistikData, ProfilStatistikRecord } from "@/components/admin/mock-data";

export default function StatistikPage() {
  const [data, setData] = useState<ProfilStatistikRecord[]>(profilStatistikData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProfilStatistikRecord | null>(null);

  // Form Fields
  const [formLabel, setFormLabel] = useState("");
  const [formValue, setFormValue] = useState("");

  const handleOpenEdit = (item: ProfilStatistikRecord) => {
    setEditingItem(item);
    setFormLabel(item.label);
    setFormValue(String(item.value));
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLabel.trim() || !formValue.trim()) return;

    if (editingItem) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? { ...item, label: formLabel, value: formValue }
            : item
        )
      );
    }

    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Profil Statistik Kelurahan
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Kelola 3 indikator statistik demografi yang ditampilkan di beranda publik (
          <code className="font-mono text-slate-700">profil_statistik</code>).
          Setiap indikator mewakili satu kolom di bagian profil halaman utama.
        </p>
      </div>

      {/* Info Banner */}
      <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700 flex items-start gap-2">
        <span className="mt-0.5 shrink-0 font-bold">ℹ</span>
        <span>
          Tabel ini memiliki <strong>3 baris tetap</strong> sesuai tampilan beranda publik. Klik tombol
          edit untuk memperbarui label dan nilai masing-masing indikator.
        </span>
      </div>

      {/* Cards Grid — Preview visual mirip halaman publik */}
      <div className="grid grid-cols-3 gap-4">
        {data
          .sort((a, b) => a.urutan - b.urutan)
          .map((item) => (
            <Card key={item.id} className="relative group">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs uppercase tracking-wide">
                  Statistik #{item.urutan}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-3xl font-bold tracking-tight text-slate-900">
                  {item.value}
                </p>
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

      {/* Preview note */}
      <Card className="bg-slate-50 border-dashed">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-700">
            Pratinjau Tampilan Publik
          </CardTitle>
          <CardDescription className="text-xs">
            3 statistik di atas akan tampil seperti ini di halaman beranda:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-3 gap-3 border-t border-slate-200 pt-5">
            {data
              .sort((a, b) => a.urutan - b.urutan)
              .map((stat) => (
                <div key={stat.id}>
                  <dd className="text-2xl font-semibold tracking-tight text-[#173b2d]">
                    {stat.value}
                  </dd>
                  <dt className="mt-1 text-[10px] font-medium leading-snug text-zinc-500 uppercase tracking-wide">
                    {stat.label}
                  </dt>
                </div>
              ))}
          </dl>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          title="Edit Data Statistik"
          description={`Memperbarui statistik #${editingItem?.urutan} pada tabel profil_statistik.`}
        >
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Label Indikator
              </label>
              <Input
                type="text"
                required
                placeholder="Contoh: Jumlah Penduduk"
                value={formLabel}
                onChange={(e) => setFormLabel(e.target.value)}
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Deskripsi singkat yang tampil di bawah angka statistik.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nilai / Angka
              </label>
              <Input
                type="text"
                required
                placeholder="Contoh: 12.480"
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Gunakan format yang mudah dibaca (misalnya: 12.480, 3.965, 42).
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" size="sm" className="gap-1.5">
                <Check className="h-3.5 w-3.5" />
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
