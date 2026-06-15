import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0..100+
  size?: "sm" | "md";
  /**
   * "budget"     → spend health: <75 green, 75–99 amber, ≥100 red (over budget).
   * "completion" → fulfilment: ≥100 green (done), >0 blue (in progress), 0 muted.
   */
  variant?: "budget" | "completion";
}

export function Progress({
  value,
  size = "md",
  variant = "budget",
  className,
  ...props
}: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));

  const color =
    variant === "completion"
      ? value >= 100
        ? "bg-emerald-500"
        : "bg-blue-500"
      : value >= 100
        ? "bg-red-500"
        : value >= 75
          ? "bg-amber-400"
          : "bg-emerald-500";

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-full bg-slate-100",
        size === "sm" ? "h-1.5" : "h-2",
        className,
      )}
      {...props}
    >
      <div
        className={cn("h-full origin-left rounded-full animate-grow-x", color)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
