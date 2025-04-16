import React from "react";

import type { Log } from "~/types/trackables";
import { Text } from "~/components/ui/text";

interface TextDisplayProps {
  value: string;
  isLong?: boolean;
  size?: "sm" | "md" | "lg";
}

export function TextDisplay({
  value,
  isLong = false,
  size = "md",
}: TextDisplayProps) {
  const textSize =
    size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base";

  if (isLong) {
    return (
      <Text className={`w-full max-w-full text-wrap text-left ${textSize}`}>
        {value}
      </Text>
    );
  }

  // For short text
  return (
    <Text className={`w-full max-w-full text-wrap text-left ${textSize}`}>
      {value}
    </Text>
  );
}

export function getTextValueFromLog(
  log: Log,
  isLong = false,
  size: "sm" | "md" | "lg" = "sm",
): React.ReactNode {
  if (!log.textValue) return null;
  return <TextDisplay value={log.textValue} isLong={isLong} size={size} />;
}
