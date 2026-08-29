import { describe, expect, it } from "vitest"

import { defaultOwnerships, mergeOwnerships, ownershipId, type ApartmentOwnership } from "@/data/ownership"

describe("apartment ownerships", () => {
  it("keeps the default Syndiqo and HOET showcase homes reserved", () => {
    const attemptedOverride: ApartmentOwnership = {
      ...defaultOwnerships[0],
      ownerName: "Override",
      source: "customer",
    }

    expect(mergeOwnerships([attemptedOverride])).toEqual(defaultOwnerships)
  })

  it("adds paid customer claims after the showcase homes", () => {
    const customer: ApartmentOwnership = {
      id: ownershipId("cedar-terraces", "6A"),
      towerId: "cedar-terraces",
      unit: "6A",
      ownerName: "Northstar",
      website: "https://example.com/",
      logoUrl: "/api/logo?key=logo",
      brandColor: "#112233",
      source: "customer",
    }

    expect(mergeOwnerships([customer])).toEqual([...defaultOwnerships, customer])
  })
})
