import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galeri Foto | Kelurahan Sukorejo",
  description:
    "Galeri foto kegiatan, momen kebersamaan, dan keindahan lingkungan Kelurahan Sukorejo.",
};

export default function GaleriLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
