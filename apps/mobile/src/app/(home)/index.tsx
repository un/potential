import React from "react";
import { View } from "react-native";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Flask, PlusCircle } from "phosphor-react-native";

import { TrackersContainer } from "~/components/trackers/TrackersContainer";
import { Text } from "~/components/ui/text";
import { iconColor } from "~/utils/ui";

export default function DashboardHome() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1" edges={["bottom"]}>
      <View className="flex h-full flex-1 flex-col gap-6 pt-6">
        <View
          className={
            "flex flex-row items-center justify-between gap-2 px-6 py-0"
          }
        >
          <View className={"flex flex-row items-center justify-end gap-2"}>
            <Pressable onPress={() => router.push("/(home)/new")} hitSlop={4}>
              <Flask color={iconColor()} />
            </Pressable>
            <Text className="text-sand-11 text-xs">Run a new experiment</Text>
          </View>
          <View className={"flex flex-row items-center justify-end gap-2"}>
            <Text className="text-sand-11 text-xs">Track something new</Text>
            <Pressable onPress={() => router.push("/(home)/new")} hitSlop={4}>
              <PlusCircle color={iconColor()} />
            </Pressable>
          </View>
        </View>
        <ScrollView
          className="flex flex-1 flex-col gap-8 px-6 pb-0"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="mb-6 flex flex-1 flex-col items-center gap-6">
            {/* <ExperimentsDemo /> */}
            <TrackersContainer />
          </View>
        </ScrollView>
        {/* <View className="flex w-full flex-row gap-2 px-6 py-0">
          <Button
            onPress={() => router.push("/(home)/log")}
            // className="flex w-[49%] flex-row gap-2"
            className="flex w-full flex-row gap-2"
          >
            <Text>Log</Text>
          </Button>
          <Button
            onPress={() => router.push("/(home)/experiment")}
            className="flex w-[49%] flex-row gap-2"
          >
            <Text>Experiment</Text>
          </Button>
        </View> */}
      </View>
    </SafeAreaView>
  );
}
