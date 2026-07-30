# AGENTS.md — AI Coding Instructions

> This file is the authoritative guide for AI assistants working on this codebase.
> The codebase is the single source of truth. If documentation conflicts with code, trust the code.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 16** (App Router, TypeScript) — NOT the version you know |
| Language | TypeScript 5 (strict mode) |
| React | React 19 |
| Styling | Tailwind CSS **v4** (via `@tailwindcss/postcss`) |
| Icons | `lucide-react` |
| Rich-Text Editor | `react-quill-new` (dynamic import, SSR disabled) |
| Data Fetching (Client) | TanStack Query v5 (`@tanstack/react-query`) |
| Validation | Zod **v4** (`zod ^4.4.3`) |
| Backend / Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth via `@supabase/ssr` |
| Storage | Supabase Storage (S3-compatible) |
| Deployment | Vercel |

> **Read `node_modules/next/dist/docs/` before using any Next.js API.**
> Next.js 16 + React 19 have breaking changes. Never assume API shapes from training data.

---

## Architecture Rules

### Rendering Strategy

- **Public pages** (`app/(public)/**`) → **React Server Components (RSC)** by default.
  - Fetch data directly with `await createClient()` from `lib/supabase/server.ts`.
  - Do **not** add `"use client"` unless interactivity is strictly required.
- **Admin pages** (`app/(admin)/**`) → Client Components (`"use client"`) with TanStack Query.
  - All admin pages currently use mock data from `components/admin/mock-data.ts`.
  - Wire them to `lib/query/fetcher.ts` when integrating with Supabase.
- **Admin layout** is `"use client"` (needed for `usePathname` and sidebar state).

### Supabase Client Rules

| Context | Import |
|---|---|
| Server Components, Server Actions, Middleware | `@/lib/supabase/server` → `await createClient()` |
| Client Components | `@/lib/supabase/client` → `createClient()` |

- Never import the server client in a `"use client"` file.
- Never import the browser client in RSC or Server Actions.
- Import path is always `@/lib/supabase/...` — NOT `@/utils/supabase/...`.

### Admin CRUD Data Flow

```
Client Component Form
  → Zod validation (client-side, lib/query/schema.ts)
  → lib/query/fetcher.ts function
  → Upload to Supabase Storage (if file present)
  → Insert/Update Supabase DB
  → Invalidate TanStack Query cache
```

### Public Read Data Flow

```
Server Component (RSC)
  → await createClient()  [lib/supabase/server.ts]
  → Supabase query
  → Render HTML (zero client JS for data fetching)
```

---

## Folder Conventions

```
app/
  (public)/            # Public-facing pages (RSC by default)
    page.tsx            # Beranda / Home
    artikel/[slug]/     # Article list + detail pages
    galeri/             # Gallery page
    layanan/            # Services page (directory exists, page not yet built)
    kontak/             # Contact page (directory exists, page not yet built)
    layout.tsx          # Wraps Navbar + Footer
  (admin)/             # Admin CMS (all Client Components)
    admin/
      page.tsx           # Dashboard overview
      artikel/           # Article CRUD
      galeri/            # Gallery CRUD
      hero-slides/       # Hero slide CRUD
      layanan/           # Service CRUD
      statistik/         # Statistics CRUD
      pengaturan/        # Admin user management
      layout.tsx         # Sidebar + topbar layout
    login/

components/
  home/                # Components for public/home pages only
    data.ts             # Static mock data (replace with Supabase when ready)
    types.ts            # TypeScript types for home components
  artikel/             # Components for article pages
    data.ts             # Static mock data (replace with Supabase when ready)
    types.ts
  admin/               # Shared admin-only components
    mock-data.ts        # Temporary mock data for all admin modules
    image-upload-field.tsx
    quill-editor.tsx
    page-ui.tsx
  ui/                  # Generic primitive UI components (no domain logic)

lib/
  supabase/
    server.ts           # createClient() for Server context
    client.ts           # createClient() for Browser context
    storage.ts          # Storage helpers (stub — implement here)
  query/
    schema.ts           # Zod schemas + inferred TypeScript types (single source of truth)
    fetcher.ts          # Pure async CRUD functions (used inside TanStack Query hooks)
    keys.ts             # TanStack Query key factory (currently empty)

middleware.ts           # Route guard: /admin/* requires valid auth session
```

---

## Coding Standards

- **TypeScript**: No `any`. Use types inferred from Zod schemas via `z.infer<typeof Schema>`.
- **Indentation**: 2 spaces. No trailing whitespace.
- **Imports**: Use `@/` alias. Group order: external → `@/lib` → `@/components` → relative.
- **Comments**: Preserve all existing comments. Add new comments only for non-obvious logic.
- **Components**: Named exports + arrow functions. Exception: page/layout files use `export default function`.
- **No barrel index files** in `lib/` — import directly from the specific file.

---

## Naming Conventions

| Entity | Convention | Example |
|---|---|---|
| React components | PascalCase | `NewsCard`, `ImageUploadField` |
| Files | kebab-case | `image-upload-field.tsx`, `quill-editor.tsx` |
| Hooks | `use` prefix | `useArtikelList` |
| Zod schemas | `PascalCase + Schema` | `ArtikelSchema`, `GaleriInsertSchema` |
| Inferred TS types | PascalCase | `Artikel`, `GaleriInsert`, `HeroSlide` |
| Fetcher functions | `verb + Entity` | `fetchArtikelList`, `insertGaleri`, `deleteHeroSlide` |
| DB table names | `snake_case` | `artikel`, `profil_statistik`, `hero_slides` |
| Storage buckets | `kebab-case` | `artikel-images`, `galeri-images` |
| URL slugs | `kebab-case` | `program-posyandu-2025` |

---

## Validation Conventions

All Zod schemas are in `lib/query/schema.ts`. Never define entity types elsewhere.

**Standard schema set per entity:**

| Schema | Purpose |
|---|---|
| `EntitySchema` | Full DB row shape |
| `EntityInsertSchema` | Omits `id`, `created_at`, `updated_at` |
| `EntityUpdateSchema` | Partial, `id` required |
| `EntityFormSchema` | Insert-based with nullable/optional adjustments for forms |

- Use **Zod v4 API only**. Check docs — v4 has breaking changes from v3.
- Validate on the client before calling any fetcher function.

---

## Data Fetching Conventions

- **Admin** → `lib/query/fetcher.ts` functions inside TanStack Query hooks.
  - Fetchers are pure async — no state, hooks, or side effects inside them.
  - Define query keys in `lib/query/keys.ts`.
- **Public RSC pages** → direct Supabase query via server client. Do not use fetcher.ts.
- **Article sorting**: Always use `tanggal_terbit DESC` — never `created_at`.
- **Public article filter**: Always include `.eq("status", "terbit")` on public queries.
- **Storage URLs**: Use `getPublicUrl(bucket, path)` from `lib/query/fetcher.ts`.

---

## Reusability Guidelines

- **`components/ui/`** — stateless, generic primitives. No domain logic. No Supabase calls.
- **`components/admin/`** — `ImageUploadField` and `QuillEditor` are shared across all admin CRUD forms.
- **`components/home/`** and **`components/artikel/`** — presentational only. Pass data as props from the page.
- Never duplicate Zod-inferred types. Always import from `lib/query/schema.ts`.

---

## Things AI Must NOT Do

- Do not add `"use client"` to pages that can stay as Server Components.
- Do not import `lib/supabase/server` inside a Client Component.
- Do not import `lib/supabase/client` inside an RSC or Server Action.
- Do not use `@/utils/supabase/...` — the path is `@/lib/supabase/...`.
- Do not query the `"berita"` table — it does not exist. The table is `"artikel"`.
- Do not sort article queries by `created_at` — use `tanggal_terbit`.
- Do not define TypeScript types that duplicate Zod-inferred types from `schema.ts`.
- Do not install new dependencies without explicit user approval.
- Do not use Tailwind CSS v3 syntax (e.g., `@apply`, arbitrary `jit:` values) — this is v4.
- Do not use `next/image` for Supabase Storage images unless the hostname is added to `next.config.ts` `remotePatterns`.
- Do not hardcode Supabase storage base URLs — use `getPublicUrl()`.
- Do not invent features not present in the codebase or clearly planned.
- Do not add multi-role authentication beyond the single `role = 'admin'`.
- Do not create public INSERT routes or complaint/pengaduan forms — out of scope.
