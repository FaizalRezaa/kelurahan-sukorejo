import Image from "next/image";
import { ProfileStatistic } from "./types";

type ProfileSectionProps = {
  profileStatistics: ProfileStatistic[];
};

export function ProfileSection({ profileStatistics }: ProfileSectionProps) {
  return (
    <section
      aria-labelledby="profil-kelurahan"
      className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 sm:px-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center md:gap-14 lg:px-10"
    >
      <div className="relative aspect-[5/4] overflow-hidden rounded-sm bg-[#d5e0d7] shadow-sm md:aspect-[4/5]">
        <Image
          src="/foto-profil.jpeg"
          alt="Warga berkumpul dalam kegiatan lingkungan"
          fill
          sizes="(max-width: 768px) 100vw, 42vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#174331]/20" />
      </div>

      <div className="max-w-2xl">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#2d5e45]/25 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#2d5e45]">
          Profil Kelurahan
        </p>
        <h2
          id="profil-kelurahan"
          className="text-3xl font-semibold leading-tight tracking-tight text-[#173b2d] sm:text-4xl"
        >
          Tumbuh bersama, melayani dengan sepenuh hati.
        </h2>
        <p className="mt-5 text-base leading-relaxed text-zinc-600 sm:text-lg">
          Kelurahan Sukorejo adalah ruang hidup bagi masyarakat yang menjunjung
          tinggi semangat gotong royong. Kami berkomitmen menghadirkan layanan
          publik yang mudah dijangkau serta mendukung lingkungan yang aman,
          sehat, dan produktif.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500 sm:text-base">
          Bersama warga, kami terus mengembangkan potensi wilayah untuk masa
          depan Sukorejo yang lebih baik.
        </p>

        <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-[#2d5e45]/15 pt-6 sm:gap-6 sm:pt-7">
          {profileStatistics.map((statistic) => (
            <div key={statistic.label}>
              <dt className="order-2 mt-1 text-[10px] font-medium leading-snug text-zinc-500 sm:text-xs">
                {statistic.label}
              </dt>
              <dd className="order-1 text-2xl font-semibold tracking-tight text-[#173b2d] sm:text-3xl">
                {statistic.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
