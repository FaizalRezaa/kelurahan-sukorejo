import Link from "next/link";
import Providers from "@/app/providers";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="min-h-screen flex bg-gray-100 font-sans">
        
        {/* Sidebar Navigasi Kiri */}
        <aside className="w-64 bg-white border-r shadow-sm flex flex-col">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
            <p className="text-xs text-gray-500 mt-1">Kelurahan Sukorejo</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            <Link 
              href="/admin" 
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/admin/berita" 
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md font-medium transition-colors"
            >
              Manajemen Berita
            </Link>
            <Link 
              href="/admin/statistik" 
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md font-medium transition-colors"
            >
              Statistik Penduduk
            </Link>
            <Link 
              href="/admin/galeri" 
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md font-medium transition-colors"
            >
              Galeri Desa
            </Link>
          </nav>
        </aside>

        {/* Konten Utama di Kanan */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        
      </div>
    </Providers>
  );
}