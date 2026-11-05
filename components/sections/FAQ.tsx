import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"
import type { FAQ as FAQType } from "@/types"
import { ChevronDown } from "lucide-react"

type FAQProps = {
  faqs: FAQType[]
  title?: string
  headingLevel?: 2 | 3 | 4
}

export function FAQ({
  faqs,
  title = "Frequently Asked Questions",
  headingLevel = 2,
}: FAQProps) {
  if (!faqs || faqs.length === 0) return null

  const HeadingTag = `h${headingLevel}` as "h2" | "h3" | "h4"

  return (
    <Section className="bg-[var(--color-bg)]">
      <Container>
        <div className="max-w-3xl mx-auto">
          <HeadingTag className="text-3xl font-bold text-[var(--color-primary)] mb-8 text-center">
            {title}
          </HeadingTag>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group border border-[var(--color-border)] rounded-lg overflow-hidden [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer font-medium text-[var(--color-text)] hover:bg-[var(--color-bg-muted)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-inset">
                  <span>{faq.question}</span>
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-[var(--color-text-muted)] transition-transform duration-200 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="px-6 pb-5 pt-4 text-[var(--color-text-muted)] leading-relaxed border-t border-[var(--color-border)]">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}