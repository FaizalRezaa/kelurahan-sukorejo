import Link from "next/link";

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
            <span className="grid size-11 place-items-center rounded-full border border-[#e4c77d]/80 bg-[#e4c77d]/15 font-serif text-xl font-bold text-[#f6e2a9]">
              S
            </span>
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
            Jl. Sukorejo No. 1
            <br />
            Sukorejo, Kota Blitar
          </address>
          <a
            href="https://maps.google.com/?q=Kelurahan+Sukorejo"
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
              <dd>08.00 — 15.00</dd>
            </div>
            <div className="flex justify-between gap-5">
              <dt>Jumat</dt>
              <dd>08.00 — 14.30</dd>
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
              href="tel:+62342000000"
              className="block transition hover:text-[#f6e2a9]"
            >
              (0342) 000 000
            </a>
            <a
              href="mailto:kelurahan.sukorejo@blitar.go.id"
              className="block break-words transition hover:text-[#f6e2a9]"
            >
              kelurahan.sukorejo@blitar.go.id
            </a>
          </div>
          <a
            href="https://www.instagram.com/"
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
