"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isTransparent, setIsTransparent] = useState(isHomePage);
  const lastScrollY = useRef(0);

  // Efek untuk menyembunyikan/menampilkan navbar saat scroll
  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY.current;

      if (currentScrollY <= 50) {
        setIsVisible(true);
      } else {
        setIsVisible(!scrollingDown);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Efek untuk mengatur transparansi berdasarkan halaman dan hero section
  useEffect(() => {
    // 1. Jika BUKAN di halaman home, paksa navbar menjadi solid (tidak transparan)
    if (!isHomePage) {
      setIsTransparent(false);
      return;
    }

    // 2. Jika di halaman home, kembalikan state awal ke transparan
    setIsTransparent(true);

    const heroSection = document.getElementById("hero");
    if (!heroSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsTransparent(entry.isIntersecting);
      },
      { rootMargin: "-1px 0px 0px 0px", threshold: 0.1 },
    );

    observer.observe(heroSection);
    return () => observer.disconnect();
  }, [isHomePage]); // Dependensi ini memastikan efek berjalan setiap rute berubah

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Layanan", href: "/#layanan" },
    { name: "Artikel", href: "/artikel" },
    { name: "Galeri", href: "/galeri" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b py-6 md:py-8 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${
        isTransparent
          ? "bg-transparent border-transparent"
          : "bg-white/95 border-zinc-200/80 shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 flex items-center justify-between">
        {/* DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-base font-semibold transition-colors ${
                isTransparent
                  ? "text-white hover:text-gray-200"
                  : "text-zinc-600 hover:text-[#2d5e45]"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* DESKTOP ACTION BUTTON */}
        <div className="hidden lg:block z-50">
          <Link
            href="https://api.whatsapp.com/send/?phone=6281326326295&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-full px-8 py-3.5 text-base font-bold shadow-md transition-all active:scale-95 ${
              isTransparent
                ? "bg-white/10 text-white hover:bg-white/20"
                : "bg-[#2d5e45] text-white hover:bg-[#1e402f] hover:shadow-lg"
            }`}
          >
            Hubungi Kami
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`lg:hidden p-2 -mr-2 rounded-lg transition-colors z-50 focus:outline-none ${
            isTransparent && !isOpen
              ? "text-white hover:bg-white/20"
              : "text-zinc-900 hover:bg-zinc-200/60"
          }`}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      <div
        className={`absolute top-0 left-0 w-full h-screen bg-[#f4f1ea] pt-28 px-6 transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <nav className="flex flex-col space-y-6 text-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-bold text-zinc-800 hover:text-[#2d5e45] transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-8">
            <Link
              href="https://api.whatsapp.com/send/?phone=6281326326295&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="inline-block w-full max-w-sm mx-auto rounded-full bg-[#2d5e45] px-6 py-4 text-lg font-bold text-white shadow-md hover:bg-[#1e402f] transition-all"
            >
              Hubungi Kami
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
