import type { LucideIcon } from "lucide-react"

/* ─────────────────────────────────────────────────────────
 * Data models — kept in sync with /data/*.ts
 * ───────────────────────────────────────────────────────── */

export interface FAQ {
  id?: string
  question: string
  answer: string
}

export interface Service {
  slug: string
  title: string
  shortDescription: string
  description: string
  /**
   * Either a Lucide icon name (mapped in ServicesGrid's ICON_MAP)
   * or a directly imported Lucide component.
   */
  icon: string | LucideIcon
  features: string[]
  faqs: FAQ[]
  metaTitle: string
  metaDescription: string
}

export interface Area {
  slug: string
  name: string
  description: string
  metaTitle: string
  metaDescription: string
}

export interface Testimonial {
  id?: string
  name: string
  area?: string
  serviceReceived: string
  quote: string
  /** ISO date string (e.g., "2025-01-15") or human-readable date */
  date?: string
  /** Set true only when the testimonial is verifiably real */
  verified?: boolean
}

export interface NavItem {
  name: string
  href: string
}

/* ─────────────────────────────────────────────────────────
 * Form data models
 * ───────────────────────────────────────────────────────── */

/** Public inquiry form — minimal data collection. */
export interface ContactFormData {
  name: string
  phone: string
  whatsapp?: string
  email?: string
  /** Optional subject line */
  subject?: string
  message?: string
  /** User must agree to be contacted */
  consent: true
  /** Honeypot field — must be empty */
  honeypot?: string
}

/** Care request form — extends contact form with service details. */
export interface RequestCareFormData {
  contactName: string
  phone: string
  email?: string
  service: string
  area: string
  /** Preferences only — do NOT collect medical details publicly. */
  preferences?: string
  consent: true
  honeypot?: string
}