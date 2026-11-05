import { createHash, randomBytes } from "node:crypto"
import { cache } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { and, eq, gt } from "drizzle-orm"
import { getDb, schema } from "@/lib/db"
import type { AdminRole } from "@/lib/db/schema"
import { can, type Permission } from "./permissions"

export const SESSION_COOKIE = "wwpc_admin"
const SESSION_HOURS = 8

export interface SessionUser {
  id: string
  email: string
  name: string
  role: AdminRole
}

const sha256 = (v: string) => createHash("sha256").update(v).digest("hex")

export async function createSession(userId: string): Promise<void> {
  const db = await getDb()
  const token = randomBytes(32).toString("base64url")
  const expiresAt = new Date(Date.now() + SESSION_HOURS * 3600 * 1000)
  await db.insert(schema.adminSessions).values({
    userId,
    tokenHash: sha256(token),
    expiresAt,
  })
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  })
}

export async function destroySession(): Promise<void> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (token) {
    const db = await getDb()
    await db
      .delete(schema.adminSessions)
      .where(eq(schema.adminSessions.tokenHash, sha256(token)))
  }
  store.delete(SESSION_COOKIE)
}

/** Validates the session against the DB on every call (de-duplicated per request). */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null
  const db = await getDb()
  const [row] = await db
    .select({
      id: schema.adminUsers.id,
      email: schema.adminUsers.email,
      name: schema.adminUsers.name,
      role: schema.adminUsers.role,
    })
    .from(schema.adminSessions)
    .innerJoin(schema.adminUsers, eq(schema.adminUsers.id, schema.adminSessions.userId))
    .where(
      and(
        eq(schema.adminSessions.tokenHash, sha256(token)),
        gt(schema.adminSessions.expiresAt, new Date()),
        eq(schema.adminUsers.active, true)
      )
    )
    .limit(1)
  return row ?? null
})

/** For pages: redirects to login when unauthenticated, 403-style redirect when unauthorised. */
export async function requireUser(permission?: Permission): Promise<SessionUser> {
  const user = await getCurrentUser()
  if (!user) redirect("/admin/login")
  if (permission && !can(user.role, permission)) redirect("/admin?denied=1")
  return user
}

/** For server actions: throws instead of redirecting, so no mutation runs unauthorised. */
export async function assertUser(permission: Permission): Promise<SessionUser> {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorised")
  if (!can(user.role, permission)) throw new Error("Forbidden")
  return user
}
