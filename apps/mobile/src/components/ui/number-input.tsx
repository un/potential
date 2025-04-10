import React, { useState } from "react";
import { Animated, Pressable, TextInput, View } from "react-native";

import { cn } from "~/utils/ui";
import { Text } from "./text";

interface NumberInputProps {
  unit: string;
  value: number;
  increments: number[];
  decrements: number[];
  className?: string;
  onValueChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Helper function to format number to 1 decimal place
const formatToOneDecimal = (num: number): number => {
  return Number(Math.round(num * 10) / 10);
};

// Helper function to format display value
const formatDisplayValue = (num: number): string => {
  const formatted = formatToOneDecimal(num);
  return formatted % 1 === 0 ? formatted.toString() : formatted.toFixed(1);
};

export function NumberInput({
  unit,
  value,
  increments,
  decrements,
  className,
  onValueChange,
  minValue = -Infinity,
  maxValue = Infinity,
}: NumberInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const [decrementAnimations] = useState(() =>
    decrements.map(() => new Animated.Value(0)),
  );
  const [incrementAnimations] = useState(() =>
    increments.map(() => new Animated.Value(0)),
  );

  const handleIncrement = (amount: number) => {
    const newValue = formatToOneDecimal(Math.min(value + amount, maxValue));
    onValueChange(newValue);
  };

  const handleDecrement = (amount: number) => {
    const newValue = formatToOneDecimal(Math.max(value - amount, minValue));
    onValueChange(newValue);
  };

  const handleValueChange = (text: string) => {
    setInputValue(text);
    const numericValue = Number(text);
    if (!isNaN(numericValue)) {
      const clampedValue = formatToOneDecimal(
        Math.min(Math.max(numericValue, minValue), maxValue),
      );
      onValueChange(clampedValue);
    }
  };

  const handleSubmitEditing = () => {
    setIsEditing(false);
    setInputValue(formatToOneDecimal(value).toString());
  };

  const isIncrementDisabled = (amount: number) => value + amount > maxValue;
  const isDecrementDisabled = (amount: number) => value - amount < minValue;

  return (
    <View
      className={cn(
        "w-full max-w-full flex-row items-center justify-center gap-2",
        className,
      )}
    >
      <View className="flex-row items-center gap-1">
        {decrements.map((amount, index) => {
          const originalIndex = decrements.indexOf(amount);
          const animation = decrementAnimations[originalIndex];
          if (!animation) return null;

          return (
            <AnimatedPressable
              key={`dec-${amount}`}
              onPress={() => handleDecrement(amount)}
              className={cn(
                "border-sand-6 items-center justify-center rounded-full border",
                isDecrementDisabled(amount) ? "bg-sand-1/50" : "bg-sand-1",
                index === decrements.length - 1 && "h-14 w-14",
                index === decrements.length - 2 && "h-12 w-12",
                index === decrements.length - 3 && "h-10 w-10",
              )}
            >
              <Text
                className={cn(
                  "font-medium",
                  isDecrementDisabled(amount) && "opacity-50",
                )}
              >
                -
                {amount.toString().startsWith("0")
                  ? amount.toString().slice(1)
                  : amount}
              </Text>
            </AnimatedPressable>
          );
        })}
      </View>

      <View className="mx-2 flex-col items-center pt-4">
        {isEditing ? (
          <TextInput
            className="text-sand-12 min-w-[40px] p-0 text-center font-['Monocraft'] text-5xl"
            value={inputValue}
            onChangeText={handleValueChange}
            keyboardType="decimal-pad"
            autoFocus
            onBlur={handleSubmitEditing}
            onSubmitEditing={handleSubmitEditing}
          />
        ) : (
          <Pressable
            onPress={() => {
              setIsEditing(true);
              setInputValue(formatToOneDecimal(value).toString());
            }}
          >
            <View className="flex-col items-center">
              <Text className="text-5xl" type={"title"}>
                {formatDisplayValue(value)}
              </Text>
              <Text className="text-sand-11 text-sm">
                {unit}
                {value === minValue && "(min)"}
                {value === maxValue && "(max)"}
              </Text>
            </View>
          </Pressable>
        )}
      </View>

      <View className="flex-row-reverse items-center gap-1 overflow-clip">
        {increments.map((amount, index) => {
          const originalIndex = increments.indexOf(amount);
          const animation = incrementAnimations[originalIndex];
          if (!animation) return null;

          return (
            <AnimatedPressable
              key={`inc-${amount}`}
              onPress={() => handleIncrement(amount)}
              className={cn(
                "border-sand-6 items-center justify-center rounded-full border",
                isIncrementDisabled(amount) ? "bg-sand-1/50" : "bg-sand-1",
                index === increments.length - 1 && "h-14 w-14",
                index === increments.length - 2 && "h-12 w-12",
                index === increments.length - 3 && "h-10 w-10",
              )}
            >
              <Text
                className={cn(
                  "font-medium",
                  isIncrementDisabled(amount) && "opacity-50",
                )}
              >
                +
                {amount.toString().startsWith("0")
                  ? amount.toString().slice(1)
                  : amount}
              </Text>
            </AnimatedPressable>
          );
        })}
      </View>
    </View>
  );
}
