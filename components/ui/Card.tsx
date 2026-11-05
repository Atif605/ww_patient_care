import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils/cn"

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm",
        className
      )}
      {...props}
    />
  )
}