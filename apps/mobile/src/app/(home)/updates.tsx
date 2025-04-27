import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { trpc } from "~/utils/api";
import { authClient } from "~/utils/auth-client";

interface Update {
  version: string;
  changes?: string[];
  bugs?: string[];
  videoUrl?: string;
}

// UPDATE expoConfig.extra.onboardingVersion with latest version number
const updates: Update[] = [
  {
    version: "0.0.1",
    changes: [
      "Added nutrients and macros to food/drink logging",
      "Added manual sleep logging",
      "Added manual activity logging",
      "Added basic supplement tracking",
    ],
  },
];

export default function Updates() {
  const { data: session } = authClient.useSession();

  const router = useRouter();
  const { mutateAsync } = useMutation(
    trpc.user.profile.updateOnboardingVersion.mutationOptions({
      onSuccess: () => {
        toast.success("Onboarding version updated");
        router.replace("/(home)");
      },
      onError: (err) => {
        console.error("Mutation error:", err);
        toast.error(err.message || "Failed to save food/drink log");
      },
    }),
  );

  return (
    <SafeAreaView className="flex-1 p-6">
      <View className="flex flex-1 flex-col gap-6">
        <Text className="text-3xl" type={"title"}>
          Latest{" "}
          <Text type="title" className="text-3xl">
            Potential Health
          </Text>{" "}
          Updates
        </Text>
        <Text className="">Welcome back {session?.user.name}!</Text>
        <ScrollView>
          <View className="flex flex-col gap-8">
            {updates.length > 0 && updates[0] && (
              <View key={updates[0].version} className="flex flex-col gap-4">
                <Text className="font-bold">
                  Heres whats new in version {updates[0].version} 🚀
                </Text>
                {updates[0].changes?.map((change) => (
                  <Text key={change}>- {change}</Text>
                ))}
                {updates[0].bugs?.length && (
                  <Text className="font-bold">Bugs fixed:</Text>
                )}
                {updates[0].bugs?.map((bug) => <Text key={bug}>- {bug}</Text>)}
              </View>
            )}
            <View className="flex flex-col gap-2">
              {updates.length > 1 && <Text type="title">Previous updates</Text>}
              {updates.slice(1).map((update) => (
                <View key={update.version} className="flex flex-col gap-4">
                  <Text className="text-sm font-bold">
                    Version {update.version}
                  </Text>
                  {update.changes?.map((change) => (
                    <Text key={change} className="text-sm">
                      - {change}
                    </Text>
                  ))}
                  {update.bugs?.length && (
                    <Text className="font-bold">Bugs fixed:</Text>
                  )}
                  {update.bugs?.map((bug) => (
                    <Text key={bug} className="text-sm">
                      - {bug}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        <Button
          onPress={() =>
            mutateAsync({ version: updates[0]?.version ?? "0.0.1" })
          }
        >
          <Text>Continue</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
