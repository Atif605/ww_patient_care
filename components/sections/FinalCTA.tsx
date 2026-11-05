import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"
import { Button } from "@/components/ui/Button"
import { siteConfig } from "@/config/site"
import { features } from "@/config/features"
import { getWhatsAppUrl, getPhoneUrl } from "@/lib/utils/format"
import { PhoneCall, MessageCircle } from "lucide-react"

const WHATSAPP_MESSAGE = "Hi, I'd like to arrange home care services."

export function FinalCTA() {
  const hasPhone = !siteConfig.phone.includes("PLACEHOLDER")
  const hasWhatsApp = !siteConfig.whatsapp.includes("PLACEHOLDER")

  return (
    <Section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white">
      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Arrange Care for Your Loved One?
          </h2>

          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Our team is here to answer your questions and help you find the
            right support.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Primary action */}
            <Button
              href="/request-care"
              size="lg"
              className="w-full sm:w-auto bg-white text-[var(--color-primary)] hover:bg-white/90 font-semibold"
            >
              Request Care Online
            </Button>

            {/* Phone CTA */}
            {features.callButton && hasPhone && (
              <Button
                href={getPhoneUrl(siteConfig.phone)}
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
                data-event="phone_click"
              >
                <PhoneCall className="mr-2 h-5 w-5" aria-hidden="true" />
                Call {siteConfig.phone}
              </Button>
            )}

            {/* WhatsApp CTA */}
            {features.whatsappWidget && hasWhatsApp && (
              <Button
                href={getWhatsAppUrl(siteConfig.whatsapp, WHATSAPP_MESSAGE)}
                size="lg"
                variant="whatsapp"
                className="w-full sm:w-auto"
                data-event="whatsapp_click"
              >
                <MessageCircle className="mr-2 h-5 w-5" aria-hidden="true" />
                WhatsApp Us
              </Button>
            )}
          </div>

          {/* Closing note — process, not promise */}
          <p className="mt-8 text-sm text-white/60">
            Fill the form or call us — we&apos;ll get back to you as soon as
            possible.
          </p>
        </div>
      </Container>
    </Section>
  )
}