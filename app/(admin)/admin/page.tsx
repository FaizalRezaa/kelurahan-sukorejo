import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  // Verifikasi ulang dari sisi Server Component untuk keamanan ganda
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Dasbor Admin Kelurahan
        </h1>
        <p className="text-gray-600 mb-8">
          Selamat datang, {data.user.email}! Anda memiliki akses penuh ke sistem ini.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg bg-blue-50 border-blue-100">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Manajemen Berita</h2>
            <p className="text-sm text-blue-600">Kelola publikasi dan kegiatan desa.</p>
          </div>
          <div className="p-6 border rounded-lg bg-green-50 border-green-100">
            <h2 className="text-xl font-semibold text-green-800 mb-2">Profil Statistik</h2>
            <p className="text-sm text-green-600">Ubah data penduduk dan wilayah.</p>
          </div>
        </div>
        
        {/* Tombol Logout Sederhana */}
        <form action={async () => {
          "use server";
          const supabase = await createClient();
          await supabase.auth.signOut();
          redirect("/login");
        }} className="mt-10">
          <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium">
            Keluar (Logout)
          </button>
        </form>
      </div>
    </div>
  );
}