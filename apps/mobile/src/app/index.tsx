import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getLoadedFonts } from "expo-font";
import { Stack } from "expo-router";

import { Text } from "~/components/ui/text";

// import { useQueryClient } from "@tanstack/react-query";

export default function Index() {
  // const queryClient = useQueryClient();

  const loadedFonts = getLoadedFonts();

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
        <View className="flex-1 p-4">
          <View className="py-2">
            <Text className="font-semibold italic">Press on a post</Text>
            <Text className="font-semibold italic">
              {loadedFonts.map((font) => font).join(", ")}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
