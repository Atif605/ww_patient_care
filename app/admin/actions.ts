"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { getDb, schema } from "@/lib/db"
import { audit } from "@/lib/audit"
import { verifyPassword } from "@/lib/auth/password"
import { assertUser, createSession, destroySession, getCurrentUser } from "@/lib/auth/session"
import { clearRateLimit, clientKey, rateLimit } from "@/lib/security/rate-limit"
import { renderEmail, sendEmail } from "@/lib/email"
import { addDays, isValidIsoDate, todayInTimezone } from "@/lib/utils/date"
import { siteConfig } from "@/config/site"
import { services } from "@/data/services"

export interface ActionState {
  error?: string
  ok?: string
}

/* ─── Authentication ─────────────────────────────────── */

const loginSchema = z.object({
  email: z.email().max(200),
  password: z.string().min(1).max(200),
})

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const h = await headers()
  const ipKey = clientKey(h)
  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
  })
  if (!parsed.success) return { error: "Enter your email and password." }
  const { email, password } = parsed.data

  // Brute-force protection: per IP and per account.
  const ipOk = await rateLimit("login-ip", ipKey, 10, 15 * 60)
  const acctOk = await rateLimit("login-acct", email, 5, 15 * 60)
  if (!ipOk || !acctOk) return { error: "Too many attempts. Try again in 15 minutes." }

  const db = await getDb()
  const [user] = await db
    .select()
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.email, email))
    .limit(1)

  const valid = await verifyPassword(password, user?.passwordHash)
  if (!user || !valid || !user.active) {
    await audit(user?.id ?? null, "login.failed", "admin_user", email)
    return { error: "Invalid email or password." }
  }

  await createSession(user.id)
  // Only failures should count toward the lockout.
  await Promise.all([clearRateLimit("login-ip", ipKey), clearRateLimit("login-acct", email)])
  await db
    .update(schema.adminUsers)
    .set({ lastLoginAt: new Date() })
    .where(eq(schema.adminUsers.id, user.id))
  await audit(user.id, "login.success", "admin_user", user.id)
  redirect("/admin")
}

export async function logout(): Promise<void> {
  const user = await getCurrentUser()
  await destroySession()
  if (user) await audit(user.id, "logout", "admin_user", user.id)
  redirect("/admin/login")
}

/* ─── Leads ──────────────────────────────────────────── */

const leadUpdateSchema = z.object({
  id: z.uuid(),
  status: z.enum(schema.leadStatusEnum.enumValues),
  assignedTo: z.union([z.uuid(), z.literal("")]),
})

export async function updateLead(formData: FormData): Promise<void> {
  const user = await assertUser("leads")
  const input = leadUpdateSchema.parse(Object.fromEntries(formData))
  const db = await getDb()
  await db
    .update(schema.leads)
    .set({ status: input.status, assignedTo: input.assignedTo || null })
    .where(eq(schema.leads.id, input.id))
  await audit(user.id, "lead.update", "lead", input.id, {
    status: input.status,
    assignedTo: input.assignedTo || null,
  })
  revalidatePath("/admin", "layout")
}

const noteSchema = z.object({ id: z.uuid(), body: z.string().trim().min(1).max(2000) })

export async function addLeadNote(formData: FormData): Promise<void> {
  const user = await assertUser("leads")
  const input = noteSchema.parse(Object.fromEntries(formData))
  const db = await getDb()
  await db.insert(schema.leadNotes).values({
    leadId: input.id,
    authorId: user.id,
    body: input.body,
  })
  await audit(user.id, "lead.note_added", "lead", input.id)
  revalidatePath(`/admin/leads/${input.id}`)
}

/* ─── Bookings (requests, never auto-confirmed) ──────── */

const bookingSchema = z.object({
  id: z.uuid(),
  decision: z.enum(["confirm", "reject", "propose", "cancel"]),
  proposedDate: z.string().optional(),
  proposedWindow: z.enum(schema.timeWindowEnum.enumValues).optional(),
  adminNote: z.string().trim().max(1000).optional(),
})

export async function updateBooking(formData: FormData): Promise<void> {
  const user = await assertUser("bookings")
  const raw = Object.fromEntries(formData)
  const input = bookingSchema.parse({
    ...raw,
    proposedWindow: raw.proposedWindow || undefined,
    proposedDate: raw.proposedDate || undefined,
  })
  const db = await getDb()

  if (input.decision === "propose") {
    const today = todayInTimezone(siteConfig.timezone)
    const d = input.proposedDate
    if (!d || !isValidIsoDate(d) || d < today || d > addDays(today, siteConfig.booking.maxAdvanceDays) || !input.proposedWindow) {
      throw new Error("A valid future date and time window are required to propose a new time")
    }
  }

  const status = {
    confirm: "confirmed",
    reject: "rejected",
    propose: "reschedule_proposed",
    cancel: "cancelled",
  }[input.decision] as (typeof schema.bookingStatusEnum.enumValues)[number]

  const [booking] = await db
    .update(schema.bookingRequests)
    .set({
      status,
      adminNote: input.adminNote || null,
      proposedDate: input.decision === "propose" ? input.proposedDate : null,
      proposedWindow: input.decision === "propose" ? input.proposedWindow : null,
    })
    .where(eq(schema.bookingRequests.id, input.id))
    .returning()
  if (!booking) throw new Error("Booking not found")

  if (input.decision === "confirm") {
    await db
      .update(schema.leads)
      .set({ status: "assessment_scheduled" })
      .where(and(eq(schema.leads.id, booking.leadId), eq(schema.leads.status, "new")))
  }
  await audit(user.id, `booking.${input.decision}`, "booking", input.id)

  // Customer is told only AFTER an admin decision, and only if they gave an email.
  if (input.decision === "confirm" || input.decision === "propose") {
    const [lead] = await db
      .select({ email: schema.leads.email, reference: schema.leads.reference })
      .from(schema.leads)
      .where(eq(schema.leads.id, booking.leadId))
    if (lead?.email) {
      const confirmed = input.decision === "confirm"
      await sendEmail({
        kind: confirmed ? "customer_booking_confirmed" : "customer_booking_reschedule",
        to: lead.email,
        subject: confirmed ? "Your assessment is confirmed" : "A different assessment time is proposed",
        reference: lead.reference,
        html: renderEmail({
          heading: confirmed ? "Your assessment is confirmed" : "A different time is proposed",
          reference: lead.reference,
          lines: confirmed
            ? [`Date: ${booking.preferredDate} (${booking.preferredWindow})`, input.adminNote ?? ""].filter(Boolean)
            : [
                `Proposed: ${booking.proposedDate} (${booking.proposedWindow})`,
                "Please reply or call us to confirm this time.",
                input.adminNote ?? "",
              ].filter(Boolean),
        }),
      }).catch(() => undefined)
    }
  }
  revalidatePath("/admin", "layout")
}

/* ─── Contact messages ───────────────────────────────── */

const messageSchema = z.object({
  id: z.uuid(),
  status: z.enum(schema.messageStatusEnum.enumValues),
  internalNote: z.string().trim().max(2000).optional(),
})

export async function updateMessage(formData: FormData): Promise<void> {
  const user = await assertUser("messages")
  const input = messageSchema.parse(Object.fromEntries(formData))
  const db = await getDb()
  await db
    .update(schema.contactMessages)
    .set({ status: input.status, internalNote: input.internalNote || null })
    .where(eq(schema.contactMessages.id, input.id))
  await audit(user.id, "message.update", "contact_message", input.id, { status: input.status })
  revalidatePath("/admin", "layout")
}

/* ─── Services & coverage ────────────────────────────── */

const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens")
  .max(60)

export async function saveService(formData: FormData): Promise<void> {
  const user = await assertUser("services")
  const slug = String(formData.get("slug"))
  const service = services.find((s) => s.slug === slug)
  if (!service) throw new Error("Unknown service")
  const active = formData.get("active") === "on"
  // Unfinished copy must never go public: block activation while placeholders remain.
  if (active && JSON.stringify(service).includes("[PLACEHOLDER")) {
    throw new Error("This service still contains [PLACEHOLDER] text in data/services.ts. Replace it with confirmed content first.")
  }
  const showPricing = formData.get("showPricing") === "on"
  const db = await getDb()
  await db
    .insert(schema.serviceSettings)
    .values({ slug, active, showPricing })
    .onConflictDoUpdate({ target: schema.serviceSettings.slug, set: { active, showPricing } })
  await audit(user.id, "service.update", "service", slug, { active, showPricing })
  revalidatePath("/admin", "layout")
}

const cityAddSchema = z.object({ name: z.string().trim().min(2).max(80), slug: slugSchema })

export async function addCity(formData: FormData): Promise<void> {
  const user = await assertUser("coverage")
  const input = cityAddSchema.parse(Object.fromEntries(formData))
  const db = await getDb()
  await db.insert(schema.cities).values({ ...input, active: false }).onConflictDoNothing()
  await audit(user.id, "city.add", "city", input.slug)
  revalidatePath("/admin/coverage")
}

const areaAddSchema = z.object({
  cityId: z.uuid(),
  name: z.string().trim().min(2).max(80),
  slug: slugSchema,
})

export async function addArea(formData: FormData): Promise<void> {
  const user = await assertUser("coverage")
  const input = areaAddSchema.parse(Object.fromEntries(formData))
  const db = await getDb()
  await db.insert(schema.areas).values({ ...input, active: false }).onConflictDoNothing()
  await audit(user.id, "area.add", "area", input.slug)
  revalidatePath("/admin/coverage")
}

export async function toggleActive(formData: FormData): Promise<void> {
  const user = await assertUser("coverage")
  const kind = z.enum(["city", "area"]).parse(formData.get("kind"))
  const id = z.uuid().parse(formData.get("id"))
  const active = formData.get("active") === "true"
  const db = await getDb()
  if (kind === "city") {
    await db.update(schema.cities).set({ active }).where(eq(schema.cities.id, id))
  } else {
    await db.update(schema.areas).set({ active }).where(eq(schema.areas.id, id))
  }
  await audit(user.id, `${kind}.set_active`, kind, id, { active })
  revalidatePath("/admin/coverage")
}

const coverageSchema = z.object({
  areaId: z.uuid(),
  serviceSlug: z.string().max(80),
  status: z.enum(["none", "needs_confirmation", "available"]),
})

export async function setCoverage(formData: FormData): Promise<void> {
  const user = await assertUser("coverage")
  const input = coverageSchema.parse(Object.fromEntries(formData))
  if (!services.some((s) => s.slug === input.serviceSlug)) throw new Error("Unknown service")
  const db = await getDb()
  if (input.status === "none") {
    await db
      .delete(schema.coverage)
      .where(and(eq(schema.coverage.areaId, input.areaId), eq(schema.coverage.serviceSlug, input.serviceSlug)))
  } else {
    await db
      .insert(schema.coverage)
      .values({ areaId: input.areaId, serviceSlug: input.serviceSlug, status: input.status })
      .onConflictDoUpdate({
        target: [schema.coverage.areaId, schema.coverage.serviceSlug],
        set: { status: input.status },
      })
  }
  await audit(user.id, "coverage.set", "coverage", input.areaId, {
    service: input.serviceSlug,
    status: input.status,
  })
  revalidatePath("/admin/coverage")
}
