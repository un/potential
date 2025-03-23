import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { authClient } from "~/utils/auth-client";

export default function DashboardHome() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  // const queryClient = useQueryClient();

  // const postQuery = useQuery(trpc.hello.hello.queryOptions());

  return (
    <SafeAreaView className="flex-1" edges={["bottom"]}>
      <View className="flex flex-1 flex-col gap-6 p-6">
        <ScrollView>
          <View className="flex flex-col gap-6">
            <Text className="mb-4 text-3xl" type={"title"}>
              Dashboard
            </Text>

            <Text className="mb-4">
              Welcome, {session?.user.name ?? "User"}!
            </Text>

            <View className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
              <Text>Your dashboard content goes here</Text>
            </View>
          </View>
        </ScrollView>
        <View>
          <Button onPress={() => router.push("/(home)/log")}>
            <Text>Log something</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
