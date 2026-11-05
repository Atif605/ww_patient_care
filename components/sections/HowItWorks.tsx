import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"

type Step = {
  number: string
  title: string
  description: string
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Request Care",
    description:
      "Reach out via phone, WhatsApp, or our online form to tell us what you need.",
  },
  {
    number: "02",
    title: "Initial Discussion",
    description:
      "We talk through your family's needs and answer any questions you may have.",
  },
  {
    number: "03",
    title: "Caregiver Match",
    description:
      "We match a caregiver based on your family's needs and preferences.",
  },
  {
    number: "04",
    title: "Ongoing Support",
    description:
      "Care begins, and we stay in touch to make adjustments as needed.",
  },
]

type HowItWorksProps = {
  headingLevel?: 2 | 3
}

export function HowItWorks({ headingLevel = 2 }: HowItWorksProps = {}) {
  const HeadingTag = `h${headingLevel}` as "h2" | "h3"

  return (
    <Section className="bg-[var(--color-bg)]">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <HeadingTag className="text-3xl font-bold text-[var(--color-primary)] mb-4">
            How It Works
          </HeadingTag>
          <p className="text-[var(--color-text-muted)]">
            Four simple steps to get quality care for your loved one.
          </p>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {STEPS.map((step, i) => {
            const isLast = i === STEPS.length - 1

            return (
              <li key={step.number} className="relative text-center">
                {/* Numbered circle */}
                <div
                  className="w-16 h-16 mx-auto bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 relative z-10"
                  aria-hidden="true"
                >
                  {step.number}
                </div>

                {/* Connector line — desktop only, between steps */}
                {!isLast && (
                  <div
                    className="hidden lg:block absolute top-8 left-[60%] right-[-40%] h-0.5 bg-[var(--color-border)]"
                    aria-hidden="true"
                  />
                )}

                {/* Screen reader hint */}
                <span className="sr-only">
                  Step {i + 1} of {STEPS.length}:
                </span>

                <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">
                  {step.title}
                </h3>
                <p className="text-[var(--color-text-muted)] leading-relaxed">
                  {step.description}
                </p>
              </li>
            )
          })}
        </ol>
      </Container>
    </Section>
  )
}