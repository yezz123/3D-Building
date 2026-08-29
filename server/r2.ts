import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"

let client: S3Client | undefined

function requiredEnv(name: string) {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing server configuration: ${name}`)
  return value
}

export function getBucketName() {
  return requiredEnv("R2_BUCKET_NAME")
}

export function getR2Client() {
  if (client) return client
  const accountId = requiredEnv("R2_ACCOUNT_ID")
  client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requiredEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: requiredEnv("R2_SECRET_ACCESS_KEY"),
    },
  })
  return client
}

export async function getJsonObject<T>(key: string) {
  const response = await getR2Client().send(new GetObjectCommand({ Bucket: getBucketName(), Key: key }))
  if (!response.Body) throw new Error("Stored ownership record is empty")
  return JSON.parse(await response.Body.transformToString()) as T
}

export async function listClaimKeys() {
  const response = await getR2Client().send(new ListObjectsV2Command({
    Bucket: getBucketName(),
    Prefix: "claims/",
    MaxKeys: 100,
  }))
  return (response.Contents ?? []).flatMap((item) => item.Key ? [item.Key] : [])
}

export async function objectExists(key: string) {
  try {
    await getR2Client().send(new HeadObjectCommand({ Bucket: getBucketName(), Key: key }))
    return true
  } catch (error) {
    if (isStatus(error, 404)) return false
    throw error
  }
}

export async function putObject(key: string, body: string | Uint8Array, contentType: string, onlyIfMissing = false) {
  await getR2Client().send(new PutObjectCommand({
    Bucket: getBucketName(),
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: key.startsWith("logos/") ? "public, max-age=31536000, immutable" : "no-store",
    ...(onlyIfMissing ? { IfNoneMatch: "*" } : {}),
  }))
}

export async function deleteObject(key: string) {
  await getR2Client().send(new DeleteObjectCommand({ Bucket: getBucketName(), Key: key }))
}

export async function getLogoObject(key: string) {
  return await getR2Client().send(new GetObjectCommand({ Bucket: getBucketName(), Key: key }))
}

export function isStatus(error: unknown, status: number) {
  return typeof error === "object" && error !== null && "$metadata" in error
    && (error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode === status
}
