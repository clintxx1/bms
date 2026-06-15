import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as Philippine Peso, e.g. 225000 -> "₱225,000.00" */
export function peso(value: number, opts?: { decimals?: boolean }) {
  const decimals = opts?.decimals ?? true;
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  }).format(value);
}

/** Compact peso for tight spaces, e.g. 4775440 -> "₱4.78M" */
export function pesoCompact(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export function pct(value: number) {
  return `${value.toFixed(2)}%`;
}
