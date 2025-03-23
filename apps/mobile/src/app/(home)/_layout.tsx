import React from "react";
import { Stack, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { X } from "phosphor-react-native";

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
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen
        name="profile"
        options={{
          title: "Profile",
          presentation: "modal",
          headerRight: () => (
            <Button variant="link" size="icon" onPress={() => router.back()}>
              <X size={18} />
            </Button>
          ),
        }}
      />
    </Stack>
    // <Tabs
    //   screenOptions={{
    //     tabBarActiveTintColor: "#3b82f6",
    //     tabBarInactiveTintColor: "#64748b",
    //     tabBarStyle: {
    //       backgroundColor: colorScheme === "dark" ? "#222221" : "#f1f0ef",
    //       borderTopColor: colorScheme === "dark" ? "#3b3a37" : "#dad9d6",
    //     },
    //     sceneStyle: {
    //       backgroundColor: colorScheme === "dark" ? "#191918" : "#f9f9f8",
    //     },
    //     headerStyle: {
    //       backgroundColor: colorScheme === "dark" ? "#222221" : "#f1f0ef",
    //       borderBottomColor: colorScheme === "dark" ? "#dad9d6" : "#dad9d6",
    //     },
    //   }}
    // >
    //   <Tabs.Screen
    //     name="index"
    //     options={{
    //       title: "Home",
    //       tabBarIcon: ({ color }) => (
    //         <FontAwesome name="home" size={24} color={color} />
    //       ),
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="profile"
    //     options={{
    //       title: "Profile",
    //       tabBarIcon: ({ color }) => (
    //         <FontAwesome name="user" size={24} color={color} />
    //       ),
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="settings"
    //     options={{
    //       title: "Settings",
    //       tabBarIcon: ({ color }) => (
    //         <FontAwesome name="cog" size={24} color={color} />
    //       ),
    //     }}
    //   />
    // </Tabs>
  );
}
