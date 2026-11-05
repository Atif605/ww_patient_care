import Link from "next/link"
import { asc, desc, eq } from "drizzle-orm"
import { getDb, schema } from "@/lib/db"
import { requireUser } from "@/lib/auth/session"
import { updateBooking } from "../actions"
import { BOOKING_LABELS, Panel, Pill, WINDOW_LABELS, btnCls, btnGhostCls, inputCls } from "../_ui"

export const metadata = { title: "Bookings" }

export default async function BookingsPage() {
  await requireUser("bookings")
  const db = await getDb()
  const rows = await db
    .select({
      b: schema.bookingRequests,
      reference: schema.leads.reference,
      name: schema.leads.name,
      phone: schema.leads.phone,
      leadId: schema.leads.id,
    })
    .from(schema.bookingRequests)
    .innerJoin(schema.leads, eq(schema.leads.id, schema.bookingRequests.leadId))
    .orderBy(asc(schema.bookingRequests.status), desc(schema.bookingRequests.createdAt))

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Booking requests</h1>
      <p className="text-sm text-[var(--color-text-muted)]">
        These are customer <strong>requests</strong>. Nothing is confirmed until you confirm it here.
      </p>
      {rows.length === 0 && <Panel><p className="text-sm text-[var(--color-text-muted)]">No booking requests yet.</p></Panel>}
      {rows.map(({ b, reference, name, phone, leadId }) => (
        <Panel key={b.id}>
          <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
            <Link className="font-semibold text-[var(--color-primary)] underline" href={`/admin/leads/${leadId}`}>{reference}</Link>
            <span>{name}</span>
            <a className="underline" href={`tel:${phone}`}>{phone}</a>
            <Pill value={b.status} label={BOOKING_LABELS[b.status]} />
            <span className="ml-auto">Requested: <strong>{b.preferredDate}</strong> · {WINDOW_LABELS[b.preferredWindow]}</span>
          </div>
          {b.proposedDate && (
            <p className="mb-2 text-sm">Proposed: {b.proposedDate} · {b.proposedWindow && WINDOW_LABELS[b.proposedWindow]}</p>
          )}
          {b.adminNote && <p className="mb-2 text-sm text-[var(--color-text-muted)]">Note: {b.adminNote}</p>}
          <form action={updateBooking} className="grid gap-2 sm:grid-cols-[1fr_auto_auto] lg:grid-cols-[1fr_160px_160px_auto]">
            <input type="hidden" name="id" value={b.id} />
            <input name="adminNote" placeholder="Note (included in customer email)" aria-label="Note" className={inputCls} />
            <input type="date" name="proposedDate" aria-label="Proposed date" className={inputCls} />
            <select name="proposedWindow" aria-label="Proposed window" className={inputCls} defaultValue="">
              <option value="">Window…</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
            </select>
            <div className="flex flex-wrap gap-2 sm:col-span-3 lg:col-span-1">
              <button name="decision" value="confirm" className={btnCls}>Confirm</button>
              <button name="decision" value="propose" className={btnGhostCls}>Propose time</button>
              <button name="decision" value="reject" className={btnGhostCls}>Reject</button>
              <button name="decision" value="cancel" className={btnGhostCls}>Cancel</button>
            </div>
          </form>
        </Panel>
      ))}
    </div>
  )
}
