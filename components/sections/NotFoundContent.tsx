import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"
import { Button } from "@/components/ui/Button"

export function NotFoundContent() {
  return (
    <Section className="pt-24 pb-24">
      <Container>
        <div className="max-w-xl mx-auto text-center">
          <p className="text-sm font-semibold text-[var(--color-accent)] mb-2">404</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-4">Page not found</h1>
          <p className="text-[var(--color-text-muted)] mb-8">
            The page you are looking for does not exist or is not available.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/" variant="primary">Back to home</Button>
            <Button href="/services" variant="outline">Our services</Button>
            <Button href="/contact" variant="outline">Contact us</Button>
          </div>
        </div>
      </Container>
    </Section>
  )
}
