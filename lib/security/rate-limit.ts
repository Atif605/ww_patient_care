import { createHmac } from "node:crypto"
import { eq, sql } from "drizzle-orm"
import { getDb, schema } from "@/lib/db"

function secret(): string {
  const s = process.env.AUTH_SECRET
  if (s && s.length >= 32) return s
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET (min 32 chars) must be set in production")
  }
  return "dev-only-insecure-secret-do-not-use-in-production"
}

export function hmac(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex")
}

/** Client IP from proxy headers. Raw IPs are never stored — only an HMAC. */
export function clientKey(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  const ip = fwd || headers.get("x-real-ip") || "unknown"
  return hmac(ip).slice(0, 32)
}

/**
 * Fixed-window limiter backed by the database (works across server instances).
 * Returns true when the request is ALLOWED.
 */
export async function rateLimit(
  bucket: string,
  key: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> {
  const db = await getDb()
  const id = `${bucket}:${key}`
  const interval = sql.raw(`interval '${Math.floor(windowSeconds)} seconds'`)
  const [row] = await db
    .insert(schema.rateLimits)
    .values({ key: id, count: 1 })
    .onConflictDoUpdate({
      target: schema.rateLimits.key,
      set: {
        count: sql`CASE WHEN ${schema.rateLimits.windowStart} < now() - ${interval} THEN 1 ELSE ${schema.rateLimits.count} + 1 END`,
        windowStart: sql`CASE WHEN ${schema.rateLimits.windowStart} < now() - ${interval} THEN now() ELSE ${schema.rateLimits.windowStart} END`,
      },
    })
    .returning({ count: schema.rateLimits.count })
  return row.count <= limit
}

/** Forget a bucket (e.g. after a successful login, so only failures accumulate). */
export async function clearRateLimit(bucket: string, key: string): Promise<void> {
  const db = await getDb()
  await db.delete(schema.rateLimits).where(eq(schema.rateLimits.key, `${bucket}:${key}`))
}
