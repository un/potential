import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { authClient, doAuthLogout } from "~/utils/auth-client";

export default function Profile() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  async function handleLogout() {
    await doAuthLogout();
    router.replace("../../login");
  }

  return (
    <SafeAreaView className="flex-1" edges={["bottom"]}>
      <ScrollView className="w-full flex-1 p-6">
        <View className="w-full flex-1 flex-col gap-4">
          <Text className="text-3xl" type={"title"}>
            Settings
          </Text>

          <View className="">
            <Text className="mb-2 text-lg">User Information</Text>
            <Text>Name: {session?.user.name ?? "Not available"}</Text>
            <Text>Email: {session?.user.email ?? "Not available"}</Text>
          </View>

          <Button onPress={() => handleLogout()}>
            <Text>Sign Out</Text>
          </Button>
          <Button
            variant={"destructive"}
            onPress={() => router.push("/delete")}
          >
            <Text>Permanently Delete Account</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
