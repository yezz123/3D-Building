import { describe, expect, it } from "vitest"

import { filterResidences, getResidence, residences } from "@/data/residences"

describe("residence catalogue", () => {
  it("models two unique residences on every released floor", () => {
    expect(residences).toHaveLength(12)
    expect(new Set(residences.map((residence) => residence.id)).size).toBe(12)

    for (const floor of [2, 3, 4, 5, 6, 7]) {
      expect(residences.filter((residence) => residence.floor === floor)).toHaveLength(2)
    }
  })

  it("filters by bedroom count and falls back for unknown ids", () => {
    expect(filterResidences("1").every((residence) => residence.beds === 1)).toBe(true)
    expect(filterResidences("2")).toHaveLength(5)
    expect(getResidence("not-a-home")).toBe(residences[0])
  })
})
