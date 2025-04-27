import React from "react";
import { View } from "react-native";
import { Star } from "phosphor-react-native";

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
    sm: "h-3 w-3",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const iconSize = () => {
    if (size === "lg") {
      return 32;
    }
    if (size === "md") {
      return 24;
    }

    if (ratingMax < 6) {
      return 20;
    }

    return 16;
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
          "flex flex-row items-center justify-center gap-2",
          isFilled ? "opacity-100" : "opacity-30",
        )}
      >
        <Star
          size={iconSize()}
          color="#FFC53D"
          weight={isFilled ? "fill" : "regular"}
        />
      </View>
    );
  });

  return (
    <View className={cn("flex flex-row gap-8", sizeClasses[size])}>
      {ratingItems}
    </View>
  );
}
