/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // Izin untuk gambar Hero
        protocol: "https",
        hostname: "kelurahan-sukorejo.supabase.co",
        port: "",
        pathname: "/**",
      },
      {
        // Izin untuk gambar Berita/News
        protocol: "https",
        hostname: "tovrugzsntmlpfjtxypr.supabase.co",
        port: "",
        pathname: "/**",
      },
      {
        // Izin untuk gambar placeholder
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "kjecnhwwzjsathisdwtb.supabase.co", // Mendaftarkan hostname Supabase milikmu
        pathname: "/storage/v1/object/public/**", // Mengizinkan akses spesifik ke folder storage public
      },
    ],
  },
};

export default nextConfig;
