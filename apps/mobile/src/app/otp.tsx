import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import { Logo } from "~/components/branding/logo";
import { Loading } from "~/components/loading";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { authClient } from "~/utils/auth-client";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchingFormMode, setIsSwitchingFormMode] = useState(false);
  const [formMode, setFormMode] = useState<"login" | "join">("login");

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await authClient.emailOtp.sendVerificationOtp({
        email: "test@test.com",
        type: "sign-in",
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleToggleFormMode = () => {
    setIsSwitchingFormMode(true);
    setTimeout(() => {
      setFormMode(formMode === "login" ? "join" : "login");
      setIsSwitchingFormMode(false);
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen options={{ title: "Login" }} />
      {isSwitchingFormMode ? (
        <View className="flex-1 items-center justify-center gap-8 p-8">
          <Loading size="3xl" />
        </View>
      ) : (
        <View className="flex-1 items-center justify-center gap-8 p-8">
          <Logo />
          {formMode === "login" ? (
            <Text className="mb-8 text-xl" type={"title"}>
              Login to your account
            </Text>
          ) : (
            <Text className="mb-8 text-xl" type={"title"}>
              Start your 1up journey now
            </Text>
          )}

          <View className="flex w-full max-w-sm flex-col gap-8">
            <Input label="Email Address" />
            <View className="flex w-full max-w-sm flex-col gap-4">
              <Button onPress={handleLogin} loading={isLoading}>
                <Text>{formMode === "login" ? "Login" : "Join"}</Text>
              </Button>
              <Button
                variant={formMode === "login" ? "secondary" : "outline"}
                onPress={handleToggleFormMode}
                loading={isLoading}
              >
                <Text>{formMode === "login" ? "Join" : "Back to Login"}</Text>
              </Button>
            </View>
          </View>
          {formMode === "join" && (
            <Text className="text-sand-11 mb-8 text-sm">
              1up is currently in beta. Please be sure to check our communities
              for regular updates.
            </Text>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
