import type { LayoutChangeEvent } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { cn } from "~/utils/ui";
import { Text } from "./text";

export interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  rangeMin: number;
  rangeMax: number;
  rangeUnit?: string;
  rangeMinLabel?: string;
  rangeMaxLabel?: string;
  rangeStepLabels?: Record<number, string>[];
  className?: string;
  knobClassName?: string;
  trackClassName?: string;
}

export function Slider({
  value,
  onValueChange,
  rangeMin,
  rangeMax,
  rangeUnit = "",
  rangeMinLabel,
  rangeMaxLabel,
  rangeStepLabels = [],
  className,
  knobClassName,
  trackClassName,
}: SliderProps) {
  // Local state for displayed value (both during and outside dragging)
  const [displayValue, setDisplayValue] = useState(value);
  // State to track dragging
  const [isDraggingState, setIsDraggingState] = useState(false);

  // Calculate total range
  const totalRange = rangeMax - rangeMin;

  // Knob dimensions - adjust these as needed for your design
  const KNOB_WIDTH = 65; // Width of the knob in pixels
  const KNOB_HEIGHT = 48; // Height of the knob in pixels
  const HORIZONTAL_PADDING = KNOB_WIDTH; // Padding to prevent knob from getting cut off

  // Shared values for animations - all initialized unconditionally
  const trackWidthValue = useSharedValue(0);
  const effectiveTrackWidth = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const animatedPosition = useSharedValue(0);

  // Define all callbacks first before using them

  // Update display value in React state
  const updateDisplayValue = useCallback((newValue: number) => {
    setDisplayValue(newValue);
  }, []);

  // Update dragging state in React state
  const updateDraggingState = useCallback((dragging: boolean) => {
    setIsDraggingState(dragging);
  }, []);

  // Value change handler
  const handleValueChange = useCallback(
    (newValue: number) => {
      if (newValue !== value) {
        onValueChange(newValue);
        setDisplayValue(newValue);
      }
    },
    [onValueChange, value],
  );

  // Convert position to value
  const calculateValue = useCallback(
    (pos: number, effectiveWidth: number) => {
      "worklet";
      if (effectiveWidth <= 0) return rangeMin;

      // Calculate percentage of position within effective track width
      const percentage = Math.max(0, Math.min(1, pos / effectiveWidth));

      // Convert to value in range and round
      const rawValue = rangeMin + percentage * totalRange;
      return Math.round(rawValue);
    },
    [rangeMin, totalRange],
  );

  // Convert value to position on the track
  const calculatePosition = useCallback(
    (val: number, effectiveWidth: number) => {
      "worklet";
      if (effectiveWidth <= 0) return 0;

      // Calculate the position based on the value's percentage in the range
      const percentage = Math.max(
        0,
        Math.min(1, (val - rangeMin) / totalRange),
      );
      return percentage * effectiveWidth;
    },
    [rangeMin, totalRange],
  );

  // Track layout measurement handler
  const onTrackLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width } = event.nativeEvent.layout;
      trackWidthValue.value = width;

      // Calculate effective width for value calculations (subtracting padding)
      const effective = Math.max(0, width - HORIZONTAL_PADDING);
      effectiveTrackWidth.value = effective;

      // Initialize position when track width is first measured
      const newPosition = calculatePosition(value, effective);
      animatedPosition.value = newPosition;
    },
    [
      value,
      calculatePosition,
      trackWidthValue,
      effectiveTrackWidth,
      animatedPosition,
      HORIZONTAL_PADDING,
    ],
  );

  // Update position when controlled value changes
  useEffect(() => {
    if (effectiveTrackWidth.value > 0) {
      const newPosition = calculatePosition(value, effectiveTrackWidth.value);
      animatedPosition.value = newPosition;
      setDisplayValue(value);
    }
  }, [value, calculatePosition, effectiveTrackWidth, animatedPosition]);

  // Create all gestures using the previously defined callbacks

  // Pan gesture for smooth dragging
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      "worklet";
      isDragging.value = true;
      runOnJS(updateDraggingState)(true);
    })
    .onChange((event) => {
      "worklet";
      // Calculate new position within track bounds (using effective width)
      const newPosition = Math.max(
        0,
        Math.min(
          effectiveTrackWidth.value,
          animatedPosition.value + event.changeX,
        ),
      );

      // Update animated position - this is expected with Reanimated shared values
      // React's immutability linting doesn't apply to Reanimated worklets
      // eslint-disable-next-line react-compiler/react-compiler
      animatedPosition.value = newPosition;

      // Calculate and update displayed value
      const newValue = calculateValue(newPosition, effectiveTrackWidth.value);

      // Update JS thread display value
      runOnJS(updateDisplayValue)(newValue);
    })
    .onFinalize(() => {
      "worklet";
      // Calculate final value from current position
      const newValue = calculateValue(
        animatedPosition.value,
        effectiveTrackWidth.value,
      );

      // Snap to nearest value
      const snappedPosition = calculatePosition(
        newValue,
        effectiveTrackWidth.value,
      );
      animatedPosition.value = snappedPosition;

      // Send value change to JS thread
      runOnJS(handleValueChange)(newValue);

      // End dragging state
      isDragging.value = false;
      runOnJS(updateDraggingState)(false);
    });

  // Tap gesture for quick jumps
  const tapGesture = Gesture.Tap().onStart((event) => {
    "worklet";
    if (effectiveTrackWidth.value <= 0) return;

    // Get tap position within the effective track bounds
    // Add padding/2 to account for the left padding
    const padAdjustedX = Math.max(0, event.x - HORIZONTAL_PADDING / 2);
    const tapPosition = Math.max(
      0,
      Math.min(effectiveTrackWidth.value, padAdjustedX),
    );

    // Calculate new value and position
    const newValue = calculateValue(tapPosition, effectiveTrackWidth.value);
    const snappedPosition = calculatePosition(
      newValue,
      effectiveTrackWidth.value,
    );

    // Update position and value
    animatedPosition.value = snappedPosition;

    // Update display value and send to JS
    runOnJS(updateDisplayValue)(newValue);
    runOnJS(handleValueChange)(newValue);
  });

  // Animated styles
  const knobStyle = useAnimatedStyle(() => {
    // Adjust the transform to position the knob correctly
    // Add HORIZONTAL_PADDING/2 to account for the left padding
    return {
      transform: [
        {
          translateX:
            animatedPosition.value + HORIZONTAL_PADDING / 2 - KNOB_WIDTH / 2,
        },
      ],
    };
  });

  // Visual track style
  const filledTrackStyle = useAnimatedStyle(() => {
    // Add HORIZONTAL_PADDING/2 to match the knob position
    return {
      width: animatedPosition.value + HORIZONTAL_PADDING / 2,
    };
  });

  // Render step markers and labels
  const renderStepMarkers = () => {
    const steps = [];

    // Add min and max labels
    const minLabel = rangeMinLabel ?? rangeMin.toString();
    const maxLabel = rangeMaxLabel ?? rangeMax.toString();

    steps.push(
      <View key="min-label" className="absolute -bottom-6 left-0">
        <Text className="text-sand-11 text-xs">{minLabel}</Text>
      </View>,
    );

    steps.push(
      <View key="max-label" className="absolute -bottom-6 right-0">
        <Text className="text-sand-11 text-xs">{maxLabel}</Text>
      </View>,
    );

    // Add custom step labels if provided
    if (rangeStepLabels.length > 0) {
      rangeStepLabels.forEach((label) => {
        const entries = Object.entries(label);
        if (entries.length > 0) {
          const entry = entries[0];
          if (!entry) return;

          const position = entry[0];
          const text = entry[1];
          const positionValue = parseInt(position);

          if (positionValue >= rangeMin && positionValue <= rangeMax) {
            const percentage = (positionValue - rangeMin) / totalRange;

            steps.push(
              <View
                key={`step-${positionValue}`}
                className="absolute -bottom-6"
                style={{
                  left: `${percentage * 100}%`,
                  transform: [{ translateX: -12 }],
                }}
              >
                <Text className="text-sand-11 text-xs">{text}</Text>
              </View>,
            );
          }
        }
      });
    }

    return steps;
  };

  // Render the component
  return (
    <View className="pb-12">
      <GestureHandlerRootView className={cn("w-full py-4", className)}>
        <View className="relative">
          {/* Track with tap gesture */}
          <GestureDetector gesture={tapGesture}>
            <View
              onLayout={onTrackLayout}
              className={cn(
                "bg-sand-3 border-sand-6 h-12 w-full rounded-full border",
                trackClassName,
              )}
            >
              {/* Filled portion of track */}
              <Animated.View
                className="bg-tomato-9 absolute h-full rounded-full"
                style={filledTrackStyle}
              />

              {/* Step markers overlay */}
              <View className="relative h-full w-full">
                {renderStepMarkers()}
              </View>
            </View>
          </GestureDetector>

          {/* Knob */}
          <GestureDetector gesture={panGesture}>
            <Animated.View
              className={cn(
                "absolute -mt-1 flex flex-col items-center justify-center",
                "bg-sand-1 border-sand-7 rounded-3xl border-2 px-4 py-1 shadow-md",
                isDraggingState ? "bg-sand-2" : "bg-sand-1",
                knobClassName,
              )}
              style={[
                {
                  minWidth: KNOB_WIDTH,
                  height: KNOB_HEIGHT,
                  top: (48 - KNOB_HEIGHT) / 2, // Center vertically on the track (48px height)
                },
                knobStyle,
              ]}
            >
              {/* Value display inside knob */}
              <Text className="text-sand-12 text-lg font-medium">
                {displayValue}
              </Text>

              {/* Unit display below value */}
              {rangeUnit ? (
                <Text className="text-sand-11 leading-0 -mt-1 text-xs">
                  {rangeUnit}
                </Text>
              ) : null}

              {/* Floating value display when dragging */}
              <View
                className={cn(
                  "bg-sand-1 border-sand-6 absolute -top-10 flex min-w-20 max-w-80 flex-row items-center justify-center gap-1 rounded-md border px-2 py-1",
                  isDraggingState ? "opacity-100" : "opacity-0",
                )}
              >
                <Text className="text-sand-12 text-md font-medium">
                  {displayValue}
                </Text>

                {rangeUnit && (
                  <Text className="text-sand-11 text-sm font-medium">
                    {rangeUnit}
                  </Text>
                )}
              </View>
            </Animated.View>
          </GestureDetector>
        </View>
      </GestureHandlerRootView>
    </View>
  );
}
