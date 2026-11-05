"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { navigation } from "@/config/navigation"
import { siteConfig } from "@/config/site"
import { getPhoneUrl, getWhatsAppUrl } from "@/lib/utils/format"
import { features } from "@/config/features"
import { Menu, X, PhoneCall, MessageCircle } from "lucide-react"
import { useFocusTrap } from "@/lib/hooks/useFocusTrap"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const trapRef = useFocusTrap(isOpen)

  const hasPhone = !siteConfig.phone.includes("PLACEHOLDER")
  const hasWhatsApp = !siteConfig.whatsapp.includes("PLACEHOLDER")

  const closeMenu = useCallback(() => {
    setIsOpen(false)
    requestAnimationFrame(() => {
      triggerRef.current?.focus()
    })
  }, [])

  // ESC to close
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu()
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, closeMenu])

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  return (
    <div className="lg:hidden">
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        className="inline-flex items-center justify-center rounded-md p-2 text-[var(--color-text)] hover:bg-[var(--color-bg-muted)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        onClick={() => setIsOpen(true)}
        aria-controls="mobile-menu-drawer"
        aria-expanded={isOpen}
        aria-label="Open main menu"
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 motion-safe:animate-[fadeIn_200ms_ease-out]"
            aria-hidden="true"
            onClick={closeMenu}
          />

          {/* Drawer */}
          <div
            ref={trapRef}
            id="mobile-menu-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation menu"
            className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-[var(--color-bg)] pb-6 shadow-xl motion-safe:animate-[slideInRight_250ms_ease-out]"
          >
            {/* Header row: brand + close */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-4">
              <span className="text-lg font-bold text-[var(--color-primary)]">
                {siteConfig.shortName}
              </span>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-bg-muted)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Navigation */}
            <nav
              aria-label="Main navigation"
              className="flex-1 px-4 py-4"
            >
              <ul className="space-y-1">
                {navigation.main.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        aria-current={isActive ? "page" : undefined}
                        className={`block rounded-md px-3 py-2 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
                          isActive
                            ? "bg-[var(--color-accent-soft)] text-[var(--color-primary)] font-semibold"
                            : "text-[var(--color-text)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-primary)]"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* CTAs */}
            <div className="border-t border-[var(--color-border)] px-4 py-4 space-y-2">
              <Link
                href="/request-care"
                onClick={closeMenu}
                className="block w-full rounded-lg bg-[var(--color-primary)] text-white text-center px-4 py-3 text-base font-medium hover:bg-[var(--color-primary-dark)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
              >
                Request Care
              </Link>

              {features.callButton && hasPhone && (
                <a
                  href={getPhoneUrl(siteConfig.phone)}
                  onClick={closeMenu}
                  data-event="phone_click"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] px-4 py-3 text-base font-medium hover:bg-[var(--color-bg-muted)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
                >
                  <PhoneCall className="h-5 w-5" aria-hidden="true" />
                  Call Now
                </a>
              )}

              {features.whatsappWidget && hasWhatsApp && (
                <a
                  href={getWhatsAppUrl(
                    siteConfig.whatsapp,
                    "Hi, I'd like to know more about your services."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  data-event="whatsapp_click"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-success)] bg-[var(--color-success)] text-white px-4 py-3 text-base font-medium hover:bg-[var(--color-success)]/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-success)] focus-visible:ring-offset-2"
                >
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}