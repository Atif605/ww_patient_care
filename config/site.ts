/**
 * Central site configuration.
 *
 * All business info lives here — components read from this file.
 * Never hardcode phone numbers, emails, or addresses elsewhere.
 *
 * Values marked [PLACEHOLDER: ...] will be filled by the owner.
 * Components should check for "PLACEHOLDER" in the string before
 * rendering contact info, to avoid showing fake data to visitors.
 */
const PLACEHOLDER_PREFIX = "[PLACEHOLDER"

export const siteConfig = {
  // ─── Brand ──────────────────────────────────────────────
  name: "Worldwide Home Patient Care Services",
  shortName: "WW Patient Care",
  tagline: "Home Patient Care Services",

  // ─── URLs ───────────────────────────────────────────────
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://wwpatientcare.com",

  // ─── Contact ────────────────────────────────────────────
  phone: process.env.NEXT_PUBLIC_PHONE || "[PLACEHOLDER: phone]",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "[PLACEHOLDER: whatsapp]",
  email: process.env.NEXT_PUBLIC_EMAIL || "[PLACEHOLDER: email]",

  // ─── Address ────────────────────────────────────────────
  address: {
    city: "Karachi",
    region: "Sindh",
    country: "Pakistan",
    full: "[PLACEHOLDER: full address]",
  },

  // ─── Hours ──────────────────────────────────────────────
  hours: "[PLACEHOLDER: operating hours]",

  // ─── Social ─────────────────────────────────────────────
  // Empty until the owner supplies REAL profile URLs (never guessed).
  social: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "",
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || "",
  },

  // ─── Locale & business rules ────────────────────────────
  timezone: "Asia/Karachi",
  currency: "PKR",
  defaultLocale: "en",
  locales: ["en", "ur"] as const,

  /** Booking REQUEST rules (a request is never an automatic confirmation). */
  booking: {
    minLeadDays: 0,
    maxAdvanceDays: 60,
  },

  // ─── Registration & credentials (owner must supply; shown only if set) ───
  registration: {
    businessRegistrationNo: "[PLACEHOLDER: business registration number]",
    ntn: "[PLACEHOLDER: NTN]",
    healthcareLicence: "[PLACEHOLDER: healthcare commission licence no. — only if issued]",
  },
} as const

export type SiteConfig = typeof siteConfig

/**
 * Helper: returns `true` if the given value is a real, non-placeholder string.
 * Use this instead of `value.includes("PLACEHOLDER")` throughout the codebase.
 */
export function isConfigured(value: string | undefined | null): boolean {
  if (!value) return false
  return !value.includes(PLACEHOLDER_PREFIX)
}