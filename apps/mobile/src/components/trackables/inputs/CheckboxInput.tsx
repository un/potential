import React from "react";
import { View } from "react-native";

import { Checkbox } from "~/components/ui/checkbox";
import { Text } from "~/components/ui/text";

interface CheckboxInputProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Input component for checkbox trackables
 */
export function CheckboxInput({
  checked,
  onCheckedChange,
  label = "Completed",
  size = "md",
}: CheckboxInputProps) {
  const textSize =
    size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base";

  return (
    <View className="flex-row items-center">
      <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
      <Text className={`ml-2 ${textSize}`}>{label}</Text>
    </View>
  );
}

/**
 * Higher-level function to get a checkbox input component
 */
export function getCheckboxInputForLog(
  checked: boolean,
  onCheckedChange: (checked: boolean) => void,
  label?: string,
): React.ReactNode {
  return (
    <CheckboxInput
      checked={checked}
      onCheckedChange={onCheckedChange}
      label={label}
    />
  );
}
