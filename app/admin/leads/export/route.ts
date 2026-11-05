import { NextResponse } from "next/server"
import { audit } from "@/lib/audit"
import { can } from "@/lib/auth/permissions"
import { getCurrentUser } from "@/lib/auth/session"
import { queryLeads } from "@/lib/admin/leads-query"

export const dynamic = "force-dynamic"

/** Neutralise spreadsheet formula injection and quote CSV fields. */
function csv(value: unknown): string {
  let s = value == null ? "" : String(value)
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`
  return `"${s.replace(/"/g, '""')}"`
}

export async function GET(request: Request) {
  const user = await getCurrentUser()
  if (!user) return new NextResponse("Unauthorized", { status: 401 })
  if (!can(user.role, "leads")) return new NextResponse("Forbidden", { status: 403 })

  const params = Object.fromEntries(new URL(request.url).searchParams)
  const rows = await queryLeads(params, 5000)
  const header = ["reference", "received", "name", "phone", "email", "service", "city", "area", "coverage", "frequency", "status"]
  const lines = [header.join(",")]
  for (const l of rows) {
    lines.push(
      [l.reference, l.createdAt.toISOString(), l.name, l.phone, l.email, l.serviceSlug, l.citySlug, l.areaSlug, l.availability, l.frequency, l.status]
        .map(csv)
        .join(",")
    )
  }
  await audit(user.id, "leads.export", "lead", undefined, { rows: rows.length })
  return new NextResponse(lines.join("\n"), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="leads.csv"',
      "cache-control": "no-store",
    },
  })
}
