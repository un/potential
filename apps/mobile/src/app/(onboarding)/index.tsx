import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
        {/* <View className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
         <Text>aa{JSON.stringify(postQuery.data)}</Text>
        </View> */}
      </View>
    </SafeAreaView>
  );
}
