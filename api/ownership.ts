import { createHash, randomUUID } from "node:crypto"
import type { VercelRequest, VercelResponse } from "@vercel/node"

import { ClaimVerificationError, verifyPaidCheckout, type PolarEnvironment } from "../server/polar.js"
import { deleteObject, getJsonObject, isStatus, listClaimKeys, objectExists, putObject } from "../server/r2.js"

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const TOWER_IDS = new Set(["atlas-court", "marina-fold", "cedar-terraces", "horizon-three"])
const RESERVED_APARTMENT_IDS = new Set(["atlas-court:4B", "marina-fold:5A"])
const UNIT = /^[2-7][AB]$/
const COLOR = /^#[0-9a-f]{6}$/i
const MAX_LOGO_BYTES = 1_500_000
const MIME_EXTENSIONS = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
])

type StoredOwnership = {
  id: string
  towerId: string
  unit: string
  ownerName: string
  website: string
  logoKey: string
  brandColor: string
  source: "customer"
  createdAt: string
}

type ClaimBody = {
  checkoutId?: unknown
  environment?: unknown
  towerId?: unknown
  unit?: unknown
  ownerName?: unknown
  website?: unknown
  brandColor?: unknown
  logo?: unknown
}

function sendError(response: VercelResponse, status: number, error: string) {
  return response.status(status).json({ error })
}

function normalizeWebsite(value: unknown) {
  if (typeof value !== "string" || value.length > 240) throw new PublicError("Enter a valid website", 400)
  try {
    const url = new URL(value.trim())
    if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("protocol")
    url.username = ""
    url.password = ""
    return url.toString()
  } catch {
    throw new PublicError("Enter a complete http or https website", 400)
  }
}

function decodeLogo(value: unknown) {
  if (typeof value !== "string") throw new PublicError("Choose a logo to upload", 400)
  const match = /^data:(image\/(?:png|jpeg|webp));base64,([a-z0-9+/=]+)$/i.exec(value)
  if (!match) throw new PublicError("Use a PNG, JPG, or WebP logo", 400)
  const mime = match[1].toLowerCase()
  const bytes = Buffer.from(match[2], "base64")
  if (!bytes.length || bytes.length > MAX_LOGO_BYTES) throw new PublicError("Keep the logo under 1.5 MB", 413)

  const valid = mime === "image/png"
    ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    : mime === "image/jpeg"
      ? bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
      : bytes.subarray(0, 4).toString() === "RIFF" && bytes.subarray(8, 12).toString() === "WEBP"
  if (!valid) throw new PublicError("That file does not appear to be a valid image", 400)

  return { bytes, mime, extension: MIME_EXTENSIONS.get(mime)! }
}

async function listOwnerships(response: VercelResponse) {
  const ownerships = await Promise.all((await listClaimKeys()).map(async (key) => {
    const item = await getJsonObject<StoredOwnership>(key)
    return {
      id: item.id,
      towerId: item.towerId,
      unit: item.unit,
      ownerName: item.ownerName,
      website: item.website,
      logoUrl: `/api/logo?key=${encodeURIComponent(item.logoKey)}`,
      brandColor: item.brandColor,
      source: item.source,
    }
  }))
  response.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=120")
  return response.status(200).json({ ownerships })
}

async function createOwnership(request: VercelRequest, response: VercelResponse) {
  const body = request.body as ClaimBody | undefined
  if (!body || typeof body !== "object") throw new PublicError("The claim form is incomplete", 400)

  const checkoutId = typeof body.checkoutId === "string" ? body.checkoutId.trim() : ""
  const environment: PolarEnvironment = body.environment === "sandbox" ? "sandbox" : "production"
  const towerId = typeof body.towerId === "string" ? body.towerId : ""
  const unit = typeof body.unit === "string" ? body.unit.toUpperCase() : ""
  const ownerName = typeof body.ownerName === "string" ? body.ownerName.trim().replace(/\s+/g, " ") : ""
  const brandColor = typeof body.brandColor === "string" && COLOR.test(body.brandColor) ? body.brandColor : "#03aded"

  if (!UUID.test(checkoutId)) throw new PublicError("Enter a valid Polar checkout ID", 400)
  if (environment === "sandbox" && process.env.ALLOW_POLAR_SANDBOX_CLAIMS !== "true") {
    throw new PublicError("Sandbox claims are available only in the preview test environment", 403)
  }
  if (!TOWER_IDS.has(towerId) || !UNIT.test(unit)) throw new PublicError("Choose a valid apartment", 400)
  if (ownerName.length < 2 || ownerName.length > 60) throw new PublicError("Keep the organization name between 2 and 60 characters", 400)

  const website = normalizeWebsite(body.website)
  const logo = decodeLogo(body.logo)
  const id = `${towerId}:${unit}`
  if (RESERVED_APARTMENT_IDS.has(id)) throw new PublicError("That showcase apartment is already claimed", 409)

  await verifyPaidCheckout(checkoutId, environment)

  const claimKey = `claims/${towerId}/${unit}.json`
  const checkoutHash = createHash("sha256").update(`${environment}:${checkoutId}`).digest("hex")
  const checkoutKey = `checkouts/${checkoutHash}.json`
  const logoKey = `logos/${towerId}/${unit}-${randomUUID()}.${logo.extension}`

  try {
    await putObject(checkoutKey, JSON.stringify({ id, environment, createdAt: new Date().toISOString() }), "application/json", true)
  } catch (error) {
    if (isStatus(error, 412)) throw new PublicError("This checkout has already claimed an apartment", 409)
    throw error
  }

  try {
    if (await objectExists(claimKey)) throw new PublicError("That apartment has already been claimed", 409)
    await putObject(logoKey, logo.bytes, logo.mime, true)
    const ownership: StoredOwnership = {
      id,
      towerId,
      unit,
      ownerName,
      website,
      logoKey,
      brandColor,
      source: "customer",
      createdAt: new Date().toISOString(),
    }
    await putObject(claimKey, JSON.stringify(ownership), "application/json", true)
    const { logoKey: _privateLogoKey, createdAt: _createdAt, ...publicOwnership } = ownership
    response.setHeader("Cache-Control", "no-store")
    return response.status(201).json({ ownership: { ...publicOwnership, logoUrl: `/api/logo?key=${encodeURIComponent(logoKey)}` } })
  } catch (error) {
    await Promise.allSettled([deleteObject(checkoutKey), deleteObject(logoKey)])
    if (isStatus(error, 412)) throw new PublicError("That apartment has already been claimed", 409)
    throw error
  }
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  response.setHeader("X-Content-Type-Options", "nosniff")
  try {
    if (request.method === "GET") return await listOwnerships(response)
    if (request.method === "POST") return await createOwnership(request, response)
    response.setHeader("Allow", "GET, POST")
    return sendError(response, 405, "Method not allowed")
  } catch (error) {
    if (error instanceof PublicError || error instanceof ClaimVerificationError) {
      return sendError(response, error.status, error.message)
    }
    console.error("ownership request failed", error instanceof Error ? error.message : "unknown error")
    return sendError(response, 500, "Apartment branding is temporarily unavailable")
  }
}

class PublicError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
  }
}
