import type { ConfigContext, ExpoConfig } from "expo/config";

interface ExpoEnv {
  EXPO_PUBLIC_BACKEND_URL?: string;
}
const env: ExpoEnv = Object.fromEntries(
  Object.entries(process.env).filter(([key]) => key.startsWith("EXPO_")),
);

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "1up",
  extra: {
    env,
    onboardingVersion: "0.0.1",
    eas: {
      projectId: "473dc1d3-c667-41e9-a543-508b4ec62250",
    },
  },
  slug: "1up",
  scheme: "1up",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/app/icon-light.png",
  userInterfaceStyle: "automatic",
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "xyz.1up",
    supportsTablet: true,
    icon: {
      light: "./assets/app/icon-light.png",
      dark: "./assets/app/icon-light.png",
      // tinted: "",
    },
  },
  android: {
    package: "xyz.1up",
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
        cameraPermission: "Allow 1up Health to access your camera",
        microphonePermission: "Allow 1up Health to access your microphone",
        recordAudioAndroid: true,
      },
    ],
    [
      "expo-av",
      {
        microphonePermission: "Allow 1up Health to access your microphone.",
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission:
          "Allow 1up Health to access your photos and let you upload them.",
      },
    ],
  ],
});
