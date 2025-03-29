import type { CameraType } from "expo-camera";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { CameraView } from "expo-camera";
import { ArrowsClockwise, Camera } from "phosphor-react-native";

import { usePermission } from "../../lib/hooks/usePermission";
import { RequestPermission } from "../ui/request-permission";

export function CameraComponent() {
  const [facing, setFacing] = useState<CameraType>("back");
  const { isGranted, isLoading } = usePermission("camera");

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
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
    <View className="bg-red-5 -mb-12 w-full flex-1">
      <CameraView
        className="mb-0"
        facing={facing}
        mode={"picture"}
        flash={"auto"}
      >
        <View className="flex h-full flex-col items-center justify-end rounded-xl">
          <View className="flex w-full flex-row items-center justify-between rounded-xl p-14 pb-16">
            <TouchableOpacity
              className="bg-sand-10 rounded-3xl p-4"
              onPress={toggleCameraFacing}
            >
              <ArrowsClockwise size={24} weight="bold" />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-sand-10 rounded-3xl p-4"
              onPress={toggleCameraFacing}
            >
              <Camera size={24} weight="bold" />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}
