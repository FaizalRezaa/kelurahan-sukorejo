"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { HeroSlide } from "./types";

type HeroProps = {
  heroSlides: HeroSlide[];
};

export function Hero({ heroSlides }: HeroProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  // Interval untuk mengganti gambar slider latar belakang
  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5500);

    return () => window.clearInterval(interval);
  }, [heroSlides.length]);

  return (
    <section
      id="hero"
      aria-label="Sambutan Kelurahan Sukorejo"
      className="relative isolate min-h-[660px] overflow-hidden bg-[#102d22] text-white sm:min-h-[720px]"
    >
      {/* Background Slider */}
      {heroSlides.map((item, index) => (
        <Image
          key={item.alt}
          src={item.image}
          alt={item.alt ?? "Hero image"}
          fill
          priority={index === 0}
          sizes="100vw"
          className={`absolute inset-0 -z-30 object-cover transition-opacity duration-[1800ms] ease-in-out ${
            index === activeSlide
              ? "scale-100 opacity-100"
              : "scale-105 opacity-0"
          }`}
        />
      ))}

      {/* Overlays */}
      <div className="absolute inset-0 -z-20 bg-[#071a13]/45" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#061a12]/70 via-[#0c3122]/25 to-[#061a12]/80" />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto mt-12 flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col items-center justify-center px-5 py-16 text-center sm:px-8">
        <div className="relative h-40 w-40 flex-shrink-0 overflow-hidden rounded-3xl sm:h-48 sm:w-48 md:h-56 md:w-56">
          <Image
            src="/logo-pemkab-blitar.png"
            alt="Logo Pemerintah Kabupaten Blitar"
            fill
            className="object-contain"
            sizes="(max-width: 640px) 10rem, (max-width: 768px) 12rem, 14rem"
            priority
          />
        </div>

        <div className="mt-8 flex max-w-2xl flex-col items-center text-white">
          <p className="text-xs uppercase tracking-[0.35em] text-[#e4c77d] sm:text-sm">
            Pemerintah Kabupaten Blitar
          </p>
          <h1 className="mt-3 text-5xl font-semibold uppercase tracking-[0.06em] text-white sm:text-6xl md:text-7xl">
            Kelurahan Sukorejo
          </h1>
        </div>
      </div>
    </section>
  );
}
