import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variants: Record<string, string> = {
  default:
    "inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-xs font-medium text-slate-50 shadow transition-colors hover:bg-slate-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50",
  secondary:
    "inline-flex items-center justify-center rounded-md bg-slate-100 px-4 py-2 text-xs font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-100/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50",
  outline:
    "inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50",
  ghost:
    "inline-flex items-center justify-center rounded-md px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  destructive:
    "inline-flex items-center justify-center rounded-md bg-rose-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-rose-600/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-950 disabled:pointer-events-none disabled:opacity-50",
};

const sizes: Record<string, string> = {
  default: "h-9 px-4 py-2",
  sm: "h-8 rounded-md px-3 text-xs",
  lg: "h-10 rounded-md px-8 text-sm",
  icon: "h-8 w-8 rounded-md p-0",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export function Button({ className, variant = "default", size = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(variants[variant] || variants.default, sizes[size] || sizes.default, className)}
      {...props}
    />
  );
}
