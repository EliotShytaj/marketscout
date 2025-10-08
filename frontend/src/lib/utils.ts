import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number | null | undefined, decimals = 2): string {
  if (num === null || num === undefined) return "N/A";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatCurrency(num: number | null | undefined): string {
  if (num === null || num === undefined) return "N/A";
  return "$" + formatNumber(num, 2);
}

export function formatPercent(num: number | null | undefined): string {
  if (num === null || num === undefined) return "N/A";
  return formatNumber(num, 2) + "%";
}

export function formatMarketCap(num: number | null | undefined): string {
  if (num === null || num === undefined) return "N/A";
  
  if (num >= 1_000_000) {
    return "$" + formatNumber(num / 1_000_000, 2) + "T";
  } else if (num >= 1_000) {
    return "$" + formatNumber(num / 1_000, 2) + "B";
  } else {
    return "$" + formatNumber(num, 2) + "M";
  }
}
