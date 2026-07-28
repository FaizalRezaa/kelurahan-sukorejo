import type { Metadata } from "next";
import { Navbar } from "../../components/home/navbar";
import { Footer } from "../../components/home/footer";
import "../globals.css";

// Saya bantu sesuaikan title dan description-nya juga agar lebih profesional
export const metadata: Metadata = {
  title: "Kelurahan Sukorejo",
  description: "Website Resmi Kelurahan Sukorejo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Menambahkan scroll-smooth untuk anchor link navbar
    <html lang="id" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#f4f1ea]">
        {/* Navbar akan selalu ada di atas */}
        <Navbar />

        {/* Konten utama halaman. flex-1 memastikan footer selalu terdorong ke paling bawah layar */}
        <div className="flex-1 flex flex-col w-full">{children}</div>

        {/* Footer akan selalu ada di bawah */}
        <Footer />
      </body>
    </html>
  );
}
