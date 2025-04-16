import type React from "react";

import type { ConstsTypes } from "@1up/consts";

import type { TrackableType } from "~/types/trackables";
import { getCheckboxInputForLog } from "./CheckboxInput";
import { getMeasureInputForLog } from "./MeasureInput";
import { getRangeInputForLog } from "./RangeInput";
import { getRatingInputForLog } from "./RatingInput";
import { getTextInputForLog } from "./TextInput";

export {
  getCheckboxInputForLog,
  getMeasureInputForLog,
  getRangeInputForLog,
  getRatingInputForLog,
  getTextInputForLog,
};

type UnitType = ConstsTypes["TRACKABLE"]["CONFIG"]["UNITS"]["MEASURE"]["KEY"];

/**
 * Get an input component for a specific trackable type
 */
export function getInputForTrackableType(
  type: TrackableType,
  value: unknown,
  onChange: (value: unknown) => void,
  config: Record<string, unknown>,
): React.ReactNode {
  switch (type) {
    case "measure": {
      const numericValue = typeof value === "number" ? value : 0;
      const onChangeNumber = (newValue: number) => onChange(newValue);

      // Extract increments/decrements from config if available
      let increments: number[] | undefined;
      let decrements: number[] | undefined;

      // Check if we have custom increments/decrements in the config
      if (config.measureIncrements && Array.isArray(config.measureIncrements)) {
        increments = config.measureIncrements as number[];
      } else {
        // Default increments
        increments = [0.1, 1, 5];
      }

      if (config.measureDecrements && Array.isArray(config.measureDecrements)) {
        decrements = config.measureDecrements as number[];
      } else {
        // Default decrements
        decrements = [0.1, 1, 5];
      }

      return getMeasureInputForLog(
        numericValue,
        onChangeNumber,
        config.measureUnitDisplay as string | undefined,
        config.measureUnitType as UnitType | undefined,
        config.measureUnitSource as string | undefined,
        config.measureMin as number | undefined,
        config.measureMax as number | undefined,
        increments,
        decrements,
      );
    }

    case "checkbox": {
      const boolValue = Boolean(value);
      const onChangeBool = (newValue: boolean) => onChange(newValue);

      return getCheckboxInputForLog(
        boolValue,
        onChangeBool,
        config.checkboxName as string | undefined,
      );
    }

    case "rating": {
      const numericValue = typeof value === "number" ? value : 0;
      const onChangeNumber = (newValue: number) => onChange(newValue);

      return getRatingInputForLog(
        numericValue,
        onChangeNumber,
        config.ratingMax as 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | undefined,
        config.ratingIcon as string | undefined,
        config.ratingEmoji as string | undefined,
        config.ratingUnit as string | undefined,
      );
    }

    case "range": {
      const numericValue = typeof value === "number" ? value : 0;
      const onChangeNumber = (newValue: number) => onChange(newValue);

      return getRangeInputForLog(
        numericValue,
        onChangeNumber,
        config.rangeMin as number | undefined,
        config.rangeMax as number | undefined,
        config.rangeUnit as string | undefined,
        config.rangeMinLabel as string | undefined,
        config.rangeMaxLabel as string | undefined,
      );
    }

    case "shortText": {
      const textValue = typeof value === "string" ? value : "";
      const onChangeText = (newValue: string) => onChange(newValue);

      return getTextInputForLog(
        textValue,
        onChangeText,
        false,
        "Enter text...",
      );
    }

    case "longText": {
      const textValue = typeof value === "string" ? value : "";
      const onChangeText = (newValue: string) => onChange(newValue);

      return getTextInputForLog(
        textValue,
        onChangeText,
        true,
        "Enter long text...",
      );
    }

    default:
      return null;
  }
}
