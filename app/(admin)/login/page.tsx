import { loginAction } from './actions'

// Di Next.js 15, searchParams bersifat asynchronous (Promise)
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  // Tunggu Promise searchParams selesai
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg border border-gray-200">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Portal Admin
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelurahan Sukorejo
          </p>
        </div>

        {/* Notifikasi Error jika login gagal */}
        {params.error && (
          <div className="mb-6 rounded-md bg-red-50 p-3 border border-red-200 text-sm text-red-600">
            {params.error}
          </div>
        )}

        {/* Form memanggil loginAction saat tombol submit ditekan */}
        <form action={loginAction} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="admin@sukorejo.desa.id"
              className="block w-full rounded-md border border-gray-300 p-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500 outline-none transition-colors"
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
              placeholder="••••••••"
              className="block w-full rounded-md border border-gray-300 p-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500 outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 rounded-md bg-blue-600 px-4 py-2.5 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Masuk ke Dasbor
          </button>
        </form>

      </div>
    </div>
  )
}