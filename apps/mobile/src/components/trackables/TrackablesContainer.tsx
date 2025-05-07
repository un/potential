import React, { useMemo } from "react";
import { View } from "react-native";
import { useQuery } from "@tanstack/react-query";

import type { ConstsTypes } from "@potential/consts";
import { CONSTS } from "@potential/consts";

import { Text } from "~/components/ui/text";
import { trpc } from "~/utils/api";
import { Card } from "../ui/card";
import { TrackableSection } from "./TrackableSection";

type TrackableParentType = ConstsTypes["TRACKABLE"]["TYPES"]["KEY"];

export function TrackablesContainer() {
  // Get all trackable parent types
  const trackableParentTypes = Object.keys(
    CONSTS.TRACKABLE.TYPES,
  ) as TrackableParentType[];

  // Create query results for each parent type
  const results = trackableParentTypes.map((type) => {
    const { data, isLoading, error } = useQuery(
      trpc.trackables.getTrackablesForParentType.queryOptions({
        trackableParentType: type,
      }),
    );

    return {
      type,
      typeName: CONSTS.TRACKABLE.TYPES[type],
      data,
      isLoading,
      error,
    };
  });

  // Organize data by parent type and then sub type
  const organizedData = useMemo(() => {
    const organized: Record<string, Record<string, any[]>> = {};

    results.forEach(({ type, typeName, data }) => {
      if (!data || data.length === 0) return;

      organized[type] = organized[type] || { _typeName: typeName };

      // Group by subType
      data.forEach((trackable) => {
        const subType = trackable.subType;
        const subTypeName = CONSTS.TRACKABLE.SUB_TYPES[subType] || subType;

        organized[type][subType] = organized[type][subType] || {
          _subTypeName: subTypeName,
          items: [],
        };

        organized[type][subType].items.push(trackable);
      });
    });

    return organized;
  }, [results]);

  const isLoading = results.some((r) => r.isLoading);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center font-serif">
        <Text>Loading trackables...</Text>
      </View>
    );
  }

  // Count total trackables to show empty state if needed
  const totalTrackables = Object.values(organizedData).reduce(
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

  if (totalTrackables === 0) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-center font-serif text-lg">
          No trackables found
        </Text>
        <Text className="text-center text-sm text-gray-500">
          Add some trackables to start tracking your progress
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 flex-col gap-6">
      {Object.entries(organizedData).map(([type, typeData]) => {
        const typeName = typeData._typeName;
        const subTypes = Object.entries(typeData).filter(
          ([key]) => key !== "_typeName",
        );

        if (subTypes.length === 0) return null;

        return (
          <View key={type} className="flex flex-col gap-2">
            <Text className="text-2xl" type={"title"}>
              {typeName}
            </Text>
            <Card>
              {subTypes.map(([subType, subTypeData]) => (
                <TrackableSection
                  key={subType}
                  title={subTypeData._subTypeName}
                  trackables={subTypeData.items}
                />
              ))}
            </Card>
          </View>
        );
      })}
    </View>
  );
}
