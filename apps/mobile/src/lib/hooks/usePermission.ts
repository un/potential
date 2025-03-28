import { useCallback, useEffect, useState } from "react";
import { Audio } from "expo-av";
import { useCameraPermissions } from "expo-camera";

export type PermissionType = "camera" | "audio";

export function usePermission(permission: PermissionType) {
  const [isGranted, setIsGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [audioPermission, setAudioPermission] = useState<boolean | null>(null);

  const checkAudioPermission = useCallback(async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const { status } = await Audio.getPermissionsAsync();
      const granted = status === "granted";
      setAudioPermission(granted);
      return granted;
    } catch (error) {
      console.error("Error checking audio permission:", error);
      setAudioPermission(false);
      return false;
    }
  }, []);

  const requestAudioPermission = useCallback(async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const { status } = await Audio.requestPermissionsAsync();
      const granted = status === "granted";
      setAudioPermission(granted);
      return granted;
    } catch (error) {
      console.error("Error requesting audio permission:", error);
      setAudioPermission(false);
      return false;
    }
  }, []);

  const requestPermission = useCallback(async () => {
    setIsLoading(true);
    let granted = false;

    switch (permission) {
      case "camera":
        await requestCameraPermission();
        granted = cameraPermission?.granted ?? false;
        break;
      case "audio":
        granted = await requestAudioPermission();
        break;
    }

    setIsGranted(granted);
    setIsLoading(false);
    return granted;
  }, [
    permission,
    requestCameraPermission,
    cameraPermission,
    requestAudioPermission,
  ]);

  useEffect(() => {
    let isMounted = true;

    const checkPermission = async () => {
      setIsLoading(true);
      let granted = false;

      switch (permission) {
        case "camera":
          granted = cameraPermission?.granted ?? false;
          break;
        case "audio":
          if (audioPermission === null) {
            granted = await checkAudioPermission();
          } else {
            granted = audioPermission;
          }
          break;
      }

      if (isMounted) {
        setIsGranted(granted);
        setIsLoading(false);
      }
    };

    void checkPermission();

    return () => {
      isMounted = false;
    };
  }, [permission, cameraPermission, audioPermission, checkAudioPermission]);

  return {
    isGranted,
    isLoading,
    requestPermission,
  };
}
