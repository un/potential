import type { TRPCClientErrorLike } from "@trpc/client";
import type { ExpoConfig } from "expo-constants";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as ExpoNotifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { z } from "zod";

import type { AppRouter } from "@potential/trpc";

import { trpc } from "~/utils/api";

// Assuming you have an auth context or hook like this:
// import { useAuth } from './useAuth'; // Replace with your actual auth hook/context

const SECURE_STORE_PUSH_TOKEN_KEY = "expoPushToken";

// Define input/output types for mutations
const _SetNotificationTokenInputSchema = z.object({
  token: z.string().max(255),
  previousToken: z.string().max(255),
});
type SetNotificationTokenInput = z.infer<
  typeof _SetNotificationTokenInputSchema
>;
interface SetNotificationTokenOutput {
  success: boolean;
}

const _DeleteNotificationTokenInputSchema = z.object({
  token: z.string().max(255),
});
type DeleteNotificationTokenInput = z.infer<
  typeof _DeleteNotificationTokenInputSchema
>;
interface DeleteNotificationTokenOutput {
  success: boolean;
}

// Helper to safely get projectId
function getExpoProjectId(): string | undefined {
  const expoConfig = Constants.expoConfig as ExpoConfig | undefined;
  return expoConfig?.extra?.eas?.projectId ?? "potential";
}

async function getPushToken(): Promise<string | null> {
  if (!Device.isDevice) {
    console.warn("Push notifications only work on physical devices.");
    toast.warning("Push notifications only work on physical devices.");
    return null;
  }

  const { status: existingStatus } =
    await ExpoNotifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== ExpoNotifications.PermissionStatus.GRANTED) {
    toast.info("Requesting push notification permissions...");
    const { status } = await ExpoNotifications.requestPermissionsAsync();
    finalStatus = status;
    toast.info(`Permission status: ${finalStatus}`);
  }

  if (finalStatus !== ExpoNotifications.PermissionStatus.GRANTED) {
    console.warn("Permission for push notifications not granted.");
    toast.error("Permission for push notifications not granted.");
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
      toast.error(`Failed to set Android channel: ${(e as Error).message}`);
    }
  }

  try {
    const projectId = getExpoProjectId();
    if (!projectId) {
      console.error("Project ID not found. Cannot get Expo Push Token.");
      toast.error("Project ID not found for push token.");
      return null;
    }
    toast.info("Getting Expo Push Token...");
    const token = (await ExpoNotifications.getExpoPushTokenAsync({ projectId }))
      .data;
    toast.success(`Got push token: ${token.substring(0, 15)}...`);
    return token;
  } catch (error) {
    console.error("Error getting Expo Push Token:", error);
    toast.error(`Error getting Expo Push Token: ${(error as Error).message}`);
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
        toast.warning("User not authenticated, skipping push token sync.");
        return;
      }
      console.log("Attempting to sync token with backend:", tokenToSync);
      toast.info(`Syncing token: ${tokenToSync.substring(0, 15)}...`);
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
        toast.success("Push token synced with backend.");
      } catch (error) {
        console.error("Failed to sync push token with backend:", error);
        toast.error(
          `Failed to sync push token: ${(error as TRPCClientErrorLike<AppRouter>).message}`,
        );
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
      if (storedToken) {
        toast.info(`Found stored token: ${storedToken.substring(0, 15)}...`);
      }

      const newToken = await getPushToken();
      setCurrentExpoPushToken(newToken);
      if (newToken && userId) {
        // Only sync if the new token is different from the one last successfully synced
        if (newToken !== previousTokenRef.current) {
          toast.info(
            `New token (${newToken.substring(0, 10)}...) differs from stored (${(previousTokenRef.current ?? "null").substring(0, 10)}...). Syncing.`,
          );
          await syncTokenWithBackend(newToken);
        } else {
          toast.info(
            `New token (${newToken.substring(0, 10)}...) is same as stored. No sync needed.`,
          );
          await syncTokenWithBackend(newToken);
        }
      } else if (!newToken && userId) {
        console.warn(
          "Failed to get a new push token, but user is authenticated.",
        );
        // toast.warning("Failed to get new push token (user auth'd)."); // Already handled in getPushToken
      } else if (newToken && !userId) {
        console.log(
          "Got new push token, but user not authenticated yet. Will sync when user ID is available.",
        );
        toast.info(
          "Got push token, but user not authenticated. Will sync later.",
        );
      }
    }

    if (userId) {
      toast.info(
        `User ID available (${userId}), initializing push notifications.`,
      );
      // Only run if user is authenticated
      void initializePushNotifications();
    } else {
      toast.warning("User ID not yet available for push sync.");
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
      toast.info(
        `Unregistering token: ${tokenToUnregister.substring(0, 15)}...`,
      );
      try {
        await deleteNotificationTokenMutation({
          token: tokenToUnregister,
        });
        console.log("Push token unregistered from backend.");
        toast.success("Push token unregistered from backend.");
      } catch (error) {
        console.error("Failed to unregister push token from backend:", error);
        toast.error(
          `Failed to unregister token: ${(error as TRPCClientErrorLike<AppRouter>).message}`,
        );
      }
      await SecureStore.deleteItemAsync(SECURE_STORE_PUSH_TOKEN_KEY);
      previousTokenRef.current = null;
      setCurrentExpoPushToken(null); // Clear state
      console.log("Push token removed from secure store.");
      toast.info("Push token removed from secure store.");
    } else {
      console.log("No push token found in secure store to unregister.");
      toast.info("No stored push token to unregister.");
    }
  }, [deleteNotificationTokenMutation]);

  return { currentExpoPushToken, handleLogoutNotifications };
}
