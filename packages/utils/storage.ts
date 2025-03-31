/**
 * Utility functions for handling image uploads to S3 via our backend
 */

// The direct upload to S3 is now handled directly in client code using fetch

/**
 * Get the URL to access an image via the backend's authenticated storage proxy
 * @param filePath The path of the file in S3
 * @param backendUrl The base URL of the backend (optional, defaults to env var)
 * @returns The URL to access the image via the backend's authenticated proxy
 * 
 * NOTE: This URL will only work for authenticated users with permission to access the image.
 * The backend will check authentication and ownership before serving the image.
 */
export function getImageProxyUrl(
  filePath: string,
  backendUrl?: string
): string {
  // Get the backend URL from the environment or the provided value
  const baseUrl = backendUrl || 
    process.env.NEXT_PUBLIC_BACKEND_URL || 
    process.env.EXPO_PUBLIC_BACKEND_URL ||
    "http://localhost:3100";
  
  // Encode the file path to ensure it's URL-safe
  const encodedFilePath = encodeURIComponent(filePath);
  
  // Return the full URL to the storage proxy
  return `${baseUrl}/storage/${encodedFilePath}`;
}

/**
 * Generate a URL for a specific image size
 * @param imageId The image ID
 * @param userId The user ID
 * @param size The size of the image to get (e.g., "thumbnail", "medium", "large")
 * @param date The date the image was uploaded (optional, defaults to current date)
 * @param fileExt The file extension (optional, defaults to "jpg")
 * @param backendUrl The base URL of the backend (optional, defaults to env var)
 * @returns The URL to access the sized image
 */
export function getImageSizeUrl(
  imageId: string,
  userId: string,
  size: string = "original",
  date?: Date,
  fileExt: string = "jpg",
  backendUrl?: string
): string {
  // Get the date to use (current date if not provided)
  const imageDate = date || new Date();
  
  // Format the date components
  const year = imageDate.getFullYear().toString();
  const month = (imageDate.getMonth() + 1).toString().padStart(2, '0');
  const day = imageDate.getDate().toString().padStart(2, '0');
  
  // Create the file path
  const filePath = `${userId}/${year}/${month}/${day}/${imageId}/${size}.${fileExt}`;
  
  // Get the proxy URL for the path
  return getImageProxyUrl(filePath, backendUrl);
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