# PROJECT.md — Kelurahan Sukorejo Website

## Project Overview

A public-facing village profile website (website profil kelurahan) for **Kelurahan Sukorejo** with a lightweight CMS. The site lets residents access village information, news, announcements, and services, while authorized village staff manage content through a protected admin panel.

The project was built as a fast 2-day sprint, prioritizing one-way information delivery (CMS), SEO-friendly public pages, and a minimal-maintenance stack after handover.

---

## Target Users

| User | Description |
|---|---|
| **Warga & Publik** | Read-only visitors: access news, announcements, village profile, and service catalogue. |
| **Admin Kelurahan** | Village staff who log in and perform CRUD via the CMS. Have basic tech literacy — admin UI must be kept **very simple and to the point**. |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| React | React 19 |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`) |
| Icons | lucide-react |
| Rich-Text Editor | react-quill-new (Quill, SSR disabled via dynamic import) |
| Client State / Fetching | TanStack Query v5 |
| Validation | Zod v4 |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth — email/password, admin-only |
| File Storage | Supabase Storage (public buckets) |
| Deployment | Vercel |

---

## Folder Structure

```
app/
  (public)/            # Public site — RSC by default
    page.tsx            # Beranda (Home)
    artikel/            # Article list + [slug] detail
    galeri/             # Photo gallery
    layanan/            # Services page (empty — not yet built)
    kontak/             # Contact page (empty — not yet built)
    layout.tsx          # Navbar + Footer shell
  (admin)/             # Admin CMS — all Client Components
    admin/
      page.tsx           # Dashboard overview
      artikel/           # Article CRUD
      galeri/            # Gallery CRUD
      hero-slides/       # Hero slide CRUD
      layanan/           # Service CRUD
      statistik/         # Statistics CRUD
      pengaturan/        # Admin user management
      layout.tsx         # Sidebar + topbar
    login/              # Login page

components/
  home/                # Home page presentation components + static mock data
  artikel/             # Article page components + static mock data
  admin/               # Shared admin components (ImageUploadField, QuillEditor, mock-data)
  ui/                  # Generic primitive UI (Button, Dialog, Table, Badge, etc.)

lib/
  supabase/
    server.ts           # Supabase server client (RSC / Server Actions)
    client.ts           # Supabase browser client (Client Components)
    storage.ts          # Storage helpers (stub)
  query/
    schema.ts           # Zod schemas + TypeScript types — single source of truth
    fetcher.ts          # Pure async CRUD functions for all tables
    keys.ts             # TanStack Query key factory (currently empty)

middleware.ts           # Route guard: /admin/* requires valid Supabase session
next.config.ts          # next/image remotePatterns (currently: unsplash.com only)
```

---

## Rendering Strategy

| Route Pattern | Strategy | Reason |
|---|---|---|
| `app/(public)/**` | React Server Components (RSC) | SEO, no client JS bundle for data |
| `app/(admin)/**` | Client Components (`"use client"`) | Interactive CRUD, TanStack Query |
| `components/home/navbar.tsx` | Client Component | Scroll-aware transparency + mobile menu |
| `app/providers.tsx` | Client Component | TanStack Query `QueryClientProvider` wrapper |
| `middleware.ts` | Edge (Next.js Middleware) | Supabase session validation for /admin |

> **Note**: The current public article list page (`app/(public)/artikel/page.tsx`) is marked `"use client"` and uses static mock data. It needs to be refactored to RSC with live Supabase data.

---

## Feature Modules

### Public Site

| Page | Route | Status |
|---|---|---|
| Beranda (Home) | `/` | Built — hero slider, stats, resource grid, banner CTAs, news preview, gallery preview. Partially wired to Supabase (news query still references old `"berita"` table name — should be `"artikel"`). |
| Artikel (List) | `/artikel` | Built — category filter, pagination. Uses static mock data. Needs Supabase integration + RSC refactor. |
| Artikel (Detail) | `/artikel/[slug]` | Directory exists. |
| Galeri | `/galeri` | Built — photo grid, lightbox, pagination, category filter. Uses static mock data. |
| Layanan | `/layanan` | Empty directory — page not yet built. |
| Kontak | `/kontak` | Empty directory — page not yet built. |

**Navigation links** (from `components/home/navbar.tsx`): Beranda, Profil (`/#profil`), Layanan (`/#layanan`), Artikel, Galeri, Hubungi Kami (`/kontak`).

#### Article Query Rules

These rules are locked to prevent implementation drift:

- **Home page ("Berita Terbaru")**: Filter `status = 'terbit'`, order by `tanggal_terbit DESC`, limit 3–6. (Using `tanggal_terbit` instead of `created_at` ensures long-drafted articles appear correctly after publish.)
- **Article list page**: Filter `status = 'terbit'`, order by `tanggal_terbit DESC`. Add category filter option.
- **Article detail — Related Articles**:
  1. Fetch other articles with the same `kategori`.
  2. Order by `tanggal_terbit DESC`, limit 4, exclude the current article's `id`.
  3. If fewer than 4 results, backfill with the latest articles across all categories.

### Admin CMS

All admin pages are currently wired to static mock data (`components/admin/mock-data.ts`). Supabase integration is the next major task.

| Module | Route | Tables Managed |
|---|---|---|
| Dashboard | `/admin` | Overview of all modules |
| Artikel | `/admin/artikel` | `artikel` |
| Galeri | `/admin/galeri` | `galeri` |
| Hero Slides | `/admin/hero-slides` | `hero_slides` |
| Layanan Publik | `/admin/layanan` | `layanan_publik` |
| Profil Statistik | `/admin/statistik` | `profil_statistik` |
| Pengaturan Admin | `/admin/pengaturan` | `profiles` (admin users) |

Each module has: data table with search/pagination, add/edit dialog (with `ImageUploadField` and `QuillEditor` where applicable), and a delete confirmation dialog.

### Out-of-Scope (MVP Exclusions)

Deliberately excluded to meet the 2-day sprint target:

| Feature | Reason excluded |
|---|---|
| Form Pengaduan Warga (complaint form) | Requires complex public RLS INSERT setup; spam risk in production. |
| Manajemen Dokumen / Produk Hukum / Laporan Keuangan | Out of scope for v1; focus is on news and village profile. |
| Multi-Admin / Role Permissions | Single `role = 'admin'` is sufficient. |
| Komentar Warga / Interactive features | Out of scope. |
| Dashboard Analytics | Out of scope. |

---

## Database Schema

All tables are in the public schema of a Supabase PostgreSQL project.

```
profil_statistik
  id          uuid PK
  label       text          -- e.g. "Jumlah Penduduk"
  value       text          -- e.g. "12.450 Jiwa"
  urutan      int           -- 1–3 (fixed 3 rows)

hero_slides
  id          uuid PK
  image_path  text          -- Supabase Storage path
  alt         text
  urutan      int
  aktif       boolean

artikel
  id          uuid PK
  slug        text UNIQUE
  judul       text
  kategori    enum          -- 'Berita' | 'Kegiatan' | 'Pengumuman'
  ringkasan   text          -- max 500 chars, shown on list cards
  konten      text          -- HTML output from Quill rich-text editor
  image_path  text NULLABLE -- thumbnail
  status      enum          -- 'draft' | 'terbit'
  tanggal_terbit  date NULLABLE
  created_at  timestamptz
  updated_at  timestamptz

layanan_publik
  id          uuid PK
  urutan      int           -- 1–6 (fixed 6 rows, matches home ResourceCard grid)
  judul       text
  deskripsi   text
  image_path  text NULLABLE
  href        text          -- destination link when card is clicked
  created_at  timestamptz

banner_items
  id          uuid PK
  urutan      int           -- 1–2 (fixed 2 rows, matches home BannerCard)
  judul       text
  button_text text          -- CTA button label
  image_path  text NULLABLE
  href        text          -- destination link
  created_at  timestamptz

galeri
  id          uuid PK
  image_path  text
  alt         text
  urutan      int
  created_at  timestamptz

profiles         -- admin users only
  id          uuid PK → references auth.users.id
  nama        text
  role        enum          -- 'admin' (single role)
  created_at  timestamptz
```

**Row Level Security (RLS):**
- `anon` role: `SELECT` only. For `artikel`, only rows where `status = 'terbit'`.
- `authenticated` role: Full `SELECT`, `INSERT`, `UPDATE`, `DELETE` (validated via `role = 'admin'` in `profiles`).

---

## Storage Buckets

All buckets are **public** (Supabase Storage).

| Bucket | Used by |
|---|---|
| `hero-images` | `hero_slides.image_path` |
| `artikel-images` | `artikel.image_path` |
| `layanan-images` | `layanan_publik.image_path` |
| `galeri-images` | `galeri.image_path` |

Storage upload is handled by `ImageUploadField` component and `uploadFile()` / `deleteFile()` in `lib/query/fetcher.ts`. To get a public URL: `getPublicUrl(bucket, path)`.

> **Note**: Buckets must be created **manually** in the Supabase dashboard before use.

---

## Environment Variables

Required in `.env.local` (not committed to git):

```env
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]

# Do NOT prefix with NEXT_PUBLIC_ — must not be exposed to the browser.
# Only needed for server-side bypass operations (rare; RSC server client is already safe).
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_ROLE_KEY]
```

Also update `next.config.ts` → `images.remotePatterns` to include the Supabase Storage hostname so `next/image` can render storage images.

---

## Authentication

- **Provider**: Supabase Auth (email + password).
- **Flow**: Admin navigates to `/login` → `supabase.auth.signInWithPassword()` → JWT stored in cookies → redirected to `/admin`.
- **Session management**: `middleware.ts` intercepts all requests, reads session via `@supabase/ssr`, redirects unauthenticated users away from `/admin`, and redirects authenticated users away from `/login`.
- **Admin creation**: Done manually via Supabase Dashboard (Auth → Create User). No self-registration.
- **Single role**: Only `role = 'admin'` exists. No multi-role system.

---

## Data Flow

### Public (Read-Only)
```
Browser request → Next.js RSC → lib/supabase/server.ts → Supabase DB → Rendered HTML
```

### Admin CRUD
```
Client form submit
  → Zod validation (lib/query/schema.ts)
  → lib/query/fetcher.ts (pure async CRUD)
  → Supabase Storage upload (if file)
  → Supabase DB mutation
  → TanStack Query cache invalidation
  → UI update
```

---

## Current Progress

### Completed
- Project scaffolding (Next.js 16, Tailwind v4, Supabase, TanStack Query, Zod)
- Supabase client setup (`lib/supabase/server.ts`, `lib/supabase/client.ts`)
- Route protection middleware (`middleware.ts`)
- Admin CMS layout (sidebar, breadcrumb, mobile drawer)
- Admin dashboard overview page
- Admin CRUD UIs for: Artikel, Galeri, Hero Slides, Layanan Publik, Statistik, Pengaturan
- Shared admin components: `ImageUploadField`, `QuillEditor`
- Generic UI primitives: Button, Dialog, Table, Badge, Card, Input, Select, etc.
- Zod schema definitions for all entities (`lib/query/schema.ts`)
- Fetcher functions for all tables (`lib/query/fetcher.ts`)
- Public home page (Beranda) layout and UI
- Public article list page with category filter and pagination
- Public gallery page with lightbox
- `app/providers.tsx` (TanStack Query provider)

### In Progress / Pending
- **Supabase integration for admin pages** — all admin pages currently use `mock-data.ts`; need to wire `useQuery`/`useMutation` via `fetcher.ts`
- **TanStack Query keys** — `lib/query/keys.ts` is empty; define key factories
- **Public pages using live data** — home page queries `"berita"` (wrong table), artikel list uses static mock data
- **Supabase hostname in `next.config.ts`** — only `images.unsplash.com` is configured; add Supabase Storage hostname for `next/image`
- **Import path bug in `fetcher.ts`** — imports from `"@/utils/supabase/client"` (wrong path); correct path is `"@/lib/supabase/client"`
- **`lib/supabase/storage.ts`** — empty stub; implement storage helpers here
- **Public pages not yet built**: `/layanan`, `/kontak`
- **Article detail page** (`/artikel/[slug]`) — directory may exist; implementation unclear
- **Artikel list RSC refactor** — currently a Client Component with mock data

---

## Roadmap

### Phase 1 — Supabase Wiring (Next)
1. Fix `fetcher.ts` import path: `@/utils/supabase/client` → `@/lib/supabase/client`
2. Define all query keys in `lib/query/keys.ts`
3. Wire admin artikel page to live Supabase via `useQuery` + `useMutation`
4. Wire remaining admin pages (galeri, hero-slides, layanan, statistik)
5. Fix home page: change `"berita"` query to `"artikel"` table
6. Add Supabase Storage hostname to `next.config.ts` `remotePatterns`

### Phase 2 — Public Page Integration
1. Refactor public artikel list to RSC + live Supabase data
2. Build article detail page (`/artikel/[slug]`)
3. Build `/layanan` public page (live data from `layanan_publik`)
4. Build `/kontak` public page (static content or live from DB)

### Phase 3 — Polish & Deploy
1. SEO: add metadata, Open Graph tags to all public pages
2. Performance: verify no unnecessary client bundles on public pages
3. Deploy to Vercel, configure environment variables
4. Verify Supabase RLS policies are active
5. Handover and documentation for village staff

---

## Definition of Done

The project is considered complete when all of the following are true:

- [ ] Application is successfully deployed to Vercel and publicly accessible.
- [ ] All public pages (Beranda, Artikel, Layanan, Galeri, Kontak) load live data from Supabase without errors.
- [ ] Supabase RLS is active: `anon` can only `SELECT` published records; `authenticated` admin can perform full CRUD.
- [ ] Admin can log in, upload images, and publish articles **without technical assistance**.
