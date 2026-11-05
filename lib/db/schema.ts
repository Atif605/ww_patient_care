import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core"

/* ─── Enums ───────────────────────────────────────────── */
export const roleEnum = pgEnum("admin_role", [
  "super_admin",
  "admin",
  "staff",
  "content",
])
export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "follow_up",
  "assessment_scheduled",
  "converted",
  "not_converted",
  "closed",
])
export const availabilityEnum = pgEnum("availability_result", [
  "available",
  "needs_confirmation",
  "not_covered",
])
export const careFrequencyEnum = pgEnum("care_frequency", [
  "one_time",
  "recurring",
])
export const timeWindowEnum = pgEnum("time_window", [
  "morning",
  "afternoon",
  "evening",
])
export const bookingStatusEnum = pgEnum("booking_status", [
  "requested",
  "confirmed",
  "rejected",
  "reschedule_proposed",
  "cancelled",
])
export const messageStatusEnum = pgEnum("message_status", [
  "new",
  "read",
  "replied",
  "closed",
])
export const notificationStatusEnum = pgEnum("notification_status", [
  "sent",
  "skipped_not_configured",
  "failed",
])

const createdAt = () =>
  timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
const updatedAt = () =>
  timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())

/* ─── Admin users & sessions ──────────────────────────── */
export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull().default("staff"),
  active: boolean("active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
})

export const adminSessions = pgTable(
  "admin_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => adminUsers.id, { onDelete: "cascade" }),
    /** SHA-256 of the cookie token — the raw token is never stored. */
    tokenHash: text("token_hash").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("admin_sessions_user_idx").on(t.userId)]
)

/* ─── Coverage: cities, areas, per-service coverage ───── */
export const cities = pgTable("cities", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  active: boolean("active").notNull().default(false),
  createdAt: createdAt(),
})

export const areas = pgTable(
  "areas",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cityId: uuid("city_id")
      .notNull()
      .references(() => cities.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    active: boolean("active").notNull().default(false),
    createdAt: createdAt(),
  },
  (t) => [unique("areas_city_slug_uq").on(t.cityId, t.slug)]
)

/** Per-service switches. Content lives in /data/services.ts; this table
 *  controls whether a service is publicly offered. Default: OFF. */
export const serviceSettings = pgTable("service_settings", {
  slug: text("slug").primaryKey(),
  active: boolean("active").notNull().default(false),
  showPricing: boolean("show_pricing").notNull().default(false),
  updatedAt: updatedAt(),
})

/** A row means the service is offered in that area. No row = not covered. */
export const coverage = pgTable(
  "coverage",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    areaId: uuid("area_id")
      .notNull()
      .references(() => areas.id, { onDelete: "cascade" }),
    serviceSlug: text("service_slug").notNull(),
    status: availabilityEnum("status").notNull().default("needs_confirmation"),
    createdAt: createdAt(),
  },
  (t) => [unique("coverage_area_service_uq").on(t.areaId, t.serviceSlug)]
)

/* ─── Leads (care requests) ───────────────────────────── */
export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reference: text("reference").notNull().unique(),
    /** Client-generated per form session — blocks double submits. */
    idempotencyKey: text("idempotency_key").notNull().unique(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    serviceSlug: text("service_slug").notNull(),
    citySlug: text("city_slug").notNull(),
    areaSlug: text("area_slug"),
    availability: availabilityEnum("availability").notNull(),
    frequency: careFrequencyEnum("frequency").notNull(),
    schedule: text("schedule"),
    startDate: date("start_date"),
    notes: text("notes"),
    callbackTime: text("callback_time"),
    privacyAcceptedAt: timestamp("privacy_accepted_at", {
      withTimezone: true,
    }).notNull(),
    marketingConsent: boolean("marketing_consent").notNull().default(false),
    locale: text("locale").notNull().default("en"),
    status: leadStatusEnum("status").notNull().default("new"),
    assignedTo: uuid("assigned_to").references(() => adminUsers.id, {
      onDelete: "set null",
    }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index("leads_status_idx").on(t.status),
    index("leads_created_idx").on(t.createdAt),
    index("leads_service_idx").on(t.serviceSlug),
    index("leads_phone_idx").on(t.phone),
  ]
)

export const leadNotes = pgTable(
  "lead_notes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    authorId: uuid("author_id").references(() => adminUsers.id, {
      onDelete: "set null",
    }),
    body: text("body").notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("lead_notes_lead_idx").on(t.leadId)]
)

/* ─── Booking requests (NOT confirmed appointments) ───── */
export const bookingRequests = pgTable(
  "booking_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId: uuid("lead_id")
      .notNull()
      .unique()
      .references(() => leads.id, { onDelete: "cascade" }),
    preferredDate: date("preferred_date").notNull(),
    preferredWindow: timeWindowEnum("preferred_window").notNull(),
    status: bookingStatusEnum("status").notNull().default("requested"),
    proposedDate: date("proposed_date"),
    proposedWindow: timeWindowEnum("proposed_window"),
    adminNote: text("admin_note"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("booking_status_idx").on(t.status)]
)

/* ─── Contact messages ────────────────────────────────── */
export const contactMessages = pgTable(
  "contact_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reference: text("reference").notNull().unique(),
    idempotencyKey: text("idempotency_key").notNull().unique(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    privacyAcceptedAt: timestamp("privacy_accepted_at", {
      withTimezone: true,
    }).notNull(),
    locale: text("locale").notNull().default("en"),
    status: messageStatusEnum("status").notNull().default("new"),
    internalNote: text("internal_note"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("contact_status_idx").on(t.status)]
)

/* ─── Notifications log, audit log, rate limits ───────── */
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  kind: text("kind").notNull(),
  recipient: text("recipient").notNull(),
  subject: text("subject").notNull(),
  status: notificationStatusEnum("status").notNull(),
  error: text("error"),
  reference: text("reference"),
  createdAt: createdAt(),
})

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => adminUsers.id, {
      onDelete: "set null",
    }),
    action: text("action").notNull(),
    entity: text("entity"),
    entityId: text("entity_id"),
    detail: jsonb("detail"),
    createdAt: createdAt(),
  },
  (t) => [index("audit_created_idx").on(t.createdAt)]
)

export const rateLimits = pgTable("rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(0),
  windowStart: timestamp("window_start", { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export type AdminRole = (typeof roleEnum.enumValues)[number]
export type LeadStatus = (typeof leadStatusEnum.enumValues)[number]
export type BookingStatus = (typeof bookingStatusEnum.enumValues)[number]
export type MessageStatus = (typeof messageStatusEnum.enumValues)[number]
export type Availability = (typeof availabilityEnum.enumValues)[number]
export type TimeWindow = (typeof timeWindowEnum.enumValues)[number]
