import type { ReactNode } from "react";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "phosphor-react-native";

import { Text } from "~/components/ui/text";
import { cn, iconColor } from "~/utils/ui";

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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={200}
          className="flex h-full w-full flex-1 flex-col gap-0"
        >
          <View className="border-sand-3 border-b p-4">
            <Pressable
              onPress={onBack}
              className="flex flex-row items-center gap-4"
            >
              <ArrowLeft size={24} weight="bold" color={iconColor()} />
              <Text type="title">{title}</Text>
            </Pressable>
          </View>
          <ScrollView
            className={cn("-mb-12 h-full w-full flex-1", !zeroPadding && "p-6")}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Animated.View>
  );
};
