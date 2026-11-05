import Link from "next/link"
import { MapPin, Phone, Mail } from "lucide-react"
import { siteConfig, isConfigured } from "@/config/site"
import { navigation } from "@/config/navigation"
import { Container } from "@/components/ui/Container"
import { getWhatsAppUrl, getPhoneUrl } from "@/lib/utils/format"
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  YouTubeIcon,
  WhatsAppIcon,
} from "@/components/icons/SocialIcons"

export function Footer() {
  const hasPhone = isConfigured(siteConfig.phone)
  const hasWhatsApp = isConfigured(siteConfig.whatsapp)
  const hasEmail = isConfigured(siteConfig.email)

  const socials = [
    {
      name: "Facebook",
      href: siteConfig.social.facebook,
      Icon: FacebookIcon,
    },
    {
      name: "Instagram",
      href: siteConfig.social.instagram,
      Icon: InstagramIcon,
    },
    {
      name: "LinkedIn",
      href: siteConfig.social.linkedin,
      Icon: LinkedInIcon,
    },
    {
      name: "YouTube",
      href: siteConfig.social.youtube,
      Icon: YouTubeIcon,
    },
  ].filter((s) => s.href && isConfigured(s.href))

  return (
    <footer
      className="bg-[var(--color-bg-muted)] border-t border-[var(--color-border)] py-12"
      role="contentinfo"
    >
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1 — Brand + NAP + CTAs */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-lg font-bold text-[var(--color-primary)] mb-4">
              {siteConfig.shortName}
            </p>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              {siteConfig.tagline}
            </p>

            <ul className="text-sm text-[var(--color-text-muted)] space-y-2">
              {isConfigured(siteConfig.address.full) && (
                <li className="flex items-start gap-2">
                  <MapPin
                    className="h-4 w-4 mt-0.5 shrink-0 text-[var(--color-accent)]"
                    aria-hidden="true"
                  />
                  <address className="not-italic">
                    {siteConfig.address.full}
                  </address>
                </li>
              )}
              {isConfigured(siteConfig.hours) && (
                <li className="flex items-start gap-2">
                  <span className="sr-only">Operating hours:</span>
                  {siteConfig.hours}
                </li>
              )}

              {hasPhone && (
                <li className="flex items-start gap-2">
                  <Phone
                    className="h-4 w-4 mt-0.5 shrink-0 text-[var(--color-accent)]"
                    aria-hidden="true"
                  />
                  <a
                    href={getPhoneUrl(siteConfig.phone)}
                    className="hover:text-[var(--color-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded"
                    data-event="phone_click"
                  >
                    {siteConfig.phone}
                  </a>
                </li>
              )}

              {hasEmail && (
                <li className="flex items-start gap-2">
                  <Mail
                    className="h-4 w-4 mt-0.5 shrink-0 text-[var(--color-accent)]"
                    aria-hidden="true"
                  />
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="hover:text-[var(--color-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded break-all"
                  >
                    {siteConfig.email}
                  </a>
                </li>
              )}
            </ul>

            {/* Quick CTAs */}
            <div className="mt-6 flex flex-col gap-2">
              <Link
                href="/request-care"
                className="inline-flex items-center justify-center rounded-lg bg-[var(--color-primary)] text-white px-4 py-2 text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
              >
                Request Care
              </Link>

              {hasWhatsApp && (
                <a
                  href={getWhatsAppUrl(
                    siteConfig.whatsapp,
                    "Hi, I'd like to know more about your services."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--color-success)] text-[var(--color-success)] px-4 py-2 text-sm font-medium hover:bg-[var(--color-success)] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-success)] focus-visible:ring-offset-2"
                  data-event="whatsapp_click"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp
                </a>
              )}
            </div>

            {/* Social Icons */}
            {socials.length > 0 && (
              <ul className="flex flex-wrap gap-2 mt-6">
                {socials.map(({ name, href, Icon }) => (
                  <li key={name}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Follow us on ${name} (opens in new tab)`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Column 2 — Services */}
          <nav aria-labelledby="footer-services-heading">
            <h2
              id="footer-services-heading"
              className="text-sm font-semibold text-[var(--color-text)] uppercase tracking-wider mb-4"
            >
              Services
            </h2>
            <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
              {navigation.footer.services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="hover:text-[var(--color-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3 — Company */}
          <nav aria-labelledby="footer-company-heading">
            <h2
              id="footer-company-heading"
              className="text-sm font-semibold text-[var(--color-text)] uppercase tracking-wider mb-4"
            >
              Company
            </h2>
            <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
              {navigation.footer.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="hover:text-[var(--color-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 4 — Legal */}
          <nav aria-labelledby="footer-legal-heading">
            <h2
              id="footer-legal-heading"
              className="text-sm font-semibold text-[var(--color-text)] uppercase tracking-wider mb-4"
            >
              Legal
            </h2>
            <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
              {navigation.footer.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="hover:text-[var(--color-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-xs text-[var(--color-text-muted)] text-center md:text-left w-full md:w-auto">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] text-center md:text-right max-w-xl leading-relaxed">
            <span className="font-semibold">Disclaimer:</span> The content on
            this website is for informational purposes only. It is not
            intended to be a substitute for professional medical advice,
            diagnosis, or treatment. In case of a medical emergency, call an
            ambulance or visit the nearest hospital immediately.
          </p>
        </div>
      </Container>
    </footer>
  )
}