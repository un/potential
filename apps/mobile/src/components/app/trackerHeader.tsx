import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text } from "../ui/text";

export default function TrackerHeader({
  props,
}: {
  props: NativeStackHeaderProps;
}) {
  return (
    <SafeAreaView
      className="bg-sand-3 flex flex-row items-center justify-between px-3 py-0 pb-1 shadow-sm"
      edges={["top"]}
    >
      {props.options.headerLeft ? (
        <View className="">{props.options.headerLeft({})}</View>
      ) : (
        <EmptyButton />
      )}

      <View className="grow items-center justify-center">
        {props.options.title && (
          <Text className="text-xl" type={"title"}>
            {props.options.title}
          </Text>
        )}
      </View>
      {props.options.headerRight ? (
        <View className="">{props.options.headerRight({})}</View>
      ) : (
        <EmptyButton />
      )}
    </SafeAreaView>
  );
}

function EmptyButton() {
  return <View className="h-12 w-12"></View>;
}
