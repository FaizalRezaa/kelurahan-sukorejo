'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  // 1. Ambil data dari input form
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 2. Inisialisasi Supabase Server
  const supabase = await createClient()

  // 3. Proses autentikasi ke Supabase
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // 4. Tangani balikan (response)
  if (error) {
    // Jika gagal, arahkan kembali ke halaman login dengan parameter error
    return redirect('/login?error=Kredensial tidak valid atau akun tidak ditemukan')
  }

  // Jika berhasil, arahkan ke dasbor admin
  return redirect('/admin')
}