import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

type Accent = "slate" | "blue" | "green" | "amber" | "red";

const accentMap: Record<Accent, { icon: string; value: string }> = {
  slate: { icon: "bg-slate-100 text-slate-600", value: "text-slate-900" },
  blue: { icon: "bg-blue-50 text-blue-600", value: "text-slate-900" },
  green: { icon: "bg-emerald-50 text-emerald-600", value: "text-emerald-600" },
  amber: { icon: "bg-amber-50 text-amber-600", value: "text-amber-600" },
  red: { icon: "bg-red-50 text-red-600", value: "text-red-600" },
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "slate",
  children,
  className,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  accent?: Accent;
  children?: React.ReactNode;
  className?: string;
}) {
  const a = accentMap[accent];
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>
        {Icon && (
          <span className={cn("grid h-8 w-8 place-items-center rounded-lg", a.icon)}>
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>
      <p className={cn("mt-2 text-[22px] font-bold leading-tight tracking-tight", a.value)}>
        {value}
      </p>
      {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
      {children && <div className="mt-3">{children}</div>}
    </Card>
  );
}
