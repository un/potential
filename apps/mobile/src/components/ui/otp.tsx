import type { OTPInputRef, SlotProps } from "input-otp-native";
import { useEffect, useRef } from "react";
import { Alert, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { OTPInput } from "input-otp-native";

import { cn } from "~/utils/ui";
import { Text } from "./text";

export default function OTP() {
  const ref = useRef<OTPInputRef>(null);
  const onComplete = (code: string) => {
    Alert.alert("Completed with code:", code);
    ref.current?.clear();
  };

  return (
    <OTPInput
      ref={ref}
      onComplete={onComplete}
      maxLength={6}
      render={({ slots }) => (
        <View className="my-4 flex-row items-center justify-center gap-2">
          {slots.map((slot, idx) => (
            <OTPSlot key={idx} {...slot} />
          ))}
        </View>
      )}
    />
  );
}

export function OTPSlot({ char, isActive, hasFakeCaret }: SlotProps) {
  return (
    <View
      className={cn(
        "border-sand-6 bg-sand-1 h-[50px] w-[50px] items-center justify-center rounded-lg border",
        {
          "border-sand-9 border-2": isActive,
        },
      )}
    >
      {char !== null && <Text className="text-2xl font-medium">{char}</Text>}
      {hasFakeCaret && <FakeCaret />}
    </View>
  );
}

function FakeCaret() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 500 }),
        withTiming(1, { duration: 500 }),
      ),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const baseStyle = {
    width: 2,
    height: 28,
    backgroundColor: "#000",
    borderRadius: 1,
  };

  return (
    <View className="absolute h-full w-full items-center justify-center">
      <Animated.View style={[baseStyle, animatedStyle]} />
    </View>
  );
}
