import React from "react";
import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

export default function DashboardLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#64748b",
        tabBarStyle: {
          backgroundColor: colorScheme === "dark" ? "#222221" : "#f1f0ef",
          borderTopColor: colorScheme === "dark" ? "#3b3a37" : "#dad9d6",
        },
        sceneStyle: {
          backgroundColor: colorScheme === "dark" ? "#191918" : "#f9f9f8",
        },
        headerStyle: {
          backgroundColor: colorScheme === "dark" ? "#222221" : "#f1f0ef",
          borderBottomColor: colorScheme === "dark" ? "#dad9d6" : "#dad9d6",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="cog" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
