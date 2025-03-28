import type { ReactNode } from "react";
import React from "react";
import { Pressable, View } from "react-native";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "phosphor-react-native";

import { Text } from "~/components/ui/text";
import { cn } from "~/utils/ui";

interface LogStepWrapperProps {
  title: string;
  onBack: () => void;
  children: ReactNode;
  backgroundColor?: string;
  zeroPadding?: boolean;
  noSafeArea?: boolean;
}

export const LogStepWrapper = ({
  title,
  onBack,
  children,
  backgroundColor = "bg-sand-2",
  zeroPadding = false,
  noSafeArea = false,
}: LogStepWrapperProps) => {
  return (
    <Animated.View
      className={`absolute inset-0 z-10 h-full w-full flex-1 ${backgroundColor}`}
      entering={SlideInRight}
      exiting={SlideOutRight}
    >
      <SafeAreaView
        className="h-full w-full flex-1"
        edges={noSafeArea ? [] : ["bottom"]}
      >
        <View className="border-sand-3 flex-row items-center border-b p-4">
          <Pressable onPress={onBack} className="pr-4">
            <ArrowLeft size={24} weight="bold" />
          </Pressable>
          <Text type="title">{title}</Text>
        </View>
        <View className={cn("h-full w-full flex-1", !zeroPadding && "p-6")}>
          {children}
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};
