import { and, eq, gt } from "drizzle-orm"
import { getDb, schema } from "@/lib/db"
import { checkAvailability } from "@/lib/coverage"
import { acknowledgeCustomer, notifyAdmin } from "@/lib/email"
import { generateReference } from "@/lib/utils/reference"
import type { CareRequestInput, ContactInput } from "@/lib/validation/schemas"
import type { Availability } from "@/lib/db/schema"

export interface CareRequestResult {
  reference: string
  availability: Availability
  duplicate: boolean
  hasBooking: boolean
  /** True only if a customer acknowledgement email was actually delivered. */
  acknowledgementEmailSent: boolean
}

const isUniqueViolation = (e: unknown): boolean => {
  const err = e as { code?: string; cause?: { code?: string } }
  return err?.code === "23505" || err?.cause?.code === "23505"
}

async function withReference<T>(
  prefix: "CR" | "CM",
  run: (reference: string) => Promise<T>
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await run(generateReference(prefix))
    } catch (e) {
      // Reference collision (unique violation on `reference`) — retry; other errors bubble up.
      const msg = String((e as { message?: string })?.message ?? "")
      const cause = String((e as { cause?: { message?: string } })?.cause?.message ?? "")
      const isRefCollision = /reference/.test(msg + cause)
      if (!(isUniqueViolation(e) && isRefCollision) || attempt >= 4) throw e
    }
  }
}

export async function createCareRequest(
  input: CareRequestInput
): Promise<CareRequestResult> {
  const db = await getDb()

  // Same submission re-sent (double click / retry) → return the stored record.
  const [existing] = await db
    .select({
      reference: schema.leads.reference,
      availability: schema.leads.availability,
      id: schema.leads.id,
    })
    .from(schema.leads)
    .where(eq(schema.leads.idempotencyKey, input.idempotencyKey))
    .limit(1)
  if (existing) return resultFromExisting(existing)

  // Same person asking for the same service within 10 minutes → treat as duplicate.
  const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000)
  const [recent] = await db
    .select({
      reference: schema.leads.reference,
      availability: schema.leads.availability,
      id: schema.leads.id,
    })
    .from(schema.leads)
    .where(
      and(
        eq(schema.leads.phone, input.phone),
        eq(schema.leads.serviceSlug, input.serviceSlug),
        gt(schema.leads.createdAt, tenMinAgo)
      )
    )
    .limit(1)
  if (recent) return resultFromExisting(recent)

  // Availability is computed server-side from configured coverage — never trusted from the client.
  const availability = await checkAvailability(
    input.citySlug,
    input.areaSlug,
    input.serviceSlug
  )

  let created: { reference: string; id: string }
  try {
    created = await withReference("CR", (reference) =>
      db.transaction(async (tx) => {
        const [lead] = await tx
          .insert(schema.leads)
          .values({
            reference,
            idempotencyKey: input.idempotencyKey,
            name: input.name,
            phone: input.phone,
            email: input.email,
            serviceSlug: input.serviceSlug,
            citySlug: input.citySlug,
            areaSlug: input.areaSlug,
            availability,
            frequency: input.frequency,
            schedule: input.schedule || null,
            startDate: input.startDate ?? null,
            notes: input.notes || null,
            callbackTime: input.callbackTime,
            privacyAcceptedAt: new Date(),
            marketingConsent: input.marketingConsent,
            locale: input.locale,
          })
          .returning({ id: schema.leads.id })
        if (input.assessmentDate && input.assessmentWindow) {
          await tx.insert(schema.bookingRequests).values({
            leadId: lead.id,
            preferredDate: input.assessmentDate,
            preferredWindow: input.assessmentWindow,
          })
        }
        return { reference, id: lead.id }
      })
    )
  } catch (e) {
    // Concurrent duplicate of the same idempotency key — return the winner.
    if (isUniqueViolation(e)) {
      const [row] = await db
        .select({
          reference: schema.leads.reference,
          availability: schema.leads.availability,
          id: schema.leads.id,
        })
        .from(schema.leads)
        .where(eq(schema.leads.idempotencyKey, input.idempotencyKey))
        .limit(1)
      if (row) return resultFromExisting(row)
    }
    throw e
  }

  // The request is stored. Notification outcomes are logged but never block success.
  const summary = [
    `Service: ${input.serviceSlug}`,
    `Area: ${input.areaSlug}, ${input.citySlug} (${availability})`,
    `Name: ${input.name}`,
    `Phone: ${input.phone}`,
    ...(input.assessmentDate
      ? [`Assessment request: ${input.assessmentDate} (${input.assessmentWindow})`]
      : []),
  ]
  await notifyAdmin(
    "admin_new_care_request",
    "New care request",
    summary,
    created.reference
  ).catch(() => undefined)

  const ack = await acknowledgeCustomer({
    kind: "customer_care_request_ack",
    to: input.email,
    subject: `We received your care request (${created.reference})`,
    heading: "We have received your request",
    lines: [
      "Thank you for contacting us. Our team will review your request and contact you using the details you provided.",
      "This is a request only. It is not a confirmed appointment or confirmed service.",
    ],
    reference: created.reference,
  }).catch(() => null)

  return {
    reference: created.reference,
    availability,
    duplicate: false,
    hasBooking: Boolean(input.assessmentDate),
    acknowledgementEmailSent: ack?.status === "sent",
  }
}

async function resultFromExisting(row: {
  reference: string
  availability: Availability
  id: string
}): Promise<CareRequestResult> {
  const db = await getDb()
  const [booking] = await db
    .select({ id: schema.bookingRequests.id })
    .from(schema.bookingRequests)
    .where(eq(schema.bookingRequests.leadId, row.id))
    .limit(1)
  return {
    reference: row.reference,
    availability: row.availability,
    duplicate: true,
    hasBooking: Boolean(booking),
    acknowledgementEmailSent: false,
  }
}

export async function createContactMessage(
  input: ContactInput
): Promise<{ reference: string; duplicate: boolean }> {
  const db = await getDb()
  const [existing] = await db
    .select({ reference: schema.contactMessages.reference })
    .from(schema.contactMessages)
    .where(eq(schema.contactMessages.idempotencyKey, input.idempotencyKey))
    .limit(1)
  if (existing) return { reference: existing.reference, duplicate: true }

  const reference = await withReference("CM", async (ref) => {
    await db.insert(schema.contactMessages).values({
      reference: ref,
      idempotencyKey: input.idempotencyKey,
      name: input.name,
      phone: input.phone,
      email: input.email,
      subject: input.subject,
      message: input.message,
      privacyAcceptedAt: new Date(),
      locale: input.locale,
    })
    return ref
  })

  await notifyAdmin(
    "admin_new_contact_message",
    "New contact message",
    [`From: ${input.name}`, `Phone: ${input.phone}`, `Subject: ${input.subject}`],
    reference
  ).catch(() => undefined)
  await acknowledgeCustomer({
    kind: "customer_contact_ack",
    to: input.email,
    subject: `We received your message (${reference})`,
    heading: "We have received your message",
    lines: ["Thank you for writing to us. Our team will review your message and reply."],
    reference,
  }).catch(() => null)

  return { reference, duplicate: false }
}
