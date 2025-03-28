import Constants from "expo-constants";

const getBaseUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(":")[0];

  if (!localhost) {
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

  if (
    env?.EXPO_PUBLIC_BACKEND_URL &&
    env.EXPO_PUBLIC_BACKEND_URL !== "" &&
    env.EXPO_PUBLIC_BACKEND_URL.length > 0
  ) {
    return env.EXPO_PUBLIC_BACKEND_URL;
  }

  return getBaseUrl();
};
