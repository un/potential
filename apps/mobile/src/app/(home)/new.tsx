import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text } from "~/components/ui/text";

export default function NewTrackable() {
  return (
    <SafeAreaView className="flex-1" edges={{ bottom: "maximum" }}>
      <ScrollView className="flex-1 p-6">
        <View className="mb-12 flex w-full flex-col items-center justify-center gap-6">
          <Text>New Trackable</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
