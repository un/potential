import type { TextInputProps } from "react-native";
import * as React from "react";
import { TextInput, View } from "react-native";

import type { InputProps } from "./input";
import { cn } from "~/utils/ui";
import { Text } from "./text";

const Textarea = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  TextInputProps & InputProps
>(
  (
    {
      className,
      multiline = true,
      numberOfLines = 4,
      placeholderClassName,
      label,
      helperText,
      error,
      ...props
    },
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
            "border-sand-7 bg-sand-1 text-sand-12 placeholder:text-sand-10 min-h-[80px] w-full rounded-md border px-3 py-3 font-['MartianMono-Regular'] text-lg",
            props.editable === false && "opacity-50",
            className,
          )}
          placeholderClassName={cn("text-sand-10", placeholderClassName)}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical="center"
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
            {typeof error[0] === "string" ? error[0] : error[0].message}
          </Text>
        )}
      </View>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
