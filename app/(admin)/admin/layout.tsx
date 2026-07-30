"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FileText,
  Home,
  Image as ImageIcon,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  Sparkles,
  X,
  ExternalLink,
  Building2,
  Plus,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navSections = [
  {
    title: "Home",
    items: [
      {
        href: "/admin",
        label: "Dashboard",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        href: "/admin/statistik",
        label: "Profil Statistik",
        icon: BarChart3,
      },
      {
        href: "/admin/hero-slides",
        label: "Hero Slides",
        icon: Layers,
      },
      {
        href: "/admin/artikel",
        label: "Artikel",
        icon: FileText,
      },
    ],
  },
  {
    title: "Konten Publik",
    items: [
      {
        href: "/admin/layanan",
        label: "Layanan Publik",
        icon: Sparkles,
      },
      {
        href: "/admin/galeri",
        label: "Galeri Foto",
        icon: ImageIcon,
      },
    ],
  },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Find active label for breadcrumb
  let activeLabel = "Dashboard";
  navSections.forEach((sec) => {
    sec.items.forEach((item) => {
      if (isActive(item.href, item.exact)) {
        activeLabel = item.label;
      }
    });
  });

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans text-slate-900 antialiased">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between border-r border-slate-200 bg-white p-4 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          {/* Header Branding */}
          <div className="flex items-center justify-between px-2 pt-1">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-xs">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-tight text-slate-900">
                  Sukorejo CMS
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Perangkat Desa
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Grouped Sidebar Menu */}
          <nav className="space-y-6">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-1">
                <h4 className="px-2 text-[11px] font-semibold text-slate-400">
                  {section.title}
                </h4>
                {section.items.map((item) => {
                  const active = isActive(item.href, item.exact);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                        active
                          ? "bg-slate-100 font-semibold text-slate-900"
                          : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          active ? "text-slate-900" : "text-slate-400"
                        }`}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer User Profile */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-md border border-slate-200/80 bg-slate-50/50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            <span className="flex items-center gap-2">
              <Home className="h-3.5 w-3.5 text-slate-500" />
              Website Utama
            </span>
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </Link>

          <div className="flex items-center justify-between rounded-md p-1.5 hover:bg-slate-50 transition">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                NR
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-900 truncate">
                  Nina Rahma
                </span>
                <span className="text-[11px] text-slate-400 truncate">
                  admin@sukorejo.desa.id
                </span>
              </div>
            </div>
            <button
              type="button"
              title="Logout Sesi"
              className="rounded-md p-1 text-slate-400 hover:text-rose-600 transition"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>Kelurahan Sukorejo</span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-semibold text-slate-900">
                {activeLabel}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 bg-white border border-slate-200/70 shadow-sm rounded-3xl">
          {children}
        </main>
      </div>
    </div>
  );
}
