import * as React from "react"
import { notFound } from "next/navigation"
import { buildMetadata } from "@/lib/seo/metadata"
import { areas } from "@/data/areas"
import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"
import { Button } from "@/components/ui/Button"
import { ServicesGrid } from "@/components/sections/ServicesGrid"
import { FinalCTA } from "@/components/sections/FinalCTA"
import Link from "next/link"
import { ArrowLeft, MapPin } from "lucide-react"

export function generateStaticParams() {
  return areas.map((area) => ({
    area: area.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ area: string }> }) {
  const areaParam = (await params).area
  const area = areas.find((a) => a.slug === areaParam)
  
  if (!area) return {}
  
  return buildMetadata({
    title: area.metaTitle,
    description: area.metaDescription,
    path: `/areas-we-serve/${area.slug}`,
  })
}

export default async function AreaPage({ params }: { params: Promise<{ area: string }> }) {
  const areaParam = (await params).area
  const area = areas.find((a) => a.slug === areaParam)
  
  if (!area) {
    notFound()
  }

  return (
    <>
      <Section className="bg-[var(--color-bg-muted)] pt-12 md:pt-20 pb-12">
        <Container>
          <Link href="/areas-we-serve" className="inline-flex items-center text-sm font-medium text-[var(--color-primary)] hover:underline mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Areas
          </Link>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-8 w-8 text-[var(--color-accent)]" />
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-primary)]">Home Care in {area.name}</h1>
            </div>
            <p className="text-xl text-[var(--color-text-muted)] mb-8">
              {area.description}
            </p>
            <Button href="/request-care" variant="primary" size="lg">
              Request Care in {area.name}
            </Button>
          </div>
        </Container>
      </Section>

      <ServicesGrid />
      <FinalCTA />
    </>
  )
}
