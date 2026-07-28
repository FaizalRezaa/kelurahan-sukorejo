import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

const variants: Record<string, string> = {
  default: "inline-flex items-center rounded-md border border-transparent bg-slate-900 px-2.5 py-0.5 text-xs font-semibold text-slate-50 shadow hover:bg-slate-900/80 transition-colors",
  secondary: "inline-flex items-center rounded-md border border-transparent bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-900 hover:bg-slate-100/80 transition-colors",
  outline: "inline-flex items-center rounded-md border border-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-950 transition-colors",
  success: "inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 transition-colors",
  warning: "inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 transition-colors",
  accent: "inline-flex items-center rounded-md border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-700 transition-colors",
  destructive: "inline-flex items-center rounded-md border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 transition-colors",
};

interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
  variant?: keyof typeof variants;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return <span className={cn(variants[variant] || variants.default, className)} {...props} />;
}
