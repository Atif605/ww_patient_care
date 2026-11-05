import type { MetadataRoute } from "next"
import { siteConfig } from "@/config/site"
import { areas } from "@/data/areas"
import { getActiveServicesSafe } from "@/lib/coverage"

const STATIC_PATHS = [
  "",
  "/about",
  "/services",
  "/areas-we-serve",
  "/faq",
  "/blog",
  "/contact",
  "/request-care",
  "/legal/privacy-policy",
  "/legal/terms",
  "/legal/healthcare-disclaimer",
  "/legal/cookie-policy",
]

/** Lists only pages that exist and are published (inactive services are excluded). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await getActiveServicesSafe()
  const paths = [
    ...STATIC_PATHS,
    ...services.map((s) => `/services/${s.slug}`),
    ...areas.map((a) => `/areas-we-serve/${a.slug}`),
  ]
  return paths.map((p) => ({
    url: `${siteConfig.url}${p}`,
    changeFrequency: p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1 : 0.7,
  }))
}
