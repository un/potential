import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Loading } from "~/components/loading";
import { Text } from "~/components/ui/text";
import { authClient } from "~/utils/auth-client";

export default function Index() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    // Wait 2 seconds before redirecting
    const timer = setTimeout(() => {
      if (!isPending) {
        if (session?.user.id) {
          // User is logged in, redirect to dashboard

          router.replace("/post-login-redirect");
        } else {
          // User is not logged in, redirect to login
          router.replace("/login");
        }
      }
      // hacky workaround due to "route not found" error when splash screen is hidden, otherwise set to 2000
    }, 4000);

    return () => clearTimeout(timer);
  }, [session, isPending, router]);

  return (
    <SafeAreaView className="flex-1">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />

      <View className="flex-1 items-center justify-center gap-8 p-8">
        <Loading size="mega" />
        <Text className="text-5xl" type={"title"}>
          Loading your health potential
        </Text>
      </View>
    </SafeAreaView>
  );
}
