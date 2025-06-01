import React from "react";

import type { Log } from "~/types/trackers";
import { Text } from "~/components/ui/text";
import { cn } from "~/utils/ui";

interface TextDisplayProps {
  value: string;
  isLong?: boolean;
  size?: "sm" | "md" | "lg";
  shortened?: boolean;
}

export function TextDisplay({
  value,
  isLong = false,
  size = "md",
  shortened = false,
}: TextDisplayProps) {
  const textSize =
    size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base";

  if (isLong) {
    return (
      <Text
        className={cn(
          `w-full max-w-full text-wrap text-left ${textSize}`,
          shortened ? "line-clamp-2" : "",
        )}
      >
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
  shortened = false,
): React.ReactNode {
  if (!log.textValue) return null;
  return (
    <TextDisplay
      value={log.textValue}
      isLong={isLong}
      size={size}
      shortened={shortened}
    />
  );
}
