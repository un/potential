import React from "react";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import type { TrackableCustomConfig } from "@1up/consts";

import type { TrackableType } from "~/types/trackables";
import { getValueFromLog } from "~/components/trackables/displays";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { trpc } from "~/utils/api";
import { cn } from "~/utils/ui";

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

    return getValueFromLog(latestLog, trackableType, trackable.customConfig);
  };

  // Render log entry in history based on trackable type
  const renderLogEntry = (log: unknown) => {
    const trackableType = getTrackableType();
    return getValueFromLog(log, trackableType, trackable.customConfig);
  };

  // Determine if we should use column layout for the latest value
  const shouldUseColumnLayout = () => {
    const trackableType = getTrackableType();
    return trackableType === "rating" || trackableType === "range";
  };

  return (
    <Pressable onPress={handlePress}>
      <Card>
        <View className="flex flex-row justify-between">
          <Text className="text-lg font-bold" type={"title"}>
            {trackable.name}
          </Text>
          <View
            className={cn(
              "flex items-center",
              shouldUseColumnLayout() ? "flex-col" : "flex-row gap-0",
            )}
          >
            <Text className="text-sand-11 text-xs">Latest: </Text>
            {renderLatestValue()}
          </View>
        </View>

        {isLoading ? (
          <Text className="text-sand-11 text-sm">Loading logs...</Text>
        ) : logs && logs.length > 0 ? (
          <View className="flex flex-col gap-2">
            {logs.slice(1, 3).map((log) => (
              <View
                key={log.id}
                className="border-sand-6 flex flex-row justify-between gap-2 border-b pb-2"
              >
                <Text className="text-sm">
                  {new Date(log.createdAt).toLocaleDateString()}
                </Text>
                {renderLogEntry(log)}
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-sm text-gray-500">No logs available</Text>
        )}
      </Card>
    </Pressable>
  );
}
