import React from "react";
import { View } from "react-native";

import type { TrackableCustomConfig } from "@1up/consts";

import { Text } from "~/components/ui/text";
import { TrackableCard } from "./TrackableCard";

interface Trackable {
  id: string;
  name: string;
  description: string | null;
  type: string;
  subType: string;
  configType: string;
  customConfig: TrackableCustomConfig;
}

interface TrackableSectionProps {
  title: string;
  trackables: Trackable[];
}

export function TrackableSection({ title, trackables }: TrackableSectionProps) {
  if (trackables.length === 0) {
    return null;
  }

  return (
    <View className="mb-6">
      <Text className="mb-2 text-xl font-bold">{title}</Text>
      {trackables.map((trackable) => (
        <TrackableCard key={trackable.id} trackable={trackable} />
      ))}
    </View>
  );
}
