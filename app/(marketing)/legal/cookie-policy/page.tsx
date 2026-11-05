import * as React from "react"
import { buildMetadata } from "@/lib/seo/metadata"
import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"
import { siteConfig } from "@/config/site"

export const metadata = buildMetadata({
  title: "Cookie Policy | WW Patient Care",
  description: "Cookie Policy for Worldwide Home Patient Care Services.",
  path: "/legal/cookie-policy",
  noIndex: true,
})

export default function CookiePolicyPage() {
  return (
    <Section className="bg-[var(--color-bg)] pt-16 md:pt-24 pb-12">
      <Container>
        <div className="max-w-3xl mx-auto prose prose-blue">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-6">Cookie Policy</h1>
          <p className="text-sm text-[var(--color-text-muted)] mb-8">Last Updated: [PLACEHOLDER: Date]</p>
          
          <div className="space-y-6 text-[var(--color-text-muted)]">
            <p>
              This Cookie Policy explains how {siteConfig.name} uses cookies and similar technologies to recognize you when you visit our website.
            </p>
            
            <h2 className="text-xl font-bold text-[var(--color-text)] mt-8 mb-4">What are cookies?</h2>
            <p>
              Cookies are small data files that are placed on your computer or mobile device when you visit a website. They are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
            </p>
            
            <h2 className="text-xl font-bold text-[var(--color-text)] mt-8 mb-4">Why do we use cookies?</h2>
            <p>We use cookies for several reasons:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> These are required for technical reasons in order for our website to operate.</li>
              <li><strong>Analytics Cookies:</strong> These help us understand how our website is being used so we can improve the user experience.</li>
              <li><strong>Preference Cookies:</strong> These allow our website to remember choices you make (such as your language or the region you are in).</li>
            </ul>

            <h2 className="text-xl font-bold text-[var(--color-text)] mt-8 mb-4">How can I control cookies?</h2>
            <p>
              You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  )
}
