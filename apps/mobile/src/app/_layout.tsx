import { useCallback } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
// Fonts

import {
  IBMPlexSans_100Thin,
  IBMPlexSans_100Thin_Italic,
  IBMPlexSans_200ExtraLight,
  IBMPlexSans_200ExtraLight_Italic,
  IBMPlexSans_300Light,
  IBMPlexSans_300Light_Italic,
  IBMPlexSans_400Regular,
  IBMPlexSans_400Regular_Italic,
  IBMPlexSans_500Medium,
  IBMPlexSans_500Medium_Italic,
  IBMPlexSans_600SemiBold,
  IBMPlexSans_600SemiBold_Italic,
  IBMPlexSans_700Bold,
  IBMPlexSans_700Bold_Italic,
} from "@expo-google-fonts/ibm-plex-sans";
import {
  IBMPlexSerif_100Thin,
  IBMPlexSerif_100Thin_Italic,
  IBMPlexSerif_200ExtraLight,
  IBMPlexSerif_200ExtraLight_Italic,
  IBMPlexSerif_300Light,
  IBMPlexSerif_300Light_Italic,
  IBMPlexSerif_400Regular,
  IBMPlexSerif_400Regular_Italic,
  IBMPlexSerif_500Medium,
  IBMPlexSerif_500Medium_Italic,
  IBMPlexSerif_600SemiBold,
  IBMPlexSerif_600SemiBold_Italic,
  IBMPlexSerif_700Bold,
  IBMPlexSerif_700Bold_Italic,
} from "@expo-google-fonts/ibm-plex-serif";
import { useColorScheme } from "nativewind";
import { Toaster } from "sonner-native";

import "../styles.css";

import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClientProvider } from "@tanstack/react-query";
// @ts-expect-error types not exported correctly from lib
import { IconContext } from "phosphor-react-native/lib/module";

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
    IBMPlexSans_100Thin,
    IBMPlexSans_200ExtraLight,
    IBMPlexSans_300Light,
    IBMPlexSans_400Regular,
    IBMPlexSans_500Medium,
    IBMPlexSans_600SemiBold,
    IBMPlexSans_700Bold,
    IBMPlexSans_100Thin_Italic,
    IBMPlexSans_200ExtraLight_Italic,
    IBMPlexSans_300Light_Italic,
    IBMPlexSans_400Regular_Italic,
    IBMPlexSans_500Medium_Italic,
    IBMPlexSans_600SemiBold_Italic,
    IBMPlexSans_700Bold_Italic,
    IBMPlexSerif_100Thin,
    IBMPlexSerif_200ExtraLight,
    IBMPlexSerif_300Light,
    IBMPlexSerif_400Regular,
    IBMPlexSerif_500Medium,
    IBMPlexSerif_600SemiBold,
    IBMPlexSerif_700Bold,
    IBMPlexSerif_100Thin_Italic,
    IBMPlexSerif_200ExtraLight_Italic,
    IBMPlexSerif_300Light_Italic,
    IBMPlexSerif_400Regular_Italic,
    IBMPlexSerif_500Medium_Italic,
    IBMPlexSerif_600SemiBold_Italic,
    IBMPlexSerif_700Bold_Italic,
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
