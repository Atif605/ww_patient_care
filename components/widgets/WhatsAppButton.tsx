import { siteConfig } from "@/config/site"
import { features } from "@/config/features"
import { getWhatsAppUrl } from "@/lib/utils/format"
import { MessageCircle } from "lucide-react"

export function WhatsAppButton() {
  if (!features.whatsappWidget) return null
  if (!siteConfig.whatsapp || siteConfig.whatsapp.includes("PLACEHOLDER")) {
    return null
  }

  return (
    <a
      href={getWhatsAppUrl(
        siteConfig.whatsapp,
        "Hello! I would like to inquire about home patient care services."
      )}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-success)] text-white shadow-lg transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-success)] focus-visible:ring-offset-2 motion-safe:hover:scale-110"
      aria-label="Chat with us on WhatsApp (opens in a new tab)"
      data-event="whatsapp_click"
    >
      <MessageCircle className="h-7 w-7" aria-hidden="true" />
    </a>
  )
}