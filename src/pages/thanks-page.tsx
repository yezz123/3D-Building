import { ArrowLeftIcon, CheckIcon } from "lucide-react"
import { Link } from "@tanstack/react-router"

import { BrandMark } from "@/components/brand/brand-mark"
import { ClaimForm } from "@/components/ownership/claim-form"
import { Button } from "@/components/ui/button"
import { usePageMetadata } from "@/hooks/use-page-metadata"
import { isSandboxCheckout } from "@/lib/checkout"

export function ThanksPage() {
  const params = new URLSearchParams(window.location.search)
  const checkoutId = params.get("checkout_id")?.trim() ?? ""
  const environment = params.get("environment") === "sandbox" || isSandboxCheckout ? "sandbox" : "production"

  usePageMetadata({
    title: "Buyer Pack Confirmed | Syndiqo Tower",
    description: "Your Syndiqo Tower digital buyer-pack checkout is complete.",
    robots: "noindex, nofollow, noarchive",
  })

  return (
    <main className="thanks-page">
      <div className="thanks-page__receipt">
        <div className="thanks-page__mark">
          <BrandMark />
        </div>
        <div className="thanks-page__icon" aria-hidden="true">
          <CheckIcon />
        </div>
        <p className="eyebrow">{environment === "sandbox" ? "Sandbox checkout complete" : "Purchase complete"}</p>
        <h1>Your buyer pack is ready to become a place.</h1>
        <p>
          {environment === "sandbox"
            ? "This is a Polar Sandbox purchase. No real payment was processed, but the claim flow uses the same verification path."
            : "Your secure Polar purchase is complete. Choose one available residence below and add your organization to the 3D tower."}
        </p>
        <Button asChild size="lg" variant="outline">
          <Link to="/">
            <ArrowLeftIcon data-icon="inline-start" />
            Return to the tower
          </Link>
        </Button>
      </div>
      {checkoutId ? <ClaimForm checkoutId={checkoutId} environment={environment} /> : (
        <section className="claim-card claim-card--missing">
          <h2>Open this page from your Polar receipt.</h2>
          <p>The secure checkout ID is missing. Return to the tower and complete checkout to unlock an apartment brand claim.</p>
        </section>
      )}
    </main>
  )
}
