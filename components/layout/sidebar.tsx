"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  LayoutDashboard,
  FolderKanban,
  UserRound,
  Users2,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { org } from "@/lib/data";

type NavItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  match?: string[];
};

const overview: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  {
    label: "Project",
    icon: FolderKanban,
    href: "/",
    match: ["/", "/contract", "/supply-tracking"],
  },
  { label: "Profile", icon: UserRound },
];

const admin: NavItem[] = [
  { label: "User Management", icon: Users2, href: "/user-management" },
];

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const Icon = item.icon;
  const active =
    !!item.href &&
    (item.match
      ? item.match.includes(pathname)
      : pathname === item.href);

  const base =
    "group flex items-center gap-3 rounded-lg px-3 py-2 text-[15px] font-medium transition-colors";

  if (!item.href) {
    return (
      <span
        className={cn(
          base,
          "cursor-not-allowed text-slate-400 select-none",
        )}
        title="Available in the full app"
      >
        <Icon className="h-[18px] w-[18px] text-slate-300" />
        {item.label}
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        base,
        active
          ? "bg-blue-50 text-blue-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
      )}
    >
      <Icon
        className={cn(
          "h-[18px] w-[18px]",
          active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600",
        )}
      />
      {item.label}
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 pb-1 pt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
      {children}
    </p>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary shadow-sm shadow-blue-600/30">
          <BarChart3 className="h-6 w-6 text-white" strokeWidth={2.4} />
        </div>
        <div className="leading-tight">
          <p className="text-lg font-bold tracking-tight text-slate-900">
            {org.name}
          </p>
          <p className="text-xs text-slate-500">{org.tagline}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3">
        <SectionLabel>Overview</SectionLabel>
        <div className="space-y-1">
          {overview.map((item) => (
            <NavLink key={item.label} item={item} pathname={pathname} />
          ))}
        </div>

        <SectionLabel>Admin</SectionLabel>
        <div className="space-y-1">
          {admin.map((item) => (
            <NavLink key={item.label} item={item} pathname={pathname} />
          ))}
        </div>
      </nav>

      {/* User card */}
      <div className="p-3">
        <button className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5 text-left transition-colors hover:bg-slate-50">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-xs font-bold text-white">
            {org.user.initials}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-slate-900">
              {org.user.name}
            </span>
            <span className="block truncate text-xs text-slate-500">
              {org.user.email}
            </span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-slate-400" />
        </button>
      </div>
    </aside>
  );
}
