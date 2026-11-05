import type { Area } from "@/types"

/**
 * Service areas.
 *
 * ⚠️ IMPORTANT — Only add areas that are genuinely served by the business.
 * Quality over quantity. Each area page must have unique, locally-relevant content.
 *
 * Do NOT add unconfirmed areas. Duplicate-content area pages hurt SEO
 * and mislead users.
 */
export const areas: Area[] = [
  {
    slug: "karachi",
    name: "Karachi",
    description:
      "We provide comprehensive home patient care services across Karachi, ensuring your loved ones receive compassionate support in the comfort of their own homes.",
    metaTitle: "Home Patient Care Services in Karachi | WW Patient Care",
    metaDescription:
      "Professional home patient care and nursing services available throughout Karachi. Contact us for compassionate care.",
  },
  // Uncomment and fill in ONLY when the area is confirmed as served.
  // Each area MUST have unique content — do NOT copy-paste.
  //
  // {
  //   slug: "clifton",
  //   name: "Clifton",
  //   description: "[PLACEHOLDER: unique content for Clifton]",
  //   metaTitle: "Home Patient Care in Clifton, Karachi | WW Patient Care",
  //   metaDescription: "[PLACEHOLDER: unique meta description]",
  // },
]