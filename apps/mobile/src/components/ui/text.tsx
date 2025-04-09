/* eslint-disable @1up/no-direct-rn-import */
import type { SlottableTextProps, TextRef } from "@rn-primitives/types";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Text as RNText } from "react-native";
import * as Slot from "@rn-primitives/slot";
import { cva } from "class-variance-authority";

import { cn } from "~/utils/ui";

const textVariants = cva("web:select-text text-sand-12 text-base", {
  variants: {
    type: {
      paragraph: "font-['MartianMono-Regular']",
      title: "font-['Monocraft']",
    },
  },
  defaultVariants: {
    type: "paragraph",
  },
});

type TextVariants = VariantProps<typeof textVariants>;

const TextClassContext = React.createContext<string | undefined>(undefined);

const Text = React.forwardRef<TextRef, SlottableTextProps & TextVariants>(
  ({ className, asChild = false, type, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext);
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        className={cn(textVariants({ type }), !type && textClass, className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Text.displayName = "Text";

export { Text, TextClassContext };
