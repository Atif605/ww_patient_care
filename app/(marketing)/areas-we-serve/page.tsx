import * as React from "react"
import { buildMetadata } from "@/lib/seo/metadata"
import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"
import { AvailabilityChecker } from "@/components/widgets/AvailabilityChecker"
import { ServiceAreas } from "@/components/sections/ServiceAreas"
import { FinalCTA } from "@/components/sections/FinalCTA"

export const metadata = buildMetadata({
  title: "Areas We Serve in Karachi | WW Patient Care",
  description: "View the list of areas in Karachi where WW Patient Care provides professional home nursing and patient care services.",
  path: "/areas-we-serve",
})

export default function AreasPage() {
  return (
    <>
      <Section className="bg-[var(--color-bg-muted)] pt-16 md:pt-24 pb-12">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-6">Areas We Serve</h1>
            <p className="text-lg text-[var(--color-text-muted)]">
              Bringing professional healthcare to your doorstep across Karachi.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-[var(--color-bg)] pb-4">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-2">Check service availability</h2>
            <p className="text-[var(--color-text-muted)] mb-6">Choose your city, area and the service you need. Results come from the coverage our team has confirmed.</p>
            <AvailabilityChecker />
          </div>
        </Container>
      </Section>

      <ServiceAreas />
      <FinalCTA />
    </>
  )
}
