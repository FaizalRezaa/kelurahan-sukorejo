import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // 1. Siapkan response awal
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 2. Inisialisasi Supabase Server Client khusus untuk Middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. Ambil data sesi (session) pengguna saat ini
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 4. ATURAN PROTEKSI
  // Jika user mencoba mengakses area /admin tapi belum login -> lempar ke /login
  if (request.nextUrl.pathname.startsWith('/admin') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Jika user sudah login (punya sesi valid) tapi mencoba buka halaman login -> lempar ke /admin
  if (request.nextUrl.pathname.startsWith('/login') && user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
  }

  return supabaseResponse
}

// 5. Tentukan path mana saja yang akan dicegat oleh Middleware ini
export const config = {
  matcher: [
    /*
     * Mencegat semua request KECUALI file statis, gambar, dan aset Next.js
     * agar performa halaman publik tidak melambat.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}