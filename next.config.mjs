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
      }
    ],
  },
};

export default nextConfig;