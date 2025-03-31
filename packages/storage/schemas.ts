/**
 * Zod schemas for validating storage-related inputs
 */
import { z } from "zod";

/**
 * Schema for creating Cloudflare direct uploads
 */
export const createDirectUploadSchema = z.object({
  // Optional custom metadata to store with the image
  metadata: z.record(z.string()).optional(),
  // Number of upload URLs to create (for multiple images)
  count: z.number().int().positive().optional().default(1),
});

/**
 * Schema for getting a signed image URL
 */
export const getSignedImageUrlSchema = z.object({
  // The ID of the image to get a URL for
  imageId: z.string(),
  // The variant/size of the image (e.g., "public", "thumbnail")
  variant: z.string().optional().default("public"),
  // Whether this is a system request that bypasses ownership checks
  isSystemRequest: z.boolean().optional().default(false),
});

/**
 * Schema for getting an AI-ready image URL
 */
export const getImageUrlForAISchema = z.object({
  // The ID of the image to get a URL for
  imageId: z.string(),
  // The variant/size of the image
  variant: z.string().optional().default("public"),
});