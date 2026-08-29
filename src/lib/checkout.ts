const FALLBACK_POLAR_SANDBOX_CHECKOUT =
  "https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_5T9Nf0B3axsDxcObyl506qeUXrzbNh4wKbxPo3xGLid/redirect"

const configuredCheckout = import.meta.env.VITE_POLAR_CHECKOUT_URL?.trim()

export const POLAR_CHECKOUT_URL = configuredCheckout || FALLBACK_POLAR_SANDBOX_CHECKOUT
export const isSandboxCheckout =
  import.meta.env.VITE_POLAR_ENVIRONMENT !== "production" || POLAR_CHECKOUT_URL.includes("sandbox")

export function getCheckoutUrl(residenceId: string) {
  const url = new URL(POLAR_CHECKOUT_URL)
  url.searchParams.set("theme", "light")
  url.searchParams.set("reference_id", `syndiqo-tower-${residenceId.toLowerCase()}`)
  url.searchParams.set("utm_source", "syndiqo-tower")
  url.searchParams.set("utm_medium", "interactive-3d")
  url.searchParams.set("utm_campaign", "buyer-pack")
  url.searchParams.set("utm_content", `residence-${residenceId.toLowerCase()}`)
  return url.toString()
}

export { FALLBACK_POLAR_SANDBOX_CHECKOUT }
