import React from "react";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import type { TrackableCustomConfig } from "@potential/consts";

import type { TrackableType } from "~/types/trackables";
import { getValueFromLog } from "~/components/trackables/displays";
import { Text } from "~/components/ui/text";
import { trpc } from "~/utils/api";
import { timeAgoText } from "~/utils/date";
import { cn } from "~/utils/ui";
import { Loading } from "../loading";

interface TrackableCardProps {
  trackable: {
    id: string;
    name: string;
    configType: string;
    customConfig: TrackableCustomConfig;
  };
}

export function TrackableCard({ trackable }: TrackableCardProps) {
  const { data: logs, isLoading } = useQuery(
    trpc.log.getLogsByTrackableId.queryOptions({
      trackableId: trackable.id,
    }),
  );

  const handlePress = () => {
    router.push(`/${trackable.id}`);
  };

  // Get trackable type
  const getTrackableType = (): TrackableType => {
    const config = trackable.customConfig;
    return config.type as TrackableType;
  };

  // Render latest value based on trackable type
  const renderLatestValue = () => {
    if (!logs || logs.length === 0)
      return <Text className="text-sand-10 text-xs">No logs yet</Text>;

    const latestLog = logs[0];
    const trackableType = getTrackableType();

    return getValueFromLog({
      log: latestLog,
      type: trackableType,
      config: trackable.customConfig,
      trackable,
      ...{ short: trackableType === "longText" },
    });
  };

  // Determine if we should use column layout for the latest value
  const shouldUseColumnLayout = () => {
    const trackableType = getTrackableType();
    if (!logs || logs.length === 0) return false;
    return trackableType === "shortText" || trackableType === "longText";
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
          <Text className="">{trackable.name}</Text>
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
