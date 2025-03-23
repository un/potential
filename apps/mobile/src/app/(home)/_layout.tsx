import React from "react";
import { Stack, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { CaretLeft, X } from "phosphor-react-native";

import UserHeader from "~/components/app/userHeader";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function DashboardLayout() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: colorScheme === "dark" ? "#191918" : "#f9f9f8",
        },
        headerStyle: {
          backgroundColor: colorScheme === "dark" ? "#222221" : "#f1f0ef",
        },
        headerTitle: ({ children }) => (
          <Text type="title" className="text-center text-lg">
            {children}
          </Text>
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Home", header: () => <UserHeader /> }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: "Settings",
          headerBackVisible: false,
          headerLeft: () => (
            <Button variant="link" size="icon" onPress={() => router.back()}>
              <CaretLeft size={24} />
            </Button>
          ),
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: "Profile",
          presentation: "modal",
          headerRight: () => (
            <Button variant="link" size="icon" onPress={() => router.back()}>
              <X size={24} />
            </Button>
          ),
        }}
      />
      <Stack.Screen
        name="stats"
        options={{
          title: "Progress",
          presentation: "modal",
          headerRight: () => (
            <Button variant="link" size="icon" onPress={() => router.back()}>
              <X size={24} />
            </Button>
          ),
        }}
      />
      <Stack.Screen
        name="log"
        options={{
          title: "Log something",
          presentation: "modal",
          headerRight: () => (
            <Button variant="link" size="icon" onPress={() => router.back()}>
              <X size={24} />
            </Button>
          ),
        }}
      />
    </Stack>
  );
}
