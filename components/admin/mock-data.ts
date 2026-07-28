export interface ProfilStatistikRecord {
  id: string;
  label: string;
  value: number | string;
  urutan: number;
}

export interface ArtikelRecord {
  id: string;
  slug: string;
  judul: string;
  kategori: "Berita" | "Kegiatan";
  ringkasan: string;
  konten: string;
  image_path: string;
  status: "draft" | "terbit";
  tanggal_terbit: string;
  created_at: string;
  updated_at: string;
}

export interface LayananRecord {
  id: string;
  slug: string;
  judul: string;
  deskripsi: string;
  image_path: string;
  url: string;
  created_at: string;
}

export interface GaleriRecord {
  id: string;
  image_path: string;
  alt: string;
  urutan: number;
  created_at: string;
}

export interface HeroSlideRecord {
  id: string;
  image_path: string;
  alt: string;
  urutan: number;
  aktif: boolean;
}

export interface AdminUserRecord {
  id: string;
  nama: string;
  role: string;
  created_at: string;
}

export const profilStatistikData: ProfilStatistikRecord[] = [
  { id: "stat-1", label: "Total Penduduk", value: "14,250", urutan: 1 },
  { id: "stat-2", label: "Kepala Keluarga (KK)", value: "3,820", urutan: 2 },
  { id: "stat-3", label: "Luas Wilayah (Ha)", value: "450", urutan: 3 },
  { id: "stat-4", label: "Jumlah RT / RW", value: "32 / 08", urutan: 4 },
];

export const artikelData: ArtikelRecord[] = [
  {
    id: "artikel-1",
    slug: "bazar-umkm-desa-sukorejo",
    judul: "Bazar UMKM Desa Sukorejo 2026",
    kategori: "Kegiatan",
    ringkasan: "Pameran UMKM lokal menghadirkan produk kreatif warga dan kuliner khas.",
    konten: "Kegiatan Bazar UMKM Desa Sukorejo diselenggarakan di lapangan utama kelurahan dengan melibatkan lebih dari 40 pelaku usaha mikro lokal. Acara ini bertujuan meningkatkan roda perekonomian warga pasca pandemi.",
    image_path: "https://images.unsplash.com/photo-1531058240690-006c446962d8?w=800&auto=format&fit=crop",
    status: "terbit",
    tanggal_terbit: "2026-07-12",
    created_at: "2026-07-10",
    updated_at: "2026-07-12",
  },
  {
    id: "artikel-2",
    slug: "peresmian-taman-edukasi",
    judul: "Peresmian Taman Edukasi Dan Literasi Anak",
    kategori: "Berita",
    ringkasan: "Pembukaan taman edukasi baru untuk anak-anak dan keluarga di RW 04.",
    konten: "Lurah Sukorejo meresmikan Taman Edukasi RPTRA yang dilengkapi fasilitas perpustakaan mini, wahana bermain ramah anak, dan jaringan Wi-Fi publik.",
    image_path: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop",
    status: "terbit",
    tanggal_terbit: "2026-07-08",
    created_at: "2026-07-05",
    updated_at: "2026-07-08",
  },
  {
    id: "artikel-3",
    slug: "pelayanan-ktp-baru-digital",
    judul: "Pelayanan Digitalisasi KTP & Identitas Kependudukan",
    kategori: "Berita",
    ringkasan: "Penerapan sistem antrian online dan Identitas Kependudukan Digital (IKD).",
    konten: "Warga Sukorejo kini dapat memanfaatkan sistem booking nomor antrean pengurusan KTP secara online via portal resmi kelurahan.",
    image_path: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop",
    status: "draft",
    tanggal_terbit: "-",
    created_at: "2026-07-18",
    updated_at: "2026-07-18",
  },
  {
    id: "artikel-4",
    slug: "program-kesehatan-ibu-hamil",
    judul: "Program Posyandu Dan Bakti Kesehatan Ibu Hamil",
    kategori: "Kegiatan",
    ringkasan: "Bakti kesehatan gratis dan penyuluhan ibu hamil di balai kelurahan.",
    konten: "Puskesmas bekerjasama dengan Tim Penggerak PKK Kelurahan Sukorejo mengadakan cek kesehatan gratis dan pemberian makanan tambahan.",
    image_path: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop",
    status: "terbit",
    tanggal_terbit: "2026-07-15",
    created_at: "2026-07-12",
    updated_at: "2026-07-15",
  },
  {
    id: "artikel-5",
    slug: "pendaftaran-sekolah-baru",
    judul: "Informasi Pendaftaran Siswa Baru (PPDB) 2026",
    kategori: "Berita",
    ringkasan: "Jalur pendaftaran zonasi dan bantuan perlengkapan sekolah warga kurang mampu.",
    konten: "Panduan teknis pendaftaran siswa sekolah dasar dan menengah di wilayah Kelurahan Sukorejo tahun ajaran 2026/2027.",
    image_path: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop",
    status: "draft",
    tanggal_terbit: "-",
    created_at: "2026-07-20",
    updated_at: "2026-07-20",
  },
];

export const layananData: LayananRecord[] = [
  {
    id: "layanan-1",
    slug: "layanan-ktp",
    judul: "Pelayanan Pembuatan & Update KTP",
    deskripsi: "Prosedur penerbitan KTP elektronik baru, penggantian KTP rusak, dan perubahan alamat kependudukan.",
    image_path: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop",
    url: "https://kelurahan-sukorejo.go.id/layanan/ktp",
    created_at: "2026-07-05",
  },
  {
    id: "layanan-2",
    slug: "layanan-akta-kelahiran",
    judul: "Pendataan & Penerbitan Akta Kelahiran",
    deskripsi: "Layanan verifikasi dan pengurusan surat pengantar akta kelahiran bayi baru lahir.",
    image_path: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop",
    url: "https://kelurahan-sukorejo.go.id/layanan/akta-kelahiran",
    created_at: "2026-07-10",
  },
  {
    id: "layanan-3",
    slug: "surat-keterangan-domisili",
    judul: "Surat Keterangan Domisili & Usaha (SKU)",
    deskripsi: "Penerbitan surat keterangan domisili tempat tinggal dan surat keterangan usaha lokal.",
    image_path: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop",
    url: "https://kelurahan-sukorejo.go.id/layanan/domisili",
    created_at: "2026-07-15",
  },
];

export const galeriData: GaleriRecord[] = [
  {
    id: "galeri-1",
    image_path: "https://images.unsplash.com/photo-1531058240690-006c446962d8?w=800&auto=format&fit=crop",
    alt: "Suasana bazar UMKM Sukorejo",
    urutan: 1,
    created_at: "2026-07-11",
  },
  {
    id: "galeri-2",
    image_path: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop",
    alt: "Pengunjung acara taman edukasi",
    urutan: 2,
    created_at: "2026-07-14",
  },
  {
    id: "galeri-3",
    image_path: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop",
    alt: "Pelayanan Posyandu Balai Desa",
    urutan: 3,
    created_at: "2026-07-19",
  },
  {
    id: "galeri-4",
    image_path: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop",
    alt: "Musyawarah Perencanaan Pembangunan (Musrenbang)",
    urutan: 4,
    created_at: "2026-07-21",
  },
];

export const heroSlidesData: HeroSlideRecord[] = [
  {
    id: "slide-1",
    image_path: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop",
    alt: "Selamat Datang di Portal Resmi Kelurahan Sukorejo",
    urutan: 1,
    aktif: true,
  },
  {
    id: "slide-2",
    image_path: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&auto=format&fit=crop",
    alt: "Pelayanan Kependudukan Cepat, Transparan, dan Akuntabel",
    urutan: 2,
    aktif: true,
  },
  {
    id: "slide-3",
    image_path: "https://images.unsplash.com/photo-1531058240690-006c446962d8?w=1200&auto=format&fit=crop",
    alt: "Dukung Perkembangan Ekonomi UMKM Lokal Sukorejo",
    urutan: 3,
    aktif: false,
  },
];

export const adminUsersData: AdminUserRecord[] = [
  {
    id: "user-usr-8921-a1",
    nama: "Nina Rahma, S.STP",
    role: "Super Admin",
    created_at: "2026-01-04",
  },
  {
    id: "user-usr-8921-a2",
    nama: "Budi Santoso, S.Kom",
    role: "Admin Konten",
    created_at: "2026-02-09",
  },
  {
    id: "user-usr-8921-a3",
    nama: "Siti Nurhayati",
    role: "Admin Pelayanan",
    created_at: "2026-03-22",
  },
];
