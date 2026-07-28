export type ArtikelCategory = "Berita" | "Pengumuman" | "Kegiatan";

export type ArtikelItem = {
  id: string;
  slug: string;
  date: string;
  category: ArtikelCategory;
  title: string;
  summary: string;
  image: string;
  content: string; // HTML string for detail page
  author: string;
  readTime: string;
};
