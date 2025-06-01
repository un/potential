import React, { useMemo } from "react";
import { View } from "react-native";
import { useQueries } from "@tanstack/react-query";
import {
  ArrowBendLeftUp,
  ArrowBendRightUp,
  ArrowDown,
} from "phosphor-react-native";

import type { ConstsTypes } from "@potential/consts";
import { CONSTS } from "@potential/consts";

import { Text } from "~/components/ui/text";
import { trpc } from "~/utils/api";
import { iconColor } from "~/utils/ui";
import { Card } from "../ui/card";
import { TrackerSection } from "./TrackerSection";

type TrackerParentType = ConstsTypes["TRACKER"]["TYPES"]["KEY"];

export function TrackersContainer() {
  // Get all tracker parent types
  const trackerParentTypes = Object.keys(
    CONSTS.TRACKER.TYPES,
  ) as TrackerParentType[];

  // Use useQueries to fetch data for all parent types
  const queryHookResults = useQueries({
    queries: trackerParentTypes.map((type) => {
      return trpc.tracker.getTrackersForParentType.queryOptions({
        trackerParentType: type,
      });
    }),
  });

  // Adapt the queryHookResults to the structure expected by the existing organizedData logic
  const results = useMemo(() => {
    return queryHookResults.map((queryResult, index) => {
      const type = trackerParentTypes[index];
      // Ensure 'type' is valid before using it as an index for CONSTS.TRACKER.TYPES
      // Providing a fallback if type were somehow undefined, though it shouldn't be here.
      const typeName = type ? CONSTS.TRACKER.TYPES[type] : "Unknown Type";

      return {
        type, // The parent type string, e.g., "consumption"
        typeName, // The display name for the parent type
        data: queryResult.data, // Data from the query
        isLoading: queryResult.isLoading, // Loading state
        error: queryResult.error, // Error object
      };
    });
  }, [queryHookResults, trackerParentTypes]);

  // Organize data by parent type and then sub type
  const organizedData = useMemo(() => {
    const organized: Record<string, Record<string, any[]>> = {};

    results.forEach(({ type, typeName, data }) => {
      if (!data || data.length === 0) return;

      organized[type] = organized[type] || { _typeName: typeName };

      // Group by subType
      data.forEach((tracker) => {
        const subType = tracker.subType;
        const subTypeName = CONSTS.TRACKER.SUB_TYPES[subType] || subType;

        organized[type][subType] = organized[type][subType] || {
          _subTypeName: subTypeName,
          items: [],
        };

        organized[type][subType].items.push(tracker);
      });
    });

    return organized;
  }, [results]);

  const isLoading = results.some((r) => r.isLoading);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading trackers...</Text>
      </View>
    );
  }

  // Count total trackers to show empty state if needed
  const totalTrackers = Object.values(organizedData).reduce(
    (acc, typeGroup) => {
      const itemCount = Object.entries(typeGroup)
        .filter(([key]) => key !== "_typeName")
        .reduce(
          (sum, [_, subTypeData]) => sum + (subTypeData.items?.length || 0),
          0,
        );
      return acc + itemCount;
    },
    0,
  );

  if (totalTrackers === 0) {
    return (
      <View className="flex flex-1 flex-col items-center justify-between gap-2">
        <View className="flex w-full flex-row items-center justify-between gap-2">
          <View className="flex flex-row items-end gap-2">
            <ArrowBendLeftUp size={24} color={iconColor()} />
            <Text className="text-sand-11 -mb-1 text-xs">
              Access your settings
            </Text>
          </View>
          <View className="flex flex-row items-end gap-2">
            <Text className="text-sand-11 -mb-1 text-xs">Check your stats</Text>

            <ArrowBendRightUp size={24} color={iconColor()} />
          </View>
        </View>
        <View className="flex flex-col items-center gap-2">
          <Text className="text-center font-serif text-2xl italic">
            Welcome to Potential Health
          </Text>
          <Text className="text-center text-sm">
            Let&apos;s get started by tracking something new.
          </Text>
        </View>
        <View className="flex flex-row items-center justify-center gap-8">
          <View className="flex flex-col items-center gap-2">
            <Text className="text-sand-11 -mb-1 text-xs">
              Start tracking something new
            </Text>
            <ArrowDown size={24} color={iconColor()} />
          </View>
          <View className="flex flex-col items-center gap-2 px-4 pl-8">
            <Text className="text-sand-11 -mb-1 text-xs">
              Run your first experiment
            </Text>
            <ArrowDown size={24} color={iconColor()} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="w-full flex-1 flex-col gap-6">
      {Object.entries(organizedData).map(([type, typeData]) => {
        const typeName = typeData._typeName;
        const subTypes = Object.entries(typeData).filter(
          ([key]) => key !== "_typeName",
        );

        if (subTypes.length === 0) return null;

        return (
          <View key={type} className="flex w-full flex-col gap-2">
            <Text className="text-2xl" type={"title"}>
              {typeName}
            </Text>
            <Card>
              {subTypes.map(([subType, subTypeData]) => (
                <TrackerSection
                  key={subType}
                  title={subTypeData._subTypeName}
                  trackers={subTypeData.items}
                />
              ))}
            </Card>
          </View>
        );
      })}
    </View>
  );
}
