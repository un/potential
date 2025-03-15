import Constants from "expo-constants";

const getBaseUrl = () => {
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
