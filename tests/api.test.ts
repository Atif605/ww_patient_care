import { randomUUID } from "node:crypto"
import { beforeAll, describe, expect, it } from "vitest"
import { eq } from "drizzle-orm"
import { getDb, schema } from "@/lib/db"
import { POST as requestCare } from "@/app/api/request-care/route"
import { POST as contact } from "@/app/api/contact/route"
import { GET as availability } from "@/app/api/availability/route"
import { addDays, todayInTimezone } from "@/lib/utils/date"
import { services } from "@/data/services"

const SERVICE = services[0].slug
const OTHER_SERVICE = services[1].slug
const today = todayInTimezone("Asia/Karachi")

function post(handler: (r: Request) => Promise<Response>, body: unknown, ip = "10.0.0.1") {
  return handler(
    new Request("http://localhost/api/x", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify(body),
    })
  )
}

const validCare = () => ({
  idempotencyKey: randomUUID(),
  serviceSlug: SERVICE,
  citySlug: "testcity",
  areaSlug: "testarea",
  frequency: "one_time",
  name: "Test Person",
  phone: "0300 1234567",
  callbackTime: "anytime",
  privacyAccepted: true,
  marketingConsent: false,
  startedAt: Date.now() - 10_000,
})

beforeAll(async () => {
  const db = await getDb()
  await db.insert(schema.serviceSettings).values([
    { slug: SERVICE, active: true },
    { slug: OTHER_SERVICE, active: false },
  ])
  const [city] = await db
    .insert(schema.cities)
    .values({ slug: "testcity", name: "Test City", active: true })
    .returning()
  const [area] = await db
    .insert(schema.areas)
    .values({ cityId: city.id, slug: "testarea", name: "Test Area", active: true })
    .returning()
  await db.insert(schema.coverage).values({
    areaId: area.id,
    serviceSlug: SERVICE,
    status: "available",
  })
})

describe("availability", () => {
  it("returns available only for configured coverage", async () => {
    const r = await availability(
      new Request(`http://localhost/api/availability?citySlug=testcity&areaSlug=testarea&serviceSlug=${SERVICE}`)
    )
    expect((await r.json()).availability).toBe("available")
  })
  it("returns not_covered for inactive service and unknown area", async () => {
    for (const q of [
      `citySlug=testcity&areaSlug=testarea&serviceSlug=${OTHER_SERVICE}`,
      `citySlug=testcity&areaSlug=nowhere&serviceSlug=${SERVICE}`,
    ]) {
      const r = await availability(new Request(`http://localhost/api/availability?${q}`))
      expect((await r.json()).availability).toBe("not_covered")
    }
  })
})

describe("POST /api/request-care", () => {
  it("stores a lead and returns a reference", async () => {
    const res = await post(requestCare, validCare(), "10.0.1.1")
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.ok).toBe(true)
    expect(json.reference).toMatch(/^WWPC-CR-[A-Z0-9]{6}$/)
    expect(json.availability).toBe("available")
    const db = await getDb()
    const [row] = await db.select().from(schema.leads).where(eq(schema.leads.reference, json.reference))
    expect(row.phone).toBe("+923001234567")
    expect(row.status).toBe("new")
  })

  it("is idempotent for the same key", async () => {
    const body = validCare()
    const a = await (await post(requestCare, body, "10.0.1.2")).json()
    const b = await (await post(requestCare, body, "10.0.1.2")).json()
    expect(b.reference).toBe(a.reference)
    expect(b.duplicate).toBe(true)
  })

  it("dedupes same phone + service within minutes", async () => {
    const first = await (await post(requestCare, { ...validCare(), phone: "03211234567" }, "10.0.1.3")).json()
    const second = await (await post(requestCare, { ...validCare(), phone: "03211234567" }, "10.0.1.3")).json()
    expect(second.reference).toBe(first.reference)
  })

  it("rejects invalid phone with field errors (422) and stores nothing", async () => {
    const res = await post(requestCare, { ...validCare(), phone: "12345" }, "10.0.1.4")
    expect(res.status).toBe(422)
    expect((await res.json()).fields.phone).toBeTruthy()
  })

  it("requires privacy acknowledgement", async () => {
    const res = await post(requestCare, { ...validCare(), privacyAccepted: false }, "10.0.1.5")
    expect(res.status).toBe(422)
  })

  it("rejects past dates and out-of-range dates", async () => {
    const past = await post(requestCare, { ...validCare(), startDate: addDays(today, -1) }, "10.0.1.6")
    expect(past.status).toBe(422)
    const far = await post(requestCare, { ...validCare(), assessmentDate: addDays(today, 400), assessmentWindow: "morning" }, "10.0.1.6")
    expect(far.status).toBe(422)
  })

  it("creates a booking REQUEST (status requested) when an assessment date is given", async () => {
    const res = await post(
      requestCare,
      { ...validCare(), phone: "03451234567", assessmentDate: addDays(today, 2), assessmentWindow: "evening" },
      "10.0.1.7"
    )
    const json = await res.json()
    expect(json.hasBooking).toBe(true)
    const db = await getDb()
    const rows = await db.select().from(schema.bookingRequests)
    expect(rows.some((b) => b.status === "requested" && b.preferredWindow === "evening")).toBe(true)
  })

  it("stores not_covered requests as future-availability leads", async () => {
    const res = await post(
      requestCare,
      { ...validCare(), phone: "03331234567", areaSlug: "nowhere" },
      "10.0.1.8"
    )
    expect((await res.json()).availability).toBe("not_covered")
  })

  it("blocks honeypot and too-fast submissions without storing", async () => {
    const hp = await post(requestCare, { ...validCare(), website: "http://spam" }, "10.0.1.9")
    expect(hp.status).toBe(400)
    const fast = await post(requestCare, { ...validCare(), startedAt: Date.now() }, "10.0.1.9")
    expect(fast.status).toBe(400)
  })

  it("rate limits after 5 requests per window", async () => {
    const statuses: number[] = []
    for (let i = 0; i < 7; i++) {
      const r = await post(requestCare, { ...validCare(), phone: "0300555000" + i }, "10.0.2.1")
      statuses.push(r.status)
    }
    expect(statuses).toContain(429)
  })

  it("rejects cross-origin browser posts", async () => {
    const res = await requestCare(
      new Request("http://localhost/api/request-care", {
        method: "POST",
        headers: { origin: "https://evil.example", host: "localhost", "content-type": "application/json" },
        body: JSON.stringify(validCare()),
      })
    )
    expect(res.status).toBe(403)
  })
})

describe("POST /api/contact", () => {
  const validContact = () => ({
    idempotencyKey: randomUUID(),
    name: "Test Person",
    phone: "0300 7654321",
    subject: "Question about services",
    message: "Hello, I would like to know more.",
    privacyAccepted: true,
    startedAt: Date.now() - 10_000,
  })

  it("stores a message and returns a reference", async () => {
    const res = await post(contact, validContact(), "10.0.3.1")
    const json = await res.json()
    expect(json.ok).toBe(true)
    expect(json.reference).toMatch(/^WWPC-CM-/)
  })

  it("escapes nothing destructive: stores script tags as inert text", async () => {
    const body = { ...validContact(), message: "<script>alert(1)</script> hello there" }
    const json = await (await post(contact, body, "10.0.3.2")).json()
    const db = await getDb()
    const [row] = await db.select().from(schema.contactMessages).where(eq(schema.contactMessages.reference, json.reference))
    expect(row.message).toContain("<script>")
  })

  it("validates input", async () => {
    const res = await post(contact, { ...validContact(), message: "short" }, "10.0.3.3")
    expect(res.status).toBe(422)
  })
})

describe("notifications", () => {
  it("records admin notification as skipped when email is not configured (never 'sent')", async () => {
    const db = await getDb()
    const rows = await db.select().from(schema.notifications)
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.every((r) => r.status !== "sent")).toBe(true)
  })
})
