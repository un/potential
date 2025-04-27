import React from "react";
import { View } from "react-native";

import type { ConstsTypes } from "@potential/consts";
import { convert } from "@potential/utils/convert";

import { NumberInput } from "~/components/ui/number-input";

type UnitType = ConstsTypes["TRACKABLE"]["CONFIG"]["UNITS"]["MEASURE"]["KEY"];

interface MeasureInputProps {
  value: number;
  unit?: string;
  onChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  incrementStep?: number;
  decrementStep?: number;
  increments?: number[];
  decrements?: number[];
  size?: "sm" | "md" | "lg";
}

interface MeasureConversionInputProps {
  value: number;
  onChange: (value: number) => void;
  measureUnitType: UnitType;
  measureUnitSource: string;
  measureUnitDisplay: string;
  minValue?: number;
  maxValue?: number;
  incrementStep?: number;
  decrementStep?: number;
  increments?: number[];
  decrements?: number[];
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
 * Convert a value from display unit back to source unit
 */
function convertValueBack(
  value: number,
  unitType: UnitType,
  displayUnit: string,
  sourceUnit: string,
): number {
  // Only convert if the units are different
  if (sourceUnit === displayUnit) return value;

  // Only convert compatible unit types
  if (unitType === "volume" || unitType === "mass" || unitType === "length") {
    try {
      return convert(value).from(displayUnit).to(sourceUnit);
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
 * Input component for measure trackables
 */
export function MeasureInput({
  value,
  unit = "",
  onChange,
  minValue,
  maxValue,
  incrementStep = 1,
  decrementStep = 1,
  increments,
  decrements,
  // We keep size for consistency but don't use it directly in this component
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  size = "md",
}: MeasureInputProps) {
  return (
    <View className="flex-row items-center gap-1">
      <NumberInput
        value={value}
        onValueChange={onChange}
        minValue={minValue}
        maxValue={maxValue}
        increments={increments ?? [incrementStep]}
        decrements={decrements ?? [decrementStep]}
        unit={unit}
      />
    </View>
  );
}

/**
 * Input component for measure trackables with unit conversion
 */
export function MeasureConversionInput({
  value,
  onChange,
  measureUnitType,
  measureUnitSource,
  measureUnitDisplay,
  minValue,
  maxValue,
  incrementStep = 1,
  decrementStep = 1,
  increments,
  decrements,
  size = "md",
}: MeasureConversionInputProps) {
  // Convert from source to display for the UI
  const displayValue = convertValue(
    value,
    measureUnitType,
    measureUnitSource,
    measureUnitDisplay,
  );

  // Handle change by converting back to source units
  const handleChange = (newDisplayValue: number) => {
    const newSourceValue = convertValueBack(
      newDisplayValue,
      measureUnitType,
      measureUnitDisplay,
      measureUnitSource,
    );
    onChange(newSourceValue);
  };

  return (
    <MeasureInput
      value={displayValue}
      onChange={handleChange}
      unit={measureUnitDisplay}
      minValue={minValue}
      maxValue={maxValue}
      incrementStep={incrementStep}
      decrementStep={decrementStep}
      increments={increments}
      decrements={decrements}
      size={size}
    />
  );
}

/**
 * Higher-level function to get a measure input component with appropriate conversion
 */
export function getMeasureInputForLog(
  value: number,
  onChange: (value: number) => void,
  measureUnitDisplay?: string,
  measureUnitType?: UnitType,
  measureUnitSource?: string,
  minValue?: number,
  maxValue?: number,
  increments?: number[],
  decrements?: number[],
): React.ReactNode {
  // If all conversion parameters are provided, use MeasureConversion
  if (measureUnitType && measureUnitSource && measureUnitDisplay) {
    return (
      <MeasureConversionInput
        value={value}
        onChange={onChange}
        measureUnitType={measureUnitType}
        measureUnitSource={measureUnitSource}
        measureUnitDisplay={measureUnitDisplay}
        minValue={minValue}
        maxValue={maxValue}
        increments={increments ?? [0.1, 1, 5]}
        decrements={decrements ?? [0.1, 1, 5]}
        size="md"
      />
    );
  }

  // Otherwise fall back to regular MeasureInput
  return (
    <MeasureInput
      value={value}
      onChange={onChange}
      unit={measureUnitDisplay}
      minValue={minValue}
      maxValue={maxValue}
      increments={increments ?? [0.1, 1, 5]}
      decrements={decrements ?? [0.1, 1, 5]}
    />
  );
}
