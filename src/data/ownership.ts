export type ApartmentOwnership = {
  id: string
  towerId: string
  unit: string
  ownerName: string
  website: string
  logoUrl: string
  brandColor: string
  source: "showcase" | "customer"
}

export const defaultOwnerships: ApartmentOwnership[] = [
  {
    id: "atlas-court:4B",
    towerId: "atlas-court",
    unit: "4B",
    ownerName: "Syndiqo",
    website: "https://syndiqo.ma",
    logoUrl: "/syndiqo-mark.svg",
    brandColor: "#03aded",
    source: "showcase",
  },
  {
    id: "marina-fold:5A",
    towerId: "marina-fold",
    unit: "5A",
    ownerName: "HOET Technologies",
    website: "https://hoet.ma",
    logoUrl: "/hoet-mark.svg",
    brandColor: "#ff785a",
    source: "showcase",
  },
]

export function ownershipId(towerId: string, unit: string) {
  return `${towerId}:${unit}`
}

export function mergeOwnerships(customerOwnerships: ApartmentOwnership[]) {
  const merged = new Map(defaultOwnerships.map((ownership) => [ownership.id, ownership]))
  customerOwnerships.forEach((ownership) => {
    if (!merged.has(ownership.id)) merged.set(ownership.id, ownership)
  })
  return [...merged.values()]
}
