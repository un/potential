import React from "react";
import { View } from "react-native";

import type { TrackableCustomConfig } from "@potential/consts";

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

export function TrackableSection({ trackables }: TrackableSectionProps) {
  if (trackables.length === 0) {
    return null;
  }

  return (
    <View className="flex flex-col gap-4">
      {trackables.map((trackable) => (
        <TrackableCard key={trackable.id} trackable={trackable} />
      ))}
    </View>
  );
}
