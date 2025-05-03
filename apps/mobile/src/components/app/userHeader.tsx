import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";

// import { Bug, Fire, Gear, Star } from "@potential/phosphor-react-native";

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
          {/* <Gear size={24} /> */}
          <Text>CA</Text>
        </Link>
      </View>

      <Link href="/(home)/stats">
        <View className="flex flex-row items-center justify-end gap-4">
          <View className="flex flex-row items-center justify-end gap-1">
            <Text className="" type="title">
              {profileData?.xpTotal.toString().split(".")[0]}
            </Text>
            {/* <Star size={18} /> */}
            <Text>CA</Text>
          </View>
          <View className="flex flex-row items-center justify-end gap-1">
            <Text className="" type="title">
              {profileData?.streakCurrentDays}
            </Text>
            {/* <Fire size={18} /> */}
            <Text>CA</Text>
          </View>
          <View className="flex flex-row items-center justify-end gap-1">
            {/* <Bug size={18} /> */}
            <Text>CA</Text>
          </View>
        </View>
      </Link>
    </SafeAreaView>
  );
}
