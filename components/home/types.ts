export type ResourceItem = {
  title: string;
  description?: string;
  image: string;
  href: string;
};

export type BannerItem = {
  title: string;
  buttonText: string;
  image: string;
  href: string;
};

export type NewsItem = {
  id: string;
  date: string;
  category: "Berita" | "Kegiatan";
  title: string;
  summary: string;
  image: string;
  href: string;
};

export type GalleryItem = {
  id: string;
  image: string;
  alt: string;
  className: string;
  overlayText?: string;
  overlayHref?: string;
};

export type HeroSlide = {
  image: string;
  alt: string;
};

export type ProfileStatistic = {
  value: string;
  label: string;
};
