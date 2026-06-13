import crypto from "crypto";
import ApiKey from "../models/ApiKey";
import { connectDB } from "../config/db";

/**
 * Hashes a raw API key using SHA-256.
 * We never store the raw key — only the hash.
 */
export function hashApiKey(rawKey) {
  return crypto.createHash("sha256").update(rawKey).digest("hex");
}

/**
 * Generates a new API key string with a recognizable prefix.
 * Format: mfk_sk_<random-hex>
 */
export function generateRawApiKey() {
  const randomPart = crypto.randomBytes(32).toString("hex");
  return `mfk_sk_${randomPart}`;
}

/**
 * Authenticates an incoming request using an API key.
 * Looks for the key in: `x-api-key` header or `Authorization: Bearer <key>` header.
 *
 * Returns the ApiKey document (with companyId) on success.
 * Throws an error on failure.
 */
export async function apiKeyAuth(request) {
  await connectDB();

  let rawKey = request.headers.get("x-api-key");

  if (!rawKey) {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      rawKey = authHeader.slice(7);
    }
  }

  if (!rawKey) {
    throw new Error("API key is required. Pass it via `x-api-key` header or `Authorization: Bearer <key>`.");
  }

  const keyHash = hashApiKey(rawKey);
  const apiKey = await ApiKey.findOne({ keyHash, isActive: true });

  if (!apiKey) {
    throw new Error("Invalid or revoked API key.");
  }

  // Update lastUsedAt without blocking the request
  ApiKey.findByIdAndUpdate(apiKey._id, { lastUsedAt: new Date() }).exec();

  return apiKey;
}
