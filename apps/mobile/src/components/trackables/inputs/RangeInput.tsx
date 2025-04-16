import React from "react";
import { View } from "react-native";

import { Slider } from "~/components/ui/slider";
import { Text } from "~/components/ui/text";

interface RangeInputProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  unit?: string;
  minLabel?: string;
  maxLabel?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Input component for range trackables
 */
export function RangeInput({
  value,
  onValueChange,
  min = 0,
  max = 100,
  unit = "",
  minLabel,
  maxLabel,
  // We're not using size directly, but keeping it in the interface for consistency
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  size = "md",
}: RangeInputProps) {
  return (
    <View className="flex-col gap-2">
      <View className="flex-row items-center justify-between">
        {minLabel && <Text className="text-sand-11 text-xs">{minLabel}</Text>}
        <Text className="text-sand-11 text-xs">
          {value}
          {unit ? ` ${unit}` : ""}
        </Text>
        {maxLabel && <Text className="text-sand-11 text-xs">{maxLabel}</Text>}
      </View>

      <Slider
        value={value}
        onValueChange={onValueChange}
        rangeMin={min}
        rangeMax={max}
        rangeUnit={unit}
        rangeMinLabel={minLabel}
        rangeMaxLabel={maxLabel}
      />
    </View>
  );
}

/**
 * Higher-level function to get a range input component
 */
export function getRangeInputForLog(
  value: number,
  onValueChange: (value: number) => void,
  min?: number,
  max?: number,
  unit?: string,
  minLabel?: string,
  maxLabel?: string,
): React.ReactNode {
  return (
    <RangeInput
      value={value}
      onValueChange={onValueChange}
      min={min}
      max={max}
      unit={unit}
      minLabel={minLabel}
      maxLabel={maxLabel}
    />
  );
}
