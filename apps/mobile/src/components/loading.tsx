import type { VariantProps } from "class-variance-authority";
import React from "react";
import { View } from "react-native";
import { cva } from "class-variance-authority";

import { cn } from "~/utils/ui";
import { AnimatedHeart } from "./heart-sprite";

const loadingVariants = cva("flex-1 items-center justify-center", {
  variants: {
    size: {
      tiny: "size-3",
      sm: "size-4",
      md: "size-6",
      lg: "size-9",
      xl: "size-12",
      "2xl": "size-16",
      "3xl": "size-32",
      mega: "size-64",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const Loading: React.FC<VariantProps<typeof loadingVariants>> = ({
  size,
}) => {
  return (
    <View className={cn(loadingVariants({ size }))}>
      <AnimatedHeart />
    </View>
  );
};
