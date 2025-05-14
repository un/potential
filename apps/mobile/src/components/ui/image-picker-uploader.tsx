import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import { Image, Modal, Pressable, ScrollView, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, Images, X, XCircle } from "phosphor-react-native";

import type { CloudTypeId } from "@potential/utils";

import type { ProcessedImage } from "~/utils/images/image-processing";
import type { UploadedImage } from "~/utils/images/image-upload";
import { CameraComponent } from "~/components/app/camera";
import {
  cleanupImageTempFiles,
  processImage,
} from "~/utils/images/image-processing";
import { useImageUpload } from "~/utils/images/image-upload";
import { iconColor } from "~/utils/ui";
import { Button } from "./button";
import { Text } from "./text";

interface ExtendedUploadedImage extends UploadedImage {
  image: ProcessedImage;
}

export interface ImagePickerUploaderProps {
  onImagesChanged?: (data: {
    pendingUpload: boolean;
    imageIds: string[];
  }) => void;
  maxImages?: number;
  metadata?: Record<string, string>;
  variant?: string;
  style?: React.ComponentProps<typeof View>["style"];
  onUploadStateChange?: (uploading: boolean) => void;
  onSubmit?: () => void;
  submitting?: boolean;
}

export interface ImagePickerUploaderRef {
  uploadPendingImages: () => Promise<{
    success: boolean;
    imageIds: CloudTypeId<"userUpload">[];
    error?: string;
  }>;
}

/**
 * Combined component that allows users to take pictures with the camera
 * or select from gallery, and upload them
 */
export const ImagePickerUploader = forwardRef<
  ImagePickerUploaderRef,
  ImagePickerUploaderProps
>(
  (
    {
      onImagesChanged,
      maxImages = 10,
      metadata: _metadata = {},
      variant: _variant = "public",
      style,
      onUploadStateChange,
      onSubmit,
      submitting = false,
    },
    ref,
  ) => {
    const [showCamera, setShowCamera] = useState(false);
    const [pendingImages, setPendingImages] = useState<ProcessedImage[]>([]);
    const [uploadedImages, setUploadedImages] = useState<
      ExtendedUploadedImage[]
    >([]);
    const [error, setError] = useState<string | null>(null);

    const { uploadImages, isLoading: isUploading } = useImageUpload();

    // Notify parent about state changes
    const updateParent = useCallback(() => {
      if (onImagesChanged) {
        const imageIds = uploadedImages.map((img) => String(img.imageId));
        onImagesChanged({
          pendingUpload: pendingImages.length > 0,
          imageIds,
        });
      }

      if (onUploadStateChange) {
        onUploadStateChange(isUploading);
      }
    }, [
      pendingImages.length,
      uploadedImages,
      isUploading,
      onImagesChanged,
      onUploadStateChange,
    ]);

    // Call updateParent whenever relevant state changes
    React.useEffect(() => {
      updateParent();
    }, [pendingImages, uploadedImages, isUploading, updateParent]);

    const handleCameraCapture = (processedImage: ProcessedImage) => {
      setPendingImages((prev) => [...prev, processedImage]);
      setShowCamera(false);
    };

    const handlePickImages = async () => {
      try {
        setError(null);

        const permissionResult =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
          setError(
            "Permission to access camera roll was previously denied! Please go to phone Settings > Apps > Potential Health > Photos",
          );
          return;
        }

        const remainingSlots =
          maxImages - (uploadedImages.length + pendingImages.length);
        if (remainingSlots <= 0) {
          setError(`Maximum of ${maxImages} images allowed`);
          return;
        }

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

        const processedImages = await Promise.all(
          result.assets.map((asset) => processImage(asset)),
        );

        setPendingImages((prev) => [...prev, ...processedImages]);
      } catch (err) {
        console.error("Error picking images:", err);
        setError("Failed to pick images. Please try again.");
      }
    };

    const removePendingImage = async (index: number) => {
      const imageToRemove = pendingImages[index];
      if (imageToRemove) {
        await cleanupImageTempFiles([imageToRemove]);
      }
      const newPendingImages = [...pendingImages];
      newPendingImages.splice(index, 1);
      setPendingImages(newPendingImages);
    };

    const removeUploadedImage = (index: number) => {
      const newUploadedImages = [...uploadedImages];
      newUploadedImages.splice(index, 1);
      setUploadedImages(newUploadedImages);
    };

    // Function that parent can call to upload
    const uploadPendingImages = async () => {
      if (pendingImages.length === 0) {
        return {
          success: true,
          imageIds: uploadedImages.map((img) => String(img.imageId)),
        };
      }

      try {
        setError(null);

        if (onUploadStateChange) {
          onUploadStateChange(true);
        }

        const { uploadedImages: newlyUploadedImages, error: uploadError } =
          await uploadImages(pendingImages);

        if (uploadError) {
          setError(uploadError || "Unknown upload error");
          return {
            success: false,
            error: uploadError || "Unknown upload error",
            imageIds: uploadedImages.map((img) => String(img.imageId)),
          };
        }

        const extendedUploadedImages: ExtendedUploadedImage[] = [];

        for (
          let i = 0;
          i < Math.min(newlyUploadedImages.length, pendingImages.length);
          i++
        ) {
          const pendingImage = pendingImages[i];
          const uploadedImage = newlyUploadedImages[i];

          if (pendingImage && uploadedImage) {
            extendedUploadedImages.push({
              ...uploadedImage,
              image: pendingImage,
            });
          }
        }

        const updatedImages = [...uploadedImages, ...extendedUploadedImages];
        setUploadedImages(updatedImages);

        await cleanupImageTempFiles(pendingImages);

        setPendingImages([]);

        const imageIds = updatedImages.map((img) => String(img.imageId));
        return { success: true, imageIds };
      } catch (err) {
        console.error("Error uploading images:", err);
        const errorMessage =
          typeof err === "string"
            ? err
            : err instanceof Error
              ? err.message
              : "Failed to upload images";
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
          imageIds: uploadedImages.map((img) => String(img.imageId)),
        };
      } finally {
        if (onUploadStateChange) {
          onUploadStateChange(false);
        }
      }
    };

    // Expose uploadPendingImages method to parent component
    useImperativeHandle(
      ref,
      () => ({
        uploadPendingImages: async () => {
          const result = await uploadPendingImages();
          return {
            ...result,
            imageIds: result.imageIds as `upl_${string}`[],
          };
        },
      }),
      [pendingImages, uploadedImages],
    );

    const totalImages = pendingImages.length + uploadedImages.length;
    const isMaxImagesReached = totalImages >= maxImages;

    return (
      <View className="flex w-full flex-col gap-6" style={style}>
        {(pendingImages.length > 0 || uploadedImages.length > 0) && (
          <View className="flex flex-col gap-0">
            <Text type={"title"}>
              {totalImages} {totalImages === 1 ? "Image" : "Images"} Selected
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex flex-row gap-4"
            >
              <View className="flex flex-row gap-6">
                {pendingImages.map((image, index) => (
                  <View
                    key={`pending-${index}`}
                    className="relative flex flex-col items-center pt-4"
                  >
                    <Image
                      source={{ uri: image.uri }}
                      className="border-sand-6 h-[100px] w-[100px] rounded-lg border"
                      resizeMode="cover"
                    />
                    <Pressable
                      className="absolute -right-8 z-10 rounded-xl p-4"
                      onPress={() => removePendingImage(index)}
                      disabled={isUploading}
                    >
                      <XCircle size={24} color="#FF3B30" weight="fill" />
                    </Pressable>

                    <View className="bg-orange-9 absolute bottom-0 items-center rounded-xl px-2 py-1">
                      <Text className="text-sand-12 text-xs font-bold">
                        Pending
                      </Text>
                    </View>
                  </View>
                ))}

                {uploadedImages.map((uploadedItem, index) => (
                  <View
                    key={`uploaded-${index}`}
                    className="relative flex flex-col items-center pt-4"
                  >
                    <Image
                      source={{ uri: uploadedItem.image.uri }}
                      className="border-sand-6 h-[100px] w-[100px] rounded-lg border"
                      resizeMode="cover"
                    />
                    <Pressable
                      className="absolute -right-8 z-10 rounded-xl p-4"
                      onPress={() => removeUploadedImage(index)}
                      disabled={isUploading}
                    >
                      <XCircle size={24} color="#FF3B30" weight="fill" />
                    </Pressable>

                    <View className="bg-green-9 absolute bottom-0 items-center rounded-xl px-2 py-1">
                      <Text className="text-sand-12 text-xs font-bold">
                        Uploaded
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        <View className="flex w-full flex-row items-center gap-4">
          <Button
            size="icon-lg"
            onPress={() => setShowCamera(true)}
            disabled={isUploading || isMaxImagesReached}
          >
            <Camera size={24} color={iconColor({ lightColor: true })} />
          </Button>
          <Button
            size="icon-lg"
            onPress={handlePickImages}
            disabled={isUploading || isMaxImagesReached}
          >
            <Images size={24} color={iconColor({ lightColor: true })} />
          </Button>
          {onSubmit && (
            <Button
              className="grow"
              size="lg"
              onPress={onSubmit}
              loading={submitting}
              disabled={submitting || isUploading}
            >
              <Text>Log it</Text>
            </Button>
          )}
        </View>

        {error && (
          <Text className="mt-2 text-center text-[#FF3B30]">{error}</Text>
        )}

        {isMaxImagesReached && (
          <Text className="mt-2 text-center text-xs text-[#FF9500]">
            Maximum number of images ({maxImages}) reached
          </Text>
        )}

        <Modal
          visible={showCamera}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <CameraComponent onPictureTaken={handleCameraCapture} />
          <View className="absolute right-10 top-[70] z-10">
            <Pressable
              className="bg-red-9 rounded-2xl p-3"
              onPress={() => setShowCamera(false)}
            >
              <X size={24} color={iconColor({ lightColor: true })} />
            </Pressable>
          </View>
        </Modal>
      </View>
    );
  },
);
