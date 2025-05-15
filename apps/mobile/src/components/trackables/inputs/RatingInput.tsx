import React from "react";
import { View } from "react-native";

import { Rating } from "~/components/ui/rating";
import { Text } from "~/components/ui/text";

interface RatingInputProps {
  value: number;
  onValueChange: (value: number) => void;
  ratingMax?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  ratingIcon?: string;
  ratingEmoji?: string;
  ratingUnit?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Input component for rating trackables
 */
export function RatingInput({
  value,
  onValueChange,
  ratingMax = 5,
  ratingIcon,
  ratingEmoji,
  ratingUnit,
  size = "md",
}: RatingInputProps) {
  // Ensure ratingMax is a valid value (between 2 and 10)
  const safeRatingMax = Math.max(2, Math.min(10, ratingMax)) as
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10;

  // Determine a className based on size for spacing
  const className = size === "sm" ? "gap-1" : size === "lg" ? "gap-3" : "gap-2";

  return (
    <View className="flex-col items-center gap-1">
      <Rating
        value={value}
        onValueChange={onValueChange}
        ratingMax={safeRatingMax}
        ratingIcon={ratingIcon}
        ratingEmoji={ratingEmoji}
        className={className}
      />
      {ratingUnit && (
        <Text className="text-sand-11 text-xs">
          {value} {ratingUnit}
        </Text>
      )}
    </View>
  );
}

/**
 * Higher-level function to get a rating input component
 */
export function getRatingInputForLog(
  value: number,
  onValueChange: (value: number) => void,
  ratingMax?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
  ratingIcon?: string,
  ratingEmoji?: string,
  ratingUnit?: string,
): React.ReactNode {
  return (
    <RatingInput
      value={value}
      onValueChange={onValueChange}
      ratingMax={ratingMax}
      ratingIcon={ratingIcon}
      ratingEmoji={ratingEmoji}
      ratingUnit={ratingUnit}
      size="md"
    />
  );
}
