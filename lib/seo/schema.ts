import type { Service, FAQ } from "@/types"
import { siteConfig, isConfigured } from "@/config/site"

/**
 * JSON-LD Schema.org builders.
 *
 * IMPORTANT:
 * - Only emit schema for data that actually exists.
 * - Never emit `[PLACEHOLDER: ...]` values inside schema — Google will flag them.
 * - Use `isConfigured()` to conditionally include optional fields.
 */

// ─────────────────────────────────────────────────────────
// Organization — global site-wide
// ─────────────────────────────────────────────────────────
export function organizationSchema() {
  const sameAs = Object.values(siteConfig.social).filter(
    (url) => url && isConfigured(url)
  )

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    ...(isConfigured(siteConfig.phone) && {
      contactPoint: {
        "@type": "ContactPoint",
        telephone: siteConfig.phone,
        contactType: "customer service",
        availableLanguage: ["English", "Urdu"],
        areaServed: "PK",
      },
    }),
    ...(sameAs.length > 0 && { sameAs }),
  }
}

// ─────────────────────────────────────────────────────────
// LocalBusiness / MedicalBusiness — global + contact page
// ─────────────────────────────────────────────────────────
export function localBusinessSchema() {
  const hasFullAddress = isConfigured(siteConfig.address.full)
  const hasPhone = isConfigured(siteConfig.phone)

  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": `${siteConfig.url}#business`,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    image: `${siteConfig.url}/images/og-default.jpg`,

    ...(hasPhone && { telephone: siteConfig.phone }),

    address: {
      "@type": "PostalAddress",
      ...(hasFullAddress && { streetAddress: siteConfig.address.full }),
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      addressCountry: "PK",
    },

    geo: {
      "@type": "GeoCoordinates",
      latitude: 24.8607,
      longitude: 67.0011,
    },

    // Karachi is the current service area
    areaServed: {
      "@type": "City",
      name: siteConfig.address.city,
    },

    // NOTE: openingHours omitted until real hours are confirmed.
    // When available, add:
    // openingHoursSpecification: {
    //   "@type": "OpeningHoursSpecification",
    //   dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    //   opens: "09:00",
    //   closes: "21:00",
    // },
  }
}

// ─────────────────────────────────────────────────────────
// Service — per service page
// ─────────────────────────────────────────────────────────
export function serviceSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.title,
    description: service.description,
    provider: {
      "@type": "MedicalBusiness",
      "@id": `${siteConfig.url}#business`,
      name: siteConfig.name,
    },
    areaServed: {
      "@type": "City",
      name: siteConfig.address.city,
    },
    url: `${siteConfig.url}/services/${service.slug}`,
  }
}

// ─────────────────────────────────────────────────────────
// FAQPage — FAQ page + service FAQ blocks
// ─────────────────────────────────────────────────────────
export function faqSchema(faqs: FAQ[]) {
  // Filter out entries that still contain placeholder text
  const validFaqs = faqs.filter(
    (faq) =>
      faq.question &&
      faq.answer &&
      !faq.question.includes("[PLACEHOLDER") &&
      !faq.answer.includes("[PLACEHOLDER")
  )

  if (validFaqs.length === 0) return null

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: validFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

// ─────────────────────────────────────────────────────────
// BreadcrumbList — all inner pages
// ─────────────────────────────────────────────────────────
export function breadcrumbSchema(
  items: { name: string; item: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.name,
      item: `${siteConfig.url}${breadcrumb.item}`,
    })),
  }
}