import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { PaperPlane } from "phosphor-react-native";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { cn, iconColor } from "~/utils/ui";

export default function NewExperiment() {
  return (
    <SafeAreaView className="flex-1" edges={["bottom"]}>
      <View className="w-full flex-1 flex-col gap-4 p-6">
        <ScrollView className="w-full grow">
          <View className="flex w-full flex-1 grow flex-col items-center gap-6">
            <BubbleHuman text="I've got chronic dry skin on my face, the dermatologist suggested some anti-fungal cream but it didnt work. This is the third dermatologist I've seen and I'm still not better. Heres a picture of my skin" />
            <ImageUpload />
            <NoteAi marginTop text="Analyzing images" />
            <NoteAi text="Pulling data from Apple Health and Whoop" />
            <BubbleAi text="Did your dermatologist do a skin scraping?" />
            <BubbleHuman text="No, none of them did." />
            <BubbleAi text="Have you noticed times when it's worse?" />
            <BubbleHuman text="Yes, it's worse when I eat out" />
            <NoteAi marginTop text="Analyzing diet ingredients" />
            <BubbleAi text="Does it appear on other parts of your body?" />
            <BubbleHuman text="Yes, it's can also be on my arm and lower legs." />
            <NoteAi text="Checking medical journal articles" />
            <BubbleAi text="Based on your previous tests, health data and diet ingredients, I suspect this is an autoimmune reaction to something you're eating" />
            <BubbleAi text="We can confirm this by doing some elimination diet experiments" />
            <BubbleAi text="Each one will target different food groups, and we'll see which one works best for you" />
            <NoteAi text="Generating new experiments" />
            <NewExperiments
              experiments={[
                "Extreme: Carnivore diet",
                "Moderate: Gluten and dairy free diet",
                "Moderate: Mediterranean diet",
              ]}
            />
            <BubbleAi text="Each one will run for 2 weeks, then we'll pick the best one for long term" />
            <BubbleAi text="Do you want to know more about any of these, or should I create the plan?" />
          </View>
          {/* <View className="flex w-full flex-1 grow flex-col items-center gap-4">
            <BubbleHuman text="I want to improve my VO2 max" />
            <BubbleAi text="Thats a great goal, let me gather some data" />
            <NoteAi text="Pulling data from Apple Health and Whoop" />
            <NoteAi text="Evaluating your currently health metrics" />
            <NoteAi text="Generating a plan" />
            <BubbleAi text="Based on all your health data, theres room for improvement" />
            <BubbleAi text="Here's the experiments to work out which is most effective for you" />
            <NewExperiments
              experiments={[
                "Norwegian 4x4 method",
                "4x Zone 2 + 1x Zone 5 interval training",
                "Daily 20 minute high intensity interval training",
              ]}
            />
            <BubbleAi text="Each experiment will run for 2 weeks, then we'll pick the best one for long term" />
            <BubbleAi text="Do you want to know more about any of these, or should I create the plan?" />
            <BubbleHuman text="Isn't the Norwegian 4x4 method for athletes who are already in shape" />
            <BubbleAi text="Correct, most studies were done on athletes who were already in shape, but it can also be beneficial for people who are already regularly working out as it can fit into normal training routines." />
          </View> */}
        </ScrollView>
        <View className="flex h-fit w-full flex-col items-center gap-2">
          <View className="flex h-fit w-full flex-row items-center gap-2">
            <Input placeholder="" value={""} onChangeText={() => null} />
            <Button className="h-fit" variant={"secondary"}>
              <PaperPlane size={24} color={iconColor({ lightColor: true })} />
            </Button>
          </View>
          <Button className="h-fit w-full">
            <Text>🔥 Start Experiments</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

function BubbleHuman({ text }: { text: string }) {
  return (
    <View className="flex flex-row items-center gap-2">
      <View className="flex-1" />
      <View className="bg-sand-3 ml-10 flex flex-row items-center gap-2 rounded-lg rounded-br-none px-3 py-2">
        <Text className="text-sm">{text}</Text>
      </View>
    </View>
  );
}
function BubbleAi({ text }: { text: string }) {
  return (
    <View className="flex w-full flex-row items-center gap-2">
      <View className="mr-10 rounded-lg rounded-bl-none">
        <Text className="text-sm">{text}</Text>
      </View>
      <View className="bg-red-5 min-w-10 flex-1" />
    </View>
  );
}
function NoteAi({ text, marginTop }: { text: string; marginTop?: boolean }) {
  return (
    <View
      className={cn(
        "flex flex-row items-center gap-2",
        marginTop ? "mt-0" : "-mt-4",
      )}
    >
      <Text className="text-sand-11 text-xs">{text}</Text>

      <View className="flex-1" />
    </View>
  );
}

function NewExperiments({ experiments }: { experiments: string[] }) {
  return (
    <View className="flex w-full flex-col gap-2">
      <Text className="text-sand-11 text-sm">New Experiment Plan</Text>

      <View className="flex flex-col gap-2">
        {experiments.map((experiment, index) => (
          <View className="flex flex-row gap-1" key={index}>
            <Text className="text-sand-11 text-xs">{index + 1}.</Text>
            <Text className="text-sand-11 text-xs">{experiment}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
function ImageUpload() {
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
  return (
    <View className="flex h-40 w-full flex-1 flex-row justify-end gap-4">
      <Image
        source="https://mcadam.io/omar_skin_2.jpeg"
        placeholder={{ blurhash }}
        contentFit="cover"
        style={styles.image}
        transition={1000}
      />
      <Image
        source="https://mcadam.io/omar_skin.jpeg"
        placeholder={{ blurhash }}
        contentFit="cover"
        style={styles.image}
        transition={1000}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    height: "100%",
    width: "30%",
    borderRadius: 10,
  },
});
