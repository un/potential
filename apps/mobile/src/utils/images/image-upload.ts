import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import type { CloudTypeId } from "@1up/utils";

import type { ProcessedImage } from "./image-processing";
import { trpc } from "~/utils/api";

export interface UploadedImage {
  imageId: CloudTypeId<"userUpload">;
}

export function useImageUpload() {
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<Error | null>(null);

  const uploadPresignedUrlMutation = useMutation(
    trpc.storage.getUploadPresignedUrl.mutationOptions({
      onError: (error) => {
        console.error("Error getting presigned URLs:", error);
      },
    }),
  );

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
      const uploads: UploadedImage[] = [];
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
          console.log("🔥 image upload map", { uploadResponse });

          if (!uploadResponse.ok) {
            throw new Error(
              `Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`,
            );
          }
          uploads.push({ imageId: uploadId });
        }),
      );
      setUploadLoading(false);

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
