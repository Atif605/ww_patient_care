import Link from "next/link"
import { requireUser } from "@/lib/auth/session"
import { queryLeads, type LeadFilters } from "@/lib/admin/leads-query"
import { services } from "@/data/services"
import {
  AVAILABILITY_LABELS,
  LEAD_STATUS_LABELS,
  Pill,
  btnCls,
  btnGhostCls,
  fmtDateTime,
  inputCls,
} from "../_ui"

export const metadata = { title: "Leads" }

type Search = Record<keyof LeadFilters, string | undefined>

export default async function LeadsPage({ searchParams }: { searchParams: Promise<Search> }) {
  await requireUser("leads")
  const f = await searchParams
  const leads = await queryLeads(f)
  const serviceTitle = (slug: string) => services.find((s) => s.slug === slug)?.title ?? slug
  const exportQs = new URLSearchParams(
    Object.entries(f).filter(([, v]) => v) as [string, string][]
  ).toString()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leads</h1>
        <a className={btnGhostCls} href={`/admin/leads/export?${exportQs}`}>
          Export CSV
        </a>
      </div>

      <form className="grid gap-3 rounded-xl border border-[var(--color-border)] bg-white p-4 sm:grid-cols-2 lg:grid-cols-4" role="search">
        <input name="q" defaultValue={f.q} placeholder="Name, phone, reference" aria-label="Search" className={inputCls} />
        <select name="status" defaultValue={f.status ?? ""} aria-label="Status" className={inputCls}>
          <option value="">All statuses</option>
          {Object.entries(LEAD_STATUS_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <select name="service" defaultValue={f.service ?? ""} aria-label="Service" className={inputCls}>
          <option value="">All services</option>
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>{s.title}</option>
          ))}
        </select>
        <input name="city" defaultValue={f.city} placeholder="City slug" aria-label="City" className={inputCls} />
        <label className="flex items-center gap-2 text-sm">
          From <input type="date" name="from" defaultValue={f.from} className={inputCls} />
        </label>
        <label className="flex items-center gap-2 text-sm">
          To <input type="date" name="to" defaultValue={f.to} className={inputCls} />
        </label>
        <div className="flex gap-2">
          <button className={btnCls}>Filter</button>
          <Link href="/admin/leads" className={btnGhostCls}>Reset</Link>
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--color-bg-muted)] text-xs uppercase text-[var(--color-text-muted)]">
            <tr>
              {["Reference", "Received", "Name", "Phone", "Service", "Area", "Coverage", "Status"].map((h) => (
                <th key={h} scope="col" className="px-3 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {leads.length === 0 && (
              <tr><td colSpan={8} className="px-3 py-6 text-center text-[var(--color-text-muted)]">No leads match.</td></tr>
            )}
            {leads.map((l) => (
              <tr key={l.id}>
                <td className="px-3 py-2">
                  <Link className="font-medium text-[var(--color-primary)] underline" href={`/admin/leads/${l.id}`}>{l.reference}</Link>
                </td>
                <td className="px-3 py-2">{fmtDateTime(l.createdAt)}</td>
                <td className="px-3 py-2">{l.name}</td>
                <td className="px-3 py-2">{l.phone}</td>
                <td className="px-3 py-2">{serviceTitle(l.serviceSlug)}</td>
                <td className="px-3 py-2">{l.areaSlug}, {l.citySlug}</td>
                <td className="px-3 py-2"><Pill value={l.availability} label={AVAILABILITY_LABELS[l.availability]} /></td>
                <td className="px-3 py-2"><Pill value={l.status} label={LEAD_STATUS_LABELS[l.status]} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-[var(--color-text-muted)]">Showing up to 100 most recent matches.</p>
    </div>
  )
}
