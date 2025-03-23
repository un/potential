import { useCallback } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
// Fonts
import {
  MartianMono_100Thin,
  MartianMono_200ExtraLight,
  MartianMono_300Light,
  MartianMono_400Regular,
  MartianMono_500Medium,
  MartianMono_600SemiBold,
  MartianMono_700Bold,
  MartianMono_800ExtraBold,
} from "@expo-google-fonts/martian-mono";
import { useColorScheme } from "nativewind";

import "../styles.css";

import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { IconContext } from "phosphor-react-native";

import { queryClient } from "~/utils/api";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore error */
});

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  const [fontsLoaded, error] = useFonts({
    MartianMono_100Thin,
    MartianMono_200ExtraLight,
    MartianMono_300Light,
    MartianMono_400Regular,
    MartianMono_500Medium,
    MartianMono_600SemiBold,
    MartianMono_700Bold,
    MartianMono_800ExtraBold,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-require-imports
    Monocraft: require("assets/fonts/Monocraft.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || error) {
      await SplashScreen.hideAsync().catch(() => {
        /* ignore error */
      });
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <IconContext.Provider
          value={{
            color: colorScheme === "dark" ? "#f9f9f8" : "#191918",
          }}
        >
          <View className="flex-1" onLayout={onLayoutRootView}>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: {
                  backgroundColor:
                    colorScheme === "dark" ? "#191918" : "#f9f9f8",
                },
              }}
            />
          </View>
        </IconContext.Provider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
