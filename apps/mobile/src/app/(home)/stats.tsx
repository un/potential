import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";

import { Text } from "~/components/ui/text";
import { trpc } from "~/utils/api";

export default function Stats() {
  const { data: profileData } = useQuery(
    trpc.user.profile.getUserProfileOverview.queryOptions(),
  );
  return (
    <SafeAreaView className="flex-1" edges={["bottom"]}>
      <ScrollView className="flex-1 p-6">
        <View className="flex flex-col gap-6">
          <Text className="text-3xl" type={"title"}>
            Stats
          </Text>

          <View className="flex flex-col gap-4">
            <View className="flex w-full flex-row justify-between gap-4">
              <Text className="text-lg">Streak</Text>
              <Text className="text-lg" type={"title"}>
                {profileData?.streakCurrentDays} Days
              </Text>
            </View>
            {profileData?.streakCurrentStartDate && (
              <View className="flex w-full flex-row justify-between gap-4">
                <Text className="text-lg">Streak Start</Text>
                <Text className="text-lg" type={"title"}>
                  {profileData.streakCurrentStartDate.toLocaleDateString()}
                </Text>
              </View>
            )}
            <View className="flex w-full flex-row justify-between gap-4">
              <Text className="text-lg">XP Points</Text>
              <Text className="text-lg" type={"title"}>
                {profileData?.xpTotal}
              </Text>
            </View>
            <View className="flex w-full flex-col gap-0">
              <Text className="text-sand-11 text-sm">
                Earn XP points every time you enter a log or track something
                new.
              </Text>
              <Text className="text-sand-11 text-sm">
                Points are awarded and multiplied by your daily streak (1 day =
                1% bonus).
              </Text>
              <Text className="text-sand-11 text-sm">
                Points can be redeemed for discounts on products and
                subscriptions.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
