import React, { useState } from "react";
import { View } from "react-native";
import { Dropdown as RNDropdown } from "react-native-element-dropdown";
import { useColorScheme } from "nativewind";

import { Text } from "./text";

export interface DropdownOption {
  label: string;
  value: string | number;
}

export interface DropdownProps {
  label?: string;
  items: DropdownOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  helperText?: string;
  error?: string | string[];
  search?: boolean;
  disabled?: boolean;
}

export const Dropdown = ({
  label,
  items,
  value,
  onChange,
  placeholder = "Select an option",
  helperText,
  error,
  search = false,
  disabled = false,
}: DropdownProps) => {
  const { colorScheme } = useColorScheme();
  const [isFocus, setIsFocus] = useState(false);

  const handleChange = (item: DropdownOption) => {
    onChange(item.value);

    setIsFocus(false);
  };

  return (
    <View className="relative flex flex-col gap-1">
      {label && (
        <View className="ml-0.5">
          <Text type={"title"}>{label}</Text>
        </View>
      )}

      <RNDropdown
        style={[
          {
            height: 48,
            borderWidth: 1,
            borderColor: colorScheme === "dark" ? "#494844" : "#E3DCD5", // sand-7 equivalent
            borderRadius: 8,
            paddingHorizontal: 12,
            backgroundColor: colorScheme === "dark" ? "#1B1917" : "#FFFFFF",
          },
          isFocus && {
            borderColor: colorScheme === "dark" ? "#E54D2E" : "#EC6E48", // tomato-9 equivalent
          },
          disabled && {
            opacity: 0.5,
          },
        ]}
        containerStyle={{
          borderRadius: 8,
          backgroundColor: colorScheme === "dark" ? "#1B1917" : "#FFFFFF",
          shadowColor: colorScheme === "dark" ? "#000" : "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
        placeholderStyle={{
          fontSize: 14,
          fontFamily: "MartianMono-Regular",
          color: colorScheme === "dark" ? "#7C7B74" : "#A69F95", // sand-10 equivalent
        }}
        selectedTextStyle={{
          fontSize: 14,
          fontFamily: "MartianMono-Regular",
          color: colorScheme === "dark" ? "#F5F2F0" : "#1B1917", // sand-12 equivalent
        }}
        inputSearchStyle={{
          height: 40,
          fontSize: 14,
          fontFamily: "MartianMono-Regular",
          borderColor: colorScheme === "dark" ? "#494844" : "#E3DCD5", // sand-7 equivalent
        }}
        iconStyle={{
          width: 20,
          height: 20,
        }}
        itemTextStyle={{
          fontSize: 14,
          fontFamily: "MartianMono-Regular",
          color: colorScheme === "dark" ? "#F5F2F0" : "#1B1917", // sand-12 equivalent
        }}
        itemContainerStyle={{
          paddingVertical: 4,
          paddingHorizontal: 16,
          borderRadius: 8,
        }}
        activeColor={colorScheme === "dark" ? "#313131" : "#F5F2F0"} // sand-3
        // equivalent

        data={items}
        search={search}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={handleChange}
        disable={disabled}
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
      {error && Array.isArray(error) && error.length > 0 && (
        <Text type={"paragraph"} className="text-red-10 ml-0.5">
          {error[0]}
        </Text>
      )}
    </View>
  );
};

// const styles = StyleSheet.create({
//   dropdown: {
//     height: 48,
//     borderWidth: 1,
//     borderColor: colorScheme === "dark" ? "#494844" : "#E3DCD5", // sand-7 equivalent
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     backgroundColor: "#FCFCFB", // sand-1 equivalent
//   },
//   focusedDropdown: {
//     borderColor: "#EC6E48", // tomato-9 equivalent
//   },
//   disabledDropdown: {
//     opacity: 0.5,
//   },
//   dropdownContainer: {
//     borderRadius: 8,
//     backgroundColor: "#FFFFFF",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   placeholderText: {
//     fontSize: 14,
//     fontFamily: "MartianMono-Regular",
//     color: colorScheme === "dark" ? "#A69F95" : "#A69F95", // sand-10 equivalent
//   },
//   selectedText: {
//     fontSize: 14,
//     fontFamily: "MartianMono-Regular",
//     color: "#1B1917", // sand-12 equivalent
//   },
//   searchInput: {
//     height: 40,
//     fontSize: 14,
//     fontFamily: "MartianMono-Regular",
//     borderColor: "#E3DCD5", // sand-7 equivalent
//   },
//   iconStyle: {
//     width: 20,
//     height: 20,
//   },
//   itemText: {
//     fontSize: 14,
//     fontFamily: "MartianMono-Regular",
//     color: "#1B1917", // sand-12 equivalent
//   },
//   itemContainer: {
//     paddingVertical: 4,
//     paddingHorizontal: 16,
//   },
// });
