import * as React from "react"
import { buildMetadata } from "@/lib/seo/metadata"
import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"
import { FAQ as FAQSection } from "@/components/sections/FAQ"
import { FinalCTA } from "@/components/sections/FinalCTA"
import { globalFaqs } from "@/data/faqs"

export const metadata = buildMetadata({
  title: "Frequently Asked Questions | WW Patient Care",
  description: "Find answers to common questions about our home patient care services, caregivers, and processes.",
  path: "/faq",
})

export default function FAQPage() {
  return (
    <>
      <Section className="bg-[var(--color-bg-muted)] pt-16 md:pt-24 pb-12">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-6">Frequently Asked Questions</h1>
            <p className="text-lg text-[var(--color-text-muted)]">
              Everything you need to know about our home care services.
            </p>
          </div>
        </Container>
      </Section>

      <FAQSection faqs={globalFaqs} title="General Questions" />
      
      <FinalCTA />
    </>
  )
}
