import { and, desc, eq, gte, ilike, lt, or, type SQL } from "drizzle-orm"
import { getDb, schema } from "@/lib/db"
import { addDays, isValidIsoDate } from "@/lib/utils/date"

export interface LeadFilters {
  q?: string
  status?: string
  service?: string
  city?: string
  from?: string
  to?: string
}

const escapeLike = (s: string) => s.replace(/[\\%_]/g, (m) => `\\${m}`)

export async function queryLeads(f: LeadFilters, limit = 100) {
  const db = await getDb()
  const where: SQL[] = []
  if (f.q?.trim()) {
    const like = `%${escapeLike(f.q.trim())}%`
    where.push(
      or(
        ilike(schema.leads.name, like),
        ilike(schema.leads.phone, like),
        ilike(schema.leads.reference, like),
        ilike(schema.leads.email, like)
      ) as SQL
    )
  }
  if (f.status && (schema.leadStatusEnum.enumValues as readonly string[]).includes(f.status)) {
    where.push(eq(schema.leads.status, f.status as (typeof schema.leadStatusEnum.enumValues)[number]))
  }
  if (f.service) where.push(eq(schema.leads.serviceSlug, f.service))
  if (f.city) where.push(eq(schema.leads.citySlug, f.city))
  if (f.from && isValidIsoDate(f.from)) where.push(gte(schema.leads.createdAt, new Date(`${f.from}T00:00:00+05:00`)))
  if (f.to && isValidIsoDate(f.to)) {
    where.push(lt(schema.leads.createdAt, new Date(`${addDays(f.to, 1)}T00:00:00+05:00`)))
  }
  return db
    .select()
    .from(schema.leads)
    .where(where.length ? and(...where) : undefined)
    .orderBy(desc(schema.leads.createdAt))
    .limit(limit)
}
