import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Berita & Pengumuman | Kelurahan Sukorejo",
  description:
    "Informasi terkini, pengumuman resmi, dan dokumentasi kegiatan Kelurahan Sukorejo untuk seluruh warga.",
};

export default function ArtikelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
