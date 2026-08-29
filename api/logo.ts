import type { VercelRequest, VercelResponse } from "@vercel/node"

import { getLogoObject, isStatus } from "../server/r2.js"

const SAFE_LOGO_KEY = /^logos\/[a-z0-9-]+\/[2-7][AB]-[0-9a-f-]+\.(?:png|jpg|webp)$/i

export default async function handler(request: VercelRequest, response: VercelResponse) {
  response.setHeader("X-Content-Type-Options", "nosniff")
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET")
    return response.status(405).json({ error: "Method not allowed" })
  }

  const key = typeof request.query.key === "string" ? request.query.key : ""
  if (!SAFE_LOGO_KEY.test(key)) return response.status(400).json({ error: "Invalid logo key" })

  try {
    const object = await getLogoObject(key)
    if (!object.Body) return response.status(404).json({ error: "Logo not found" })
    const bytes = await object.Body.transformToByteArray()
    response.setHeader("Content-Type", object.ContentType || "application/octet-stream")
    response.setHeader("Cache-Control", "public, max-age=31536000, immutable")
    response.setHeader("Content-Length", String(bytes.byteLength))
    return response.status(200).send(Buffer.from(bytes))
  } catch (error) {
    if (isStatus(error, 404)) return response.status(404).json({ error: "Logo not found" })
    console.error("logo request failed", error instanceof Error ? error.message : "unknown error")
    return response.status(500).json({ error: "Logo unavailable" })
  }
}
