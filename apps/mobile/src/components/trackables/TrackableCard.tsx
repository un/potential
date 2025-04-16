import React from "react";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import type { TrackableCustomConfig } from "@1up/consts";

import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { trpc } from "~/utils/api";

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

  return (
    <Pressable onPress={handlePress}>
      <Card>
        <View className="flex flex-row justify-between">
          <Text className="text-lg font-bold" type={"title"}>
            {trackable.name}
          </Text>
          <View className="flex flex-row items-center gap-0">
            <Text className="text-sand-11 text-xs">Latest: </Text>

            <Text type={"title"} className="text-lg">
              {logs?.[0]?.numericValue}
            </Text>
            <Text className="text-sand-11 text-xs">{getMeasurementUnit()}</Text>
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
                {/* Display log value based on type */}
                {log.checked !== null && (
                  <Text>
                    Status: {log.checked ? "Completed" : "Not Completed"}
                  </Text>
                )}

                {log.numericValue !== null && (
                  <View className="flex flex-row items-end gap-0">
                    <Text>{log.numericValue}</Text>
                    <Text className="text-sand-11 text-xs">
                      {getMeasurementUnit()}
                    </Text>
                  </View>
                )}

                {log.textValue && (
                  <Text className="text-sm">{log.textValue}</Text>
                )}
                {log.jsonValue?.imageIds &&
                  log.jsonValue.imageIds.length > 0 && <Text>AAA</Text>}
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
