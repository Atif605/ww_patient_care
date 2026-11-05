import { NextResponse } from "next/server"
import { badRequest, serverError } from "@/lib/api"
import { checkAvailability, getActiveServices, getPublicCoverage } from "@/lib/coverage"
import { clientKey, rateLimit } from "@/lib/security/rate-limit"
import { availabilityQuerySchema } from "@/lib/validation/schemas"

export const dynamic = "force-dynamic"

/** GET /api/availability            → active services + coverage tree (for form dropdowns)
 *  GET /api/availability?citySlug&areaSlug&serviceSlug → availability result */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    if (!url.searchParams.has("serviceSlug")) {
      const [services, coverage] = await Promise.all([
        getActiveServices(),
        getPublicCoverage(),
      ])
      return NextResponse.json({
        ok: true,
        services: services.map((s) => ({ slug: s.slug, title: s.title })),
        cities: coverage.cities,
      })
    }

    const allowed = await rateLimit("avail", clientKey(request.headers), 60, 60)
    if (!allowed) return badRequest("Too many requests", 429)

    const parsed = availabilityQuerySchema.safeParse(Object.fromEntries(url.searchParams))
    if (!parsed.success) return badRequest("Invalid query", 422)
    const { citySlug, areaSlug, serviceSlug } = parsed.data
    const availability = await checkAvailability(citySlug, areaSlug, serviceSlug)
    return NextResponse.json({ ok: true, availability })
  } catch (error) {
    return serverError(error)
  }
}
