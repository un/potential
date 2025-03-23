import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { Stack, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { Loading } from "~/components/loading";
import { Text } from "~/components/ui/text";
import { trpc } from "~/utils/api";

export default function Login() {
  const router = useRouter();

  // get user profile
  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery(trpc.user.profile.getUserProfileOverview.queryOptions());

  const latestOnboardingVersion = Constants.expoConfig?.extra
    ?.onboardingVersion as number;

  // Only redirect after profile data is loaded
  React.useEffect(() => {
    if (profileLoading) return;

    if (profileError) {
      console.error(profileError);
      return;
    }

    if (profileData) {
      // Add setTimeout to delay redirect by 2 seconds
      setTimeout(() => {
        if (profileData.lastOnboardingVersion < latestOnboardingVersion) {
          // Use href instead of push for the path pattern
          router.replace({
            pathname: "/(onboarding)",
          });
        } else {
          router.push("/(home)");
        }
      }, 2000); // 2 seconds delay
    }
  }, [
    profileLoading,
    profileData,
    profileError,
    latestOnboardingVersion,
    router,
  ]);

  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen options={{ title: "Redirecting..." }} />

      <View className="flex-1 items-center justify-center gap-8 p-8">
        <Loading size="mega" />
        <Text className="text-2xl" type={"title"}>
          Checking your account
        </Text>
      </View>
    </SafeAreaView>
  );
}
