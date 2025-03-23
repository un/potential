import React from "react";
import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";

export default function DashboardLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: colorScheme === "dark" ? "#191918" : "#f9f9f8",
        },
        headerStyle: {
          backgroundColor: colorScheme === "dark" ? "#222221" : "#f1f0ef",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Updates",
          header: () => null,
        }}
      />
    </Stack>
  );
}
