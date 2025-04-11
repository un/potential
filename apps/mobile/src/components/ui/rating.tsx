import React, { useCallback } from "react";
import { Pressable, View } from "react-native";
import { Star } from "phosphor-react-native";

import { cn } from "~/utils/ui";
import { Text } from "./text";

type RatingMaxType = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

interface RatingProps {
  ratingMax: RatingMaxType;
  ratingUnit?: string;
  ratingIcon?: string;
  ratingEmoji?: string;
  value: number;
  onValueChange: (value: number) => void;
  className?: string;
}

export function Rating({
  ratingMax,
  ratingUnit,
  ratingIcon,
  ratingEmoji,
  value,
  onValueChange,
  className,
}: RatingProps) {
  const handlePress = useCallback(
    (index: number) => {
      // If pressing the currently selected value (except 0), reset to 0
      if (value === index && index === 1) {
        onValueChange(0);
      } else {
        onValueChange(index);
      }
    },
    [value, onValueChange],
  );

  return (
    <View className={cn("w-full items-center", className)}>
      <View className="flex-row items-center justify-center gap-3">
        {Array.from({ length: ratingMax }, (_, i) => i + 1).map((index) => {
          const isActive = value >= index;

          if (ratingEmoji) {
            // Emoji mode
            return (
              <Pressable
                key={`rating-${index}`}
                onPress={() => handlePress(index)}
                className="items-center justify-center"
                hitSlop={2}
              >
                <Text
                  className={cn(
                    "pt-4 text-5xl",
                    isActive ? "opacity-100" : "opacity-40",
                  )}
                >
                  {ratingEmoji}
                </Text>
              </Pressable>
            );
          }

          // Icon mode (uses Star by default)
          return (
            <Pressable
              key={`rating-${index}`}
              onPress={() => handlePress(index)}
              className="mb-1 items-center justify-center"
              hitSlop={2}
            >
              <Star
                size={36}
                color="#FFC53D"
                weight={isActive ? "fill" : "regular"}
              />
            </Pressable>
          );
        })}
      </View>

      {ratingUnit && <Text className="text-sand-11 text-xs">{ratingUnit}</Text>}
    </View>
  );
}
