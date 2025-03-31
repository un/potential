import React, { useState, useEffect } from "react";
import { 
  Image, 
  ImageProps, 
  ActivityIndicator, 
  View, 
  Text,
  StyleSheet 
} from "react-native";
import { api } from "../../utils/api";

// Define props interface, extending from ImageProps but overriding some props
interface ImageViewProps extends Omit<ImageProps, 'source'> {
  imageId: string;
  variant?: string;
  style?: ImageProps['style'];
  // Include any other props specific to the ImageView component
  fallbackElement?: React.ReactNode;
  loadingElement?: React.ReactNode;
}

/**
 * Image component that loads images from Cloudflare Images
 * through the backend's authenticated proxy
 */
export const ImageView: React.FC<ImageViewProps> = ({
  imageId,
  variant = "public",
  style,
  fallbackElement,
  loadingElement,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Get the backend URL from environment variable
  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:3100";

  // Generate the image URL using the backend proxy
  const directImageUrl = `${backendUrl}/images/${imageId}/${variant}`;

  // We're using both approaches: 
  // 1. Direct URL through backend proxy (faster, but might not work with certain components)
  // 2. tRPC to get a signed URL (more reliable but adds some latency)
  const {
    data: signedUrlData,
    isLoading: isLoadingUrl,
    error: urlError,
  } = api.storage.getSignedImageUrl.useQuery(
    { imageId, variant },
    { enabled: !imageUrl, retry: 1 }
  );

  useEffect(() => {
    // If we get a signed URL from tRPC, use it
    if (signedUrlData?.url) {
      setImageUrl(signedUrlData.url);
    }
  }, [signedUrlData]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    // If direct URL fails, we'll already have or be fetching the signed URL
    if (!signedUrlData?.url) {
      setHasError(true);
    }
    setIsLoading(false);
  };

  // If there's a persistent error and a fallback element, show it
  if (hasError && !signedUrlData?.url && fallbackElement) {
    return <>{fallbackElement}</>;
  }

  // Use signed URL if available, otherwise use the direct URL
  const finalImageUrl = imageUrl || directImageUrl;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: finalImageUrl, cache: 'force-cache' }}
        onLoad={handleLoad}
        onError={handleError}
        style={[
          styles.image,
          style,
          hasError && !signedUrlData?.url ? styles.hiddenImage : {}
        ]}
        {...props}
      />
      
      {/* Show loading indicator while image is loading */}
      {(isLoading || isLoadingUrl) && (
        <View style={styles.loadingContainer}>
          {loadingElement || <ActivityIndicator size="large" color="#0000ff" />}
        </View>
      )}

      {/* Show error message if loading failed and no fallback was provided */}
      {hasError && !signedUrlData?.url && !fallbackElement && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Image failed to load</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
  },
  hiddenImage: {
    display: 'none',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  errorContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
  },
  errorText: {
    color: '#721c24',
  },
});