import React from "react";
import { View } from "react-native";

import type { Log } from "~/types/trackables";
import { Text } from "~/components/ui/text";

interface RangeDisplayProps {
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  size?: "sm" | "md" | "lg";
}

export function RangeDisplay({
  value,
  min = 0,
  max = 100,
  unit = "",
  size = "md",
}: RangeDisplayProps) {
  const titleSize =
    size === "sm" ? "text-base" : size === "lg" ? "text-xl" : "text-lg";

  // Calculate position as a percentage
  const position = Math.min(
    100,
    Math.max(0, ((value - min) / (max - min)) * 100),
  );

  return (
    <View className="flex flex-row-reverse items-center gap-4">
      <View className="flex flex-row items-end justify-end gap-0">
        <Text type={"title"} className={titleSize}>
          {value}
          <Text type={"title"} className={titleSize + " text-tomato-10"}>
            /{max}
          </Text>
        </Text>
        {unit && (
          <Text
            className={`text-sand-11 ${size === "lg" ? "text-sm" : "text-xs"}`}
          >
            {unit}
          </Text>
        )}
      </View>

      {/* Range bar visualization */}
      <View className="bg-tomato-4 h-1 w-20 overflow-hidden rounded-full">
        <View
          className="bg-tomato-10 h-1 rounded-full"
          style={{ width: `${position}%` }}
        />
      </View>
    </View>
  );
}

export function getRangeValueFromLog(
  log: Log,
  min = 0,
  max = 100,
  unit?: string,
  size: "sm" | "md" | "lg" = "sm",
): React.ReactNode {
  if (log.numericValue === null) return null;
  return (
    <RangeDisplay
      value={log.numericValue}
      min={min}
      max={max}
      unit={unit}
      size={size}
    />
  );
}
