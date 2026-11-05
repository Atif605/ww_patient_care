import * as React from "react"
import { buildMetadata } from "@/lib/seo/metadata"
import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"
import { ContactForm } from "@/components/forms/ContactForm"
import { Card } from "@/components/ui/Card"
import { siteConfig, isConfigured } from "@/config/site"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { getPhoneUrl } from "@/lib/utils/format"

export const metadata = buildMetadata({
  title: "Contact Us | WW Patient Care",
  description: "Get in touch with WW Patient Care for inquiries or to request home patient care services in Karachi.",
  path: "/contact",
})

export default function ContactPage() {
  return (
    <>
      <Section className="bg-[var(--color-bg-muted)] pt-16 md:pt-24 pb-12">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-6">Contact Us</h1>
            <p className="text-lg text-[var(--color-text-muted)]">
              We&apos;re here to help. Reach out to us for any questions or to discuss your care needs.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-[var(--color-bg)]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6">Get In Touch</h2>
              <p className="text-[var(--color-text-muted)] mb-8">
                Whether you need immediate assistance or are planning for future care needs, our team is ready to provide the information and support you require.
              </p>
              
              <div className="space-y-6">
                {isConfigured(siteConfig.address.full) && (
                  <Card className="p-4 flex items-start gap-4 border-none shadow-none bg-[var(--color-bg-muted)]">
                    <MapPin className="h-6 w-6 text-[var(--color-primary)] shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-[var(--color-text)]">Office Address</h3>
                      <p className="text-[var(--color-text-muted)]">{siteConfig.address.full}</p>
                    </div>
                  </Card>
                )}
                
                {isConfigured(siteConfig.phone) && (
                  <Card className="p-4 flex items-start gap-4 border-none shadow-none bg-[var(--color-bg-muted)]">
                    <Phone className="h-6 w-6 text-[var(--color-primary)] shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-[var(--color-text)]">Phone</h3>
                      <a href={getPhoneUrl(siteConfig.phone)} className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                        {siteConfig.phone}
                      </a>
                    </div>
                  </Card>
                )}
                
                {isConfigured(siteConfig.email) && (
                  <Card className="p-4 flex items-start gap-4 border-none shadow-none bg-[var(--color-bg-muted)]">
                    <Mail className="h-6 w-6 text-[var(--color-primary)] shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-[var(--color-text)]">Email</h3>
                      <a href={`mailto:${siteConfig.email}`} className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                        {siteConfig.email}
                      </a>
                    </div>
                  </Card>
                )}
                
                {isConfigured(siteConfig.hours) && (
                  <Card className="p-4 flex items-start gap-4 border-none shadow-none bg-[var(--color-bg-muted)]">
                    <Clock className="h-6 w-6 text-[var(--color-primary)] shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-[var(--color-text)]">Operating Hours</h3>
                      <p className="text-[var(--color-text-muted)]">{siteConfig.hours}</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
            
            <div>
              <div className="bg-[var(--color-bg-muted)] p-6 sm:p-8 rounded-xl border border-[var(--color-border)]">
                <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4">Send us a message</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
