import React from "react";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import type { TrackerCustomConfig } from "@potential/consts";

import type { TrackerType } from "~/types/trackers";
import { getValueFromLog } from "~/components/trackers/displays";
import { Text } from "~/components/ui/text";
import { trpc } from "~/utils/api";
import { timeAgoText } from "~/utils/date";
import { cn } from "~/utils/ui";
import { Loading } from "../loading";

interface TrackerCardProps {
  tracker: {
    id: string;
    name: string;
    configType: string;
    customConfig: TrackerCustomConfig;
  };
}

export function TrackerCard({ tracker }: TrackerCardProps) {
  const { data: logs, isLoading } = useQuery(
    trpc.log.getLogsByTrackerId.queryOptions({
      trackerId: tracker.id,
    }),
  );

  const handlePress = () => {
    router.push(`/${tracker.id}`);
  };

  // Get tracker type
  const getTrackerType = (): TrackerType => {
    const config = tracker.customConfig;
    return config.type as TrackerType;
  };

  // Render latest value based on tracker type
  const renderLatestValue = () => {
    if (!logs || logs.length === 0)
      return <Text className="text-sand-10 text-xs">No logs yet</Text>;

    const latestLog = logs[0];
    const trackerType = getTrackerType();

    return getValueFromLog({
      log: latestLog,
      type: trackerType,
      config: tracker.customConfig,
      tracker,
      ...{ short: trackerType === "longText" },
    });
  };

  // Determine if we should use column layout for the latest value
  const shouldUseColumnLayout = () => {
    const trackerType = getTrackerType();
    if (!logs || logs.length === 0) return false;
    return trackerType === "shortText" || trackerType === "longText";
  };

  const getLatestLogTime = () => {
    if (!logs || logs.length === 0) return "";
    const latestLog = logs[0];
    if (!latestLog) return "";
    const latestLogTime = latestLog.createdAt;
    return timeAgoText({ date: new Date(latestLogTime) });
  };

  return (
    <Pressable onPress={handlePress}>
      <View
        className={cn(
          "flex w-full flex-row justify-between gap-2 py-2",
          shouldUseColumnLayout() ? "flex-col" : "flex-row gap-0",
        )}
      >
        <View className={"flex flex-row items-center gap-2"}>
          <Text className="">{tracker.name}</Text>
          <Text className="text-sand-10 text-xs">{getLatestLogTime()}</Text>
        </View>

        {isLoading ? (
          <Loading size={"sm"} />
        ) : (
          <View className={cn("flex items-center", "flex-row gap-2")}>
            {renderLatestValue()}
          </View>
        )}
      </View>
    </Pressable>
  );
}
