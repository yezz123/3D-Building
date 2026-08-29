import { describe, expect, it } from "vitest"

import { getCheckoutUrl } from "@/lib/checkout"

describe("getCheckoutUrl", () => {
  it("uses the safe Sandbox fallback and carries Syndiqo attribution", () => {
    const url = new URL(getCheckoutUrl("7B"))

    expect(url.origin).toBe("https://sandbox-api.polar.sh")
    expect(url.searchParams.get("reference_id")).toBe("syndiqo-tower-7b")
    expect(url.searchParams.get("theme")).toBe("light")
    expect(url.searchParams.get("utm_source")).toBe("syndiqo-tower")
    expect(url.searchParams.get("utm_content")).toBe("residence-7b")
  })
})
