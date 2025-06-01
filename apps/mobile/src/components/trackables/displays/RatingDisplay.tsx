import React from "react";

import type { Log } from "~/types/trackers";
import { RatingDisplay as BaseRatingDisplay } from "~/components/ui/rating-display";

interface RatingDisplayWrapperProps {
  value: number;
  ratingMax?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  ratingIcon?: string;
  ratingEmoji?: string;
  size?: "sm" | "md" | "lg";
}

export function RatingDisplayWrapper({
  value,
  ratingMax = 5,
  ratingIcon,
  ratingEmoji,
  size = "md",
}: RatingDisplayWrapperProps) {
  // Ensure ratingMax is between 2 and 10
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

  return (
    <BaseRatingDisplay
      value={value}
      ratingMax={safeRatingMax}
      ratingIcon={ratingIcon}
      ratingEmoji={ratingEmoji}
      size={size}
    />
  );
}

export function getRatingValueFromLog(
  log: Log,
  ratingMax?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
  ratingIcon?: string,
  ratingEmoji?: string,
  size: "sm" | "md" | "lg" = "sm",
): React.ReactNode {
  if (log.numericValue === null) return null;
  return (
    <RatingDisplayWrapper
      value={log.numericValue}
      ratingMax={ratingMax}
      ratingIcon={ratingIcon}
      ratingEmoji={ratingEmoji}
      size={size}
    />
  );
}
