import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { authClient } from "~/utils/auth-client";

export default function Updates() {
  const { data: session } = authClient.useSession();
  // const queryClient = useQueryClient();

  // const postQuery = useQuery(trpc.hello.hello.queryOptions());

  return (
    <SafeAreaView className="flex-1 p-6">
      <View className="flex flex-1 flex-col gap-6">
        <Text className="text-3xl" type={"title"}>
          Latest Updates
        </Text>
        <Text className="">Welcome back {session?.user.name}!</Text>
        <ScrollView>
          <View className="flex flex-col gap-8">
            <Text>
              Heres whats new in <Text type="title">1up</Text> version 0.0.3
            </Text>
            <Text>
              Heres whats new in <Text type="title">1up</Text> version 0.0.2
            </Text>
            <Text>
              Heres whats new in <Text type="title">1up</Text> version 0.0.1
            </Text>
          </View>
        </ScrollView>
        <Link href="/(home)" asChild>
          <Button>
            <Text>Continue</Text>
          </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
}
