import Link from "next/link"
import { notFound } from "next/navigation"
import { asc, eq } from "drizzle-orm"
import { z } from "zod"
import { getDb, schema } from "@/lib/db"
import { requireUser } from "@/lib/auth/session"
import { services } from "@/data/services"
import { addLeadNote, updateLead } from "../../actions"
import {
  AVAILABILITY_LABELS,
  BOOKING_LABELS,
  LEAD_STATUS_LABELS,
  Panel,
  Pill,
  WINDOW_LABELS,
  btnCls,
  fmtDateTime,
  inputCls,
} from "../../_ui"

export const metadata = { title: "Lead" }

export default async function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireUser("leads")
  const { id } = await params
  if (!z.uuid().safeParse(id).success) notFound()
  const db = await getDb()
  const [lead] = await db.select().from(schema.leads).where(eq(schema.leads.id, id)).limit(1)
  if (!lead) notFound()

  const [notes, [booking], team] = await Promise.all([
    db
      .select({ body: schema.leadNotes.body, createdAt: schema.leadNotes.createdAt, author: schema.adminUsers.name })
      .from(schema.leadNotes)
      .leftJoin(schema.adminUsers, eq(schema.adminUsers.id, schema.leadNotes.authorId))
      .where(eq(schema.leadNotes.leadId, id))
      .orderBy(asc(schema.leadNotes.createdAt)),
    db.select().from(schema.bookingRequests).where(eq(schema.bookingRequests.leadId, id)).limit(1),
    db.select({ id: schema.adminUsers.id, name: schema.adminUsers.name }).from(schema.adminUsers).where(eq(schema.adminUsers.active, true)),
  ])
  const service = services.find((s) => s.slug === lead.serviceSlug)?.title ?? lead.serviceSlug

  const rows: [string, React.ReactNode][] = [
    ["Name", lead.name],
    ["Phone", <a key="p" className="text-[var(--color-primary)] underline" href={`tel:${lead.phone}`}>{lead.phone}</a>],
    ["Email", lead.email ? <a key="e" className="text-[var(--color-primary)] underline" href={`mailto:${lead.email}`}>{lead.email}</a> : "—"],
    ["Service", service],
    ["Location", `${lead.areaSlug}, ${lead.citySlug}`],
    ["Coverage at submission", <Pill key="a" value={lead.availability} label={AVAILABILITY_LABELS[lead.availability]} />],
    ["Care type", lead.frequency === "recurring" ? "Recurring" : "One-time"],
    ["Schedule", lead.schedule || "—"],
    ["Preferred start", lead.startDate ?? "—"],
    ["Callback time", WINDOW_LABELS[lead.callbackTime ?? "anytime"] ?? lead.callbackTime ?? "—"],
    ["Notes from customer", lead.notes || "—"],
    ["Marketing consent", lead.marketingConsent ? "Yes" : "No"],
    ["Language", lead.locale],
    ["Received", fmtDateTime(lead.createdAt)],
  ]

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/leads" className="text-sm text-[var(--color-primary)] underline">← All leads</Link>
        <h1 className="mt-1 text-2xl font-bold">{lead.reference}</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Request" className="lg:col-span-2">
          <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[200px_1fr]">
            {rows.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-[var(--color-text-muted)]">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <div className="space-y-6">
          <Panel title="Manage">
            <form action={updateLead} className="space-y-3">
              <input type="hidden" name="id" value={lead.id} />
              <label className="block text-sm">Status
                <select name="status" defaultValue={lead.status} className={`${inputCls} mt-1 w-full`}>
                  {Object.entries(LEAD_STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </label>
              <label className="block text-sm">Assigned to
                <select name="assignedTo" defaultValue={lead.assignedTo ?? ""} className={`${inputCls} mt-1 w-full`}>
                  <option value="">Unassigned</option>
                  {team.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </label>
              <button className={btnCls}>Save</button>
            </form>
          </Panel>

          {booking && (
            <Panel title="Booking request">
              <p className="text-sm">
                {booking.preferredDate} · {WINDOW_LABELS[booking.preferredWindow]}{" "}
                <Pill value={booking.status} label={BOOKING_LABELS[booking.status]} />
              </p>
              <Link href="/admin/bookings" className="mt-2 inline-block text-sm text-[var(--color-primary)] underline">Manage in Bookings</Link>
            </Panel>
          )}
        </div>
      </div>

      <Panel title="Internal notes">
        <ul className="mb-4 space-y-2 text-sm">
          {notes.length === 0 && <li className="text-[var(--color-text-muted)]">No notes yet.</li>}
          {notes.map((n, i) => (
            <li key={i} className="rounded-lg bg-[var(--color-bg-muted)] p-3">
              <p className="whitespace-pre-wrap">{n.body}</p>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">{n.author ?? "Unknown"} · {fmtDateTime(n.createdAt)}</p>
            </li>
          ))}
        </ul>
        <form action={addLeadNote} className="flex flex-col gap-2 sm:flex-row">
          <input type="hidden" name="id" value={lead.id} />
          <textarea name="body" required maxLength={2000} aria-label="New note" placeholder="Add an internal note (not visible to the customer)" className="min-h-20 flex-1 rounded-lg border border-[var(--color-border)] p-3 text-sm" />
          <button className={`${btnCls} self-start`}>Add note</button>
        </form>
      </Panel>
    </div>
  )
}
