import { z } from "zod"
import { siteConfig } from "@/config/site"
import { addDays, isValidIsoDate, todayInTimezone } from "@/lib/utils/date"
import { normalizePkMobile } from "./phone"

/**
 * Shared client + server schemas. The server ALWAYS re-validates.
 * Dates are checked against the business timezone (config/site.ts).
 */

const cleanText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Please keep this under ${max} characters`)

export const phoneSchema = z
  .string()
  .trim()
  .min(1, "Please enter your mobile number")
  .transform((v, ctx) => {
    const normalized = normalizePkMobile(v)
    if (!normalized) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a Pakistani mobile number, e.g. 0300 1234567 or +92 300 1234567",
      })
      return z.NEVER
    }
    return normalized
  })

const optionalEmail = z
  .string()
  .trim()
  .max(120)
  .optional()
  .transform((v) => (v ? v : undefined))
  .pipe(z.email("Please enter a valid email address").optional())

const nameSchema = z
  .string()
  .trim()
  .min(2, "Please enter your full name")
  .max(100, "Name is too long")

export const TIME_WINDOWS = ["morning", "afternoon", "evening"] as const
export const CALLBACK_TIMES = ["anytime", ...TIME_WINDOWS] as const

const isoDate = z
  .string()
  .refine(isValidIsoDate, "Please choose a valid date")

function checkFutureDate(value: string, ctx: z.RefinementCtx, path: string[]) {
  const today = todayInTimezone(siteConfig.timezone)
  const min = addDays(today, siteConfig.booking.minLeadDays)
  const max = addDays(today, siteConfig.booking.maxAdvanceDays)
  if (value < min) {
    ctx.addIssue({ code: "custom", path, message: "Date cannot be in the past" })
  } else if (value > max) {
    ctx.addIssue({
      code: "custom",
      path,
      message: `Please choose a date within the next ${siteConfig.booking.maxAdvanceDays} days`,
    })
  }
}

const bot = {
  /** Honeypot — real users never fill this in. */
  website: z.string().max(200).optional(),
  /** Epoch ms when the form was opened; used for a minimum-fill-time check. */
  startedAt: z.number().int().optional(),
  locale: z.enum(["en", "ur"]).default("en"),
}

export const careRequestSchema = z
  .object({
    idempotencyKey: z.uuid(),
    serviceSlug: z.string().min(1, "Please select a service").max(80),
    citySlug: z.string().min(1, "Please select a city").max(80),
    areaSlug: z.string().min(1, "Please select an area").max(80),
    frequency: z.enum(["one_time", "recurring"], "Please choose one-time or recurring care"),
    schedule: cleanText(200).optional(),
    startDate: isoDate.optional(),
    notes: cleanText(500).optional(),
    name: nameSchema,
    phone: phoneSchema,
    email: optionalEmail,
    callbackTime: z.enum(CALLBACK_TIMES).default("anytime"),
    assessmentDate: isoDate.optional(),
    assessmentWindow: z.enum(TIME_WINDOWS).optional(),
    privacyAccepted: z.literal(true, {
      error: "You must acknowledge the privacy notice to continue",
    }),
    marketingConsent: z.boolean().default(false),
    ...bot,
  })
  .superRefine((v, ctx) => {
    if (v.startDate) checkFutureDate(v.startDate, ctx, ["startDate"])
    if (v.assessmentDate) {
      checkFutureDate(v.assessmentDate, ctx, ["assessmentDate"])
      if (!v.assessmentWindow) {
        ctx.addIssue({
          code: "custom",
          path: ["assessmentWindow"],
          message: "Please choose a preferred time window",
        })
      }
    }
  })

export const contactSchema = z.object({
  idempotencyKey: z.uuid(),
  name: nameSchema,
  phone: phoneSchema,
  email: optionalEmail,
  subject: z.string().trim().min(3, "Please add a subject").max(120),
  message: z.string().trim().min(10, "Please write a short message").max(1500),
  privacyAccepted: z.literal(true, {
    error: "You must acknowledge the privacy notice to continue",
  }),
  ...bot,
})

export const availabilityQuerySchema = z.object({
  citySlug: z.string().min(1).max(80),
  areaSlug: z.string().min(1).max(80),
  serviceSlug: z.string().min(1).max(80),
})

export type CareRequestInput = z.infer<typeof careRequestSchema>
export type ContactInput = z.infer<typeof contactSchema>
