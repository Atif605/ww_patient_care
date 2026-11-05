import Link from "next/link"
import Image from "next/image"
import { PhoneCall } from "lucide-react"
import { siteConfig, isConfigured } from "@/config/site"
import { Nav } from "./Nav"
import { MobileMenu } from "./MobileMenu"
import { CallButton } from "@/components/widgets/CallButton"
import { Button } from "@/components/ui/Button"
import { Container } from "@/components/ui/Container"
import { getPhoneUrl } from "@/lib/utils/format"

export function Header() {
  const hasPhone = isConfigured(siteConfig.phone)

  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm"
      role="banner"
    >
      <Container className="flex h-16 md:h-20 items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
        >
          <Image
            src="/images/logo.svg"
            alt=""
            width={36}
            height={36}
            priority
            className="h-8 w-8 md:h-9 md:w-9"
          />
          <span className="text-lg sm:text-xl font-bold text-[var(--color-primary)]">
            {siteConfig.shortName}
          </span>
        </Link>

        {/* Desktop navigation */}
        <Nav />

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile-only icon call button */}
          {hasPhone && (
            <a
              href={getPhoneUrl(siteConfig.phone)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[var(--color-primary)] hover:bg-[var(--color-bg-muted)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] xl:hidden"
              aria-label={`Call us at ${siteConfig.phone}`}
              data-event="phone_click"
            >
              <PhoneCall className="h-5 w-5" aria-hidden="true" />
            </a>
          )}

          {/* Desktop call button */}
          {hasPhone && <CallButton className="hidden xl:flex" />}

          {/* Request Care — hide on smallest screens, show from sm up */}
          <Button
            href="/request-care"
            variant="primary"
            size="md"
            className="hidden sm:inline-flex"
          >
            Request Care
          </Button>

          {/* Mobile menu trigger */}
          <MobileMenu />
        </div>
      </Container>
    </header>
  )
}