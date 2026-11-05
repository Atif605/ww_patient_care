"use client"

import { useEffect, useRef } from "react"

/**
 * Traps keyboard focus inside the referenced element while `isActive` is true.
 *
 * - Restores focus to the previously focused element on deactivate.
 * - Cycles Tab / Shift+Tab within the container.
 * - Skips hidden elements (offsetParent === null).
 *
 * Usage:
 *   const trapRef = useFocusTrap(isOpen)
 *   return <div ref={trapRef}>...</div>
 */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(
  isActive: boolean
) {
  const containerRef = useRef<T>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    // Remember what was focused before the trap opened
    previouslyFocused.current = document.activeElement as HTMLElement | null

    const container = containerRef.current

    const getFocusable = (): HTMLElement[] => {
      const selector =
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
        (el) => el.offsetParent !== null
      )
    }

    // Move focus into the trap (first focusable element, or the container)
    const focusables = getFocusable()
    if (focusables.length > 0) {
      focusables[0].focus()
    } else {
      container.setAttribute("tabindex", "-1")
      container.focus()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      const items = getFocusable()
      if (items.length === 0) {
        e.preventDefault()
        return
      }

      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (e.shiftKey) {
        if (active === first || !container.contains(active)) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (active === last || !container.contains(active)) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)

      // Restore focus to whatever was focused before
      const previous = previouslyFocused.current
      if (previous && document.body.contains(previous)) {
        previous.focus()
      }
    }
  }, [isActive])

  return containerRef
}