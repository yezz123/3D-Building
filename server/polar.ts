export type PolarEnvironment = "production" | "sandbox"

const productIds: Record<PolarEnvironment, string> = {
  production: "32b74763-1291-462d-959a-d439c007f708",
  sandbox: "74207bba-0845-4ce1-8af4-a74a039939f1",
}

type PolarCheckout = {
  id: string
  status: "open" | "expired" | "confirmed" | "succeeded" | "failed"
  product_id: string | null
  customer_email?: string | null
}

export async function verifyPaidCheckout(checkoutId: string, environment: PolarEnvironment) {
  const isSandbox = environment === "sandbox"
  const tokenName = isSandbox ? "POLAR_SANDBOX_ACCESS_TOKEN" : "POLAR_ACCESS_TOKEN"
  const token = process.env[tokenName]?.trim()
  if (!token) throw new Error(`Missing server configuration: ${tokenName}`)

  const baseUrl = isSandbox ? "https://sandbox-api.polar.sh" : "https://api.polar.sh"
  const response = await fetch(`${baseUrl}/v1/checkouts/${encodeURIComponent(checkoutId)}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  })
  if (!response.ok) {
    if (response.status === 404) throw new ClaimVerificationError("We could not find that Polar checkout", 404)
    throw new ClaimVerificationError("Polar could not verify this checkout right now", 502)
  }

  const checkout = (await response.json()) as PolarCheckout
  const expectedProduct = process.env[isSandbox ? "POLAR_SANDBOX_PRODUCT_ID" : "POLAR_PRODUCT_ID"]?.trim()
    || productIds[environment]

  if (checkout.status !== "succeeded") {
    throw new ClaimVerificationError("This Polar checkout has not completed successfully", 402)
  }
  if (checkout.product_id !== expectedProduct) {
    throw new ClaimVerificationError("This checkout does not include the apartment brand claim", 403)
  }

  return checkout
}

export class ClaimVerificationError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
  }
}
