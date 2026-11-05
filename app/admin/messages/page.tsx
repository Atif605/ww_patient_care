import { desc } from "drizzle-orm"
import { getDb, schema } from "@/lib/db"
import { requireUser } from "@/lib/auth/session"
import { updateMessage } from "../actions"
import { MESSAGE_LABELS, Panel, Pill, btnCls, fmtDateTime, inputCls } from "../_ui"

export const metadata = { title: "Messages" }

export default async function MessagesPage() {
  await requireUser("messages")
  const db = await getDb()
  const rows = await db.select().from(schema.contactMessages).orderBy(desc(schema.contactMessages.createdAt)).limit(100)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Contact messages</h1>
      {rows.length === 0 && <Panel><p className="text-sm text-[var(--color-text-muted)]">No messages yet.</p></Panel>}
      {rows.map((m) => (
        <Panel key={m.id}>
          <div className="mb-2 flex flex-wrap items-center gap-3 text-sm">
            <strong>{m.reference}</strong>
            <Pill value={m.status} label={MESSAGE_LABELS[m.status]} />
            <span className="ml-auto text-[var(--color-text-muted)]">{fmtDateTime(m.createdAt)}</span>
          </div>
          <p className="text-sm font-medium">{m.subject}</p>
          {/* React escapes text content — message bodies are never rendered as HTML. */}
          <p className="my-2 whitespace-pre-wrap rounded-lg bg-[var(--color-bg-muted)] p-3 text-sm">{m.message}</p>
          <p className="mb-3 text-sm">
            {m.name} · <a className="underline" href={`tel:${m.phone}`}>{m.phone}</a>
            {m.email && <> · <a className="underline" href={`mailto:${m.email}`}>{m.email}</a></>}
          </p>
          <form action={updateMessage} className="flex flex-col gap-2 sm:flex-row">
            <input type="hidden" name="id" value={m.id} />
            <select name="status" defaultValue={m.status} aria-label="Status" className={inputCls}>
              {Object.entries(MESSAGE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <input name="internalNote" defaultValue={m.internalNote ?? ""} placeholder="Internal note" aria-label="Internal note" maxLength={2000} className={`${inputCls} flex-1`} />
            <button className={btnCls}>Save</button>
          </form>
        </Panel>
      ))}
    </div>
  )
}
