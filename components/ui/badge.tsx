import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-slate-100 text-slate-700",
        secondary: "border-slate-200 bg-white text-slate-600",
        blue: "border-blue-100 bg-blue-50 text-blue-700",
        green: "border-emerald-100 bg-emerald-50 text-emerald-700",
        amber: "border-amber-100 bg-amber-50 text-amber-700",
        red: "border-red-100 bg-red-50 text-red-600",
        // solid category chips (match v1)
        labor: "border-transparent bg-blue-600 text-white",
        supply: "border-transparent bg-amber-400 text-amber-950",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
