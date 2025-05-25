import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation } from "@tanstack/react-query";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { trpc } from "~/utils/api";

export default function NewTrackable() {
  const { mutateAsync } = useMutation(
    trpc.trackables.promptAiForNewTrackables.mutationOptions(),
  );
  return (
    <SafeAreaView className="flex-1" edges={{ bottom: "maximum" }}>
      <ScrollView className="flex-1 p-6">
        <View className="mb-12 flex w-full flex-col items-center justify-center gap-6">
          <Text>New Trackable</Text>
          <Button onPress={() => mutateAsync({})}>
            <Text>Prompt AI</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
