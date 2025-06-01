import React from "react";
import { View } from "react-native";

import type { TrackerCustomConfig } from "@potential/consts";

import { TrackerCard } from "./TrackerCard";

interface Tracker {
  id: string;
  name: string;
  description: string | null;
  type: string;
  subType: string;
  configType: string;
  customConfig: TrackerCustomConfig;
}

interface TrackerSectionProps {
  title: string;
  trackers: Tracker[];
}

export function TrackerSection({ trackers }: TrackerSectionProps) {
  if (trackers.length === 0) {
    return null;
  }

  return (
    <View className="flex w-full flex-col gap-0">
      {trackers.map((tracker) => (
        <TrackerCard key={tracker.id} tracker={tracker} />
      ))}
    </View>
  );
}
