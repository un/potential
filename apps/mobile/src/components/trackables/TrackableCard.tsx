import React from "react";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import type { TrackableCustomConfig } from "@potential/consts";

import type { TrackableType } from "~/types/trackables";
import { getValueFromLog } from "~/components/trackables/displays";
import { Text } from "~/components/ui/text";
import { trpc } from "~/utils/api";
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
    if (!logs || logs.length === 0) return null;

    const latestLog = logs[0];
    const trackableType = getTrackableType();

    return getValueFromLog({
      log: latestLog,
      type: trackableType,
      config: trackable.customConfig,
      trackable,
    });
  };

  // Determine if we should use column layout for the latest value
  const shouldUseColumnLayout = () => {
    const trackableType = getTrackableType();
    return trackableType === "shortText" || trackableType === "longText";
  };

  return (
    <Pressable onPress={handlePress}>
      <View
        className={cn(
          "flex flex-row justify-between gap-2 py-2",
          shouldUseColumnLayout() ? "flex-col" : "flex-row gap-0",
        )}
      >
        <Text className="">{trackable.name}</Text>
        {isLoading ? (
          <Loading size={"sm"} />
        ) : (
          <View className={cn("flex items-center", "flex-row gap-0")}>
            {renderLatestValue()}
          </View>
        )}
      </View>
    </Pressable>
  );
}
