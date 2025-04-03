import { useCallback } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
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
import { Toaster } from "sonner-native";

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

// hacky workaround due to "route not found" error when splash screen is hidden
SplashScreen.setOptions({
  duration: 2000,
  fade: true,
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

  const router = useRouter();
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || error) {
      // hacky workaround due to "route not found" error when splash screen is hidden
      router.push("/");
      await SplashScreen.hideAsync().catch((error) => {
        console.error(error);
      });
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
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
            <Toaster
              position="top-center"
              closeButton
              pauseWhenPageIsHidden
              autoWiggleOnUpdate={"always"}
              toastOptions={{
                toastContainerStyle: {
                  backgroundColor:
                    colorScheme === "dark" ? "#191918" : "#f9f9f8",
                  borderColor: colorScheme === "dark" ? "#292928" : "#e0e0e0",
                  borderWidth: 1,
                },
                titleStyle: {
                  color: colorScheme === "dark" ? "#f9f9f8" : "#191918",
                },
                descriptionStyle: {
                  color: colorScheme === "dark" ? "#f9f9f8" : "#191918",
                },
              }}
            />
          </IconContext.Provider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
