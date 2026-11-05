import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"
import { CheckCircle2 } from "lucide-react"

type Reason = {
  title: string
  description: string
}

// Neutral, verifiable statements. Update copy if business details change.
const REASONS: Reason[] = [
  {
    title: "Family-Centered Care",
    description:
      "Care plans that respect your family\u2019s values and home environment.",
  },
  {
    title: "Compassionate Staff",
    description:
      "Caregivers selected for empathy as much as for skill.",
  },
  {
    title: "Tailored Support",
    description:
      "Care customized to each patient\u2019s needs and preferences.",
  },
  {
    title: "Reliable & Professional",
    description:
      "Punctual, respectful, and dependable service you can trust.",
  },
]

type WhyChooseUsProps = {
  headingLevel?: 2 | 3
}

export function WhyChooseUs({ headingLevel = 2 }: WhyChooseUsProps = {}) {
  const SectionHeading = `h${headingLevel}` as "h2" | "h3"
  const ItemHeading = `h${headingLevel + 1}` as "h3" | "h4"

  return (
    <Section className="bg-[var(--color-bg-muted)]">
      <Container>
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Text column */}
          <div className="lg:w-1/2 w-full">
            <SectionHeading className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)] mb-6">
              Why Choose WW Patient Care?
            </SectionHeading>

            <p className="text-[var(--color-text-muted)] mb-8 text-lg leading-relaxed">
              We understand that inviting someone into your home to care for a
              loved one is a significant decision. We are committed to earning
              your trust through dependable, compassionate service.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {REASONS.map((reason) => (
                <li key={reason.title} className="flex gap-3">
                  <CheckCircle2
                    className="h-6 w-6 text-[var(--color-accent)] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <ItemHeading className="font-bold text-[var(--color-text)] mb-1">
                      {reason.title}
                    </ItemHeading>
                    <p className="text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Image column — hidden until real image available */}
          <div className="hidden lg:block lg:w-1/2 w-full">
            {/* 
              [PLACEHOLDER: Add a real image here before launch]
              Suggested: A caregiver helping an elderly patient at home.
              Do NOT use stock photos of unaffiliated people without license.
            */}
            <div
              className="bg-[var(--color-border)] rounded-2xl aspect-video"
              aria-hidden="true"
            />
          </div>
        </div>
      </Container>
    </Section>
  )
}