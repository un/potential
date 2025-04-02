import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { XCircle } from "phosphor-react-native";

// Import our utility functions and components
import type { ProcessedImage } from "~/utils/image-processing";
import type { UploadedImage } from "~/utils/image-upload";
import { cleanupImageTempFiles, processImage } from "~/utils/image-processing";
import { useImageUpload } from "~/utils/image-upload";
import { Text } from "./text";

/**
 * Props for the ImageUpload component
 */
interface ImageUploadProps {
  onImagesUploaded?: (images: UploadedImage[]) => void;
  maxImages?: number;
  metadata?: Record<string, string>;
  variant?: string; // Optional variant/size of the image
  style?: React.ComponentProps<typeof View>["style"];
  initialImages?: ProcessedImage[]; // Optional images that have already been processed (e.g., from camera)
}

/**
 * Component for selecting and uploading images
 * Handles image selection and display, delegates actual upload to useImageUpload hook
 */
export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImagesUploaded,
  maxImages = 5,
  metadata: _metadata = {},
  variant: _variant = "public",
  style,
  initialImages = [],
}) => {
  const [error, setError] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<UploadedImage[]>([]);
  const [pendingImages, setPendingImages] =
    useState<ProcessedImage[]>(initialImages);
  const [previewUris, setPreviewUris] = useState<string[]>(
    initialImages.map((img) => img.uri),
  );

  // Use the image upload hook for handling uploads
  const { uploadImages, isLoading: isUploading } = useImageUpload();

  const pickImages = async () => {
    try {
      setError(null);

      // Get permission to access the camera roll
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        setError("Permission to access camera roll is required!");
        return;
      }

      // Calculate how many more images we can select
      const remainingSlots =
        maxImages - (selectedImages.length + pendingImages.length);
      if (remainingSlots <= 0) {
        setError(`Maximum of ${maxImages} images allowed`);
        return;
      }

      // Launch the image picker with multi-select enabled
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        allowsMultipleSelection: true,
        selectionLimit: remainingSlots,
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      // Process the images (convert HEIC if needed)
      const processedImages = await Promise.all(
        result.assets.map((asset) => processImage(asset)),
      );

      // Update the pending images state
      const updatedPendingImages = [...pendingImages, ...processedImages];
      setPendingImages(updatedPendingImages);

      // Update the preview URIs
      setPreviewUris([
        ...previewUris,
        ...processedImages.map((img) => img.uri),
      ]);
    } catch (err) {
      console.error("Error picking images:", err);
      setError("Failed to pick images. Please try again.");
    }
  };

  const uploadPendingImages = async () => {
    if (pendingImages.length === 0) {
      return;
    }

    try {
      setError(null);

      // Use the uploadImages function from the hook
      const { uploadedImages, error: uploadError } =
        await uploadImages(pendingImages);

      if (uploadError) {
        setError(uploadError);
        return;
      }

      // Add new images to existing selection
      const updatedImages = [...selectedImages, ...uploadedImages];
      setSelectedImages(updatedImages);

      // Clean up temporary files before clearing pending images
      await cleanupImageTempFiles(pendingImages);

      // Clear the pending images
      setPendingImages([]);

      // Call the callback with the updated list of images
      if (onImagesUploaded) {
        onImagesUploaded(updatedImages);
      }
    } catch (err) {
      console.error("Error uploading images:", err);
      setError("Failed to upload images. Please try again.");
    }
  };

  /**
   * Remove an uploaded image
   * @param index Index of the image to remove
   */
  const removeUploadedImage = (index: number) => {
    const newSelectedImages = [...selectedImages];
    newSelectedImages.splice(index, 1);
    setSelectedImages(newSelectedImages);

    // Need to update preview URIs as well, but need to account for pending images
    const totalPreviewsCount = pendingImages.length + selectedImages.length;
    const startIndex = totalPreviewsCount - selectedImages.length;
    const newPreviewUris = [...previewUris];
    newPreviewUris.splice(startIndex + index, 1);
    setPreviewUris(newPreviewUris);

    if (onImagesUploaded) {
      onImagesUploaded(newSelectedImages);
    }
  };

  /**
   * Remove a pending image before it's uploaded
   * @param index Index of the pending image to remove
   */
  const removePendingImage = async (index: number) => {
    // Clean up any temporary file created for this image
    const imageToRemove = pendingImages[index];
    if (imageToRemove) {
      await cleanupImageTempFiles([imageToRemove]);
    }

    // Remove from state
    const newPendingImages = [...pendingImages];
    newPendingImages.splice(index, 1);
    setPendingImages(newPendingImages);

    // Update preview URIs
    const newPreviewUris = [...previewUris];
    newPreviewUris.splice(index, 1);
    setPreviewUris(newPreviewUris);
  };

  const totalImages = pendingImages.length + selectedImages.length;
  const isMaxImagesReached = totalImages >= maxImages;

  return (
    <View className="my-2.5" style={style}>
      {/* Image previews */}
      {(pendingImages.length > 0 || selectedImages.length > 0) && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-1.5 py-2.5"
        >
          {/* Pending images (not yet uploaded) */}
          {pendingImages.map((image, index) => (
            <View key={`pending-${index}`} className="relative mx-1.5">
              <Image
                source={{ uri: image.uri }}
                className="h-[100px] w-[100px] rounded-lg border border-[#ddd]"
                resizeMode="cover"
              />
              <Pressable
                className="absolute -right-2 -top-2 z-10 rounded-xl bg-white"
                onPress={() => removePendingImage(index)}
                disabled={isUploading}
              >
                <XCircle size={24} color="#FF3B30" weight="fill" />
              </Pressable>
              {/* Pending indicator */}
              <View className="absolute bottom-0 left-0 right-0 items-center bg-black/50 py-0.5">
                <Text className="text-xs font-bold text-white">Pending</Text>
              </View>
            </View>
          ))}

          {/* Uploaded images */}
          {selectedImages.map((image, index) => (
            <View key={`uploaded-${index}`} className="relative mx-1.5">
              <Image
                source={{ uri: previewUris[pendingImages.length + index] }}
                className="h-[100px] w-[100px] rounded-lg border border-[#ddd]"
                resizeMode="cover"
              />
              <Pressable
                className="absolute -right-2 -top-2 z-10 rounded-xl bg-white"
                onPress={() => removeUploadedImage(index)}
                disabled={isUploading}
              >
                <XCircle size={24} color="#FF3B30" weight="fill" />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Button Row */}
      <View className="mt-2.5 flex-row items-center justify-between">
        {/* Select Images button */}
        <Pressable
          onPress={pickImages}
          className={`flex-1 items-center justify-center rounded-lg border border-[#ccc] bg-[#f9f9f9] p-3 ${
            isUploading || isMaxImagesReached ? "opacity-50" : ""
          }`}
          disabled={isUploading || isMaxImagesReached}
        >
          <Text className="text-sm text-[#666]">
            {totalImages === 0
              ? "Select Images"
              : `Add More (${totalImages}/${maxImages})`}
          </Text>
        </Pressable>

        {/* Upload button - only show if there are pending images */}
        {pendingImages.length > 0 && (
          <Pressable
            onPress={uploadPendingImages}
            className={`ml-2.5 flex-1 items-center justify-center rounded-lg border border-[#0A84FF] bg-[#0A84FF] p-3 ${
              isUploading ? "opacity-50" : ""
            }`}
            disabled={isUploading}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text className="text-sm font-bold text-white">
                Upload {pendingImages.length}{" "}
                {pendingImages.length === 1 ? "Image" : "Images"}
              </Text>
            )}
          </Pressable>
        )}
      </View>

      {/* Error message */}
      {error && (
        <Text className="mt-2 text-center text-[#FF3B30]">{error}</Text>
      )}

      {/* Max images warning */}
      {isMaxImagesReached && (
        <Text className="mt-2 text-center text-xs text-[#FF9500]">
          Maximum number of images ({maxImages}) reached
        </Text>
      )}
    </View>
  );
};
