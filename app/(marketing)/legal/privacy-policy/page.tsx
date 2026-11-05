import * as React from "react"
import { buildMetadata } from "@/lib/seo/metadata"
import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"
import { siteConfig } from "@/config/site"

export const metadata = buildMetadata({
  title: "Privacy Policy | WW Patient Care",
  description: "Privacy Policy for Worldwide Home Patient Care Services.",
  path: "/legal/privacy-policy",
  noIndex: true,
})

export default function PrivacyPolicyPage() {
  return (
    <Section className="bg-[var(--color-bg)] pt-16 md:pt-24 pb-12">
      <Container>
        <div className="max-w-3xl mx-auto prose prose-blue">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-6">Privacy Policy</h1>
          <p className="text-sm text-[var(--color-text-muted)] mb-8">Last Updated: [PLACEHOLDER: Date]</p>
          
          <div className="space-y-6 text-[var(--color-text-muted)]">
            <p>
              At {siteConfig.name}, we are committed to protecting the privacy and security of our patients and website visitors. This Privacy Policy outlines how we collect, use, and safeguard your personal and medical information.
            </p>
            
            <h2 className="text-xl font-bold text-[var(--color-text)] mt-8 mb-4">1. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Information:</strong> Name, contact details, address.</li>
              <li><strong>Health Information:</strong> Information relevant to the care services requested, as provided voluntarily by you or an authorized family member.</li>
              <li><strong>Website Data:</strong> Standard analytics data, IP addresses, and cookies (see our Cookie Policy).</li>
            </ul>
            
            <h2 className="text-xl font-bold text-[var(--color-text)] mt-8 mb-4">2. How We Use Your Information</h2>
            <p>The information we collect is used solely to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and coordinate home patient care services.</li>
              <li>Communicate with you regarding appointments, assessments, and service updates.</li>
              <li>Improve our services and website experience.</li>
              <li>Comply with legal and regulatory requirements.</li>
            </ul>
            
            <h2 className="text-xl font-bold text-[var(--color-text)] mt-8 mb-4">3. Data Protection</h2>
            <p>
              We implement appropriate technical and organizational measures to ensure the security of your personal and health information against unauthorized access, alteration, or disclosure.
            </p>

            <h2 className="text-xl font-bold text-[var(--color-text)] mt-8 mb-4">4. Sharing of Information</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. Information is only shared with our assigned caregivers and medical staff strictly on a need-to-know basis for the purpose of providing care.
            </p>
            
            <p className="mt-12 text-sm">
              If you have any questions about this Privacy Policy, please contact us at {siteConfig.email}.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  )
}
