import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowsClockwise,
  Barcode,
  Bed,
  Brain,
  Camera,
  Drop,
  Lightning,
  MagnifyingGlass,
  Microphone,
  PersonArmsSpread,
  PersonSimpleRun,
  Pill,
  TextAa,
  Virus,
} from "phosphor-react-native";

import { Text } from "~/components/ui/text";

export default function Logger() {
  return (
    <SafeAreaView className="flex-1" edges={["bottom"]}>
      <ScrollView>
        <View className="flex w-full flex-col gap-6 p-6">
          <View className="border-sand-3 flex flex-col gap-4 border-b-2 pb-4">
            <Text type="title" className="-mb-2">
              Food and Drink
            </Text>
            <View className="flex w-full flex-row items-center justify-between gap-2">
              <View className="bg-sand-3 flex h-28 w-[31%] flex-col items-center justify-center gap-4 rounded-md">
                <Camera size={24} weight="bold" />
                <Text className="text-sm">Photo</Text>
              </View>
              <View className="bg-sand-3 flex h-28 w-[31%] flex-col items-center justify-center gap-4 rounded-md">
                <Microphone size={24} weight="bold" />
                <Text className="text-sm">Audio</Text>
              </View>
              <View className="bg-sand-3 flex h-28 w-[31%] flex-col items-center justify-center gap-4 rounded-md">
                <TextAa size={24} weight="bold" />
                <Text className="text-sm">Text</Text>
              </View>
            </View>
            <View className="flex w-full flex-row items-center justify-between gap-2">
              <View className="bg-sand-3 flex h-14 w-[48%] flex-row items-center justify-center gap-2 rounded-md">
                <Barcode size={24} weight="bold" />
                <Text className="text-sm">Scan</Text>
              </View>
              <View className="bg-sand-3 flex h-14 w-[48%] flex-row items-center justify-center gap-2 rounded-md">
                <MagnifyingGlass size={24} weight="bold" />
                <Text className="text-sm">Search</Text>
              </View>
            </View>
          </View>

          {/* <View className="border-sand-3 flex flex-col gap-6 border-b-2 pb-4">
            
            <View className="flex w-full flex-row items-center justify-between gap-2">
              <View className="bg-sand-3 flex h-28 w-[31%] flex-col items-center justify-center gap-2 rounded-md">
                <PersonSimpleRun size={24} weight="bold" />
                <Text className="text-sm">Activities</Text>
              </View>
              <View className="bg-sand-3 flex h-28 w-[31%] flex-col items-center justify-center gap-2 rounded-md">
                <Brain size={24} weight="bold" />
                <Text className="text-sm">Mind</Text>
              </View>
              <View className="bg-sand-3 flex h-28 w-[31%] flex-col items-center justify-center gap-2 rounded-md">
                <Bed size={24} weight="bold" />
                <Text className="text-sm">Sleep</Text>
              </View>
            </View>
            <View className="flex w-full flex-row items-center justify-between gap-2">
              <View className="bg-sand-3 flex h-14 w-[48%] flex-row items-center justify-center gap-2 rounded-md">
                <Pill size={24} weight="bold" />
                <Text className="text-sm">Supplements</Text>
              </View>
              <View className="bg-sand-3 flex h-14 w-[48%] flex-row items-center justify-center gap-2 rounded-md">
                <Virus size={24} weight="bold" />
                <Text className="text-sm">Symptoms</Text>
              </View>
            </View>
            <View className="flex w-full flex-row items-center justify-between gap-2">
              <View className="bg-sand-3 flex h-14 w-[48%] flex-row items-center justify-center gap-2 rounded-md">
                <ArrowsClockwise size={24} weight="bold" />
                <Text className="text-sm">Cycles</Text>
              </View>
              <View className="bg-sand-3 flex h-14 w-[48%] flex-row items-center justify-center gap-2 rounded-md">
                <Lightning size={24} weight="bold" />
                <Text className="text-sm">Energy</Text>
              </View>
            </View>
            <View className="flex w-full flex-row items-center justify-between gap-2">
              <View className="bg-sand-3 flex h-14 w-[48%] flex-row items-center justify-center gap-2 rounded-md">
                <Drop size={24} weight="bold" />
                <Text className="text-sm">Blood</Text>
              </View>
              <View className="bg-sand-3 flex h-14 w-[48%] flex-row items-center justify-center gap-2 rounded-md">
                <PersonArmsSpread size={24} weight="bold" />
                <Text className="text-sm">Body</Text>
              </View>
            </View>
          </View> */}
          <View className="border-sand-3 flex flex-col gap-6 border-b-2 pb-4">
            <Text type="title" className="-mb-4">
              Physical
            </Text>
            <View className="flex w-full flex-row items-center justify-between gap-2">
              <View className="bg-sand-3 flex h-28 w-[31%] flex-col items-center justify-center gap-4 rounded-md">
                <PersonSimpleRun size={24} weight="bold" />
                <Text className="text-sm">Activities</Text>
              </View>
              <View className="bg-sand-3 flex h-28 w-[31%] flex-col items-center justify-center gap-4 rounded-md">
                <Lightning size={24} weight="bold" />
                <Text className="text-sm">Energy</Text>
              </View>
              <View className="bg-sand-3 flex h-28 w-[31%] flex-col items-center justify-center gap-4 rounded-md">
                <Bed size={24} weight="bold" />
                <Text className="text-sm">Sleep</Text>
              </View>
            </View>
            <Text type="title" className="-mb-4">
              Prevention & Monitoring
            </Text>
            <View className="flex w-full flex-row items-center justify-between gap-2">
              <View className="bg-sand-3 flex h-28 w-[31%] flex-col items-center justify-center gap-4 rounded-md">
                <Pill size={24} weight="bold" />
                <Text className="text-sm">Supplements</Text>
              </View>
              <View className="bg-sand-3 flex h-28 w-[31%] flex-col items-center justify-center gap-4 rounded-md">
                <ArrowsClockwise size={24} weight="bold" />
                <Text className="text-sm">Cycles</Text>
              </View>
              <View className="bg-sand-3 flex h-28 w-[31%] flex-col items-center justify-center gap-4 rounded-md">
                <Brain size={24} weight="bold" />
                <Text className="text-sm">Mind</Text>
              </View>
            </View>
            <Text type="title" className="-mb-4">
              Medical
            </Text>
            <View className="flex w-full flex-row items-center justify-between gap-2">
              <View className="bg-sand-3 flex h-28 w-[31%] flex-col items-center justify-center gap-4 rounded-md">
                <Virus size={24} weight="bold" />
                <Text className="text-sm">Symptoms</Text>
              </View>
              <View className="bg-sand-3 flex h-28 w-[31%] flex-col items-center justify-center gap-4 rounded-md">
                <Drop size={24} weight="bold" />
                <Text className="text-sm">Blood</Text>
              </View>

              <View className="bg-sand-3 flex h-28 w-[31%] flex-col items-center justify-center gap-4 rounded-md">
                <PersonArmsSpread size={24} weight="bold" />
                <Text className="text-sm">Body</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
