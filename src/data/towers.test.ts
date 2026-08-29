import { describe, expect, it } from "vitest"

import { createBids } from "@/data/bids"
import { towers } from "@/data/towers"

describe("tower marketplace", () => {
  it("exposes four distinct towers with three façades and twelve units each", () => {
    expect(towers).toHaveLength(4)
    expect(new Set(towers.map((tower) => tower.style)).size).toBe(4)
    expect(new Set(towers.map((tower) => tower.startingPrice)).size).toBe(4)

    for (const tower of towers) {
      expect(tower.faces).toHaveLength(3)
      expect(tower.residences).toHaveLength(12)
      expect(tower.residences.every((residence) => residence.towerId === tower.id)).toBe(true)
      expect(tower.residences[0].priceValue).toBe(tower.startingPrice)
    }
  })

  it("creates clearly attributable bid activity for every tower", () => {
    for (const tower of towers) {
      const activity = createBids(tower)
      expect(activity).toHaveLength(5)
      expect(activity.every((bid) => bid.towerId === tower.id && bid.amount > 0)).toBe(true)
    }
  })
})
