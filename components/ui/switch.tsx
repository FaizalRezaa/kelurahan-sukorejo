"use client";

import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function Switch({ checked, onCheckedChange, className, ...props }: SwitchProps) {
  return (
    <label className={cn("relative inline-flex cursor-pointer items-center", className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onCheckedChange(event.target.checked)}
        className="peer sr-only"
        {...props}
      />
      <span className="inline-block h-6 w-11 rounded-full bg-slate-200 transition peer-checked:bg-emerald-500" />
      <span className="pointer-events-none absolute left-1 top-1 inline-block h-4 w-4 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5" />
    </label>
  );
}
