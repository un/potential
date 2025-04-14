import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function DashboardHome() {
  const router = useRouter();
  const [weight, setWeight] = useState(25);
  const [checked, setChecked] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedValue2, setSelectedValue2] = useState(0);
  const [sleepQuality, setSleepQuality] = useState(0);
  const [sleepDuration, setSleepDuration] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  // const queryClient = useQueryClient();

  // const postQuery = useQuery(trpc.hello.hello.queryOptions());

  return (
    <SafeAreaView className="flex-1" edges={["bottom"]}>
      <View className="flex h-full flex-1 flex-col gap-6 p-6">
        <View className="flex-1">
          <View className="flex flex-1 flex-col gap-6">
            <Text className="mb-4 text-3xl" type={"title"}>
              Dashboard
            </Text>
            {/* <NumberInput
              unit="kg"
              value={weight}
              onValueChange={setWeight}
              increments={[0.1, 1, 10]}
              decrements={[0.1, 1, 10]}
              minValue={10}
              maxValue={243}
            />
            <Checkbox checked={checked} onCheckedChange={setChecked} />

            <Slider
              value={selectedValue}
              onValueChange={setSelectedValue}
              rangeMin={0}
              rangeMax={10}
              rangeUnit="/10"
            />

            <Slider
              value={selectedValue2}
              onValueChange={setSelectedValue2}
              rangeMin={0}
              rangeMax={100}
              rangeUnit="%"
              rangeMinLabel="Minimum"
              rangeMaxLabel="Maximum"
              rangeStepLabels={[
                { 25: "Low" },
                { 50: "Medium" },
                { 75: "High" },
              ]}
            /> */}
            {/* <Rating
              ratingMax={5}
              ratingEmoji="😴"
              ratingUnit="Sleep Quality"
              value={sleepQuality}
              onValueChange={setSleepQuality}
            />
            <Rating
              ratingMax={5}
              ratingUnit="Sleep Duration"
              value={sleepDuration}
              onValueChange={setSleepDuration}
            />
            {/* <LongText label="Notes" /> */}

            {/* <Picker
              value={selectedLanguage}
              onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
              items={[
                { label: "Java", value: "java" },
                { label: "JavaScript", value: "js" },
                { label: "AI", value: "ai" },
                { label: "J2", value: "j2" },
                { label: "J4", value: "j4" },
              ]}
            /> */}
            {/* <Text className="mb-4">
              Welcome, {session?.user.name ?? "User"}!
            </Text>

            <View className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
              <Text>Your dashboard content goes here</Text>
            </View> */}
            {/* <NewTrackable /> */}
            {/* <Dropdown
              label="Select an option"
              options={[
                { label: "Option 1", value: "option1" },
                { label: "Option 2", value: "option2" },
              ]}
              value={selectedValue}
              onChange={setSelectedValue}
            /> */}
          </View>
        </View>
        <View>
          <Button
            onPress={() => router.push("/(home)/log")}
            className="flex flex-row gap-2"
          >
            <Text>Log</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
