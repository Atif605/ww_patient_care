import * as React from "react"
import { buildMetadata } from "@/lib/seo/metadata"
import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"
import { siteConfig } from "@/config/site"

export const metadata = buildMetadata({
  title: "Healthcare Disclaimer | WW Patient Care",
  description: "Healthcare Disclaimer for Worldwide Home Patient Care Services.",
  path: "/legal/healthcare-disclaimer",
  noIndex: true,
})

export default function HealthcareDisclaimerPage() {
  return (
    <Section className="bg-[var(--color-bg)] pt-16 md:pt-24 pb-12">
      <Container>
        <div className="max-w-3xl mx-auto prose prose-blue">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-6">Healthcare Disclaimer</h1>
          
          <div className="space-y-6 text-[var(--color-text-muted)] bg-[var(--color-bg-muted)] p-8 rounded-xl border border-[var(--color-border)]">
            <h2 className="text-xl font-bold text-[var(--color-danger)] mb-4 uppercase tracking-wider">Not for Medical Emergencies</h2>
            <p className="font-medium text-[var(--color-text)]">
              {siteConfig.name} does not provide emergency medical services.
            </p>
            <p>
              If you or a loved one is experiencing a medical emergency, acute severe pain, loss of consciousness, severe bleeding, or any other life-threatening condition, <strong>DO NOT rely on this website or our home care services.</strong> 
            </p>
            <p className="font-bold text-[var(--color-text)]">
              Immediately call local emergency services or proceed to the nearest hospital emergency department.
            </p>

            <div className="my-8 border-t border-[var(--color-border)]"></div>

            <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">Informational Purposes Only</h3>
            <p>
              The content provided on this website, including text, graphics, images, and other material, is for informational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
            </p>
            
            <h3 className="text-lg font-bold text-[var(--color-text)] mt-6 mb-2">Always Consult a Physician</h3>
            <p>
              Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this website. Our services are designed to support and follow the care plan prescribed by the patient&apos;s primary healthcare provider.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  )
}
