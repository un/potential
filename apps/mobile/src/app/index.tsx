import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { Text } from "~/components/ui/text";
import { trpc } from "~/utils/api";
import { authClient } from "~/utils/auth-client";
import { getApiUrl } from "~/utils/base-url";

// import { useQueryClient } from "@tanstack/react-query";

export default function Index() {
  // const queryClient = useQueryClient();

  const apiUrl = getApiUrl();

  const postQuery = useQuery(trpc.hello.hello.queryOptions());
  const { data: session } = authClient.useSession();

  return (
    <SafeAreaView className="flex-1">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="bg-green-5 flex-1 p-4">
        <Text className="pb-2 text-center text-3xl">
          Create <Text className="text-red-9">T3</Text> Turbo
        </Text>
        <Text className="pb-2 text-center text-3xl font-light">
          Create <Text className="text-pink-400">T3</Text> Turbo
        </Text>
        <Text className="pb-2 text-center text-5xl font-bold">
          Create <Text className="text-pink-400">T3</Text> Turbo
        </Text>
        <ScrollView className="flex-1 overflow-scroll p-4">
          <View className="py-2">
            <Text className="font-semibold italic">Press on a post</Text>

            <Text className="font-semibold italic">
              API: {JSON.stringify(apiUrl)}
            </Text>
            <Text className="font-semibold italic">
              response: {JSON.stringify(postQuery.data)}
            </Text>
            <Text>Welcome, {session?.user.name ?? "Guest"}</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
