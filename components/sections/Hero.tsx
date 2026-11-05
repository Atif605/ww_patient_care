import { Button } from "@/components/ui/Button"
import { Container } from "@/components/ui/Container"
import { siteConfig } from "@/config/site"
import { features } from "@/config/features"
import { getWhatsAppUrl, getPhoneUrl } from "@/lib/utils/format"
import { PhoneCall, MessageCircle, CheckCircle } from "lucide-react"

export function Hero() {
  const hasPhone = !siteConfig.phone.includes("PLACEHOLDER")
  const hasWhatsApp = !siteConfig.whatsapp.includes("PLACEHOLDER")

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-br from-[var(--color-bg-muted)] via-white to-[var(--color-accent-soft)] pt-16 md:pt-24 lg:pt-32 pb-16 md:pb-24"
      aria-labelledby="hero-heading"
    >
      <Container className="relative z-10">
        <div className="max-w-3xl">
          {/* Location / eyebrow badge */}
          <div className="mb-5 inline-flex items-center rounded-full bg-[var(--color-accent-soft)] px-4 py-1.5 text-sm font-medium text-[var(--color-primary)]">
            Serving Karachi Families
          </div>

          {/* Main heading — exactly ONE h1 per page */}
          <h1
            id="hero-heading"
            className="text-4xl font-bold tracking-tight text-[var(--color-primary)] sm:text-5xl md:text-6xl mb-6"
          >
            Worldwide Home Patient Care in Karachi
          </h1>

          {/* Subheading */}
          <p className="text-lg text-[var(--color-text-muted)] sm:text-xl mb-8 max-w-2xl">
            Professional and reliable in-home healthcare services for your loved
            ones. We bring quality care to your doorstep.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Button href="/request-care" size="lg" variant="primary">
              Request Care Now
            </Button>

            {features.callButton && hasPhone && (
              <Button
                href={getPhoneUrl(siteConfig.phone)}
                size="lg"
                variant="outline"
                data-event="phone_click"
              >
                <PhoneCall className="mr-2 h-5 w-5" aria-hidden="true" />
                <span className="hidden sm:inline">{siteConfig.phone}</span>
                <span className="sm:hidden">Call Now</span>
              </Button>
            )}

            {features.whatsappWidget && hasWhatsApp && (
              <Button
                href={getWhatsAppUrl(
                  siteConfig.whatsapp,
                  "Hi, I'd like to request care services."
                )}
                size="lg"
                variant="whatsapp"
                data-event="whatsapp_click"
              >
                <MessageCircle className="mr-2 h-5 w-5" aria-hidden="true" />
                <span className="hidden sm:inline">WhatsApp Us</span>
                <span className="sm:hidden">WhatsApp</span>
              </Button>
            )}
          </div>

          {/* Trust indicators — neutral, verifiable statements only */}
          <div className="pt-8 border-t border-[var(--color-border)]">
            <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-[var(--color-text-muted)]">
              <li className="flex items-center gap-2">
                <CheckCircle
                  className="h-4 w-4 shrink-0 text-[var(--color-accent)]"
                  aria-hidden="true"
                />
                <span>Karachi-based service</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle
                  className="h-4 w-4 shrink-0 text-[var(--color-accent)]"
                  aria-hidden="true"
                />
                <span>Family-centered care</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle
                  className="h-4 w-4 shrink-0 text-[var(--color-accent)]"
                  aria-hidden="true"
                />
                <span>Fast response</span>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  )
}