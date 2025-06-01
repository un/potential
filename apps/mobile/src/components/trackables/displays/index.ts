import type React from "react";

import type { ConstsTypes } from "@potential/consts";

import type { Log, Tracker, TrackerType } from "~/types/trackers";
import { getCheckboxValueFromLog } from "./CheckboxDisplay";
import { getMeasureValueFromLog } from "./MeasureDisplay";
import { getRangeValueFromLog } from "./RangeDisplay";
import { getRatingValueFromLog } from "./RatingDisplay";
import { getTextValueFromLog } from "./TextDisplay";

export {
  getCheckboxValueFromLog,
  getMeasureValueFromLog,
  getRangeValueFromLog,
  getRatingValueFromLog,
  getTextValueFromLog,
};

/**
 * Get a UI element to display a log value based on tracker type
 */
export function getValueFromLog({
  log,
  type,
  config,
  size = "sm",
  tracker,
  short,
}: {
  log: unknown;
  type: TrackerType;
  config: Record<string, unknown>;
  size?: "sm" | "md" | "lg";
  tracker: Tracker;
  short?: boolean;
}): React.ReactNode {
  if (!log) return null;

  // Safe cast the log to our Log type
  const safeLog = log as Log;

  // Extract commonly used properties with safe defaults
  const measureUnit = config.measureUnitDisplay as string | undefined;
  const measureUnitType = config.measureUnitType as
    | ConstsTypes["TRACKER"]["CONFIG"]["UNITS"]["MEASURE"]["KEY"]
    | undefined;
  const measureUnitSource = config.measureUnitSource as string | undefined;
  const ratingMax = config.ratingMax as
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | undefined;
  const ratingIcon = config.ratingIcon as string | undefined;
  const ratingEmoji = config.ratingEmoji as string | undefined;
  const rangeMin = (config.rangeMin as number | undefined) ?? 0;
  const rangeMax = (config.rangeMax as number | undefined) ?? 100;

  // Select component based on tracker type
  switch (type) {
    case "measure":
      return getMeasureValueFromLog(
        safeLog,
        measureUnit,
        measureUnitType,
        measureUnitSource,
        size,
      );

    case "checkbox":
      return getCheckboxValueFromLog(safeLog, tracker, size);

    case "rating":
      return getRatingValueFromLog(
        safeLog,
        ratingMax,
        ratingIcon,
        ratingEmoji,
        size,
      );

    case "range":
      return getRangeValueFromLog(
        safeLog,
        rangeMin,
        rangeMax,
        measureUnit,
        size,
      );

    case "shortText":
      return getTextValueFromLog(safeLog, false, size);

    case "longText":
      return getTextValueFromLog(safeLog, true, size, short);

    default:
      return null;
  }
}
