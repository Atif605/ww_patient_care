"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

type NavLinkProps = {
  href: string
  children: ReactNode
}

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname()

  // Exact match for "/" else prefix match
  const isActive =
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`inline-flex items-center rounded-md px-2 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
        isActive
          ? "font-semibold text-[var(--color-primary)]"
          : "font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-muted)]"
      }`}
    >
      {children}
    </Link>
  )
}