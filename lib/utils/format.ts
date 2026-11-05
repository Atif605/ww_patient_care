import { isConfigured } from "@/config/site"

/**
 * Formatting & URL helpers.
 */

/**
 * Basic display formatting for a phone number.
 * Currently trims whitespace. Extend if you need grouped digits
 * (e.g., "+92 300 1234567").
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return ""
  return phone.trim()
}

/**
 * Build a WhatsApp `wa.me` deep link.
 * Returns "#" if the number isn't configured — callers should hide the button instead.
 *
 * Note: wa.me requires the number in international format without a leading `+`
 * or special characters. We strip everything except digits.
 */
export function getWhatsAppUrl(phone: string, message?: string): string {
  if (!isConfigured(phone)) return "#"

  const cleanPhone = phone.replace(/[^0-9]/g, "")
  if (!cleanPhone) return "#"

  const baseUrl = `https://wa.me/${cleanPhone}`
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl
}

/**
 * Build a `tel:` URL for click-to-call.
 * Allows an optional leading `+` for international numbers.
 * Returns "#" if the number isn't configured.
 */
export function getPhoneUrl(phone: string): string {
  if (!isConfigured(phone)) return "#"

  const cleanPhone = phone.replace(/[^0-9+]/g, "")
  if (!cleanPhone || cleanPhone === "+") return "#"

  return `tel:${cleanPhone}`
}