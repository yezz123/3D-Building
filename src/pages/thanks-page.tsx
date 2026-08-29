import { ArrowLeftIcon, CheckIcon } from "lucide-react"
import { Link } from "@tanstack/react-router"

import { BrandMark } from "@/components/brand/brand-mark"
import { Button } from "@/components/ui/button"
import { usePageMetadata } from "@/hooks/use-page-metadata"
import { isSandboxCheckout } from "@/lib/checkout"

export function ThanksPage() {
  usePageMetadata({
    title: "Buyer Pack Confirmed | Syndiqo Tower",
    description: "Your Syndiqo Tower digital buyer-pack checkout is complete.",
    robots: "noindex, nofollow, noarchive",
  })

  return (
    <main className="thanks-page">
      <div className="thanks-page__mark">
        <BrandMark />
      </div>
      <div className="thanks-page__icon" aria-hidden="true">
        <CheckIcon />
      </div>
      <p className="eyebrow">{isSandboxCheckout ? "Sandbox checkout complete" : "Purchase complete"}</p>
      <h1>Your buyer pack is on the list.</h1>
      <p>
        {isSandboxCheckout
          ? "This was a Polar Sandbox purchase, so no real payment was processed."
          : "Your secure Polar purchase is complete. Delivery and project updates will follow by email."}
      </p>
      <Button asChild size="lg" variant="outline">
        <Link to="/">
          <ArrowLeftIcon data-icon="inline-start" />
          Return to the tower
        </Link>
      </Button>
    </main>
  )
}
