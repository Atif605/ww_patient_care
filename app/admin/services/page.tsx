import { getDb, schema } from "@/lib/db"
import { requireUser } from "@/lib/auth/session"
import { services } from "@/data/services"
import { saveService } from "../actions"
import { Panel, btnCls } from "../_ui"

export const metadata = { title: "Services" }

export default async function ServicesAdminPage() {
  await requireUser("services")
  const db = await getDb()
  const settings = new Map((await db.select().from(schema.serviceSettings)).map((s) => [s.slug, s]))

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Services</h1>
      <p className="text-sm text-[var(--color-text-muted)]">
        Only services you activate appear in the Request Care form and availability checker.
        Every service starts <strong>inactive</strong> — activate only what the business has confirmed it provides.
        Service wording lives in <code>data/services.ts</code>.
      </p>
      <Panel>
        <ul className="divide-y divide-[var(--color-border)]">
          {services.map((s) => {
            const st = settings.get(s.slug)
            const incomplete = JSON.stringify(s).includes("[PLACEHOLDER")
            return (
              <li key={s.slug}>
                <form action={saveService} className="flex flex-wrap items-center gap-4 py-3 text-sm">
                  <input type="hidden" name="slug" value={s.slug} />
                  <span className="min-w-48 flex-1 font-medium">{s.title}{incomplete && <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-900">Content incomplete — cannot activate</span>}</span>
                  <label className="flex items-center gap-2"><input type="checkbox" name="active" defaultChecked={st?.active ?? false} /> Active</label>
                  <label className="flex items-center gap-2"><input type="checkbox" name="showPricing" defaultChecked={st?.showPricing ?? false} /> Show pricing</label>
                  <button className={btnCls}>Save</button>
                </form>
              </li>
            )
          })}
        </ul>
      </Panel>
    </div>
  )
}
