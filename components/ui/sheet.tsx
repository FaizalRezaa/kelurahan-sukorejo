"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SheetContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextValue | undefined>(undefined);

function useSheet() {
  const context = React.useContext(SheetContext);
  if (!context) {
    throw new Error("Sheet components must be used within a Sheet");
  }
  return context;
}

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  return <SheetContext.Provider value={{ open, onOpenChange }}>{children}</SheetContext.Provider>;
}

export function SheetTrigger({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const sheet = useSheet();
  return (
    <button type="button" onClick={() => sheet.onOpenChange(true)} className={cn("inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-50", className)} {...props} />
  );
}

export function SheetClose({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const sheet = useSheet();
  return (
    <button type="button" onClick={() => sheet.onOpenChange(false)} className={cn("inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-50", className)} {...props} />
  );
}

export function SheetContent({ className, children }: { className?: string; children: React.ReactNode }) {
  const sheet = useSheet();

  if (!sheet.open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex bg-slate-950/40 p-4">
      <button className="absolute inset-0" aria-label="Close navigation" onClick={() => sheet.onOpenChange(false)} />
      <aside className={cn("relative z-10 h-full w-full max-w-xs space-y-6 overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl", className)}>
        {children}
      </aside>
    </div>
  );
}
