import React, { useState } from "react";
import { 
  Image, 
  View, 
  Text, 
  ActivityIndicator, 
  Pressable, 
  ScrollView,
  StyleSheet 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { api } from "../../utils/api";
import { generateUniqueFileName } from "@1up/storage/utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { XCircle } from "phosphor-react-native";

interface UploadedImage {
  imageId: string;
  variant?: string;
}

interface ImageUploadProps {
  onImagesUploaded?: (images: UploadedImage[]) => void;
  maxImages?: number;
  metadata?: Record<string, string>;
  variant?: string; // Optional variant/size of the image
  style?: React.ComponentProps<typeof View>["style"];
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImagesUploaded,
  maxImages = 5,
  metadata = {},
  variant = "public",
  style 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<UploadedImage[]>([]);
  const [previewUris, setPreviewUris] = useState<string[]>([]);
  
  const insets = useSafeAreaInsets();
  
  // Use tRPC to get direct upload URLs
  const directUploadMutation = api.storage.createDirectUpload.useMutation();
  
  // Use tRPC to get signed image URLs for previews
  const getSignedUrlQuery = api.storage.getSignedImageUrl.useQuery;

  const pickImages = async () => {
    try {
      setError(null);
      
      // Get permission to access the camera roll
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        setError("Permission to access camera roll is required!");
        return;
      }
      
      // Calculate how many more images we can select
      const remainingSlots = maxImages - selectedImages.length;
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
      
      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }
      
      // Upload each selected image
      await uploadImages(result.assets);
    } catch (err) {
      console.error("Error picking images:", err);
      setError("Failed to pick images. Please try again.");
    }
  };

  const uploadImages = async (assets: ImagePicker.ImagePickerAsset[]) => {
    try {
      setIsUploading(true);
      
      // Request direct upload URLs for all images
      const { uploads } = await directUploadMutation.mutateAsync({
        count: assets.length,
        metadata,
      });
      
      if (!uploads || uploads.length !== assets.length) {
        throw new Error("Failed to get upload URLs for all images");
      }
      
      // Upload each image concurrently
      await Promise.all(
        assets.map(async (asset, index) => {
          const { uri, type: assetType } = asset;
          const { uploadURL, id } = uploads[index];
          
          // Determine content type
          const contentType = assetType || "image/jpeg";
          
          // Convert the image to a blob
          const response = await fetch(uri);
          const blob = await response.blob();
          
          // Upload the image directly to Cloudflare
          const uploadResponse = await fetch(uploadURL, {
            method: 'POST',
            body: blob,
            headers: {
              'Content-Type': contentType
            }
          });
          
          if (!uploadResponse.ok) {
            throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
          }
          
          return id;
        })
      );
      
      // Update the selected images state
      const newImages = uploads.map(upload => ({
        imageId: upload.id,
        variant,
      }));
      
      // Add new images to existing selection
      const updatedImages = [...selectedImages, ...newImages];
      setSelectedImages(updatedImages);
      
      // Add local URIs to previews
      setPreviewUris([...previewUris, ...assets.map(asset => asset.uri)]);
      
      // Call the callback with the updated list of images
      if (onImagesUploaded) {
        onImagesUploaded(updatedImages);
      }
      
      setIsUploading(false);
    } catch (err) {
      console.error("Error uploading images:", err);
      setError("Failed to upload images. Please try again.");
      setIsUploading(false);
    }
  };
  
  const removeImage = (index: number) => {
    const newSelectedImages = [...selectedImages];
    newSelectedImages.splice(index, 1);
    setSelectedImages(newSelectedImages);
    
    const newPreviewUris = [...previewUris];
    newPreviewUris.splice(index, 1);
    setPreviewUris(newPreviewUris);
    
    if (onImagesUploaded) {
      onImagesUploaded(newSelectedImages);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* Image previews */}
      {selectedImages.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.previewsContainer}
        >
          {previewUris.map((uri, index) => (
            <View key={`image-${index}`} style={styles.previewContainer}>
              <Image
                source={{ uri }}
                style={styles.previewImage}
                resizeMode="cover"
              />
              <Pressable
                style={styles.removeButton}
                onPress={() => removeImage(index)}
              >
                <XCircle size={24} color="#FF3B30" weight="fill" />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}
      
      {/* Upload button */}
      <Pressable
        onPress={pickImages}
        style={[
          styles.uploadButton,
          isUploading ? styles.uploadButtonDisabled : {},
          selectedImages.length >= maxImages ? styles.uploadButtonDisabled : {}
        ]}
        disabled={isUploading || selectedImages.length >= maxImages}
      >
        {isUploading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Text style={styles.uploadButtonText}>
            {selectedImages.length === 0 
              ? "Select Images" 
              : `Add More (${selectedImages.length}/${maxImages})`}
          </Text>
        )}
      </Pressable>
      
      {/* Error message */}
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      {/* Max images warning */}
      {selectedImages.length >= maxImages && (
        <Text style={styles.warningText}>
          Maximum number of images ({maxImages}) reached
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  previewsContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  previewContainer: {
    position: 'relative',
    marginHorizontal: 5,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
    marginTop: 10,
  },
  uploadButtonDisabled: {
    opacity: 0.5,
  },
  uploadButtonText: {
    color: "#666",
    fontSize: 16,
  },
  errorText: {
    color: "#FF3B30",
    marginTop: 8,
    textAlign: 'center',
  },
  warningText: {
    color: "#FF9500",
    marginTop: 8,
    textAlign: 'center',
    fontSize: 12,
  }
});