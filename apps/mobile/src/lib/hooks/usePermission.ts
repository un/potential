import { useCallback, useEffect, useState } from "react";
import { Audio } from "expo-av";
import { useCameraPermissions } from "expo-camera";
import {
  getMediaLibraryPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";

export type PermissionType =
  | "camera"
  | "audio"
  | "mediaLibrary"
  | "imagePicker";

export function usePermission(permission: PermissionType) {
  const [isGranted, setIsGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [audioPermission, setAudioPermission] = useState<boolean | null>(null);
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState<
    boolean | null
  >(null);

  const checkAudioPermission = useCallback(async () => {
    try {
      const { status } = await Audio.getPermissionsAsync();
      // Using a hardcoded string since this is what the API returns
      const granted = status === Audio.PermissionStatus.GRANTED;
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
      const { status } = await Audio.requestPermissionsAsync();
      // Using a hardcoded string since this is what the API returns
      const granted = status === Audio.PermissionStatus.GRANTED;
      setAudioPermission(granted);
      return granted;
    } catch (error) {
      console.error("Error requesting audio permission:", error);
      setAudioPermission(false);
      return false;
    }
  }, []);

  const checkMediaLibraryPermission = useCallback(async () => {
    try {
      const result = await getMediaLibraryPermissionsAsync();
      const granted = result.granted;
      setMediaLibraryPermission(granted);
      return granted;
    } catch (error) {
      console.error("Error checking media library permission:", error);
      setMediaLibraryPermission(false);
      return false;
    }
  }, []);

  const requestMediaLibraryPermission = useCallback(async () => {
    try {
      // Dynamically import the function to avoid TypeScript issues
      const result = await requestMediaLibraryPermissionsAsync();
      const granted = result.granted;
      setMediaLibraryPermission(granted);
      return granted;
    } catch (error) {
      console.error("Error requesting media library permission:", error);
      setMediaLibraryPermission(false);
      return false;
    }
  }, []);

  const requestAPermission = useCallback(async () => {
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
      case "mediaLibrary":
        granted = await requestMediaLibraryPermission();
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
    requestMediaLibraryPermission,
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
        case "mediaLibrary":
          if (mediaLibraryPermission === null) {
            granted = await checkMediaLibraryPermission();
          } else {
            granted = mediaLibraryPermission;
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
  }, [
    permission,
    cameraPermission,
    audioPermission,
    mediaLibraryPermission,
    checkAudioPermission,
    checkMediaLibraryPermission,
  ]);

  return {
    isGranted,
    isLoading,
    requestPermission: requestAPermission,
  };
}
