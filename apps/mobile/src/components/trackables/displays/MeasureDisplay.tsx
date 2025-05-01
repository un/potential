import React from "react";
import { View } from "react-native";

import type { ConstsTypes } from "@potential/consts";
import { convert } from "@potential/utils/convert";

import type { Log } from "~/types/trackables";
import { Text } from "~/components/ui/text";
import { cn } from "~/utils/ui";

// Define unit types locally to avoid import issues
type UnitType = ConstsTypes["TRACKABLE"]["CONFIG"]["UNITS"]["MEASURE"]["KEY"];

interface MeasureDisplayProps {
  value: number;
  unit?: string;
  size?: "sm" | "md" | "lg";
}

interface MeasureConversionProps {
  value: number;
  measureUnitType: UnitType;
  measureUnitSource: string;
  measureUnitDisplay: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Convert a value from source unit to display unit based on unit type
 */
function convertValue(
  value: number,
  unitType: UnitType,
  sourceUnit: string,
  displayUnit: string,
): number {
  // Only convert if the units are different
  if (sourceUnit === displayUnit) return value;

  // Only convert compatible unit types
  if (unitType === "volume" || unitType === "mass" || unitType === "length") {
    try {
      return convert(value).from(sourceUnit).to(displayUnit);
    } catch (err) {
      // Safe error handling
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Unit conversion error:", errorMessage);
    }
  }

  // Return original value if conversion failed or not supported
  return value;
}

/**
 * Display component for showing a measurement with units
 */
export function MeasureDisplay({
  value,
  unit = "",
  size = "md",
}: MeasureDisplayProps) {
  const textSize =
    size === "sm" ? "text-sm" : size === "lg" ? "text-5lg" : "text-2xl";
  const titleSize =
    size === "sm" ? "text-base" : size === "lg" ? "text-5xl" : "text-2xl";

  // Format the value to avoid too many decimal places
  const formattedValue = Number.isInteger(value)
    ? value
    : parseFloat(value.toFixed(2));

  return (
    <View className="flex flex-row items-end gap-0">
      <Text type={"title"} className={cn(titleSize)}>
        {formattedValue}
      </Text>
      {unit && <Text className={cn("text-tomato-10", textSize)}>{unit}</Text>}
    </View>
  );
}

/**
 * Display a measurement with unit conversion
 */
export function MeasureConversion({
  value,
  measureUnitType,
  measureUnitSource,
  measureUnitDisplay,
  size = "md",
}: MeasureConversionProps) {
  const convertedValue = convertValue(
    value,
    measureUnitType,
    measureUnitSource,
    measureUnitDisplay,
  );

  return (
    <MeasureDisplay
      value={convertedValue}
      unit={measureUnitDisplay}
      size={size}
    />
  );
}

/**
 * Higher-level function to get a measure display component with appropriate conversion
 */
export function getMeasureValueFromLog(
  log: Log,
  measureUnitDisplay?: string,
  measureUnitType?: UnitType,
  measureUnitSource?: string,
  size: "sm" | "md" | "lg" = "sm",
): React.ReactNode {
  if (log.numericValue === null) return null;

  // If all conversion parameters are provided, use MeasureConversion
  if (measureUnitType && measureUnitSource && measureUnitDisplay) {
    return (
      <MeasureConversion
        value={log.numericValue}
        measureUnitType={measureUnitType}
        measureUnitSource={measureUnitSource}
        measureUnitDisplay={measureUnitDisplay}
        size={size}
      />
    );
  }

  // Otherwise fall back to regular MeasureDisplay
  return (
    <MeasureDisplay
      value={log.numericValue}
      unit={measureUnitDisplay}
      size={size}
    />
  );
}
