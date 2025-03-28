import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "@tanstack/react-form";
import { OTPInput } from "input-otp-native";
import { z } from "zod";

import { Logo } from "~/components/branding/logo";
import { Button } from "~/components/ui/button";
import { OTPSlot } from "~/components/ui/otp";
import { Text } from "~/components/ui/text";
import { authClient } from "~/utils/auth-client";

const loginSignupSchema = z.object({
  otp: z.string().length(6),
});

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const router = useRouter();
  const { email } = useLocalSearchParams();

  const form = useForm({
    defaultValues: {
      otp: "",
    },
    validators: {
      onChange: loginSignupSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      const { error, data } = await authClient.signIn.emailOtp({
        email: email as string,
        otp: value.otp,
      });

      if (error?.status) {
        setIsLoading(false);
        setOtpError(error.message ?? "An error occurred, try again.");
        console.error(error);
        // TODO: Add error toast
        return;
      }
      if (data) {
        router.replace("/post-login-redirect");
      }
      setOtpError("Something went wrong, try again.");
      setIsLoading(false);
    },
  });

  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen options={{ title: "Login" }} />
      <View className="flex-1 items-center justify-center gap-8 p-8">
        <Logo />
        <Text className="text-xl" type={"title"}>
          We sent a code to your email
        </Text>

        <View className="flex w-full max-w-sm flex-col gap-8">
          <form.Field
            name="otp"
            validators={{
              onChangeAsyncDebounceMs: 1500,
            }}
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <View className="flex flex-col items-center justify-center gap-0">
                  <Text className="" type={"title"}>
                    Verification Code
                  </Text>
                  <OTPInput
                    onChange={(value) => field.handleChange(value)}
                    maxLength={6}
                    render={({ slots }) => (
                      <View className="my-4 flex-row items-center justify-center gap-2">
                        {slots.map((slot, idx) => (
                          <OTPSlot key={idx} {...slot} />
                        ))}
                      </View>
                    )}
                  />
                  {otpError && <Text className="text-red-10">{otpError}</Text>}
                </View>
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
                  <Text>Verify</Text>
                </Button>
              )}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
