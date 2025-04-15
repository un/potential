import React from "react";
import { View } from "react-native";
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

  return (
    <Card className="mb-4 p-4">
      <Text className="text-lg font-bold">{trackable.name}</Text>

      {isLoading ? (
        <Text className="text-sm text-gray-500">Loading logs...</Text>
      ) : logs && logs.length > 0 ? (
        <View className="mt-2">
          <Text className="mb-1 text-sm font-semibold">Recent Logs:</Text>
          {logs.map((log) => (
            <View key={log.id} className="mb-2 border-b border-gray-200 pb-2">
              <Text className="text-sm text-gray-700">
                {new Date(log.createdAt).toLocaleDateString()}
              </Text>

              {/* Display log value based on type */}
              {log.checked !== null && (
                <Text>
                  Status: {log.checked ? "Completed" : "Not Completed"}
                </Text>
              )}

              {log.numericValue !== null && (
                <Text>Value: {log.numericValue}</Text>
              )}

              {log.textValue && (
                <Text className="text-sm">{log.textValue}</Text>
              )}

              {log.jsonValue &&
                log.jsonValue.imageIds &&
                log.jsonValue.imageIds.length > 0 && <Text>AAA</Text>}
            </View>
          ))}
        </View>
      ) : (
        <Text className="text-sm text-gray-500">No logs available</Text>
      )}
    </Card>
  );
}
