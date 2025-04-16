import React from "react";

import type { Log } from "~/types/trackables";
import { Text } from "~/components/ui/text";

interface CheckboxDisplayProps {
  checked: boolean;
  size?: "sm" | "md" | "lg";
}

export function CheckboxDisplay({
  checked,
  size = "md",
}: CheckboxDisplayProps) {
  const textSize =
    size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base";

  return (
    <Text className={textSize}>
      {checked ? "✓ Completed" : "✗ Not completed"}
    </Text>
  );
}

export function getCheckboxValueFromLog(
  log: Log,
  size: "sm" | "md" | "lg" = "sm",
): React.ReactNode {
  if (log.checked === null) return null;
  return <CheckboxDisplay checked={log.checked} size={size} />;
}
