import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Fire, Star } from "phosphor-react-native";

import { trpc } from "~/utils/api";
import { Text } from "../ui/text";

export default function UserHeader() {
  // get user profile
  const { data: profileData } = useQuery(
    trpc.user.profile.getUserProfileOverview.queryOptions(),
  );
  return (
    <SafeAreaView
      className="bg-sand-3 flex flex-row items-center justify-between px-6 py-0 pb-6 shadow-sm"
      edges={["top"]}
    >
      <View className="">
        <Link href="/(home)/profile">
          <Text className="" type="title">
            one
          </Text>
        </Link>
      </View>

      <Link href="/(home)/stats">
        <View className="flex flex-row items-center justify-end gap-4">
          <View className="flex flex-row items-center justify-end gap-1">
            <Text className="" type="title">
              {profileData?.xpTotal}
            </Text>
            <Star size={18} />
          </View>
          <View className="flex flex-row items-center justify-end gap-1">
            <Text className="" type="title">
              {profileData?.streakCurrentDays}
            </Text>
            <Fire size={18} />
          </View>
        </View>
      </Link>
    </SafeAreaView>
  );
}
