export type ResidenceStatus = "available" | "preview" | "waitlist"

export type Residence = {
  id: string
  floor: number
  wing: "A" | "B"
  beds: 1 | 2 | 3
  baths: number
  area: number
  exposure: string
  view: string
  plan: string
  price: string
  status: ResidenceStatus
  summary: string
}

export const residences: Residence[] = [
  {
    id: "2A",
    floor: 2,
    wing: "A",
    beds: 1,
    baths: 1,
    area: 61,
    exposure: "East",
    view: "Garden court",
    plan: "The Studio+",
    price: "$485k",
    status: "available",
    summary: "A compact east-facing home with a full-width morning terrace.",
  },
  {
    id: "2B",
    floor: 2,
    wing: "B",
    beds: 2,
    baths: 2,
    area: 88,
    exposure: "West",
    view: "River bend",
    plan: "The Gallery",
    price: "$640k",
    status: "preview",
    summary: "A through-plan residence with a long kitchen gallery and evening light.",
  },
  {
    id: "3A",
    floor: 3,
    wing: "A",
    beds: 2,
    baths: 2,
    area: 91,
    exposure: "South-east",
    view: "Garden court",
    plan: "The Gallery",
    price: "$665k",
    status: "available",
    summary: "Two quiet bedrooms frame an open corner living room and planted balcony.",
  },
  {
    id: "3B",
    floor: 3,
    wing: "B",
    beds: 1,
    baths: 1,
    area: 64,
    exposure: "North-west",
    view: "City roofline",
    plan: "The Studio+",
    price: "$510k",
    status: "available",
    summary: "A flexible one-bedroom with a pocket study and deep sunset window seat.",
  },
  {
    id: "4A",
    floor: 4,
    wing: "A",
    beds: 3,
    baths: 2.5,
    area: 128,
    exposure: "South-east",
    view: "Park canopy",
    plan: "The Corner House",
    price: "$910k",
    status: "waitlist",
    summary: "A dual-aspect family home with separated bedroom and entertaining wings.",
  },
  {
    id: "4B",
    floor: 4,
    wing: "B",
    beds: 2,
    baths: 2,
    area: 96,
    exposure: "South-west",
    view: "River + city",
    plan: "The Gallery",
    price: "$720k",
    status: "available",
    summary: "The building’s signature split-corner plan with wraparound sunset glass.",
  },
  {
    id: "5A",
    floor: 5,
    wing: "A",
    beds: 2,
    baths: 2,
    area: 99,
    exposure: "East",
    view: "Park horizon",
    plan: "The Gallery",
    price: "$755k",
    status: "preview",
    summary: "A calm, wide plan with both bedrooms opening onto the planted terrace.",
  },
  {
    id: "5B",
    floor: 5,
    wing: "B",
    beds: 1,
    baths: 1.5,
    area: 68,
    exposure: "West",
    view: "River bend",
    plan: "The Studio+",
    price: "$545k",
    status: "available",
    summary: "A high-floor one-bedroom with a generous kitchen island and sunset loggia.",
  },
  {
    id: "6A",
    floor: 6,
    wing: "A",
    beds: 3,
    baths: 2.5,
    area: 136,
    exposure: "South-east",
    view: "Park + skyline",
    plan: "The Corner House",
    price: "$1.05m",
    status: "available",
    summary: "A high-floor corner home with two terraces and a separate utility room.",
  },
  {
    id: "6B",
    floor: 6,
    wing: "B",
    beds: 2,
    baths: 2,
    area: 103,
    exposure: "South-west",
    view: "River panorama",
    plan: "The Gallery",
    price: "$820k",
    status: "waitlist",
    summary: "Broad river views lead from the living room through to the primary suite.",
  },
  {
    id: "7A",
    floor: 7,
    wing: "A",
    beds: 3,
    baths: 3,
    area: 142,
    exposure: "South-east",
    view: "Park panorama",
    plan: "The Sky House",
    price: "$1.18m",
    status: "preview",
    summary: "A set-back sky home with a sheltered dining terrace and private entry hall.",
  },
  {
    id: "7B",
    floor: 7,
    wing: "B",
    beds: 3,
    baths: 3,
    area: 145,
    exposure: "South-west",
    view: "River panorama",
    plan: "The Sky House",
    price: "$1.24m",
    status: "available",
    summary: "The top south-west home, with a continuous terrace and horizon-level light.",
  },
]

export function filterResidences(beds: "all" | "1" | "2" | "3") {
  if (beds === "all") return residences
  return residences.filter((residence) => residence.beds === Number(beds))
}

export function getResidence(id: string) {
  return residences.find((residence) => residence.id === id) ?? residences[0]
}
