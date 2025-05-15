import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner-native";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { trpc } from "~/utils/api";

export default function Profile() {
  const router = useRouter();

  // Setup the mutation for creating logs
  const { mutateAsync } = useMutation(
    trpc.user.account.deleteAccount.mutationOptions({
      onSuccess: async () => {
        toast.success(`Account deleted successfully`);
        await SecureStore.deleteItemAsync("potential_cookie");
        await SecureStore.deleteItemAsync("potential_session_data");
        router.replace("/");
      },
      onError: (err) => {
        console.error("Mutation error:", err);
        toast.error(err.message || "Failed to Delete account, contact support");
      },
    }),
  );

  return (
    <SafeAreaView className="flex-1" edges={["bottom"]}>
      <ScrollView className="w-full flex-1 p-6">
        <View className="w-full flex-1 flex-col gap-4">
          <Text className="text-3xl" type={"title"}>
            Are you sure you want to delete your account?
          </Text>

          <View className="flex flex-col gap-2">
            <Text className="text-lg">
              This will permanently delete your whole account and all it's data.
              This will take effect immediately and is irreversible.
            </Text>
            <Text className="text-lg">
              If you're facing issues using the app, or have any feedback,
              please contact us at support@potentialhealth.io
            </Text>
          </View>

          <Button onPress={() => router.back()}>
            <Text>Cancel</Text>
          </Button>
          <Button
            variant={"destructive"}
            onPress={() => mutateAsync({ confirm: true })}
          >
            <Text>Confirm</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
