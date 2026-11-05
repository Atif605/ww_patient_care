import * as React from "react"
import { notFound } from "next/navigation"
import { buildMetadata } from "@/lib/seo/metadata"
import { serviceSchema } from "@/lib/seo/schema"
import { getActiveServicesSafe } from "@/lib/coverage"
import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"
import { Button } from "@/components/ui/Button"
import { FAQ } from "@/components/sections/FAQ"
import { FinalCTA } from "@/components/sections/FinalCTA"
import { CheckCircle2, ArrowLeft } from "lucide-react"
import Link from "next/link"

async function findActiveService(slug: string) {
  const active = await getActiveServicesSafe()
  return active.find((s) => s.slug === slug)
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug
  const service = await findActiveService(slug)
  if (!service) return { robots: { index: false } }

  return buildMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
  })
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug
  // Services the owner has not activated are not published.
  const service = await findActiveService(slug)

  if (!service) {
    notFound()
  }

  const jsonLd = serviceSchema(service)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Section className="bg-[var(--color-bg-muted)] pt-12 md:pt-20 pb-12">
        <Container>
          <Link href="/services" className="inline-flex items-center text-sm font-medium text-[var(--color-primary)] hover:underline mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
          </Link>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-6">{service.title}</h1>
            <p className="text-xl text-[var(--color-text-muted)] mb-8">
              {service.shortDescription}
            </p>
            <div className="flex gap-4">
              <Button href={`/request-care?service=${service.slug}`} variant="primary" size="lg">
                Request This Service
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-[var(--color-bg)]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4">Overview</h2>
                <p className="text-[var(--color-text-muted)] leading-relaxed text-lg">
                  {service.description}
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6">What&apos;s Included</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-[var(--color-bg-muted)]">
                      <CheckCircle2 className="h-6 w-6 text-[var(--color-accent)] shrink-0 mt-0.5" />
                      <span className="text-[var(--color-text)]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10 rounded-xl p-6 sticky top-24">
                <h3 className="text-xl font-bold text-[var(--color-primary)] mb-4">Need Help Deciding?</h3>
                <p className="text-[var(--color-text-muted)] mb-6">
                  Contact us for a free assessment. We will help you choose the right level of care for your loved one.
                </p>
                <Button href="/contact" variant="outline" className="w-full bg-white">
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {service.faqs.length > 0 && (
        <FAQ faqs={service.faqs} title={`Frequently Asked Questions about ${service.title}`} />
      )}
      
      <FinalCTA />
    </>
  )
}
