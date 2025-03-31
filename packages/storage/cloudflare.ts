/**
 * Cloudflare Images integration for 1up
 * 
 * This file handles all interactions with Cloudflare Images API
 * Documentation: https://developers.cloudflare.com/images/
 */

/**
 * Type definitions for Cloudflare Images API
 */
export interface CloudflareImageUploadResult {
  id: string;
  uploadURL: string;
  requireSignedURLs: boolean;
}

export interface CloudflareImageMetadata {
  userId: string;
  uploadedAt: string;
  [key: string]: string;
}

export interface CloudflareImageDetails {
  id: string;
  filename: string;
  uploaded: string; // ISO date string
  requireSignedURLs: boolean;
  variants: string[];
  meta: CloudflareImageMetadata;
}

/**
 * Create a Cloudflare Images direct upload URL
 * 
 * @param userId User ID to associate with the image
 * @param customMetadata Additional metadata to store with the image
 * @returns Upload details including the direct upload URL
 */
export async function createDirectUpload(
  userId: string,
  customMetadata: Record<string, string> = {}
): Promise<CloudflareImageUploadResult> {
  const apiToken = process.env.CLOUDFLARE_IMAGES_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  
  if (!apiToken || !accountId) {
    throw new Error("Missing Cloudflare credentials. Set CLOUDFLARE_IMAGES_API_TOKEN and CLOUDFLARE_ACCOUNT_ID.");
  }
  
  // Prepare metadata (userId is required)
  const metadata = {
    userId,
    uploadedAt: new Date().toISOString(),
    ...customMetadata
  };
  
  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v2/direct_upload`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requireSignedURLs: true,
          metadata
        })
      }
    );
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Cloudflare Images API error: ${JSON.stringify(errorData)}`);
    }
    
    const data = await res.json();
    
    if (!data.success || !data.result) {
      throw new Error(`Cloudflare Images API returned unsuccessful response: ${JSON.stringify(data)}`);
    }
    
    return {
      id: data.result.id,
      uploadURL: data.result.uploadURL,
      requireSignedURLs: data.result.requireSignedURLs
    };
  } catch (error) {
    console.error("Error creating Cloudflare direct upload:", error);
    throw error;
  }
}

/**
 * Get details of a Cloudflare image including its metadata
 * 
 * @param imageId The ID of the image to get details for
 * @returns Image details including metadata
 */
export async function getImageDetails(imageId: string): Promise<CloudflareImageDetails> {
  const apiToken = process.env.CLOUDFLARE_IMAGES_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  
  if (!apiToken || !accountId) {
    throw new Error("Missing Cloudflare credentials. Set CLOUDFLARE_IMAGES_API_TOKEN and CLOUDFLARE_ACCOUNT_ID.");
  }
  
  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1/${imageId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Cloudflare Images API error: ${JSON.stringify(errorData)}`);
    }
    
    const data = await res.json();
    
    if (!data.success || !data.result) {
      throw new Error(`Cloudflare Images API returned unsuccessful response: ${JSON.stringify(data)}`);
    }
    
    return {
      id: data.result.id,
      filename: data.result.filename,
      uploaded: data.result.uploaded,
      requireSignedURLs: data.result.requireSignedURLs,
      variants: data.result.variants,
      meta: data.result.meta
    };
  } catch (error) {
    console.error("Error getting Cloudflare image details:", error);
    throw error;
  }
}

/**
 * Check if a user owns an image by checking the metadata
 * 
 * @param imageId The ID of the image to check
 * @param userId The user ID to verify ownership against
 * @returns True if the user owns the image, false otherwise
 */
export async function doesUserOwnImage(imageId: string, userId: string): Promise<boolean> {
  try {
    const details = await getImageDetails(imageId);
    return details.meta.userId === userId;
  } catch (error) {
    console.error(`Error checking image ownership for image ${imageId}:`, error);
    return false;
  }
}

/**
 * Generate a signed URL for accessing a Cloudflare image
 * 
 * @param imageId The ID of the image to generate a URL for
 * @param variant The variant/size of the image (e.g., "public", "thumbnail")
 * @param expirationTimestamp When the URL should expire (Unix timestamp)
 * @returns The signed URL to access the image
 */
export async function createSignedImageUrl(
  imageId: string,
  variant: string = "public",
  expirationTimestamp?: number
): Promise<string> {
  const deliveryUrl = process.env.CLOUDFLARE_IMAGES_DELIVERY_URL;
  const privateKey = process.env.CLOUDFLARE_IMAGES_PRIVATE_KEY;
  
  if (!deliveryUrl || !privateKey) {
    throw new Error("Missing Cloudflare credentials. Set CLOUDFLARE_IMAGES_DELIVERY_URL and CLOUDFLARE_IMAGES_PRIVATE_KEY.");
  }
  
  // If no expiration provided, default to 1 hour from now
  const expiry = expirationTimestamp || Math.floor(Date.now() / 1000) + 3600;
  
  try {
    // Create the URL to sign
    const url = new URL(`${deliveryUrl}/${imageId}/${variant}`);
    
    // Sign the URL using the Cloudflare signing algorithm
    // We're using the JWT approach from Cloudflare docs
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(privateKey),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    // Create the message to sign (URL + expiry)
    const message = encoder.encode(`${url.pathname}${expiry}`);
    
    // Sign the message
    const signature = await crypto.subtle.sign("HMAC", key, message);
    
    // Convert signature to base64url format
    const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    
    // Add the signature and expiry as query parameters
    url.searchParams.set("sig", signatureBase64);
    url.searchParams.set("exp", expiry.toString());
    
    return url.toString();
  } catch (error) {
    console.error("Error creating signed image URL:", error);
    throw error;
  }
}

/**
 * Generate a URL that can be used in AI prompts
 * 
 * @param imageId The ID of the image to use in AI prompts
 * @param variant The variant/size of the image to use
 * @returns A URL that can be used in AI prompts
 */
export async function getImageUrlForAI(
  imageId: string,
  variant: string = "public"
): Promise<string> {
  // For AI prompts, we want a short-lived URL (10 minutes)
  const expirationTimestamp = Math.floor(Date.now() / 1000) + 600; // 10 minutes
  return createSignedImageUrl(imageId, variant, expirationTimestamp);
}