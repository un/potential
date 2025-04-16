import React from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { TrackablesContainer } from "~/components/trackables/TrackablesContainer";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function DashboardHome() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1" edges={["bottom"]}>
      <View className="flex h-full flex-1 flex-col gap-6">
        <ScrollView className="flex-1 p-6 pb-0">
          <View className="mb-6 flex flex-1 flex-col gap-6">
            <TrackablesContainer />
          </View>
        </ScrollView>
        <View className="px-6 py-0">
          <Button
            onPress={() => router.push("/(home)/log")}
            className="flex flex-row gap-2"
          >
            <Text>Log</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
