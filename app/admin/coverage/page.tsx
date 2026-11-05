import { asc } from "drizzle-orm"
import { getDb, schema } from "@/lib/db"
import { requireUser } from "@/lib/auth/session"
import { services } from "@/data/services"
import { addArea, addCity, setCoverage, toggleActive } from "../actions"
import { Panel, btnCls, btnGhostCls, inputCls } from "../_ui"

export const metadata = { title: "Coverage" }

export default async function CoveragePage() {
  await requireUser("coverage")
  const db = await getDb()
  const [cities, areas, cov] = await Promise.all([
    db.select().from(schema.cities).orderBy(asc(schema.cities.name)),
    db.select().from(schema.areas).orderBy(asc(schema.areas.name)),
    db.select().from(schema.coverage),
  ])
  const covKey = new Map(cov.map((c) => [`${c.areaId}:${c.serviceSlug}`, c.status]))

  const ToggleForm = ({ kind, id, active }: { kind: "city" | "area"; id: string; active: boolean }) => (
    <form action={toggleActive}>
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="active" value={String(!active)} />
      <button className={btnGhostCls}>{active ? "Deactivate" : "Activate"}</button>
    </form>
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Coverage</h1>
      <p className="text-sm text-[var(--color-text-muted)]">
        The availability checker and Request Care form use ONLY what is configured here. A service in an area with
        no setting is reported to customers as <em>not covered</em>. Cities and areas start inactive.
      </p>

      <Panel title="Add a city">
        <form action={addCity} className="flex flex-wrap gap-2">
          <input name="name" required placeholder="City name (e.g. Karachi)" aria-label="City name" className={inputCls} />
          <input name="slug" required placeholder="slug (karachi)" aria-label="City slug" pattern="[a-z0-9]+(-[a-z0-9]+)*" className={inputCls} />
          <button className={btnCls}>Add city</button>
        </form>
      </Panel>

      {cities.length === 0 && <p className="text-sm">No cities yet.</p>}
      {cities.map((city) => (
        <Panel key={city.id}>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold">{city.name}</h2>
            <span className={`rounded-full px-2.5 py-0.5 text-xs ${city.active ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-800"}`}>
              {city.active ? "Active" : "Inactive"}
            </span>
            <ToggleForm kind="city" id={city.id} active={city.active} />
          </div>

          {areas.filter((a) => a.cityId === city.id).map((area) => (
            <div key={area.id} className="mb-4 rounded-lg border border-[var(--color-border)] p-3">
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <h3 className="font-medium">{area.name}</h3>
                <span className={`rounded-full px-2.5 py-0.5 text-xs ${area.active ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-800"}`}>
                  {area.active ? "Active" : "Inactive"}
                </span>
                <ToggleForm kind="area" id={area.id} active={area.active} />
              </div>
              <ul className="grid gap-2 sm:grid-cols-2">
                {services.map((s) => (
                  <li key={s.slug}>
                    <form action={setCoverage} className="flex items-center gap-2 text-sm">
                      <input type="hidden" name="areaId" value={area.id} />
                      <input type="hidden" name="serviceSlug" value={s.slug} />
                      <span className="flex-1 truncate">{s.title}</span>
                      <select name="status" defaultValue={covKey.get(`${area.id}:${s.slug}`) ?? "none"} aria-label={`${s.title} in ${area.name}`} className={inputCls}>
                        <option value="none">Not covered</option>
                        <option value="needs_confirmation">Needs confirmation</option>
                        <option value="available">Available</option>
                      </select>
                      <button className={btnGhostCls}>Set</button>
                    </form>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <form action={addArea} className="flex flex-wrap gap-2">
            <input type="hidden" name="cityId" value={city.id} />
            <input name="name" required placeholder="Area name (e.g. Clifton)" aria-label="Area name" className={inputCls} />
            <input name="slug" required placeholder="slug (clifton)" aria-label="Area slug" pattern="[a-z0-9]+(-[a-z0-9]+)*" className={inputCls} />
            <button className={btnCls}>Add area</button>
          </form>
        </Panel>
      ))}
    </div>
  )
}
