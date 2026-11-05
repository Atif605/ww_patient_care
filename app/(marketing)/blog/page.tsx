import * as React from "react"
import { buildMetadata } from "@/lib/seo/metadata"
import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"

export const metadata = buildMetadata({
  title: "Blog | WW Patient Care",
  description: "Read the latest news, tips, and insights on home patient care and nursing from WW Patient Care.",
  path: "/blog",
})

export default function BlogPage() {
  return (
    <Section className="bg-[var(--color-bg-muted)] min-h-screen pt-16 md:pt-24 pb-12">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-6">Our Blog</h1>
          <p className="text-lg text-[var(--color-text-muted)] mb-12">
            Insights, tips, and news regarding home patient care in Karachi.
          </p>
          
          <div className="bg-[var(--color-bg)] p-12 rounded-xl border border-[var(--color-border)]">
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4">Coming Soon</h2>
            <p className="text-[var(--color-text-muted)]">
              We are working on putting together helpful resources for you and your family. Please check back later.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  )
}
