import Link from "next/link";
import Image from "next/image";

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-5 fill-none stroke-current stroke-[1.8]"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer
      className="bg-[#173b2d] text-white"
      aria-label="Informasi Kelurahan Sukorejo"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 md:gap-x-16 lg:grid-cols-[1.25fr_1fr_1fr_0.8fr] lg:px-10">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-3"
            aria-label="Kelurahan Sukorejo, beranda"
          >
            <Image
              src="/logo-pemkab-blitar.png"
              alt="Logo Pemkab Blitar"
              width={44}
              height={44}
              className="object-contain"
            />
            <span className="text-xs font-bold leading-tight tracking-[0.16em]">
              KELURAHAN<span className="block text-white/65">SUKOREJO</span>
            </span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">
            Melayani dengan sepenuh hati untuk Sukorejo yang nyaman, rukun, dan
            bertumbuh bersama.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold tracking-wide text-[#f6e2a9]">
            Lokasi
          </h2>
          <address className="mt-4 not-italic text-sm leading-relaxed text-white/75">
            Kantor Kelurahan Sukorejo
            <br />
            Jl. Kelud No.72, Sukorejo
            <br />
            Kec. Sutojayan, Kabupaten Blitar
            <br />
            Jawa Timur 66172
          </address>
          <a
            href="https://www.google.com/maps/place/Jl.+Kelud+No.72,+Sukorejo,+Kec.+Sutojayan,+Kabupaten+Blitar,+Jawa+Timur+66172/@-8.172598,112.2311344,1319m/data=!3m2!1e3!4b1!4m6!3m5!1s0x2e78eb81dee80f93:0x4646158486f83d6d!8m2!3d-8.1726033!4d112.2337093!16s%2Fg%2F11w1h_jtqc?entry=tts&g_ep=EgoyMDI2MDcyNy4wIPu8ASoASAFQAw%3D%3D&skid=27fce479-4e7c-4112-b759-035ef8456caf"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex text-sm font-semibold text-[#e4c77d] transition hover:text-[#f6e2a9]"
          >
            Lihat di peta
            <span aria-hidden="true" className="ml-1">
              ↗
            </span>
          </a>
        </div>

        <div>
          <h2 className="text-sm font-bold tracking-wide text-[#f6e2a9]">
            Jam Pelayanan
          </h2>
          <dl className="mt-4 space-y-3 text-sm text-white/75">
            <div className="flex justify-between gap-5">
              <dt>Senin — Kamis</dt>
              <dd>07.30 — 15.30</dd>
            </div>
            <div className="flex justify-between gap-5">
              <dt>Jumat</dt>
              <dd>07.30 — 16.00</dd>
            </div>
            <div className="border-t border-white/15 pt-3">
              <dt className="text-white/55">
                Sabtu — Minggu & hari libur: tutup
              </dt>
            </div>
          </dl>
        </div>

        <div>
          <h2 className="text-sm font-bold tracking-wide text-[#f6e2a9]">
            Hubungi Kami
          </h2>
          <div className="mt-4 space-y-3 text-sm text-white/75">
            <a
              href="https://api.whatsapp.com/send/?phone=6281326326295&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="block transition hover:text-[#f6e2a9]"
            >
              +62 813-2632-6295
            </a>
            <a
              href="mailto:kelurahan.sukorejo.blitarkab@gmail.com"
              className="block break-words transition hover:text-[#f6e2a9]"
            >
              kelurahan.sukorejo.blitarkab@gmail.com
            </a>
          </div>
          <a
            href="https://www.instagram.com/kelsukorejo.sutojayan"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram Kelurahan Sukorejo"
            className="mt-5 inline-flex size-10 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-[#e4c77d] hover:bg-[#e4c77d] hover:text-[#173b2d]"
          >
            <InstagramIcon />
          </a>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <p>© 2026 Kelurahan Sukorejo. Seluruh hak cipta dilindungi.</p>
          <p>Portal informasi dan pelayanan warga.</p>
        </div>
      </div>
    </footer>
  );
}
