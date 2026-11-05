import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"
import { Card } from "@/components/ui/Card"
import { testimonials } from "@/data/testimonials"
import { features } from "@/config/features"
import { Quote } from "lucide-react"

type TestimonialsProps = {
  headingLevel?: 2 | 3
}

export function Testimonials({ headingLevel = 2 }: TestimonialsProps = {}) {
  // Double guard: feature flag AND data
  if (!features.testimonials || !testimonials || testimonials.length === 0) {
    return null
  }

  const HeadingTag = `h${headingLevel}` as "h2" | "h3"

  // Dynamic grid based on count for better layout
  const gridClass =
    testimonials.length === 1
      ? "grid grid-cols-1 max-w-2xl mx-auto gap-8"
      : testimonials.length === 2
        ? "grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8"
        : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"

  return (
    <Section className="bg-[var(--color-bg)]">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <HeadingTag className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)] mb-4">
            What Families Say
          </HeadingTag>
          <p className="text-[var(--color-text-muted)]">
            Real experiences from the families we serve in Karachi.
          </p>
        </div>

        <div className={gridClass}>
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id ?? testimonial.name}
              className="p-8 flex flex-col h-full bg-[var(--color-bg-muted)] border-none"
            >
              <Quote
                className="h-10 w-10 mb-4 text-[var(--color-accent)]"
                aria-hidden="true"
              />

              <blockquote className="text-lg text-[var(--color-text)] italic leading-relaxed mb-6 flex-grow">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <footer>
                <p className="font-bold text-[var(--color-primary)] not-italic">
                  {testimonial.name}
                </p>
                <p className="text-sm text-[var(--color-text-muted)] not-italic">
                  {testimonial.serviceReceived}
                </p>
              </footer>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}