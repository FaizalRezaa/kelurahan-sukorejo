import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  image?: string;
  size?: AvatarSize;
}

const sizes: Record<AvatarSize, string> = {
  sm: "h-10 w-10 text-sm",
  md: "h-12 w-12 text-base",
  lg: "h-16 w-16 text-lg",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0]?.toUpperCase())
    .filter(Boolean)
    .slice(0, 2)
    .join("");
}

export function Avatar({ name, image, size = "md", className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-800",
        sizes[size],
        className,
      )}
      {...props}
    >
      {image ? (
        <img alt={name} src={image} className="h-full w-full object-cover" />
      ) : (
        <span className="font-semibold">{initials(name)}</span>
      )}
    </div>
  );
}
