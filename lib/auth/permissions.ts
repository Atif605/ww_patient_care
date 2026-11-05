import type { AdminRole } from "@/lib/db/schema"

export type Permission =
  | "leads"
  | "bookings"
  | "messages"
  | "coverage"
  | "services"
  | "audit"
  | "users"

const MATRIX: Record<AdminRole, readonly Permission[]> = {
  super_admin: ["leads", "bookings", "messages", "coverage", "services", "audit", "users"],
  admin: ["leads", "bookings", "messages", "coverage", "services", "audit"],
  staff: ["leads", "bookings", "messages"],
  content: [],
}

export const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  staff: "Staff / Lead Manager",
  content: "Content Manager",
}

export function can(role: AdminRole, permission: Permission): boolean {
  return MATRIX[role].includes(permission)
}
