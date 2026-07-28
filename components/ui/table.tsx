import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function Table(props: ComponentPropsWithoutRef<"table">) {
  return <table className={cn("min-w-full border-collapse text-left text-sm", props.className)} {...props} />;
}

export function TableHeader({ className, ...props }: ComponentPropsWithoutRef<"thead">) {
  return <thead className={cn("border-b border-slate-200 bg-slate-50", className)} {...props} />;
}

export function TableBody({ className, ...props }: ComponentPropsWithoutRef<"tbody">) {
  return <tbody className={cn(className)} {...props} />;
}

export function TableRow({ className, ...props }: ComponentPropsWithoutRef<"tr">) {
  return <tr className={cn("odd:bg-white even:bg-slate-50", className)} {...props} />;
}

export function TableHead({ className, ...props }: ComponentPropsWithoutRef<"th">) {
  return <th className={cn("px-4 py-3 text-left font-semibold text-slate-700", className)} {...props} />;
}

export function TableCell({ className, ...props }: ComponentPropsWithoutRef<"td">) {
  return <td className={cn("px-4 py-4 align-top text-slate-700", className)} {...props} />;
}
