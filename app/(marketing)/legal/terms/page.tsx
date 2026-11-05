import * as React from "react"
import { buildMetadata } from "@/lib/seo/metadata"
import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"
import { siteConfig } from "@/config/site"

export const metadata = buildMetadata({
  title: "Terms of Service | WW Patient Care",
  description: "Terms of Service for Worldwide Home Patient Care Services.",
  path: "/legal/terms",
  noIndex: true,
})

export default function TermsPage() {
  return (
    <Section className="bg-[var(--color-bg)] pt-16 md:pt-24 pb-12">
      <Container>
        <div className="max-w-3xl mx-auto prose prose-blue">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-6">Terms of Service</h1>
          <p className="text-sm text-[var(--color-text-muted)] mb-8">Last Updated: [PLACEHOLDER: Date]</p>
          
          <div className="space-y-6 text-[var(--color-text-muted)]">
            <p>
              Welcome to {siteConfig.name}. By accessing our website or using our services, you agree to be bound by these Terms of Service.
            </p>
            
            <h2 className="text-xl font-bold text-[var(--color-text)] mt-8 mb-4">1. Service Provision</h2>
            <p>
              We provide home patient care and nursing services in Karachi. The specific scope of care will be agreed upon during our initial assessment and documented in a separate care agreement.
            </p>
            
            <h2 className="text-xl font-bold text-[var(--color-text)] mt-8 mb-4">2. Non-Emergency Nature</h2>
            <p>
              <strong>We do not provide emergency medical services.</strong> In case of a medical emergency, you must immediately call an ambulance or proceed to the nearest hospital. Our staff are not equipped to handle acute life-threatening situations in a home environment.
            </p>
            
            <h2 className="text-xl font-bold text-[var(--color-text)] mt-8 mb-4">3. User Responsibilities</h2>
            <p>
              When arranging care, you agree to provide accurate and complete information regarding the patient&apos;s medical history, current condition, and home environment to ensure the safety of both the patient and our staff.
            </p>
            
            <h2 className="text-xl font-bold text-[var(--color-text)] mt-8 mb-4">4. Payment Terms</h2>
            <p>
              [PLACEHOLDER: Add specific payment terms, e.g., &quot;Payment is due according to the schedule outlined in your care agreement.&quot;]
            </p>

            <h2 className="text-xl font-bold text-[var(--color-text)] mt-8 mb-4">5. Limitation of Liability</h2>
            <p>
              While we strive to provide the highest standard of care, {siteConfig.shortName} shall not be held liable for any unforeseen complications or outcomes arising from the natural progression of a patient&apos;s underlying medical condition.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  )
}
