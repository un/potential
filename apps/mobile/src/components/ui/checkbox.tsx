import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Pressable } from "react-native";
import { cva } from "class-variance-authority";

// import { Check } from "@potential/phosphor-react-native";

import { Loading } from "~/components/loading";
import { cn } from "~/utils/ui";
import { Text } from "./text";

const checkboxVariants = cva(
  "group flex items-center justify-center rounded-md border p-3",
  {
    variants: {
      size: {
        default: "h-8 w-8",
        sm: "h-6 w-6",
        lg: "h-10 w-10",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

type CheckboxProps = Omit<
  React.ComponentPropsWithoutRef<typeof Pressable>,
  "onPress"
> &
  VariantProps<typeof checkboxVariants> & {
    loading?: boolean;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  };

const Checkbox = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  CheckboxProps
>(
  (
    { className, size, loading, checked = false, onCheckedChange, ...props },
    ref,
  ) => {
    const handleToggle = React.useCallback(() => {
      onCheckedChange?.(!checked);
    }, [checked, onCheckedChange]);

    return (
      <Pressable
        className={cn(
          props.disabled && "web:pointer-events-none opacity-90",
          checked ? "bg-tomato-9 border-tomato-9" : "bg-sand-1 border-sand-7",
          checkboxVariants({ size, className }),
        )}
        ref={ref}
        role="checkbox"
        aria-checked={checked}
        disabled={loading ?? props.disabled}
        onPress={handleToggle}
        {...props}
        hitSlop={10}
      >
        {loading ? (
          <Loading size="sm" />
        ) : checked ? (
          // <Check
          //   size={size === "lg" ? 24 : size === "sm" ? 12 : 16}
          //   weight="bold"
          //   color={"#f9f9f8"}
          // />
          <Text>CA</Text>
        ) : null}
      </Pressable>
    );
  },
);
Checkbox.displayName = "Checkbox";

export { Checkbox, checkboxVariants };
export type { CheckboxProps };
