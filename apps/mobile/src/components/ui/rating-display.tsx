import React from "react";
import { View } from "react-native";

import { Text } from "~/components/ui/text";
import { cn } from "~/utils/ui";

interface RatingDisplayProps {
  value: number;
  ratingMax: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  ratingIcon?: string;
  ratingEmoji?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * A component to display rating values with stars, icons, or emoji
 */
export function RatingDisplay({
  value,
  ratingMax,
  ratingIcon,
  ratingEmoji,
  size = "md",
}: RatingDisplayProps) {
  // Determine sizing based on prop
  const sizeClasses = {
    sm: "gap-1",
    md: "gap-2",
    lg: "gap-3",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-3xl",
    lg: "text-5xl pt-4",
  };

  const iconSizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  // Create an array of rating icons based on the max value
  const ratingItems = Array.from({ length: ratingMax }, (_, index) => {
    const isFilled = index < value;

    // If emoji is specified, use emoji display
    if (ratingEmoji) {
      return (
        <Text
          key={index}
          className={cn(
            textSizeClasses[size],
            isFilled ? "opacity-100" : "opacity-30",
          )}
        >
          {ratingEmoji}
        </Text>
      );
    }

    // Default to star icon or use specified icon
    const iconType = ratingIcon ?? "star";
    return (
      <View
        key={index}
        className={cn(
          iconSizeClasses[size],
          "items-center justify-center",
          isFilled ? "opacity-100" : "opacity-30",
        )}
      >
        <Text>{iconType}</Text>
      </View>
    );
  });

  return (
    <View className={cn("flex-row", sizeClasses[size])}>{ratingItems}</View>
  );
}
