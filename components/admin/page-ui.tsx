"use client";

import { type ReactNode } from "react";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface AdminPageHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
  badgeText?: string;
}

export function AdminPageHeader({ title, description, action, badgeText }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-slate-500">{badgeText ?? "Panel Admin"}</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-950">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
}

export function StatCard({ label, value, icon, description }: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
            {description ? <p className="mt-2 text-sm text-slate-600">{description}</p> : null}
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-3xl bg-slate-100 text-slate-700">{icon}</div>
        </div>
      </CardHeader>
    </Card>
  );
}

interface AdminTabItem {
  id: string;
  label: string;
  count?: number;
}

interface AdminTabsProps {
  tabs: AdminTabItem[];
  value: string;
  onChange: (value: string) => void;
}

export function AdminTabs({ tabs, value, onChange }: AdminTabsProps) {
  return (
    <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 text-sm font-semibold text-slate-700 shadow-sm">
      {tabs.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`rounded-full px-4 py-2 transition ${
              active
                ? "bg-slate-950 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            {tab.label}
            {typeof tab.count === "number" ? ` (${tab.count})` : ""}
          </button>
        );
      })}
    </div>
  );
}

interface DataTableProps {
  title: string;
  description?: string;
  columns: string[];
  toolbar?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

export function DataTable({ title, description, columns, toolbar, footer, children }: DataTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
          {toolbar ? <div className="flex flex-wrap items-center gap-2">{toolbar}</div> : null}
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto px-0 pb-0">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>{children}</TableBody>
        </Table>
      </CardContent>
      {footer ? <div className="border-t border-slate-200 bg-slate-50 px-4 py-3">{footer}</div> : null}
    </Card>
  );
}

interface PaginationProps {
  page: number;
  pageCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (value: number) => void;
}

export function AdminTablePagination({ page, pageCount, pageSize, onPageChange, onPageSizeChange }: PaginationProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-slate-600">Page {page} of {pageCount}</div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
        <span>Rows per page:</span>
        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition hover:border-slate-300"
        >
          {[5, 10, 20].map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        <div className="inline-flex items-center gap-2">
          <Button variant="outline" type="button" onClick={() => onPageChange(Math.max(1, page - 1))}>
            Prev
          </Button>
          <Button variant="outline" type="button" onClick={() => onPageChange(Math.min(pageCount, page + 1))}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export function TableActionMenu({ children }: { children: ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Aksi baris" className="inline-flex rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
        <MoreVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>{children}</DropdownMenuContent>
    </DropdownMenu>
  );
}
