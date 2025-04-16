import React from "react";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import type { TrackableCustomConfig } from "@1up/consts";

import { Card } from "~/components/ui/card";
import { RatingDisplay } from "~/components/ui/rating-display";
import { Text } from "~/components/ui/text";
import { trpc } from "~/utils/api";
import { cn } from "~/utils/ui";

interface Log {
  id: string;
  createdAt: string;
  numericValue: number | null;
  textValue: string | null;
  checked: boolean | null;
  jsonValue?: {
    imageIds?: string[];
  } | null;
}

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

  // Helper to safely get measurement unit if available
  const getMeasurementUnit = () => {
    if ("measureUnitDisplay" in trackable.customConfig) {
      return trackable.customConfig.measureUnitDisplay;
    }
    return "";
  };

  // Render latest value based on trackable type
  const renderLatestValue = () => {
    if (!logs || logs.length === 0) return null;

    const latestLog = logs[0];
    const config = trackable.customConfig;

    if (config.type === "rating" && latestLog.numericValue !== null) {
      return (
        <RatingDisplay
          value={latestLog.numericValue}
          ratingMax={
            Math.max(2, Math.min(10, config.ratingMax || 5)) as
              | 2
              | 3
              | 4
              | 5
              | 6
              | 7
              | 8
              | 9
              | 10
          }
          ratingIcon={"ratingIcon" in config ? config.ratingIcon : undefined}
          ratingEmoji={"ratingEmoji" in config ? config.ratingEmoji : undefined}
          size="sm"
        />
      );
    } else if (config.type === "checkbox" && latestLog.checked !== null) {
      return (
        <Text>{latestLog.checked ? "✓ Completed" : "✗ Not completed"}</Text>
      );
    } else if (latestLog.numericValue !== null) {
      return (
        <View className="flex flex-row items-center gap-0">
          <Text type={"title"} className="text-lg">
            {latestLog.numericValue}
          </Text>
          <Text className="text-sand-11 text-xs">{getMeasurementUnit()}</Text>
        </View>
      );
    } else if (latestLog.textValue) {
      // For text-based trackables
      return (
        <Text className="line-clamp-1 max-w-[150px] truncate text-sm">
          {latestLog.textValue}
        </Text>
      );
    }

    return null;
  };

  // Render log entry in history based on trackable type
  const renderLogEntry = (log) => {
    const config = trackable.customConfig;

    if (config.type === "rating" && log.numericValue !== null) {
      return (
        <RatingDisplay
          value={log.numericValue}
          ratingMax={
            Math.max(2, Math.min(10, config.ratingMax || 5)) as
              | 2
              | 3
              | 4
              | 5
              | 6
              | 7
              | 8
              | 9
              | 10
          }
          ratingIcon={"ratingIcon" in config ? config.ratingIcon : undefined}
          ratingEmoji={"ratingEmoji" in config ? config.ratingEmoji : undefined}
          size="sm"
        />
      );
    } else if (config.type === "checkbox" && log.checked !== null) {
      return <Text>{log.checked ? "✓ Completed" : "✗ Not completed"}</Text>;
    } else if (log.numericValue !== null) {
      return (
        <View className="flex flex-row items-end gap-0">
          <Text>{log.numericValue}</Text>
          <Text className="text-sand-11 text-xs">{getMeasurementUnit()}</Text>
        </View>
      );
    } else if (log.textValue) {
      return <Text className="text-sm">{log.textValue}</Text>;
    }

    return null;
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
              trackable.customConfig.type === "rating"
                ? "flex-col"
                : "flex-row gap-0",
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
                {renderLogEntry(log)}
                <Text className="text-sm">
                  {new Date(log.createdAt).toLocaleDateString()}
                </Text>
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
