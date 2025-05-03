import type { ConfigContext, ExpoConfig } from "expo/config";

interface ExpoEnv {
  EXPO_PUBLIC_BACKEND_URL?: string;
}
const env: ExpoEnv = Object.fromEntries(
  Object.entries(process.env).filter(([key]) => key.startsWith("EXPO_")),
);

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Potential",
  extra: {
    env,
    onboardingVersion: "0.0.1",
    eas: {
      projectId: "473dc1d3-c667-41e9-a543-508b4ec62250",
    },
  },
  slug: "potential",
  scheme: "potential",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/app/icon-light.png",
  userInterfaceStyle: "automatic",
  updates: {
    fallbackToCacheTimeout: 0,
  },
  newArchEnabled: true,
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "io.potentialhealth",
    supportsTablet: true,
    icon: {
      light: "./assets/app/icon-light.png",
      dark: "./assets/app/icon-light.png",
      // tinted: "",
    },
  },
  android: {
    package: "io.potentialhealth",
    adaptiveIcon: {
      foregroundImage: "./assets/app/icon-light.png",
      backgroundColor: "#1F104A",
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
