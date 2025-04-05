import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Pressable } from "react-native";
import { cva } from "class-variance-authority";

import { Loading } from "~/components/loading";
import { TextClassContext } from "~/components/ui/text";
import { cn } from "~/utils/ui";

const buttonVariants = cva(
  "group flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-tomato-9 active:opacity-90",
        destructive: "border-red-10 bg-red-5 border active:opacity-90",
        secondary: "bg-sand-9 active:opacity-80",
        outline: "bg-sand-3 border-sand-6 active:bg-sand-5 border",
        ghost: "bg-sand-1 active:bg-sand-5",
        link: "",
      },
      size: {
        default: "native:h-12 h-10 px-4",
        sm: "h-9 rounded-md px-3",
        lg: "native:h-14 h-11 px-5",
        icon: "h-12 w-12",
        "icon-sm": "h-9 w-9",
        "icon-lg": "h-14 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const buttonTextVariants = cva("text-sand-1 font-['Monocraft'] text-lg", {
  variants: {
    variant: {
      default: "text-tomato-1 dark:text-tomato-12",
      destructive: "text-red-12",
      secondary:
        "text-sand-1 dark:text-sand-12 group-active:text-secondary-foreground",
      outline: "text-sand-12 group-active:text-accent-foreground",
      ghost: "text-sand-12 group-active:text-accent-foreground",
      link: "text-sand-12 group-active:underline",
    },
    size: {
      default: "",
      sm: "",
      lg: "native:text-lg",
      icon: "",
      "icon-sm": "",
      "icon-lg": "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof buttonVariants> & { loading?: boolean };

const Button = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  ButtonProps
>(({ className, variant, size, loading, ...props }, ref) => {
  return (
    <TextClassContext.Provider
      value={buttonTextVariants({
        variant,
        size,
        className: "web:pointer-events-none",
      })}
    >
      <Pressable
        className={cn(
          props.disabled && "web:pointer-events-none opacity-50",
          buttonVariants({ variant, size, className }),
        )}
        ref={ref}
        role="button"
        disabled={loading ?? props.disabled}
        {...props}
      >
        {loading ? <Loading size="md" /> : props.children}
      </Pressable>
    </TextClassContext.Provider>
  );
});
Button.displayName = "Button";

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
