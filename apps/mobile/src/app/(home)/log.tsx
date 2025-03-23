import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text } from "~/components/ui/text";

export default function Stats() {
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 p-6">
        <Text className="mb-4 text-3xl" type={"title"}>
          Log something
        </Text>

        <View className="mb-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
          <Text className="mb-2 text-lg">User Information</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
