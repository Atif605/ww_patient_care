export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[var(--color-bg)] focus:px-4 focus:py-2 focus:font-medium focus:text-[var(--color-primary)] focus:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
    >
      Skip to main content
    </a>
  )
}