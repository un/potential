import React from "react";
import { View } from "react-native";

import { Input } from "~/components/ui/input";
import { LongText } from "~/components/ui/long-text";
import { Text } from "~/components/ui/text";

interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  isLong?: boolean;
  placeholder?: string;
  label?: string;
  maxLength?: number;
  size?: "sm" | "md" | "lg";
}

/**
 * Input component for text trackables (both short and long text)
 */
export function TextInput({
  value,
  onChangeText,
  isLong = false,
  placeholder = "Enter text...",
  label,
  maxLength,
  // We're not using size here, but keeping it in the props for consistency
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  size = "md",
}: TextInputProps) {
  return (
    <View className="flex-col gap-1">
      {label && <Text className="text-sand-11 text-xs">{label}</Text>}

      {isLong ? (
        <LongText
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          maxLength={maxLength}
        />
      ) : (
        <Input
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          maxLength={maxLength}
        />
      )}
    </View>
  );
}

/**
 * Higher-level function to get a text input component
 */
export function getTextInputForLog(
  value: string,
  onChangeText: (text: string) => void,
  isLong = false,
  placeholder?: string,
  label?: string,
  maxLength?: number,
): React.ReactNode {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      isLong={isLong}
      placeholder={placeholder}
      label={label}
      maxLength={maxLength}
    />
  );
}
