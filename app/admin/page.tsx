import Link from "next/link"
import { count, desc, eq, inArray } from "drizzle-orm"
import { getDb, schema } from "@/lib/db"
import { requireUser } from "@/lib/auth/session"
import { Panel, Pill, LEAD_STATUS_LABELS, fmtDateTime } from "./_ui"

export const metadata = { title: "Overview" }

export default async function AdminOverview({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string }>
}) {
  await requireUser()
  const { denied } = await searchParams
  const db = await getDb()

  const n = async (q: Promise<{ c: number }[]>) => (await q)[0]?.c ?? 0
  const [total, fresh, followUps, converted, contacts, bookings, recent, audits] = await Promise.all([
    n(db.select({ c: count() }).from(schema.leads)),
    n(db.select({ c: count() }).from(schema.leads).where(eq(schema.leads.status, "new"))),
    n(db.select({ c: count() }).from(schema.leads).where(inArray(schema.leads.status, ["contacted", "follow_up"]))),
    n(db.select({ c: count() }).from(schema.leads).where(eq(schema.leads.status, "converted"))),
    n(db.select({ c: count() }).from(schema.contactMessages)),
    n(db.select({ c: count() }).from(schema.bookingRequests).where(eq(schema.bookingRequests.status, "requested"))),
    db.select().from(schema.leads).orderBy(desc(schema.leads.createdAt)).limit(8),
    db.select().from(schema.auditLogs).orderBy(desc(schema.auditLogs.createdAt)).limit(8),
  ])

  const stats = [
    ["Total leads", total],
    ["New leads", fresh],
    ["Pending follow-ups", followUps],
    ["Converted", converted],
    ["Contact messages", contacts],
    ["Open booking requests", bookings],
  ] as const

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Overview</h1>
      {denied && (
        <p role="alert" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          Your role does not have access to that section.
        </p>
      )}
      <dl className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-[var(--color-border)] bg-white p-4">
            <dt className="text-xs text-[var(--color-text-muted)]">{label}</dt>
            <dd className="mt-1 text-2xl font-bold">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Recent leads">
          {recent.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">No leads yet.</p>
          ) : (
            <ul className="divide-y divide-[var(--color-border)] text-sm">
              {recent.map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-3 py-2">
                  <Link className="font-medium text-[var(--color-primary)] underline" href={`/admin/leads/${l.id}`}>
                    {l.reference}
                  </Link>
                  <span className="truncate">{l.name}</span>
                  <Pill value={l.status} label={LEAD_STATUS_LABELS[l.status]} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Recent activity">
          {audits.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">No activity yet.</p>
          ) : (
            <ul className="divide-y divide-[var(--color-border)] text-sm">
              {audits.map((a) => (
                <li key={a.id} className="flex justify-between gap-3 py-2">
                  <span>{a.action}</span>
                  <span className="text-[var(--color-text-muted)]">{fmtDateTime(a.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  )
}
