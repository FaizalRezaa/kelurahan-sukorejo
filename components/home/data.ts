import {
  ResourceItem,
  BannerItem,
  NewsItem,
  GalleryItem,
  HeroSlide,
  ProfileStatistic,
} from "./types";

export const heroSlides: HeroSlide[] = [
  {
    image:
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=85&w=2000&auto=format&fit=crop",
    alt: "Pemandangan jalan hijau di pagi hari",
  },
  {
    image:
      "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=85&w=2000&auto=format&fit=crop",
    alt: "Warga berjalan bersama di ruang terbuka",
  },
  {
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=85&w=2000&auto=format&fit=crop",
    alt: "Lanskap perbukitan hijau",
  },
];

export const profileStatistics: ProfileStatistic[] = [
  { value: "12.480", label: "Jumlah Penduduk" },
  { value: "3.965", label: "Jumlah Kepala Keluarga" },
  { value: "42", label: "Jumlah RT" },
];

export const resourceItems: ResourceItem[] = [
  {
    title: "Layanan Surat & Administrasi",
    description:
      "Ajukan surat pengantar KTP, KK, SKCK, domisili, dan surat lainnya secara online",
    image:
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop",
    href: "/layanan",
  },
  {
    title: "Bantuan Sosial (PKH/BST)",
    description:
      "Info penyaluran bantuan PKH, BST, dan program sosial lainnya untuk warga",
    image:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1200&auto=format&fit=crop",
    href: "/berita",
  },
  {
    title: "Kampung Tangguh & Kesehatan",
    description:
      "Info kesiapsiagaan kampung tangguh dan layanan kesehatan warga Sukorejo",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop",
    href: "/berita",
  },
  {
    title: "UMKM & Potensi Wilayah",
    description: "Temukan produk UMKM dan potensi unggulan Kelurahan Sukorejo",
    image:
      "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=1200&auto=format&fit=crop",
    href: "/potensi",
  },
  {
    title: "Pengaduan & Aspirasi Warga",
    description: "Sampaikan laporan, keluhan, atau aspirasi ke pihak kelurahan",
    image:
      "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=1200&auto=format&fit=crop",
    href: "/pengaduan",
  },
  {
    title: "Transparansi Anggaran",
    description: "Akses laporan keuangan, kinerja, dan perencanaan kelurahan",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop",
    href: "/transparansi",
  },
];

export const bannerItems: BannerItem[] = [
  {
    title: "Cari Produk Hukum?",
    buttonText: "Lihat Produk Hukum",
    image:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop",
    href: "/produk-hukum",
  },
  {
    title: "Butuh Layanan Kelurahan?",
    buttonText: "Layanan Online",
    image:
      "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1200&auto=format&fit=crop",
    href: "/layanan-online",
  },
];

export const newsItems: NewsItem[] = [
  {
    id: "1",
    date: "23 JULI 2026",
    category: "Berita",
    title: "Revitalisasi Kampung Tangguh Semeru di Kelurahan Sukorejo",
    summary:
      "Kelurahan Sukorejo kembali menggalakkan program Kampung Tangguh Semeru guna meningkatkan kesiapsiagaan warga terhadap kesehatan, keamanan, dan ketahanan pangan lokal.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
    href: "/berita/kampung-tangguh",
  },
  {
    id: "2",
    date: "22 JULI 2026",
    category: "Kegiatan",
    title: "Kegiatan Gotong Royong Perbaikan Jalan Desa Bersama Warga",
    summary:
      "Warga Kelurahan Sukorejo mengadakan kegiatan pembersihan lingkungan dan perbaikan jalan desa untuk menjaga kenyamanan dan keselamatan akses warga.",
    image:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800&auto=format&fit=crop",
    href: "/kegiatan/gotong-royong",
  },
  {
    id: "3",
    date: "20 JULI 2026",
    category: "Berita",
    title: "Peluncuran Program Pemberdayaan UMKM Lokal Sukorejo",
    summary:
      "Untuk mendorong potensi ekonomi wilayah, Kelurahan Sukorejo menggelar workshop pemasaran digital dan pendaftaran NIB gratis bagi para pelaku UMKM setempat.",
    image:
      "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=800&auto=format&fit=crop",
    href: "/berita/pelatihan-umkm",
  },
  {
    id: "4",
    date: "18 JULI 2026",
    category: "Kegiatan",
    title: "Posyandu Balita & Lansia Rutin Bulan Juli di Balai Kelurahan",
    summary:
      "Layanan pemeriksaan kesehatan, penimbangan balita, serta pembagian makanan tambahan bergizi diselenggarakan rutin bagi seluruh warga Sukorejo.",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop",
    href: "/kegiatan/posyandu-juli",
  },
  {
    id: "5",
    date: "15 JULI 2026",
    category: "Berita",
    title: "Penyaluran Bantuan Sosial PKH & BST Tahap III Berjalan Lancar",
    summary:
      "Pemerintah Kelurahan Sukorejo bersama pendamping sosial sukses menyalurkan bantuan sosial kepada ratusan keluarga penerima manfaat secara tertib.",
    image:
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=800&auto=format&fit=crop",
    href: "/berita/penyaluran-bansos",
  },
  {
    id: "6",
    date: "10 JULI 2026",
    category: "Kegiatan",
    title: "Musyawarah Perencanaan Pembangunan Kelurahan (Musrenbangkel)",
    summary:
      "Pihak kelurahan bersama tokoh masyarakat dan RT/RW berkumpul menyusun usulan prioritas pembangunan infrastruktur dan pemberdayaan masyarakat.",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
    href: "/kegiatan/musrenbangkel",
  },
];

export const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=85&w=1400&auto=format&fit=crop",
    alt: "Tebing batu di lanskap terbuka",
    className:
      "col-span-2 aspect-[16/10] sm:col-span-1 sm:aspect-[4/5] md:col-span-4 md:row-span-2 md:aspect-auto",
  },
  {
    id: "g2",
    image:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=85&w=900&auto=format&fit=crop",
    alt: "Bukit pasir saat sore hari",
    className:
      "col-span-2 aspect-[16/10] sm:col-span-1 sm:aspect-[4/5] md:col-span-2 md:row-span-2 md:aspect-auto",
  },
  {
    id: "g3",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=85&w=900&auto=format&fit=crop",
    alt: "Hamparan bukit pasir",
    className:
      "col-span-1 aspect-[4/5] md:col-span-2 md:row-span-2 md:aspect-auto",
  },
  {
    id: "g4",
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=85&w=900&auto=format&fit=crop",
    alt: "Cahaya matahari di perbukitan",
    className:
      "col-span-1 aspect-[4/5] md:col-span-2 md:row-span-2 md:aspect-auto",
  },
  {
    id: "g5",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=85&w=900&auto=format&fit=crop",
    alt: "Jalur di antara tebing batu",
    className:
      "col-span-2 aspect-[16/10] sm:col-span-1 sm:aspect-[4/5] md:col-span-2 md:row-span-2 md:aspect-auto",
  },
  {
    id: "g6",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=85&w=1200&auto=format&fit=crop",
    alt: "Langit cerah di atas pantai",
    className:
      "col-span-1 aspect-[4/5] md:col-span-3 md:row-span-2 md:aspect-auto",
  },
  {
    id: "g7",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=85&w=1200&auto=format&fit=crop",
    alt: "Pemandangan pegunungan yang tenang",
    className:
      "col-span-1 aspect-[4/5] md:col-span-3 md:row-span-2 md:aspect-auto",
  },
];
