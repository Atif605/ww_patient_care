import { PhoneCall } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { siteConfig } from "@/config/site"
import { features } from "@/config/features"
import { getPhoneUrl } from "@/lib/utils/format"

interface CallButtonProps {
  className?: string
}

export function CallButton({ className }: CallButtonProps) {
  if (!features.callButton) return null
  if (!siteConfig.phone || siteConfig.phone.includes("PLACEHOLDER")) return null

  return (
    <Button
      variant="primary"
      href={getPhoneUrl(siteConfig.phone)}
      className={className}
      data-event="phone_click"
      aria-label={`Call us at ${siteConfig.phone}`}
    >
      <PhoneCall className="mr-2 h-4 w-4" aria-hidden="true" />
      {siteConfig.phone}
    </Button>
  )
}