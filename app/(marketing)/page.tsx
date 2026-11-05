import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo/metadata"
import { Hero } from "@/components/sections/Hero"
import { TrustStrip } from "@/components/sections/TrustStrip"
import { ServicesGrid } from "@/components/sections/ServicesGrid"
import { WhyChooseUs } from "@/components/sections/WhyChooseUs"
import { HowItWorks } from "@/components/sections/HowItWorks"
import { ServiceAreas } from "@/components/sections/ServiceAreas"
import { Testimonials } from "@/components/sections/Testimonials"
import { FAQ } from "@/components/sections/FAQ"
import { FinalCTA } from "@/components/sections/FinalCTA"
import { globalFaqs } from "@/data/faqs"

export const metadata: Metadata = buildMetadata({
  title: "WW Patient Care | Home Patient Care Services in Karachi",
  description:
    "Professional, compassionate home patient care and nursing services in Karachi. Trust us with the care of your loved ones.",
  path: "/",
})

export default function HomePage() {
  // Hide FAQs that still contain placeholder text
  const homepageFaqs = globalFaqs
    .filter(
      (faq) =>
        !faq.question.includes("[PLACEHOLDER") &&
        !faq.answer.includes("[PLACEHOLDER")
    )
    .slice(0, 5)

  return (
    <>
      <Hero />
      <TrustStrip />
      <ServicesGrid />
      <WhyChooseUs />
      <HowItWorks />
      <ServiceAreas />
      <Testimonials />
      {homepageFaqs.length > 0 && <FAQ faqs={homepageFaqs} />}
      <FinalCTA />
    </>
  )
}