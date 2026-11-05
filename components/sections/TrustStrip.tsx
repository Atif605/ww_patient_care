import { Container } from "@/components/ui/Container"
import { Shield, Clock, MapPin, Heart, type LucideIcon } from "lucide-react"

type TrustPoint = {
  icon: LucideIcon
  title: string
}

// Neutral, verifiable claims only.
// TODO: Verify each claim with the business owner before publishing.
const TRUST_POINTS: TrustPoint[] = [
  { icon: MapPin, title: "Karachi-Based Service" },
  { icon: Heart, title: "Family-Centered Care" },
  { icon: Shield, title: "Carefully Selected Team" },
  { icon: Clock, title: "Convenient Timing" },
]

export function TrustStrip() {
  return (
    <section
      className="bg-[var(--color-primary)] py-8"
      aria-label="Why families choose us"
    >
      <Container>
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
          {TRUST_POINTS.map((point) => {
            const Icon = point.icon
            return (
              <li
                key={point.title}
                className="flex flex-col items-center text-center gap-2"
              >
                <Icon
                  className="h-7 w-7 text-[var(--color-accent)]"
                  aria-hidden="true"
                />
                <p className="font-medium text-sm sm:text-base">
                  {point.title}
                </p>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}