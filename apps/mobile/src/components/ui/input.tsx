import type { TextInputProps } from "react-native";
import * as React from "react";
import { TextInput, View } from "react-native";

import { cn } from "~/utils/ui";
import { Text } from "./text";

type InputProps = TextInputProps & {
  label?: string;
  helperText?: string;
  error?: string | object[];
};

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  (
    { className, placeholderClassName, label, helperText, error, ...props },
    ref,
  ) => {
    return (
      <View className="relative flex flex-col gap-1">
        {label && (
          <View className="ml-0.5">
            <Text type={"title"}>{label}</Text>
          </View>
        )}
        <TextInput
          ref={ref}
          className={cn(
            "native:leading-[1.25] border-sand-7 text-sand-12 placeholder:text-sand-10 bg-sand-1 h-12 rounded-md border px-3 font-['MartianMono-Regular'] text-base",
            props.editable === false && "web:cursor-not-allowed opacity-50",
            className,
          )}
          placeholderClassName={cn("text-sand-10", placeholderClassName)}
          {...props}
        />
        {helperText && !error && (
          <Text type={"paragraph"} className="text-sand-10 ml-0.5">
            {helperText}
          </Text>
        )}
        {error && typeof error === "string" && (
          <Text type={"paragraph"} className="text-red-10 ml-0.5">
            {error}
          </Text>
        )}
        {error && error.length > 0 && (
          <Text type={"paragraph"} className="text-red-10 ml-0.5">
            {error[0].message ?? "Error"}
          </Text>
        )}
      </View>
    );
  },
);

Input.displayName = "Input";

export { Input };
