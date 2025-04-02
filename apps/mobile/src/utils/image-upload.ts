import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import type { CloudTypeId } from "@1up/utils";

import type { ProcessedImage } from "./image-processing";
import { trpc } from "./api";

// Represents an uploaded image returned from the server
export interface UploadedImage {
  imageId: CloudTypeId<"userUpload">;
}

export function useImageUpload() {
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<Error | null>(null);

  // Create mutation options using the proper tRPC v11 pattern
  const uploadPresignedUrlMutation = useMutation(
    trpc.storage.getUploadPresignedUrl.mutationOptions({
      onError: (error) => {
        console.error("Error getting presigned URLs:", error);
      },
    }),
  );

  // Function to handle the upload process
  const uploadImages = async (
    images: ProcessedImage[],
  ): Promise<{
    uploadedImages: UploadedImage[];
    error?: string;
  }> => {
    if (images.length === 0) {
      return {
        uploadedImages: [],
      };
    }
    setUploadLoading(true);

    try {
      // Request direct upload URLs for all images using mutateAsync
      const uploads: UploadedImage[] = [];
      // Upload each image concurrently
      await Promise.all(
        images.map(async (image) => {
          const { id: uploadId, url: uploadUrl } =
            await uploadPresignedUrlMutation.mutateAsync({
              fileType: image.type,
            });
          const { uri, type } = image;

          const response = await fetch(uri);

          const blob = await response.blob();
          const uploadResponse = await fetch(uploadUrl, {
            method: "PUT",
            body: blob,
            headers: {
              "Content-Type": type,
            },
          });

          if (!uploadResponse.ok) {
            throw new Error(
              `Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`,
            );
          }
          uploads.push({ imageId: uploadId });
          console.log("🔥", { response });
        }),
      );
      setUploadLoading(false);
      // Return the uploaded image information
      return {
        uploadedImages: uploads,
      };
    } catch (err) {
      setUploadLoading(false);
      setUploadError(
        err instanceof Error ? err : new Error("Failed to upload images"),
      );
      return {
        uploadedImages: [],
        error: err instanceof Error ? err.message : "Failed to upload images",
      };
    }
  };

  return {
    uploadImages,
    isLoading: uploadLoading,
    error: uploadError,
  };
}
