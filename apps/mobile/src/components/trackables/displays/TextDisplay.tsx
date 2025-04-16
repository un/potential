import React from "react";

import type { Log } from "~/types/trackables";
import { Text } from "~/components/ui/text";

interface TextDisplayProps {
  value: string;
  isLong?: boolean;
  size?: "sm" | "md" | "lg";
  maxWidth?: string;
}

export function TextDisplay({
  value,
  isLong = false,
  size = "md",
  maxWidth = "150px",
}: TextDisplayProps) {
  const textSize =
    size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base";

  if (isLong) {
    // For long text, show truncated
    return (
      <Text className={`line-clamp-2 max-w-[${maxWidth}] ${textSize}`}>
        {value}
      </Text>
    );
  }

  // For short text
  return (
    <Text className={`line-clamp-1 max-w-[${maxWidth}] truncate ${textSize}`}>
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
