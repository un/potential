import React from "react";
import { View } from "react-native";
import { Picker as RNPicker } from "@react-native-picker/picker";
import { useColorScheme } from "nativewind";

import { cn } from "~/utils/ui";

export interface PickerOption {
  value: string;
  label: string;
}

export interface PickerProps {
  items: PickerOption[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function Picker({
  items,
  value,
  onValueChange,
  className,
}: PickerProps) {
  const { colorScheme } = useColorScheme();
  return (
    <View className={cn("w-full rounded-lg bg-card", className)}>
      <RNPicker
        selectedValue={value}
        onValueChange={onValueChange}
        itemStyle={{
          fontFamily: "MartianMono-Regular",
          fontSize: 14,
          color: colorScheme === "dark" ? "#f9f9f8" : "#191918",
        }}
      >
        {items.map((option) => (
          <RNPicker.Item
            key={option.value}
            label={option.label}
            value={option.value}
          />
        ))}
      </RNPicker>
    </View>
  );
}
