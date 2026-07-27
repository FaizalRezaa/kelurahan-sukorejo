# PRD - Website Profil Kelurahan Sukorejo (Sprint 2 Hari)

## Latar Belakang

Pembuatan website profil kelurahan dengan target _sprint_ cepat (2 hari eksekusi). Kelurahan belum memiliki web profil resmi secara online. Dibutuhkan website statis dengan CMS ringan agar admin kelurahan (perangkat desa) bisa memperbarui konten secara mandiri setelah _handover_.

Fokus utama adalah menekan kompleksitas agar pengembangan yang dibagi secara paralel (sisi Next.js untuk antarmuka dan Supabase untuk _database_/_storage_) dapat selesai tepat waktu tanpa mengorbankan stabilitas.

## Target Pengguna

- **Warga & Publik:** Membaca informasi, pengumuman, berita, profil kelurahan, dan melihat katalog layanan.
- **Admin Kelurahan:** Login dan melakukan CRUD (Create, Read, Update, Delete) konten melalui CMS. Memiliki pemahaman teknologi dasar, sehingga UI admin harus dibuat **sangat sederhana** dan _to the point_.

## Fitur MVP (Harus Ada)

### Halaman Publik (Informasi Searah)

- [ ] **Beranda (Landing Page):**
- Hero slider bergambar.
- Ringkasan profil & statistik kelurahan (Jumlah penduduk, KK, RT).
- Berita & Kegiatan terbaru.

- [ ] **Halaman Berita & Kegiatan:**
- Menampilkan _list_ artikel (judul, tanggal, thumbnail, ringkasan).
- Menggunakan satu tabel/model data di Supabase (`berita`), dibedakan menggunakan field `kategori` ('Berita' atau 'Kegiatan').
- Halaman detail artikel.

- [ ] **Halaman Layanan:**
- Katalog statis/dinamis berisi daftar layanan warga (contoh: Layanan Surat Pengantar, Bantuan Sosial) beserta deskripsi syarat dan ketentuannya.

- [ ] **Halaman Galeri:**
- Menampilkan grid foto kegiatan atau potensi wilayah kelurahan.

- [ ] **Halaman Kontak & Profil:**
- Informasi alamat, kontak, dan jam operasional.

### Halaman Admin (CMS via Next.js Client Components)

- [ ] **Otentikasi:** Halaman login sederhana menggunakan email dan password (Supabase Auth).
- [ ] **Manajemen Berita:** CRUD untuk tabel `berita`. Terdapat fungsi upload _thumbnail_ ke Supabase Storage.
- [ ] **Manajemen Statistik:** Modal ringkas untuk mengedit angka statistik yang tampil di Beranda (Tabel `profil_statistik`).
- [ ] **Manajemen Galeri:** Upload dan hapus foto untuk halaman galeri (Tabel `galeri`).

### Aturan Sorting/Query (Berita & Kegiatan)

Aturan ini dikunci agar tidak terjadi perbedaan implementasi di tengah jalan:

- **Beranda ("Berita Terbaru"):** _Filter_ berdasarkan `status = 'terbit'`, urutkan (_sort_) berdasarkan `tanggal_terbit` secara _descending_, _limit_ 3-6 item. (Menghindari penggunaan `created_at` agar artikel yang di-_draft_ lama namun baru di-_publish_ tetap berada di atas).
- **Halaman List Berita & Kegiatan:** _Filter_ berdasarkan `status = 'terbit'`, urutkan `tanggal_terbit` _descending_. Tambahkan opsi filter kategori.
- **Halaman Detail (Berita Terkait):**

1. Ambil artikel lain dengan kategori yang sama.
2. _Sort_ `tanggal_terbit` _descending_, _limit_ 4, pastikan mengecualikan ( _exclude_) ID artikel yang sedang dibuka.
3. Jika hasil kurang dari 4, genapi dengan mengambil artikel terbaru lintas kategori.

## Fitur yang DIBUANG Dulu (_Out of Scope_ MVP)

Fitur-fitur ini ditiadakan untuk menjaga target rilis 2 hari:

- **Form Pengaduan Warga:** Dihapus sepenuhnya untuk menghindari setup _Row Level Security_ (RLS) _insert_ publik yang kompleks dan mencegah masuknya data _spam_ saat produksi.
- **Manajemen Dokumen Resmi / Produk Hukum / Laporan Keuangan:** Dihapus dari iterasi pertama ini. Fokus dialihkan pada penyampaian berita dan profil kelurahan.
- **Multi-Admin / Role Permissions:** Cukup 1 role admin universal (`role = 'admin'`).
- **Komentar Warga / Fitur Interaktif Tambahan.**
- **Dashboard Analytics Khusus.**

## Kendala & Pendekatan Teknis

- **Waktu Eksekusi (2 Hari):** Pengerjaan dibagi tegas (Next.js UI & state vs Supabase Schema & Storage). Tidak ada waktu untuk logika abstrak yang rumit.
- **Minim Maintenance:** Setelah selesai, aplikasi akan dilepas ke pihak kelurahan. Hindari dependensi pihak ketiga yang memerlukan _maintenance_ tinggi.
- **Render Strategy:** Gunakan **Server Components** murni untuk halaman publik agar _SEO-friendly_ dan mengurangi _load_ JavaScript di HP warga. Gunakan TanStack Query khusus di dalam halaman `/admin`.

## Definition of Done (DoD)

- Aplikasi sukses di-_deploy_ ke Vercel dan dapat diakses publik.
- Halaman publik (Beranda, Profil, Berita, Layanan, Galeri) berhasil memuat data dari Supabase tanpa _error_.
- Sistem RLS Supabase aktif: Publik hanya bisa melakukan `GET` (khusus berita yang rilis), sedangkan Admin bisa melakukan CRUD.
- Admin dapat melakukan _login_, mengunggah gambar, dan mempublikasikan artikel berita dengan sukses tanpa memerlukan pendampingan teknis.
