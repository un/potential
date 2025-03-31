/**
 * Utility functions for working with Cloudflare Images
 */

/**
 * Generate a URL for accessing an image through the backend proxy
 * @param imageId The Cloudflare image ID
 * @param variant The variant of the image to access (e.g., "public", "thumbnail")
 * @param backendUrl The base URL of the backend (optional, defaults to env var)
 * @returns The URL to access the image via the backend's authenticated proxy
 */
export function getImageProxyUrl(
  imageId: string,
  variant: string = "public",
  backendUrl?: string
): string {
  // Get the backend URL from the environment or the provided value
  const baseUrl = backendUrl || 
    process.env.NEXT_PUBLIC_BACKEND_URL || 
    process.env.EXPO_PUBLIC_BACKEND_URL ||
    "http://localhost:3100";
  
  // Return the full URL to the image proxy endpoint
  return `${baseUrl}/images/${imageId}/${variant}`;
}

/**
 * Extract a file extension from a filename
 * @param fileName The name of the file
 * @returns The file extension (e.g., "jpg", "png")
 */
export function getFileExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() || "";
}

/**
 * Generate a unique filename for upload
 * @param originalFileName The original file name
 * @returns A unique filename with the original extension
 */
export function generateUniqueFileName(originalFileName: string): string {
  const extension = getFileExtension(originalFileName);
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  
  return `${timestamp}-${randomString}.${extension}`;
}

/**
 * Sanitize a filename to ensure it's safe for storage
 * @param fileName The file name to sanitize
 * @returns A sanitized filename
 */
export function sanitizeFileName(fileName: string): string {
  // Remove any path traversal characters and ensure safe filename
  return fileName
    .replace(/\.\.\//g, "") // Remove path traversal attempts
    .replace(/[^\w\s.-]/g, "_") // Replace unsafe characters with underscore
    .replace(/\s+/g, "_"); // Replace spaces with underscores
}