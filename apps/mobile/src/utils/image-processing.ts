import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

// Represents a processed image ready for upload
export interface ProcessedImage {
  uri: string;
  type: string;
  width: number;
  height: number;
  convertedFile?: boolean; // For tracking temporary files that need cleanup
}

/**
 * Check if an image is a HEIC/HEIF format
 * @param uri The URI of the image
 * @param mimeType Optional MIME type if known
 * @returns boolean indicating if the image is HEIC/HEIF
 */
export const isHeicImage = (uri: string, mimeType?: string | null): boolean => {
  // Check file extension
  const extension = uri.split(".").pop()?.toLowerCase();
  const isHeicExtension = extension === "heic" || extension === "heif";

  // Check URI for HEIC string (iOS often has URIs without clear extensions)
  const uriContainsHeic =
    Platform.OS === "ios" &&
    (uri.includes("HEIC") ||
      uri.includes("heic") ||
      uri.includes("HEIF") ||
      uri.includes("heif"));

  // Check MIME type if available
  const isHeicMimeType = mimeType === "image/heic" || mimeType === "image/heif";

  return isHeicExtension || uriContainsHeic || isHeicMimeType;
};

/**
 * Convert HEIC/HEIF image to JPEG
 * @param uri The URI of the HEIC/HEIF image
 * @returns ProcessedImage with the converted JPEG image
 */
export const convertHeicToJpeg = async (
  uri: string,
): Promise<ProcessedImage> => {
  try {
    // Copy the file to app's cache directory first if needed
    // This is especially important for iOS HEIC images from the photo library
    let fileUri = uri;

    // If the URI is a remote or asset URI, copy it to local filesystem first
    if (uri.startsWith("ph://") || uri.startsWith("asset://")) {
      const filename = `temp_${Date.now()}.jpg`;
      const destinationUri = `${FileSystem.cacheDirectory}${filename}`;
      await FileSystem.copyAsync({
        from: uri,
        to: destinationUri,
      });
      fileUri = destinationUri;
    }

    const imageContext = ImageManipulator.manipulate(fileUri);

    const imageRendered = await imageContext.renderAsync();
    const imageSaved = await imageRendered.saveAsync({
      format: SaveFormat.JPEG,
    });

    return {
      uri: imageSaved.uri,
      type: "image/jpeg",
      width: imageRendered.width,
      height: imageRendered.height,
      convertedFile: true,
    };
  } catch (error) {
    console.error("🚨 Error converting HEIC to JPEG:", error);
    // Return an object that matches the expected interface, but with the original URI
    // The caller will need to handle this gracefully
    return {
      uri: uri,
      type: "image/jpeg", // Assume JPEG as fallback
      width: 0, // We don't know the dimensions
      height: 0,
      convertedFile: false,
    };
  }
};

/**
 * Process an image from any source (camera, gallery, etc.) to ensure it's in a suitable format for upload
 * @param imageAsset Image asset from picker or camera
 * @returns ProcessedImage ready for upload
 */
export const processImage = async (imageAsset: {
  uri: string;
  type?: string | null;
  width?: number;
  height?: number;
  convertedFile?: boolean;
}): Promise<ProcessedImage> => {
  // Check if this is a HEIC image that needs conversion
  if (Platform.OS === "ios" && isHeicImage(imageAsset.uri, imageAsset.type)) {
    return await convertHeicToJpeg(imageAsset.uri);
  }

  return {
    uri: imageAsset.uri,
    type: imageAsset.type ?? "image/jpeg",
    width: imageAsset.width ?? 0,
    height: imageAsset.height ?? 0,
    convertedFile: imageAsset.convertedFile ?? false,
  };
};

export const cleanupImageTempFiles = async (
  processedImages: ProcessedImage[],
): Promise<void> => {
  const tempFilesToCleanup = processedImages
    .filter((img) => img.convertedFile)
    .map((img) => img.uri);

  if (tempFilesToCleanup.length > 0) {
    await Promise.all(
      tempFilesToCleanup.map(async (fileUri) => {
        if (fileUri) {
          try {
            const fileInfo = await FileSystem.getInfoAsync(fileUri);
            if (fileInfo.exists) {
              await FileSystem.deleteAsync(fileUri, { idempotent: true });
            }
          } catch (error) {
            console.error(
              `Failed to clean up temporary file: ${fileUri}`,
              error,
            );
          }
        }
      }),
    ).catch((error) => {
      console.error("Error during temp file cleanup:", error);
    });
  }
};

/**
 * Process an image from the camera
 * @param cameraPicture Picture captured from the camera
 * @returns ProcessedImage ready for upload
 */
export const processCameraPicture = async (cameraPicture: {
  uri: string;
  width: number;
  height: number;
}): Promise<ProcessedImage> => {
  return await processImage({
    uri: cameraPicture.uri,
    type: "image/jpeg", // Camera usually returns JPEG
    width: cameraPicture.width,
    height: cameraPicture.height,
  });
};
