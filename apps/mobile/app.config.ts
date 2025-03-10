import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: '1up',
  slug: '1up',
  scheme: '1up',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './assets/icon-light.png',
  userInterfaceStyle: 'automatic',
  jsEngine: 'hermes',
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: 'com.1upapp',
    supportsTablet: true,
    icon: {
      light: './assets/icon-light.png',
      dark: './assets/icon-dark.png'
      // tinted: "",
    }
  },
  android: {
    package: 'com.1upapp',
    adaptiveIcon: {
      foregroundImage: './assets/icon-light.png',
      backgroundColor: '#1F104A'
    }
  },
  // extra: {
  //   eas: {
  //     projectId: "your-eas-project-id",
  //   },
  // },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true
  },
  plugins: [
    'expo-router',
    [
      'expo-sqlite',
      {
        enableFTS: true,
        useSQLCipher: true
      }
    ],
    [
      'expo-secure-store',
      {
        configureAndroidBackup: true,
        faceIDPermission:
          'Allow Augmented to access your Face ID biometric data.'
      }
    ],
    [
      'expo-splash-screen',
      {
        backgroundColor: '#E4E4E7',
        image: './assets/icon-light.png',
        dark: {
          backgroundColor: '#18181B',
          image: './assets/icon-dark.png'
        }
      }
    ]
  ]
});
