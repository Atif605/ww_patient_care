import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"
import { Card } from "@/components/ui/Card"
import { areas } from "@/data/areas"
import Link from "next/link"
import { MapPin } from "lucide-react"

type ServiceAreasProps = {
  headingLevel?: 2 | 3
}

export function ServiceAreas({ headingLevel = 2 }: ServiceAreasProps = {}) {
  const HeadingTag = `h${headingLevel}` as "h2" | "h3"

  // If no areas configured, don't render the section
  if (!areas || areas.length === 0) return null

  return (
    <Section className="bg-[var(--color-bg-muted)]">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <HeadingTag className="text-3xl font-bold text-[var(--color-primary)] mb-4">
            Areas We Serve
          </HeadingTag>
          <p className="text-[var(--color-text-muted)]">
            Providing dedicated home patient care across the city.
          </p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {areas.map((area) => (
            <li key={area.slug}>
              <Link
                href={`/areas-we-serve/${area.slug}`}
                className="block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
              >
                <Card className="p-6 h-full flex items-center gap-3 hover:border-[var(--color-primary)] hover:shadow-md transition-all group">
                  <MapPin
                    className="h-6 w-6 shrink-0 text-[var(--color-accent)]"
                    aria-hidden="true"
                  />
                  <span className="font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                    {area.name}
                  </span>
                </Card>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
          <p>
            Don&apos;t see your area listed?{" "}
            <Link
              href="/contact"
              className="text-[var(--color-primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded"
            >
              Contact us
            </Link>{" "}
            to check availability.
          </p>
        </div>

        {/* Areas are managed in data/areas.ts. Only add areas the business actually serves. */}
      </Container>
    </Section>
  )
}