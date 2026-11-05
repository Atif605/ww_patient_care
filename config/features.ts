/**
 * Feature flags for the site.
 *
 * Toggle features on/off without touching component code.
 * - Keep disabled until the real content/data is confirmed.
 * - `testimonials` should remain `false` until real, verified testimonials exist.
 */
export const features = {
  /** Floating WhatsApp button + WhatsApp CTAs */
  whatsappWidget: true,

  /** Call buttons showing the phone number */
  callButton: true,

  /**
   * Testimonials section.
   * Keep `false` until real, verified testimonials are available.
   * Never fabricate testimonials.
   */
  testimonials: false,

  /** Blog / health resources section */
  blog: true,

  /**
   * Analytics loading flag.
   * Auto-enabled when GA4 ID is set in environment variables.
   */
  analytics: Boolean(process.env.NEXT_PUBLIC_GA_ID),
} as const

export type FeatureFlags = typeof features