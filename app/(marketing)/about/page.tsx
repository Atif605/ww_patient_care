import * as React from "react"
import { buildMetadata } from "@/lib/seo/metadata"
import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"
import { FinalCTA } from "@/components/sections/FinalCTA"
import Link from "next/link"
import { aboutContent } from "@/config/content"
import { siteConfig } from "@/config/site"

export const metadata = buildMetadata({
  title: "About Us | WW Patient Care",
  description: "Learn about Worldwide Home Patient Care Services, our mission, vision, and the compassionate team behind our home care services in Karachi.",
  path: "/about",
})

export default function AboutPage() {
  return (
    <>
      <Section className="bg-[var(--color-bg-muted)] pt-16 md:pt-24 pb-12">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-6">About {siteConfig.shortName}</h1>
            <p className="text-lg text-[var(--color-text-muted)]">
              Dedicated to bringing professional, compassionate healthcare to your home.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-[var(--color-bg)]">
        <Container>
          <div className="max-w-3xl mx-auto space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Who we are</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                {siteConfig.name} arranges home patient care in Karachi. Please read our{" "}
                <Link href="/legal/healthcare-disclaimer" className="text-[var(--color-primary)] underline">healthcare disclaimer</Link>{" "}
                for the difference between non-clinical support and clinical care, and{" "}
                <Link href="/services" className="text-[var(--color-primary)] underline">see the services</Link>{" "}
                currently offered.
              </p>
            </div>

            {aboutContent.mission && (
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Our Mission</h2>
                <p className="text-[var(--color-text-muted)] leading-relaxed">{aboutContent.mission}</p>
              </div>
            )}

            {aboutContent.vision && (
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Our Vision</h2>
                <p className="text-[var(--color-text-muted)] leading-relaxed">{aboutContent.vision}</p>
              </div>
            )}

            {aboutContent.values.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Our Values</h2>
                <ul className="list-disc pl-6 text-[var(--color-text-muted)] space-y-2">
                  {aboutContent.values.map((v) => (
                    <li key={v.title}><strong>{v.title}</strong> – {v.text}</li>
                  ))}
                </ul>
              </div>
            )}

            {aboutContent.story.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Our Story</h2>
                <div className="text-[var(--color-text-muted)] space-y-4 leading-relaxed">
                  {aboutContent.story.map((para, i) => <p key={i}>{para}</p>)}
                </div>
              </div>
            )}

            {(aboutContent.team.intro || aboutContent.team.groups.length > 0) && (
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Our Team</h2>
                {aboutContent.team.intro && (
                  <p className="text-[var(--color-text-muted)] leading-relaxed mb-6">{aboutContent.team.intro}</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {aboutContent.team.groups.map((g) => (
                    <div key={g.title} className="p-4 border border-[var(--color-border)] rounded-lg">
                      <h3 className="font-bold text-[var(--color-text)]">{g.title}</h3>
                      <p className="text-sm text-[var(--color-text-muted)]">{g.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>

      <FinalCTA />
    </>
  )
}
