import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { getActiveServicesSafe } from "@/lib/coverage"
import Link from "next/link"
import {
  Activity,
  HeartPulse,
  Users,
  Bed,
  Stethoscope,
  HandHeart,
  ArrowRight,
  type LucideIcon,
} from "lucide-react"

const ICON_MAP: Record<string, LucideIcon> = {
  stethoscope: Stethoscope,
  "heart-pulse": HeartPulse,
  users: Users,
  activity: Activity,
  bed: Bed,
  "hand-heart": HandHeart,
}

type ServicesGridProps = {
  headingLevel?: 2 | 3
}

export async function ServicesGrid({ headingLevel = 2 }: ServicesGridProps = {}) {
  const services = await getActiveServicesSafe()
  const HeadingTag = `h${headingLevel}` as "h2" | "h3"

  if (services.length === 0) {
    return (
      <Section className="bg-[var(--color-bg)]">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <HeadingTag className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)] mb-4">
              Our Home Care Services
            </HeadingTag>
            <p className="text-[var(--color-text-muted)] mb-6">
              Our service list is being finalised. Please contact us to ask about the support you need.
            </p>
            <Button href="/contact" variant="outline" size="lg">
              Contact us
            </Button>
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <Section className="bg-[var(--color-bg)]">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <HeadingTag className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)] mb-4">
            Our Home Care Services
          </HeadingTag>
          <p className="text-[var(--color-text-muted)]">
            We provide a comprehensive range of home patient care services
            designed to meet the unique needs of your loved ones in Karachi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon =
              typeof service.icon === "string"
                ? ICON_MAP[service.icon]
                : service.icon

            return (
              <Card
                key={service.slug}
                className="flex flex-col h-full hover:shadow-md hover:border-[var(--color-primary)] transition-all group"
              >
                <div className="p-6 flex-grow flex flex-col">
                  <div className="w-12 h-12 rounded-lg bg-[var(--color-accent-soft)] group-hover:bg-[var(--color-accent)] flex items-center justify-center text-[var(--color-accent)] group-hover:text-white mb-4 transition-colors">
                    {Icon && (
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-[var(--color-text)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-[var(--color-text-muted)] mb-6 flex-grow leading-relaxed">
                    {service.shortDescription}
                  </p>

                  <Link
                    href={`/services/${service.slug}`}
                    aria-label={`Learn more about ${service.title}`}
                    className="text-[var(--color-primary)] font-medium hover:underline inline-flex items-center mt-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded"
                  >
                    Learn more
                    <ArrowRight
                      className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Button href="/services" variant="outline" size="lg">
            View All Services
          </Button>
        </div>
      </Container>
    </Section>
  )
}