import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as ExpoNotifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";

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

  if (existingStatus !== "granted") {
    const { status } = await ExpoNotifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
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
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;
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

  const setNotificationTokenMutation =
    trpc.user.account.setNotificationToken.useMutation();
  const deleteNotificationTokenMutation =
    trpc.user.account.deleteNotificationToken.useMutation();

  // Function to register or update token with backend
  const syncTokenWithBackend = useCallback(
    async (tokenToSync: string) => {
      if (!userId) {
        console.log("User not authenticated, skipping token sync.");
        return;
      }
      console.log("Attempting to sync token with backend:", tokenToSync);
      try {
        await setNotificationTokenMutation.mutateAsync({
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

      if (newToken && newToken !== storedToken) {
        console.log(
          "New or different push token obtained:",
          newToken,
          "Stored token:",
          storedToken,
        );
        await syncTokenWithBackend(newToken);
      } else if (newToken && !storedToken) {
        console.log(
          "Push token obtained, no token was previously stored:",
          newToken,
        );
        await syncTokenWithBackend(newToken);
      } else if (newToken && newToken === storedToken) {
        console.log(
          "Current push token is the same as stored. No sync needed initially.",
        );
        // Optionally, you might still want to "touch" the token on the backend
        // to update last_seen_at by calling syncTokenWithBackend(newToken)
        // For now, we only sync if it's different or new.
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
        await deleteNotificationTokenMutation.mutateAsync({
          token: tokenToUnregister,
        });
        console.log("Push token unregistered from backend.");
      } catch (error) {
        console.error("Failed to unregister push token from backend:", error);
        // Decide if you still want to delete locally if backend fails.
        // For now, we proceed to delete locally.
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
