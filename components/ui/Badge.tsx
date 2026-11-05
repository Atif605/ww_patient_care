import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils/cn"

type BadgeVariant = "primary" | "accent" | "success" | "warning" | "danger" | "neutral"
type BadgeSize = "sm" | "md" | "lg"

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  primary: "bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
  accent: "bg-[var(--color-accent-soft)] text-[var(--color-accent)]",
  success: "bg-green-100 text-green-800",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-800",
  neutral: "bg-[var(--color-bg-muted)] text-[var(--color-text-muted)]",
}

const SIZE_STYLES: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
}

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
  size?: BadgeSize
}

export function Badge({
  className,
  variant = "primary",
  size = "sm",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full font-semibold max-w-full truncate",
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        className
      )}
      {...props}
    />
  )
}