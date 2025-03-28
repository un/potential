import { View } from "react-native";

import type { PermissionType } from "../../lib/hooks/usePermission";
import { usePermission } from "../../lib/hooks/usePermission";
import { Button } from "./button";
import { Text } from "./text";

interface RequestPermissionProps {
  permission: PermissionType;
  title?: string;
  description?: string;
  buttonText?: string;
  onPermissionGranted?: () => void;
}

export function RequestPermission({
  permission,
  title = "Permission Required",
  description = `We need your permission to use the ${permission}`,
  buttonText = `Grant ${permission} Permission`,
  onPermissionGranted,
}: RequestPermissionProps) {
  const { requestPermission } = usePermission(permission);

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted && onPermissionGranted) {
      onPermissionGranted();
    }
  };

  return (
    <View className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
      <Text className="text-center text-2xl font-bold">{title}</Text>
      <Text className="mb-4 text-center text-base">{description}</Text>
      <Button onPress={handleRequestPermission} className="w-full">
        <Text>{buttonText}</Text>
      </Button>
    </View>
  );
}
