import Constants from "expo-constants";

/**
 * Extend this function when going to production by
 * setting the baseUrl to your production API URL.
 */
export const getBaseUrl = () => {
  /**
   * Gets the IP address of your host-machine. If it cannot automatically find it,
   * you'll have to manually set it. NOTE: Port 3000 should work for most but confirm
   * you don't have anything else running on it, or you'd have to change it.
   *
   * **NOTE**: This is only for development. In production, you'll want to set the
   * baseUrl to your production API URL.
   */
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(":")[0];

  if (!localhost) {
    // return "https://turbo.t3.gg";
    throw new Error(
      "Failed to get localhost. Please point to your production server.",
    );
  }
  return `http://${localhost}:3100`;
};
export const getApiUrl = (): string => {
  // Define the type for the environment variables
  interface ExpoEnv {
    EXPO_PUBLIC_BACKEND_URL?: string;
  }

  // Cast the env object to the defined type
  const env = Constants.expoConfig?.extra?.env as ExpoEnv | undefined;
  const backendUrl = env?.EXPO_PUBLIC_BACKEND_URL;

  return backendUrl ?? getBaseUrl();
};
