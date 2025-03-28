import type { TouchableOpacityProps } from "react-native";
import React from "react";
import { TouchableOpacity as RNTouchableOpacity } from "react-native";

export const TouchableOpacity = ({
  children,
  ...props
}: TouchableOpacityProps) => {
  return <RNTouchableOpacity {...props}>{children}</RNTouchableOpacity>;
};
