import {
  forwardRef,
  type ButtonHTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
} from "react"
import Link from "next/link"
import { cn } from "@/lib/utils/cn"

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "whatsapp"
type ButtonSize = "sm" | "md" | "lg"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  href?: string
  external?: boolean
  children?: ReactNode
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]",
  secondary:
    "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]",
  outline:
    "border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10",
  ghost:
    "text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10",
  whatsapp:
    "bg-[var(--color-success)] text-white hover:bg-[var(--color-success-dark)]",
}

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "h-9 px-4",
  md: "h-10 px-6",
  lg: "h-11 px-8 text-base",
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      href,
      external,
      children,
      type,
      ...props
    },
    ref
  ) => {
    const anchorProps = {
      onClick: props.onClick as unknown as MouseEventHandler<HTMLAnchorElement>,
      "aria-label": props["aria-label"],
      title: props.title,
    }
    const classes = cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
      "disabled:pointer-events-none disabled:opacity-50",
      VARIANT_STYLES[variant],
      SIZE_STYLES[size],
      className
    )

    if (href) {
      // Protocol links (tel:, mailto:) — no target, no rel
      const isProtocolLink =
        href.startsWith("tel:") || href.startsWith("mailto:")
      // External HTTP links
      const isHttpExternal =
        external ||
        href.startsWith("http://") ||
        href.startsWith("https://")

      if (isProtocolLink) {
        return (
          <a href={href} className={classes} {...anchorProps}>
            {children}
          </a>
        )
      }

      if (isHttpExternal) {
        return (
          <a
            href={href}
            className={classes}
            target="_blank"
            rel="noopener noreferrer"
            {...anchorProps}
          >
            {children}
          </a>
        )
      }

      // Internal Next.js Link
      return (
        <Link href={href} className={classes} {...anchorProps}>
          {children}
        </Link>
      )
    }

    return (
      <button
        type={type ?? "button"}
        className={classes}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"