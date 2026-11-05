import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { NotFoundContent } from "@/components/sections/NotFoundContent"

export const metadata = { title: "Page not found", robots: { index: false } }

// Rendered for URLs that match no route at all.
export default function GlobalNotFound() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <NotFoundContent />
      </main>
      <Footer />
    </>
  )
}
