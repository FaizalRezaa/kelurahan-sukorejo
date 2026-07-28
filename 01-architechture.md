# Architecture — Website Kelurahan Sukorejo (Final - 2 Day Sprint)

## 1. Ringkasan Tech Stack

| Layer                  | Teknologi                                                     |
| ---------------------- | ------------------------------------------------------------- |
| Framework              | Next.js 14+ (App Router, TypeScript, React Server Components) |
| Styling                | Tailwind CSS                                                  |
| Iconography            | lucide-react                                                  |
| Data Fetching (Client) | TanStack Query (React Query v5)                               |
| Validasi Schema        | Zod                                                           |
| Backend / Database     | Supabase (PostgreSQL)                                         |
| Autentikasi            | Supabase Auth (Email/Password, khusus Admin)                  |
| File Storage           | Supabase Storage (S3-compatible API)                          |
| Deployment             | Vercel (disarankan)                                           |

**Prinsip Utama:**

- **Server Components (RSC):** Dipakai secara _default_ untuk seluruh halaman publik (Beranda, Berita, Layanan) agar _SEO-friendly_ dan performa maksimal. Data di-fetch langsung via Supabase Server Client.
- **Client Components & TanStack Query:** Hanya digunakan untuk halaman yang butuh interaktivitas tinggi (Dashboard Admin, Form CRUD, Modal Edit Statistik).
- **Zod sebagai Single Source of Truth:** Digunakan untuk validasi form di sisi _client_ dan validasi ulang di dalam _Server Actions_ sebelum masuk ke database.
- **Minimum Viable Product (MVP):** Fokus pada informasi searah (CMS). Fitur dua arah (seperti form pengaduan) dieliminasi untuk mempercepat peluncuran.

---

## 2. Struktur Folder

```text
kelurahan-sukorejo/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx                 # Layout publik (termasuk Navbar & Footer)
│   │   ├── page.tsx                   # Beranda Publik (Server Component)
│   │   ├── berita/
│   │   │   ├── page.tsx               # Daftar berita (Server Component)
│   │   │   └── [slug]/
│   │   │       └── page.tsx           # Detail artikel berita
│   │   ├── layanan/
│   │   │   └── page.tsx               # Katalog layanan warga
│   │   └── kontak/
│   │       └── page.tsx               # Halaman kontak statis
│   │
│   ├── (admin)/
│   │   ├── login/
│   │   │   └── page.tsx               # Form Login Admin (Client Component)
│   │   ├── layout.tsx                 # Layout Admin (sidebar, header admin)
│   │   └── admin/
│   │       ├── page.tsx               # Dashboard Utama
│   │       ├── statistik/
│   │       │   └── page.tsx           # Tabel & Modal Edit Profil Statistik
│   │       ├── berita/
│   │       │   ├── page.tsx           # Tabel Data Berita
│   │       │   └── baru/page.tsx      # Form Tambah Berita
│   │       └── galeri/
│   │           └── page.tsx           # Manajemen Galeri Foto
│   │
│   ├── layout.tsx                     # Root HTML & body layout
│   ├── providers.tsx                  # QueryClientProvider wrapper
│   └── globals.css
│
├── components/
│   ├── ui/                            # Primitive UI (Button, Input, Table)
│   ├── layout/
│   │   ├── navbar.tsx
│   │   └── footer.tsx
│   ├── home/                          # Section khusus Beranda
│   │   ├── hero.tsx
│   │   ├── profile-section.tsx
│   │   └── resource-card.tsx
│   └── admin/                         # Komponen CMS
│       ├── data-table.tsx
│       ├── modal.tsx
│       └── image-uploader.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                  # Supabase browser client
│   │   ├── server.ts                  # Supabase server client (cookies based)
│   │   └── storage.ts                 # Helper upload/delete gambar
│   ├── query/
│   │   └── keys.ts                    # Factory query keys TanStack
│   └── utils.ts                       # Helper classnames (cn), formatting, dsb.
│
├── hooks/
│   └── queries/                       # TanStack Query custom hooks
│       ├── use-berita.ts
│       └── use-statistik.ts           # hook mutasi edit statistik
│
├── schemas/                           # Zod Schemas
│   ├── common.schema.ts               # Skema statistik, dll
│   └── berita.schema.ts
│
├── actions/                           # Next.js Server Actions
│   ├── berita.actions.ts
│   └── statistik.actions.ts
│
├── middleware.ts                      # Proteksi /admin & pengecekan sesi login
├── .env.local
├── next.config.ts
└── tailwind.config.ts

```

---

## 3. Skema Database (PostgreSQL)

```text
profil_statistik   (id, label, value, urutan)
hero_slides        (id, image_path, alt, urutan, aktif)

artikel             (id, slug, judul, kategori['Berita'|'Kegiatan'],
                    ringkasan, konten, image_path, status['draft'|'terbit'],
                    tanggal_terbit, created_at, updated_at)

layanan            (id, slug, judul, deskripsi, image_path, created_at)

galeri             (id, image_path, alt, urutan, created_at)

profiles (admin)   (id -> mereferensi auth.users.id, nama, role, created_at)

```

**Aturan Row Level Security (RLS):**

- **Publik (`anon`):** Hanya memiliki hak akses `SELECT`. Khusus tabel `berita`, hanya baris dengan `status = 'terbit'` yang bisa dibaca publik.
- **Admin (`authenticated`):** Memiliki hak akses `SELECT`, `INSERT`, `UPDATE`, `DELETE` ke semua tabel (divalidasi dengan `role = 'admin'` di tabel `profiles`).

---

## 4. Storage Buckets (Supabase Storage)

Dibuat secara manual di dashboard Supabase. Semua diatur sebagai **Public Bucket**.

- `hero-images`
- `artikel-images`
- `layanan-images`
- `galeri-images`

---

## 5. Alur Data & Autentikasi

### A. Alur Login Admin

1. Akun admin dibuat manual oleh tim IT melalui Supabase Dashboard (Auth -> Create User).
2. Admin mengakses `/login` dan memasukkan kredensial.
3. Fungsi `supabase.auth.signInWithPassword` dipanggil di sisi client.
4. Token sesi (JWT) otomatis disimpan di _cookies_ browser.
5. Router mengarahkan admin ke `/admin`.

### B. Proteksi Route Middleware

- File `middleware.ts` berada di root proyek.
- Mencegat semua _request_ ke path `/admin/*`.
- Membaca _cookie_ sesi menggunakan `@supabase/ssr`. Jika sesi tidak ada atau tidak valid, _request_ di-_redirect_ kembali ke `/login`.

### C. Alur Data Publik (Read-Only)

`Server Component → lib/supabase/server.ts → Eksekusi Query → Render HTML`

- Cepat, _SEO friendly_, dan tidak membebani sisi client dengan _bundle_ JavaScript tambahan.

### D. Alur Data Admin (CRUD & Upload)

`Client Component Form → Validasi Zod (Client) → Panggil Next.js Server Action → Validasi Zod (Server) → Upload Supabase Storage (Jika ada file) → Insert/Update DB → Revalidate Path / Invalidate TanStack Query`

- Menggunakan modal dialog untuk edit data simpel (seperti `profil_statistik`) agar _flow_ kerja admin lebih cepat.

---

## 6. Environment Variables

Pastikan file `.env.local` berisi nilai berikut:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]

# JANGAN beri prefix NEXT_PUBLIC_ agar tidak terekspos ke sisi klien.
# Gunakan hanya untuk proses server khusus jika diperlukan akses by-pass (meski RSC sudah aman dengan server client).
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_ROLE_KEY]

```

**Next.js Config:** Tambahkan domain Supabase di `next.config.ts` pada `images.remotePatterns` agar `next/image` bisa merender gambar dari Storage dengan benar.

```

```
