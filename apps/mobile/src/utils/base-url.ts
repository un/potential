import Constants from "expo-constants";

export const getApiUrl = (): string => {
  interface ExpoEnv {
    EXPO_PUBLIC_BACKEND_URL?: string;
  }

  // get backend api url from env
  const env = Constants.expoConfig?.extra?.env as ExpoEnv | undefined;

  if (
    env?.EXPO_PUBLIC_BACKEND_URL &&
    env.EXPO_PUBLIC_BACKEND_URL !== "" &&
    env.EXPO_PUBLIC_BACKEND_URL.length > 0
  ) {
    return env.EXPO_PUBLIC_BACKEND_URL;
  }

  // if backend env is not set, assume localhost, fetch and use IP address

  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(":")[0];

  if (!localhost) {
    throw new Error(
      "Failed to get localhost. Please point to your production server.",
    );
  }
  return `http://${localhost}:3100`;
};
