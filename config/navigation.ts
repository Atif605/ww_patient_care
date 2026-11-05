/**
 * Central navigation config.
 *
 * - `main`    → Header desktop nav
 * - `footer`  → Footer columns (services / company / legal)
 *
 * Every `href` must point to an existing route.
 * Do NOT add placeholder links like "#" — they hurt SEO and trust.
 */
export interface NavItem {
  name: string
  href: string
}

export const navigation = {
  main: [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Areas We Serve", href: "/areas-we-serve" },
    { name: "FAQ", href: "/faq" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ] as NavItem[],

  footer: {
    services: [
      { name: "Home Nursing Care", href: "/services/home-nursing-care" },
      { name: "Patient Care at Home", href: "/services/patient-care-at-home" },
      { name: "Elderly Care", href: "/services/elderly-care" },
      {
        name: "Post-Hospitalization Care",
        href: "/services/post-hospitalization-care",
      },
      {
        name: "Bedridden Patient Care",
        href: "/services/bedridden-patient-care",
      },
      { name: "Caregiver Services", href: "/services/caregiver-services" },
    ] as NavItem[],

    company: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      // ⚠️ Removed "Careers" — placeholder "#" hurts SEO and trust.
      // Add back only when /careers page exists.
    ] as NavItem[],

    legal: [
      { name: "Privacy Policy", href: "/legal/privacy-policy" },
      { name: "Terms & Conditions", href: "/legal/terms" },
      {
        name: "Healthcare Disclaimer",
        href: "/legal/healthcare-disclaimer",
      },
      { name: "Cookie Policy", href: "/legal/cookie-policy" },
    ] as NavItem[],
  },
} as const

export type Navigation = typeof navigation