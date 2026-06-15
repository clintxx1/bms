import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm text-slate-500">
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-1">
            {item.href && !last ? (
              <Link
                href={item.href}
                className="rounded-md px-1.5 py-0.5 font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  "px-1.5 py-0.5",
                  last ? "font-semibold text-slate-900" : "text-slate-500",
                )}
              >
                {item.label}
              </span>
            )}
            {!last && <ChevronRight className="h-3.5 w-3.5 text-slate-300" />}
          </span>
        );
      })}
    </nav>
  );
}
