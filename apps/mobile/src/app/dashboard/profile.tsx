import React from "react";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { Text } from "~/components/ui/text";
import { authClient } from "~/utils/auth-client";

export default function Profile() {
  const { data: session } = authClient.useSession();

  const handleLogout = () => {
    authClient.signOut();
    router.replace("/");
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 p-6">
        <Text className="mb-4 text-3xl" type={"title"}>
          Profile
        </Text>

        <View className="mb-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
          <Text className="mb-2 text-lg">User Information</Text>
          <Text>Name: {session?.user.name ?? "Not available"}</Text>
          <Text>Email: {session?.user.email ?? "Not available"}</Text>
        </View>

        <TouchableOpacity
          className="mt-4 items-center rounded-lg bg-red-500 px-4 py-3"
          onPress={handleLogout}
        >
          <Text className="font-semibold text-white">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
