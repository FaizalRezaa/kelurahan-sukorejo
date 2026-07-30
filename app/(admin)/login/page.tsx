'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const supabase = createClient()

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(
        authError.message === 'Invalid login credentials'
          ? 'Email atau password salah. Silakan coba lagi.'
          : authError.message
      )
      setIsLoading(false)
      return
    }

    // Login berhasil — refresh agar middleware mendeteksi session baru
    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg border border-gray-200">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Portal Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Kelurahan Sukorejo</p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-md bg-red-50 p-3 border border-red-200 text-sm text-red-600"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@sukorejo.desa.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="block w-full rounded-md border border-gray-300 p-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500 outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="block w-full rounded-md border border-gray-300 p-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500 outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 rounded-md bg-blue-600 px-4 py-2.5 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Memproses...' : 'Masuk ke Dasbor'}
          </button>
        </form>

      </div>
    </div>
  )
}
