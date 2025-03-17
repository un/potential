import type { VariantProps } from "class-variance-authority";
import React from "react";
import { View } from "react-native";
import { cva } from "class-variance-authority";

import { cn } from "~/utils/ui";
import { AnimatedHeart } from "./branding/heart-sprite";

const loadingVariants = cva("flex-1 items-center justify-center", {
  variants: {
    size: {
      tiny: "size-3 max-h-3 max-w-3",
      sm: "size-4 max-h-4 max-w-4",
      md: "size-6 max-h-6 max-w-6",
      lg: "size-9 max-h-9 max-w-9",
      xl: "size-12 max-h-12 max-w-12",
      "2xl": "size-16 max-h-16 max-w-16",
      "3xl": "size-32 max-h-32 max-w-32",
      mega: "size-64 max-h-64 max-w-64",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const Loading: React.FC<
  VariantProps<typeof loadingVariants> & { bpm?: number }
> = ({ size, bpm = 42 }) => {
  return (
    <View className={cn(loadingVariants({ size }))}>
      <AnimatedHeart bpm={bpm} />
    </View>
  );
};
