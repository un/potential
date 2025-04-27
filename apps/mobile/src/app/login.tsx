import { useForm } from "@tanstack/react-form";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

import { Logo } from "~/components/branding/logo";
import { Loading } from "~/components/loading";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { authClient } from "~/utils/auth-client";

const loginSignupSchema = z.object({
  email: z.string().min(4, { message: "Email is required" }).email(),
});

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchingFormMode, setIsSwitchingFormMode] = useState(false);
  const [formMode, setFormMode] = useState<"login" | "join">("login");
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onChange: loginSignupSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email: value.email,
        type: "sign-in",
      });
      if (error) {
        setIsLoading(false);
        console.error(error);
        return;
      }
      router.push({
        pathname: "/otp",
        params: {
          email: value.email,
        },
      });

      setIsLoading(false);
    },
  });

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

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex h-full flex-1 flex-col items-center justify-center gap-8 p-8"
      >
        {isSwitchingFormMode ? (
          <View className="flex-1 items-center justify-center gap-8 p-8">
            <Loading size="3xl" />
          </View>
        ) : (
          <View className="flex w-full flex-col items-center justify-center gap-8">
            <Logo size="3xl" />
            {formMode === "login" ? (
              <Text className="mb-8 text-xl" type={"title"}>
                Login to your account
              </Text>
            ) : (
              <Text className="mb-8 text-xl" type={"title"}>
                Reach your health potential now
              </Text>
            )}
            <View className="flex w-full max-w-sm flex-col gap-8">
              <form.Field
                name="email"
                validators={{
                  onChangeAsyncDebounceMs: 1500,
                }}
                children={(field) => {
                  // Avoid hasty abstractions. Render props are great!
                  return (
                    <>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChangeText={field.handleChange}
                        label="Email Address"
                        error={field.state.meta.errors as object[]}
                      />
                    </>
                  );
                }}
              />
              <View className="flex w-full max-w-sm flex-col gap-4">
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <Button
                      // eslint-disable-next-line @typescript-eslint/unbound-method
                      onPress={form.handleSubmit}
                      loading={isLoading || isSubmitting}
                      disabled={!canSubmit}
                    >
                      <Text>{formMode === "login" ? "Login" : "Join"}</Text>
                    </Button>
                  )}
                />
                <Button
                  variant={formMode === "login" ? "secondary" : "outline"}
                  onPress={handleToggleFormMode}
                  loading={isLoading}
                >
                  <Text>{formMode === "login" ? "Join" : "Back to Login"}</Text>
                </Button>
              </View>
            </View>
            {/* </form> */}
            {formMode === "join" && (
              <Text className="text-sand-11 mb-8 text-sm">
                Potential Health is currently in beta. Please be sure to check our
                communities for regular updates.
              </Text>
            )}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
