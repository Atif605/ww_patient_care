import type { Metadata } from "next"
import { existsSync } from "node:fs"
import nodePath from "node:path"
import { siteConfig } from "@/config/site"

interface MetadataProps {
  title: string
  description: string
  path: string
  image?: string
  noIndex?: boolean
}

/**
 * Builds a Next.js `Metadata` object for a page.
 *
 * Usage:
 *   export const metadata = buildMetadata({
 *     title: "About Us",
 *     description: "...",
 *     path: "/about",
 *   })
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: MetadataProps): Metadata {
  // Normalize path so we never build "/path//" or "/path/"
  const cleanPath = path === "/" ? "" : path.replace(/\/$/, "")
  const url = `${siteConfig.url}${cleanPath}`

  // Only advertise an OG image that actually exists in /public.
  const defaultOg = existsSync(nodePath.join(process.cwd(), "public", "images", "og-default.jpg"))
    ? `${siteConfig.url}/images/og-default.jpg`
    : undefined
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : `${siteConfig.url}${image}`
    : defaultOg

  return {
    title,
    description,
    metadataBase: new URL(siteConfig.url),

    alternates: {
      canonical: url,
    },

    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] }),
      locale: "en_PK",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },

    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}