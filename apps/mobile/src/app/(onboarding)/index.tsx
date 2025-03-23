import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { authClient } from "~/utils/auth-client";

export default function DashboardHome() {
  const { data: session } = authClient.useSession();
  // const queryClient = useQueryClient();

  // const postQuery = useQuery(trpc.hello.hello.queryOptions());

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 p-6">
        <Text className="mb-4 text-3xl" type={"title"}>
          Onboarding
        </Text>

        <Text className="mb-4">Welcome, {session?.user.name ?? "User"}!</Text>

        <View className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
          <Text>Your dashboard content goes here</Text>
        </View>
        <Link href="/(home)" asChild>
          <Button>
            <Text>Go to home</Text>
          </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
}
