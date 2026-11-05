import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind class names safely.
 *
 * - `clsx` handles conditional class names (strings, objects, arrays, falsy values).
 * - `twMerge` resolves conflicting Tailwind classes so the last one wins.
 *
 * Example:
 *   cn("px-4 py-2", condition && "px-6")  // → "py-2 px-6"
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}