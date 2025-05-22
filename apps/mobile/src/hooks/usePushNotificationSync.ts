import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as ExpoNotifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import { useMutation } from "@tanstack/react-query";

import { trpc } from "~/utils/api";

// Assuming you have an auth context or hook like this:
// import { useAuth } from './useAuth'; // Replace with your actual auth hook/context

const SECURE_STORE_PUSH_TOKEN_KEY = "expoPushToken";

async function getPushToken(): Promise<string | null> {
  if (!Device.isDevice) {
    console.warn("Push notifications only work on physical devices.");
    return null;
  }

  const { status: existingStatus } =
    await ExpoNotifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== ExpoNotifications.PermissionStatus.GRANTED) {
    const { status } = await ExpoNotifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== ExpoNotifications.PermissionStatus.GRANTED) {
    console.warn("Permission for push notifications not granted.");
    return null;
  }

  if (Platform.OS === "android") {
    try {
      await ExpoNotifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: ExpoNotifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    } catch (e) {
      console.error("Failed to set notification channel:", e);
    }
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const projectId = Constants.expoConfig?.extra?.eas.projectId as string;
    if (!projectId) {
      console.error("Project ID not found. Cannot get Expo Push Token.");
      return null;
    }
    const token = (await ExpoNotifications.getExpoPushTokenAsync({ projectId }))
      .data;
    return token;
  } catch (error) {
    console.error("Error getting Expo Push Token:", error);
    return null;
  }
}

export function usePushNotificationSync(userId: string | undefined) {
  const [currentExpoPushToken, setCurrentExpoPushToken] = useState<
    string | null
  >(null);
  const previousTokenRef = useRef<string | null>(null); // To store the token that was last sent to backend

  // Setup the mutation for creating logs
  const { mutateAsync: setNotificationTokenMutation } = useMutation(
    trpc.user.account.setNotificationToken.mutationOptions({}),
  );
  const { mutateAsync: deleteNotificationTokenMutation } = useMutation(
    trpc.user.account.deleteNotificationToken.mutationOptions({}),
  );

  // Function to register or update token with backend
  const syncTokenWithBackend = useCallback(
    async (tokenToSync: string) => {
      if (!userId) {
        console.log("User not authenticated, skipping token sync.");
        return;
      }
      console.log("Attempting to sync token with backend:", tokenToSync);
      try {
        await setNotificationTokenMutation({
          token: tokenToSync,
          previousToken: previousTokenRef.current ?? "", // Send the previously synced token
        });
        await SecureStore.setItemAsync(
          SECURE_STORE_PUSH_TOKEN_KEY,
          tokenToSync,
        );
        previousTokenRef.current = tokenToSync; // Update the ref to the newly synced token
        console.log("Push token synced with backend and stored securely.");
      } catch (error) {
        console.error("Failed to sync push token with backend:", error);
      }
    },
    [userId, setNotificationTokenMutation],
  );

  // Effect to get token and sync if new/different
  useEffect(() => {
    async function initializePushNotifications() {
      const storedToken = await SecureStore.getItemAsync(
        SECURE_STORE_PUSH_TOKEN_KEY,
      );
      previousTokenRef.current = storedToken; // Initialize ref with stored token

      const newToken = await getPushToken();
      setCurrentExpoPushToken(newToken);
      if (newToken && userId) {
        await syncTokenWithBackend(newToken);
      }
    }

    if (userId) {
      // Only run if user is authenticated
      void initializePushNotifications();
    }
  }, [userId, syncTokenWithBackend]); // Rerun if userId changes or syncTokenWithBackend (which depends on userId)

  const handleLogoutNotifications = useCallback(async () => {
    const tokenToUnregister = await SecureStore.getItemAsync(
      SECURE_STORE_PUSH_TOKEN_KEY,
    );
    if (tokenToUnregister) {
      console.log(
        "Attempting to unregister token from backend:",
        tokenToUnregister,
      );
      try {
        await deleteNotificationTokenMutation({
          token: tokenToUnregister,
        });
        console.log("Push token unregistered from backend.");
      } catch (error) {
        console.error("Failed to unregister push token from backend:", error);
      }
      await SecureStore.deleteItemAsync(SECURE_STORE_PUSH_TOKEN_KEY);
      previousTokenRef.current = null;
      setCurrentExpoPushToken(null); // Clear state
      console.log("Push token removed from secure store.");
    } else {
      console.log("No push token found in secure store to unregister.");
    }
  }, [deleteNotificationTokenMutation]);

  return { currentExpoPushToken, handleLogoutNotifications };
}
