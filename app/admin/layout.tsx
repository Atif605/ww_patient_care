import type { Metadata } from "next"
import Link from "next/link"
import { getCurrentUser } from "@/lib/auth/session"
import { can, ROLE_LABELS, type Permission } from "@/lib/auth/permissions"
import { logout } from "./actions"
import { btnGhostCls } from "./_ui"

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
}

const NAV: { href: string; label: string; perm?: Permission }[] = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/leads", label: "Leads", perm: "leads" },
  { href: "/admin/bookings", label: "Bookings", perm: "bookings" },
  { href: "/admin/messages", label: "Messages", perm: "messages" },
  { href: "/admin/coverage", label: "Coverage", perm: "coverage" },
  { href: "/admin/services", label: "Services", perm: "services" },
  { href: "/admin/audit", label: "Audit log", perm: "audit" },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  return (
    <div className="min-h-screen bg-[var(--color-bg-muted)]">
      {user && (
        <header className="border-b border-[var(--color-border)] bg-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
            <span className="font-semibold text-[var(--color-primary)]">Admin</span>
            <nav aria-label="Admin" className="flex flex-wrap gap-1 text-sm">
              {NAV.filter((n) => !n.perm || can(user.role, n.perm)).map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="rounded-md px-3 py-2 hover:bg-[var(--color-bg-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-3 text-sm">
              <span className="text-[var(--color-text-muted)]">
                {user.name} · {ROLE_LABELS[user.role]}
              </span>
              <form action={logout}>
                <button className={btnGhostCls}>Sign out</button>
              </form>
            </div>
          </div>
        </header>
      )}
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  )
}
