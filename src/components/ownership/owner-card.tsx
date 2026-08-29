import { ArrowUpRightIcon, Building2Icon } from "lucide-react"
import type { CSSProperties } from "react"

import type { ApartmentOwnership } from "@/data/ownership"

export function OwnerCard({ ownership }: { ownership: ApartmentOwnership }) {
  return (
    <a
      className="owner-card"
      href={ownership.website}
      rel="noreferrer"
      style={{ "--owner-color": ownership.brandColor } as CSSProperties}
      target="_blank"
    >
      <span className="owner-card__logo">
        <img alt={`${ownership.ownerName} logo`} src={ownership.logoUrl} />
      </span>
      <span>
        <small>{ownership.source === "showcase" ? "Showcase resident" : "Branded resident"}</small>
        <strong>{ownership.ownerName}</strong>
      </span>
      <ArrowUpRightIcon aria-hidden="true" />
    </a>
  )
}

export function UnclaimedOwnerCard() {
  return (
    <div className="owner-card owner-card--empty">
      <span className="owner-card__logo"><Building2Icon aria-hidden="true" /></span>
      <span>
        <small>Digital address</small>
        <strong>Available to brand</strong>
      </span>
    </div>
  )
}
