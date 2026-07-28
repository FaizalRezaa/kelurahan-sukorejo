"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function DropdownMenu({ className, ...props }: HTMLAttributes<HTMLDetailsElement>) {
  return <details className={cn("relative inline-block", className)} {...props} />;
}

export function DropdownMenuTrigger({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <summary
      className={cn(
        "inline-flex h-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownMenuContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "absolute right-0 z-50 mt-2 min-w-[180px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownMenuItem({ className, ...props }: HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50",
        className,
      )}
      {...props}
    />
  );
}
