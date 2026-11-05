import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils/cn"

export function Section({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn("py-12 md:py-20 lg:py-24", className)}
      {...props}
    />
  )
}