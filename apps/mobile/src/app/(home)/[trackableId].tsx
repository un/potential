import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { trpc } from "~/utils/api";

export default function TrackableDetailsPage() {
  const params = useLocalSearchParams();
  const trackableId = params.trackableId as string;

  const { data: trackable, isLoading: isLoadingTrackable } = useQuery(
    trpc.trackables.getTrackableById.queryOptions({
      id: trackableId,
    }),
  );

  const { data: logs, isLoading: isLoadingLogs } = useQuery(
    trpc.log.getLogsByTrackableId.queryOptions({
      trackableId: trackableId,
    }),
  );

  // Helper to safely get measurement unit if available
  const getMeasurementUnit = () => {
    if (
      trackable?.customConfig &&
      "measureUnitDisplay" in trackable.customConfig
    ) {
      return trackable.customConfig.measureUnitDisplay;
    }
    return "";
  };

  if (isLoadingTrackable) {
    return (
      <SafeAreaView className="flex-1">
        <Stack.Screen options={{ title: "Loading..." }} />
        <View className="flex-1 items-center justify-center">
          <Text>Loading trackable...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!trackable) {
    return (
      <SafeAreaView className="flex-1">
        <Stack.Screen options={{ title: "Not Found" }} />
        <View className="flex-1 items-center justify-center">
          <Text>Trackable not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen options={{ title: trackable.name }} />
      <ScrollView className="flex-1 p-4">
        <Card className="mb-4">
          <View className="flex flex-row justify-between">
            <Text className="text-lg font-bold" type={"title"}>
              {trackable.name}
            </Text>
            <View className="flex flex-row items-center gap-0">
              <Text className="text-sand-11 text-xs">Latest: </Text>
              <Text type={"title"} className="text-lg">
                {logs?.[0]?.numericValue}
              </Text>
              <Text className="text-sand-11 text-xs">
                {getMeasurementUnit()}
              </Text>
            </View>
          </View>
          {trackable.description && (
            <Text className="text-sand-11 mt-2">{trackable.description}</Text>
          )}
        </Card>

        <Text type="title" className="mb-2">
          History
        </Text>

        {isLoadingLogs ? (
          <Text className="text-sand-11">Loading history...</Text>
        ) : logs && logs.length > 0 ? (
          <View className="flex flex-col gap-4">
            {logs.map((log) => (
              <Card key={log.id} className="border-sand-6 border">
                <View className="flex flex-row justify-between">
                  <View>
                    {/* Display log value based on type */}
                    {log.checked !== null && (
                      <Text className="font-medium">
                        Status: {log.checked ? "Completed" : "Not Completed"}
                      </Text>
                    )}

                    {log.numericValue !== null && (
                      <View className="flex flex-row items-end gap-0">
                        <Text className="font-medium">{log.numericValue}</Text>
                        <Text className="text-sand-11 text-xs">
                          {getMeasurementUnit()}
                        </Text>
                      </View>
                    )}

                    {log.textValue && (
                      <Text className="font-medium">{log.textValue}</Text>
                    )}
                  </View>

                  <Text className="text-sand-11">
                    {new Date(log.createdAt).toLocaleString()}
                  </Text>
                </View>

                {log.jsonValue?.imageIds &&
                  log.jsonValue.imageIds.length > 0 && (
                    <View className="mt-2">
                      <Text className="text-sm">Images available</Text>
                    </View>
                  )}

                {log.textValue &&
                  log.textValue !== log.numericValue?.toString() && (
                    <Text className="mt-2 text-sm">{log.textValue}</Text>
                  )}
              </Card>
            ))}
          </View>
        ) : (
          <Text className="text-gray-500">No logs available</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
