"use client";

import { Share2 } from "lucide-react";

type ShareButtonProps = {
  title: string;
};

export function ShareButton({ title }: ShareButtonProps) {
  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title, url: window.location.href });
    } else if (typeof navigator !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-zinc-200 bg-white text-zinc-600 hover:border-[#2d5e45] hover:text-[#2d5e45] transition-all text-xs font-semibold"
      aria-label="Bagikan artikel"
    >
      <Share2 className="w-3.5 h-3.5" />
      Bagikan
    </button>
  );
}
