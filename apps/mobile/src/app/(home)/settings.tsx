import React from "react";
import { Switch, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";

import { Text } from "~/components/ui/text";

export default function Settings() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const handleToggleTheme = () => {
    toggleColorScheme();
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 p-6">
        <Text className="mb-4 text-3xl" type={"title"}>
          Settings
        </Text>

        <View className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg">Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={handleToggleTheme}
              trackColor={{ false: "#767577", true: "#3b82f6" }}
              thumbColor="#f4f3f4"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
