import type { CameraType } from "expo-camera";
import { useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { CameraView } from "expo-camera";
import { ArrowsClockwise, Camera } from "phosphor-react-native";

import type { ProcessedImage } from "~/utils/images/image-processing";
import { RequestPermission } from "~/components/ui/request-permission";
import { Text } from "~/components/ui/text";
import { usePermission } from "~/lib/hooks/usePermission";
import { processCameraPicture } from "~/utils/images/image-processing";
import { iconColor } from "~/utils/ui";

interface CameraComponentProps {
  onPictureTaken?: (processedImage: ProcessedImage) => void;
}

export function CameraComponent({ onPictureTaken }: CameraComponentProps) {
  const [facing, setFacing] = useState<CameraType>("back");
  const { isGranted, isLoading } = usePermission("camera");
  const [isTakingPicture, setIsTakingPicture] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePicture() {
    if (!cameraRef.current || isTakingPicture) return;

    try {
      setIsTakingPicture(true);
      setError(null);

      // Take the picture
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false, // Enable image processing
      });

      // Process the image (convert HEIC to JPEG if needed on iOS)
      const processedImage = await processCameraPicture(photo);

      // Call the callback function with the processed image
      if (onPictureTaken) {
        onPictureTaken(processedImage);
      }
    } catch (err) {
      console.error("Error taking picture:", err);
      setError("Failed to take picture. Please try again.");
    } finally {
      setIsTakingPicture(false);
    }
  }

  if (isLoading) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!isGranted) {
    // Camera permissions are not granted yet.
    return <RequestPermission permission="camera" />;
  }

  return (
    <View className="bg-sand-9 w-full flex-1">
      <CameraView
        className="mb-0"
        facing={facing}
        mode={"picture"}
        flash={"auto"}
        ref={cameraRef}
      >
        <View className="flex h-full flex-col items-center justify-end rounded-xl">
          <View className="flex w-full flex-row items-center justify-between rounded-xl p-14 pb-16">
            <TouchableOpacity
              className="bg-sand-10 rounded-3xl p-4"
              onPress={toggleCameraFacing}
            >
              <ArrowsClockwise size={24} weight="bold" color={iconColor()} />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-sand-10 rounded-3xl p-4"
              onPress={takePicture}
              disabled={isTakingPicture}
            >
              <Camera size={24} weight="bold" color={iconColor()} />
            </TouchableOpacity>
            {error && <Text className="text-red-9 p-6">{error}</Text>}
          </View>
        </View>
      </CameraView>
    </View>
  );
}
