export type ResidenceStatus = "available" | "preview" | "waitlist"

export type Residence = {
  id: string
  unit: string
  towerId: string
  floor: number
  wing: "A" | "B"
  beds: 1 | 2 | 3
  baths: number
  area: number
  exposure: string
  view: string
  plan: string
  price: string
  priceValue: number
  status: ResidenceStatus
  summary: string
}

type ResidenceTemplate = Omit<Residence, "id" | "unit" | "towerId" | "price" | "priceValue">

const residenceTemplates: ResidenceTemplate[] = [
  { floor: 2, wing: "A", beds: 1, baths: 1, area: 61, exposure: "East", view: "Garden court", plan: "The Studio+", status: "available", summary: "A compact east-facing home with a full-width morning terrace." },
  { floor: 2, wing: "B", beds: 2, baths: 2, area: 88, exposure: "West", view: "River bend", plan: "The Gallery", status: "preview", summary: "A through-plan residence with a long kitchen gallery and evening light." },
  { floor: 3, wing: "A", beds: 2, baths: 2, area: 91, exposure: "South-east", view: "Garden court", plan: "The Gallery", status: "available", summary: "Two quiet bedrooms frame an open corner living room and planted balcony." },
  { floor: 3, wing: "B", beds: 1, baths: 1, area: 64, exposure: "North-west", view: "City roofline", plan: "The Studio+", status: "available", summary: "A flexible one-bedroom with a pocket study and deep sunset window seat." },
  { floor: 4, wing: "A", beds: 3, baths: 2.5, area: 128, exposure: "South-east", view: "Park canopy", plan: "The Corner House", status: "waitlist", summary: "A dual-aspect family home with separated bedroom and entertaining wings." },
  { floor: 4, wing: "B", beds: 2, baths: 2, area: 96, exposure: "South-west", view: "River and city", plan: "The Gallery", status: "available", summary: "The building's signature split-corner plan with wraparound sunset glass." },
  { floor: 5, wing: "A", beds: 2, baths: 2, area: 99, exposure: "East", view: "Park horizon", plan: "The Gallery", status: "preview", summary: "A calm, wide plan with both bedrooms opening onto the planted terrace." },
  { floor: 5, wing: "B", beds: 1, baths: 1.5, area: 68, exposure: "West", view: "River bend", plan: "The Studio+", status: "available", summary: "A high-floor one-bedroom with a generous kitchen island and sunset loggia." },
  { floor: 6, wing: "A", beds: 3, baths: 2.5, area: 136, exposure: "South-east", view: "Park and skyline", plan: "The Corner House", status: "available", summary: "A high-floor corner home with two terraces and a separate utility room." },
  { floor: 6, wing: "B", beds: 2, baths: 2, area: 103, exposure: "South-west", view: "River panorama", plan: "The Gallery", status: "waitlist", summary: "Broad river views lead from the living room through to the primary suite." },
  { floor: 7, wing: "A", beds: 3, baths: 3, area: 142, exposure: "South-east", view: "Park panorama", plan: "The Sky House", status: "preview", summary: "A set-back sky home with a sheltered dining terrace and private entry hall." },
  { floor: 7, wing: "B", beds: 3, baths: 3, area: 145, exposure: "South-west", view: "River panorama", plan: "The Sky House", status: "available", summary: "The top south-west home, with a continuous terrace and horizon-level light." },
]

const priceMultipliers = [1, 1.22, 1.29, 1.07, 1.67, 1.42, 1.5, 1.15, 1.95, 1.65, 2.15, 2.28]

export function formatMad(value: number) {
  return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 1 : 2)}M MAD`
}

export function createTowerResidences(towerId: string, prefix: string, startingPrice: number) {
  return residenceTemplates.map((template, index): Residence => {
    const unit = `${template.floor}${template.wing}`
    const priceValue = Math.round((startingPrice * priceMultipliers[index]) / 10_000) * 10_000

    return {
      ...template,
      id: prefix ? `${prefix}-${unit}` : unit,
      unit,
      towerId,
      priceValue,
      price: formatMad(priceValue),
    }
  })
}

export const residences = createTowerResidences("atlas-court", "", 3_900_000)

export function filterResidences(
  beds: "all" | "1" | "2" | "3",
  catalogue: Residence[] = residences,
) {
  if (beds === "all") return catalogue
  return catalogue.filter((residence) => residence.beds === Number(beds))
}

export function getResidence(id: string, catalogue: Residence[] = residences) {
  return catalogue.find((residence) => residence.id === id) ?? catalogue[0]
}
