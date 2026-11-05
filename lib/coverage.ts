import { connection } from "next/server"
import { and, asc, eq } from "drizzle-orm"
import { getDb, schema } from "@/lib/db"
import { services } from "@/data/services"
import type { Availability } from "@/lib/db/schema"

/* ─── Public reads (only ACTIVE records) ─────────────────── */

export async function getActiveServiceSlugs(): Promise<Set<string>> {
  const db = await getDb()
  const rows = await db
    .select({ slug: schema.serviceSettings.slug })
    .from(schema.serviceSettings)
    .where(eq(schema.serviceSettings.active, true))
  const known = new Set(services.map((s) => s.slug))
  return new Set(rows.map((r) => r.slug).filter((s) => known.has(s)))
}

export async function getActiveServices() {
  const active = await getActiveServiceSlugs()
  return services.filter((s) => active.has(s.slug))
}

export interface PublicCoverage {
  cities: {
    slug: string
    name: string
    areas: { slug: string; name: string; serviceSlugs: string[] }[]
  }[]
}

/** Active cities → active areas → services offered there (per coverage rows). */
export async function getPublicCoverage(): Promise<PublicCoverage> {
  const db = await getDb()
  const active = await getActiveServiceSlugs()
  const rows = await db
    .select({
      citySlug: schema.cities.slug,
      cityName: schema.cities.name,
      areaSlug: schema.areas.slug,
      areaName: schema.areas.name,
      serviceSlug: schema.coverage.serviceSlug,
    })
    .from(schema.cities)
    .innerJoin(schema.areas, eq(schema.areas.cityId, schema.cities.id))
    .leftJoin(schema.coverage, eq(schema.coverage.areaId, schema.areas.id))
    .where(and(eq(schema.cities.active, true), eq(schema.areas.active, true)))
    .orderBy(asc(schema.cities.name), asc(schema.areas.name))

  const cityMap = new Map<string, PublicCoverage["cities"][number]>()
  for (const r of rows) {
    let city = cityMap.get(r.citySlug)
    if (!city) {
      city = { slug: r.citySlug, name: r.cityName, areas: [] }
      cityMap.set(r.citySlug, city)
    }
    let area = city.areas.find((a) => a.slug === r.areaSlug)
    if (!area) {
      area = { slug: r.areaSlug, name: r.areaName, serviceSlugs: [] }
      city.areas.push(area)
    }
    if (r.serviceSlug && active.has(r.serviceSlug)) area.serviceSlugs.push(r.serviceSlug)
  }
  return { cities: [...cityMap.values()] }
}

/**
 * Availability is derived ONLY from configured coverage rows.
 * No matching active row ⇒ "not_covered". Never optimistic.
 */
export async function checkAvailability(
  citySlug: string,
  areaSlug: string,
  serviceSlug: string
): Promise<Availability> {
  const db = await getDb()
  const active = await getActiveServiceSlugs()
  if (!active.has(serviceSlug)) return "not_covered"

  const [row] = await db
    .select({ status: schema.coverage.status })
    .from(schema.coverage)
    .innerJoin(schema.areas, eq(schema.areas.id, schema.coverage.areaId))
    .innerJoin(schema.cities, eq(schema.cities.id, schema.areas.cityId))
    .where(
      and(
        eq(schema.cities.slug, citySlug),
        eq(schema.cities.active, true),
        eq(schema.areas.slug, areaSlug),
        eq(schema.areas.active, true),
        eq(schema.coverage.serviceSlug, serviceSlug)
      )
    )
    .limit(1)
  return row?.status ?? "not_covered"
}

/**
 * For public pages: opts the page into request-time rendering (so admin changes
 * show immediately) and degrades to "no active services" if the database is
 * unreachable, instead of breaking the whole page.
 */
export async function getActiveServicesSafe() {
  await connection()
  try {
    return await getActiveServices()
  } catch (e) {
    console.error("[coverage] could not load active services", e)
    return []
  }
}
