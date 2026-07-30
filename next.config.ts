import type { NextConfig } from "next";

// Ekstrak hostname dari NEXT_PUBLIC_SUPABASE_URL, misal:
// "https://xyzabc.supabase.co" → "xyzabc.supabase.co"
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseHostname = supabaseUrl
  ? new URL(supabaseUrl).hostname
  : "*.supabase.co"; // placeholder saat env belum diisi

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        // Supabase Storage — hostname diambil dari env agar fleksibel per-project
        protocol: "https",
        hostname: supabaseHostname,
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
