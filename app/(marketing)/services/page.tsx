import * as React from "react"
import { buildMetadata } from "@/lib/seo/metadata"
import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"
import { ServicesGrid } from "@/components/sections/ServicesGrid"
import { HowItWorks } from "@/components/sections/HowItWorks"
import { FinalCTA } from "@/components/sections/FinalCTA"

export const metadata = buildMetadata({
  title: "Home Care Services | WW Patient Care",
  description: "Explore our comprehensive home patient care services in Karachi, including nursing care, elderly care, and post-hospitalization support.",
  path: "/services",
})

export default function ServicesPage() {
  return (
    <>
      <Section className="bg-[var(--color-bg-muted)] pt-16 md:pt-24 pb-12">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-6">Our Services</h1>
            <p className="text-lg text-[var(--color-text-muted)]">
              Tailored care plans designed to meet the unique needs of your loved ones.
            </p>
          </div>
        </Container>
      </Section>

      <ServicesGrid />
      <HowItWorks />
      <FinalCTA />
    </>
  )
}
