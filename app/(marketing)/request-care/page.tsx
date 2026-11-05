import { Suspense } from "react"
import { buildMetadata } from "@/lib/seo/metadata"
import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"
import { RequestCareForm } from "@/components/forms/RequestCareForm"

export const metadata = buildMetadata({
  title: "Request Care | WW Patient Care",
  description:
    "Request home patient care in Karachi. Tell us the service and location you need and our team will contact you to arrange an assessment.",
  path: "/request-care",
})

export default function RequestCarePage() {
  return (
    <Section className="bg-[var(--color-bg-muted)] pt-16 md:pt-24 pb-12">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-4">Request Care</h1>
            <p className="text-lg text-[var(--color-text-muted)]">
              Tell us what you need. This is a request, not an instant booking — our team will contact you to discuss next steps.
            </p>
          </div>

          <div className="bg-[var(--color-bg)] p-6 sm:p-8 rounded-xl border border-[var(--color-border)] shadow-sm">
            <Suspense fallback={<p role="status">Loading form…</p>}>
              <RequestCareForm />
            </Suspense>
          </div>
        </div>
      </Container>
    </Section>
  )
}
