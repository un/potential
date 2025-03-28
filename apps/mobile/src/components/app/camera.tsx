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
    <View className="bg-red-5 h-full w-full items-center justify-center">
      <CameraView
        className="bg-green-5 flex h-full w-full flex-col items-end rounded-3xl p-8"
        facing={facing}
        mode={"picture"}
        flash={"auto"}
      >
        <View className="m-4 flex w-full flex-row items-center justify-between bg-transparent p-12">
          <TouchableOpacity
            className="bg-sand-11 rounded-3xl p-4"
            onPress={toggleCameraFacing}
          >
            <ArrowsClockwise size={24} weight="bold" />
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-sand-11 rounded-3xl p-4"
            onPress={toggleCameraFacing}
          >
            <Camera size={24} weight="bold" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}
