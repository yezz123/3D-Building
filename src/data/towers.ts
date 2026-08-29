import { createTowerResidences, type Residence } from "@/data/residences"

export type TowerStyle = "terraces" | "split" | "frame" | "crown"

export type Tower = {
  id: string
  code: string
  index: string
  name: string
  district: string
  city: string
  description: string
  designNote: string
  style: TowerStyle
  startingPrice: number
  priceLabel: string
  floors: number
  homes: number
  activeBids: number
  marketMove: number
  faces: readonly [string, string, string]
  palette: { body: string; bodySecondary: string; glass: string; accent: string; slab: string }
  residences: Residence[]
}

type TowerDefinition = Omit<Tower, "priceLabel" | "residences">

const definitions: TowerDefinition[] = [
  {
    id: "atlas-court", code: "ATC", index: "01", name: "Atlas Court", district: "Casa Anfa", city: "Casablanca",
    description: "Layered garden terraces made for long morning light and calm city views.", designNote: "Stepped terraces / mineral frame", style: "terraces",
    startingPrice: 3_900_000, floors: 18, homes: 36, activeBids: 18, marketMove: 1.8,
    faces: ["Court", "Sun", "Garden"],
    palette: { body: "#193653", bodySecondary: "#284b67", glass: "#9eddf4", accent: "#03aded", slab: "#e5ecef" },
  },
  {
    id: "marina-fold", code: "MRF", index: "02", name: "Marina Fold", district: "Ain Diab", city: "Casablanca",
    description: "Two slender wings open toward the Atlantic and meet at a glass sky lobby.", designNote: "Split volume / ocean glass", style: "split",
    startingPrice: 5_200_000, floors: 22, homes: 44, activeBids: 24, marketMove: 2.4,
    faces: ["Marina", "Atlantic", "City"],
    palette: { body: "#12304f", bodySecondary: "#35657d", glass: "#a8e8f7", accent: "#2bc4e9", slab: "#f0eee7" },
  },
  {
    id: "cedar-terraces", code: "CDT", index: "03", name: "Cedar Terraces", district: "Bouskoura", city: "Casablanca",
    description: "A warm structural grid wraps broad family homes and planted corner rooms.", designNote: "Deep frame / planted corners", style: "frame",
    startingPrice: 6_850_000, floors: 16, homes: 32, activeBids: 11, marketMove: 0.9,
    faces: ["Arrival", "Cedar", "Park"],
    palette: { body: "#1c3850", bodySecondary: "#8c7964", glass: "#8fcbdc", accent: "#03aded", slab: "#d8d0c4" },
  },
  {
    id: "horizon-three", code: "HR3", index: "04", name: "Horizon Three", district: "Rabat Agdal", city: "Rabat",
    description: "A sculpted three-level crown gives every upper home a different horizon line.", designNote: "Tiered crown / civic stone", style: "crown",
    startingPrice: 8_400_000, floors: 24, homes: 48, activeBids: 9, marketMove: 3.1,
    faces: ["Boulevard", "Medina", "Horizon"],
    palette: { body: "#10223f", bodySecondary: "#52677d", glass: "#bcecf7", accent: "#19b8e7", slab: "#e7e3d9" },
  },
]

export const towers: Tower[] = definitions.map((tower) => ({
  ...tower,
  priceLabel: `From ${(tower.startingPrice / 1_000_000).toFixed(2).replace(/0$/, "")}M MAD`,
  residences: createTowerResidences(tower.id, tower.id === "atlas-court" ? "" : tower.code, tower.startingPrice),
}))

export function getTower(id: string) {
  return towers.find((tower) => tower.id === id) ?? towers[0]
}
