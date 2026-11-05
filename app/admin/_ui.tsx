import type { ReactNode } from "react"

export const LEAD_STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  follow_up: "Follow-up",
  assessment_scheduled: "Assessment Scheduled",
  converted: "Converted",
  not_converted: "Not Converted",
  closed: "Closed",
}

export const BOOKING_LABELS: Record<string, string> = {
  requested: "Requested",
  confirmed: "Confirmed",
  rejected: "Rejected",
  reschedule_proposed: "New time proposed",
  cancelled: "Cancelled",
}

export const MESSAGE_LABELS: Record<string, string> = {
  new: "New",
  read: "Read",
  replied: "Replied",
  closed: "Closed",
}

export const AVAILABILITY_LABELS: Record<string, string> = {
  available: "Available",
  needs_confirmation: "Needs confirmation",
  not_covered: "Not covered",
}

export const WINDOW_LABELS: Record<string, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  anytime: "Anytime",
}

const TONE: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  requested: "bg-blue-100 text-blue-800",
  available: "bg-green-100 text-green-800",
  confirmed: "bg-green-100 text-green-800",
  converted: "bg-green-100 text-green-800",
  needs_confirmation: "bg-amber-100 text-amber-800",
  follow_up: "bg-amber-100 text-amber-800",
  reschedule_proposed: "bg-amber-100 text-amber-800",
  not_covered: "bg-red-100 text-red-800",
  rejected: "bg-red-100 text-red-800",
  not_converted: "bg-gray-200 text-gray-800",
}

export function Pill({ value, label }: { value: string; label: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
        TONE[value] ?? "bg-gray-100 text-gray-800"
      }`}
    >
      {label}
    </span>
  )
}

export function Panel({
  title,
  children,
  className = "",
}: {
  title?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`rounded-xl border border-[var(--color-border)] bg-white p-5 ${className}`}>
      {title && <h2 className="mb-3 text-base font-semibold">{title}</h2>}
      {children}
    </section>
  )
}

export const inputCls =
  "h-10 rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
export const btnCls =
  "inline-flex h-10 items-center justify-center rounded-lg bg-[var(--color-primary)] px-4 text-sm font-medium text-white hover:bg-[var(--color-primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
export const btnGhostCls =
  "inline-flex h-10 items-center justify-center rounded-lg border border-[var(--color-border)] bg-white px-4 text-sm font-medium hover:bg-[var(--color-bg-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"

export const fmtDateTime = (d: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Karachi",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d)
