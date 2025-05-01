import React from "react";
import { View } from "react-native";

import type { Log, Trackable } from "~/types/trackables";
import { Checkbox } from "~/components/ui/checkbox";
import { Text } from "~/components/ui/text";

interface CheckboxDisplayProps {
  checked: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
  color?: "accent" | "default";
}

export function CheckboxDisplay({
  checked,
  label = "Completed",
  size = "md",
}: CheckboxDisplayProps) {
  const textSize =
    size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base";

  const checkboxSize = size === "sm" ? "sm" : size === "lg" ? "lg" : "default";

  return (
    <View className="flex-row items-center gap-2">
      <Text className={`${textSize}`}>{label}</Text>
      <Checkbox checked={checked} disabled size={checkboxSize} />
    </View>
  );
}

export function getCheckboxValueFromLog(
  log: Log,
  trackable: Trackable,
  size: "sm" | "md" | "lg" = "sm",
): React.ReactNode {
  if (log.checked === null) return null;

  let label = "Completed";
  if (trackable.customConfig.type === "checkbox") {
    label = trackable.customConfig.checkboxName || "Completed";
  }

  return (
    <CheckboxDisplay
      checked={log.checked}
      label={label}
      size={size}
      color="accent"
    />
  );
}
