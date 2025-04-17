import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { trpc } from "~/utils/api";

const bugReportSchema = z.object({
  message: z.string().min(1, "Please enter a message"),
});

export default function Stats() {
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const { data: profileData } = useQuery(
    trpc.user.profile.getUserProfileOverview.queryOptions(),
  );

  const { mutateAsync } = useMutation(
    trpc.user.profile.sendBugReport.mutationOptions({
      onSuccess: () => {
        toast.success("Bug report sent successfully");
        setIsFormSubmitting(false);
        form.reset();
      },
      onError: (err) => {
        console.error("Mutation error:", err);
        toast.error(
          err.message ||
            "Failed to send bug report, send a manual email to omar@mcadam.io",
        );
        setIsFormSubmitting(false);
      },
    }),
  );

  const form = useForm({
    defaultValues: {
      message: "",
    },
    validators: {
      onChange: bugReportSchema,
    },
    onSubmit: async ({ value }) => {
      setIsFormSubmitting(true);
      await mutateAsync({
        message: value.message,
      });
    },
  });

  return (
    <SafeAreaView className="flex-1" edges={["bottom"]}>
      <ScrollView className="flex-1 p-6">
        <View className="flex flex-col gap-6">
          <Text className="text-3xl" type={"title"}>
            Stats
          </Text>

          <View className="flex flex-col gap-4">
            <View className="flex w-full flex-row justify-between gap-4">
              <Text className="text-lg">Streak</Text>
              <Text className="text-lg" type={"title"}>
                {profileData?.streakCurrentDays} Days
              </Text>
            </View>
            {profileData?.streakCurrentStartDate && (
              <View className="flex w-full flex-row justify-between gap-4">
                <Text className="text-lg">Streak Start</Text>
                <Text className="text-lg" type={"title"}>
                  {profileData.streakCurrentStartDate.toLocaleDateString()}
                </Text>
              </View>
            )}
            <View className="flex w-full flex-row justify-between gap-4">
              <Text className="text-lg">XP Points</Text>
              <Text className="text-lg" type={"title"}>
                {profileData?.xpTotal}
              </Text>
            </View>
            <View className="flex w-full flex-col gap-0">
              <Text className="text-sand-11 text-sm">
                Earn XP points every time you enter a log or track something
                new.
              </Text>
              <Text className="text-sand-11 text-sm">
                Points are awarded and multiplied by your daily streak (1 day =
                1% bonus).
              </Text>
              <Text className="text-sand-11 text-sm">
                Points can be redeemed for discounts on products and
                subscriptions.
              </Text>
            </View>
          </View>

          <View className="mt-8">
            <Text className="mb-4 text-2xl" type={"title"}>
              Report a Bug
            </Text>
            <form.Field
              name="message"
              children={(field) => (
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  label="Describe what you were doing when the bug occurred, and what you expected to happen."
                  error={field.state.meta.errors as object[]}
                  placeholder="Describe what went wrong..."
                  multiline
                  numberOfLines={4}
                />
              )}
            />
            <View className="mt-4">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    // eslint-disable-next-line @typescript-eslint/unbound-method
                    onPress={form.handleSubmit}
                    loading={isFormSubmitting || isSubmitting}
                    disabled={!canSubmit}
                  >
                    <Text>Submit Bug Report</Text>
                  </Button>
                )}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
