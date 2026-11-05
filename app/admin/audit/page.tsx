import { desc, eq } from "drizzle-orm"
import { getDb, schema } from "@/lib/db"
import { requireUser } from "@/lib/auth/session"
import { fmtDateTime } from "../_ui"

export const metadata = { title: "Audit log" }

export default async function AuditPage() {
  await requireUser("audit")
  const db = await getDb()
  const rows = await db
    .select({ a: schema.auditLogs, who: schema.adminUsers.email })
    .from(schema.auditLogs)
    .leftJoin(schema.adminUsers, eq(schema.adminUsers.id, schema.auditLogs.userId))
    .orderBy(desc(schema.auditLogs.createdAt))
    .limit(200)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Audit log</h1>
      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--color-bg-muted)] text-xs uppercase text-[var(--color-text-muted)]">
            <tr>{["When", "User", "Action", "Entity", "Detail"].map((h) => <th key={h} scope="col" className="px-3 py-2">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {rows.map(({ a, who }) => (
              <tr key={a.id}>
                <td className="px-3 py-2 whitespace-nowrap">{fmtDateTime(a.createdAt)}</td>
                <td className="px-3 py-2">{who ?? "—"}</td>
                <td className="px-3 py-2">{a.action}</td>
                <td className="px-3 py-2">{a.entity} {a.entityId}</td>
                <td className="px-3 py-2 font-mono text-xs">{a.detail ? JSON.stringify(a.detail) : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
