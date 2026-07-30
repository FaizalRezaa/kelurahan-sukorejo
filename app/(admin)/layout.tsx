import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin Dashboard - Kelurahan Sukorejo",
  description: "Dashboard admin untuk mengelola konten Kelurahan Sukorejo",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (

      <div className="min-h-full bg-slate-50 text-slate-900">
        {children}
      </div>
    
  );
}
