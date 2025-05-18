import type { ConfigContext, ExpoConfig } from "expo/config";

interface ExpoEnv {
  EXPO_PUBLIC_BACKEND_URL?: string;
}
const env: ExpoEnv = Object.fromEntries(
  Object.entries(process.env).filter(([key]) => key.startsWith("EXPO_")),
);

const IS_DEV = process.env.APP_VARIANT === "development";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: IS_DEV ? "Potential Dev" : "Potential",
  extra: {
    env,
    onboardingVersion: "0.0.1",
    eas: {
      projectId: "f406fd9a-e9b0-4fd9-93f0-d2533b773a05",
    },
  },
  slug: IS_DEV ? "potential-dev" : "potential",
  scheme: IS_DEV ? "potential-dev" : "potential",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/app/icon-light.png",
  userInterfaceStyle: "automatic",
  updates: {
    url: "https://u.expo.dev/f406fd9a-e9b0-4fd9-93f0-d2533b773a05",
  },
  newArchEnabled: true,
  assetBundlePatterns: ["**/*"],
  ios: {
    runtimeVersion: "1.0.0",
    bundleIdentifier: IS_DEV ? "io.potentialhealth.dev" : "io.potentialhealth",
    supportsTablet: true,
    icon: {
      light: "./assets/app/icon-light.png",
      dark: "./assets/app/icon-light.png",
      // tinted: "",
    },
  },
  android: {
    package: IS_DEV ? "io.potentialhealth.dev" : "io.potentialhealth",
    adaptiveIcon: {
      foregroundImage: "./assets/app/icon-light.png",
      backgroundColor: "#1F104A",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    "expo-web-browser",
    "expo-localization",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#f1f0ef",
        image: "./assets/app/splash-light.png",
        dark: {
          backgroundColor: "#222221",
          image: "./assets/app/splash-dark.png",
        },
      },
    ],
    [
      "expo-camera",
      {
        cameraPermission: "Allow Potential Health to access your camera",
        microphonePermission:
          "Allow Potential Health to access your microphone",
        recordAudioAndroid: true,
      },
    ],
    [
      "expo-av",
      {
        microphonePermission:
          "Allow Potential Health to access your microphone.",
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission:
          "Allow Potential Health to access your photos and let you upload them.",
      },
    ],
  ],
});
