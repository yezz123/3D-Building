import type { Residence } from "@/data/residences"

export function FloorPlan({ residence }: { residence: Residence }) {
  const hasThirdRoom = residence.beds === 3

  return (
    <svg
      aria-label={`Diagram of ${residence.plan}, residence ${residence.id}`}
      className="floor-plan"
      role="img"
      viewBox="0 0 260 176"
    >
      <rect x="8" y="8" width="244" height="160" rx="4" />
      <path d="M112 8v96H8M112 58h140M174 58v110M112 104h62" />
      <path d="M45 104v64M75 104v28h37M212 58v44h40" />
      {hasThirdRoom ? <path d="M174 112h78M214 112v56" /> : <path d="M174 122h78" />}
      <path className="floor-plan__glass" d="M18 8h84M122 8h120" />
      <circle cx="143" cy="81" r="12" />
      <rect x="27" y="121" width="38" height="28" rx="2" />
      <rect x="190" y="76" width="43" height="22" rx="2" />
      <text x="18" y="27">LIVING</text>
      <text x="122" y="77">KITCHEN</text>
      <text x="182" y="147">BED {residence.beds}</text>
    </svg>
  )
}
