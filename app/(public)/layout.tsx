import { Navbar } from "../../components/home/navbar";
import { Footer } from "../../components/home/footer";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f1ea]">
      {/* Navbar akan selalu ada di atas */}
      <Navbar />

      {/* Konten utama halaman */}
      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>

      {/* Footer akan selalu ada di bawah */}
      <Footer />
    </div>
  );
}