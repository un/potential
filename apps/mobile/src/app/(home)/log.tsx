import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowCounterClockwise,
  ArrowsClockwise,
  Barcode,
  Bed,
  Brain,
  Camera,
  Drop,
  Lightning,
  Microphone,
  PersonArmsSpread,
  PersonSimpleRun,
  Pill,
  TextAa,
  Virus,
} from "phosphor-react-native";

import { Text } from "~/components/ui/text";
import {
  AudioStep,
  PhotoStep,
  ScanStep,
  SearchStep,
  TextStep,
} from "./logSteps/fooddrink";
import { BloodStep, BodyStep, SymptomsStep } from "./logSteps/medical";
import { ActivitiesStep, EnergyStep, SleepStep } from "./logSteps/physical";
import { CyclesStep, MindStep, SupplementsStep } from "./logSteps/prevention";

// Button component for consistent styling and behavior
function LogButton({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      className="bg-sand-3 flex h-28 w-[31%] flex-col items-center justify-center gap-4 rounded-md"
      onPress={onPress}
      android_ripple={{ color: "rgba(0, 0, 0, 0.1)" }}
    >
      {icon}
      <Text className="text-sm">{label}</Text>
    </Pressable>
  );
}

// Variant for the wider buttons
function WideLogButton({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      className="bg-sand-3 flex h-14 w-[48%] flex-row items-center justify-center gap-2 rounded-md"
      onPress={onPress}
      android_ripple={{ color: "rgba(0, 0, 0, 0.1)" }}
    >
      {icon}
      <Text className="text-sm">{label}</Text>
    </Pressable>
  );
}

// Define step types for our state management
type StepType =
  | null
  | "food:photo"
  | "food:audio"
  | "food:text"
  | "food:scan"
  | "food:search"
  | "physical:activities"
  | "physical:energy"
  | "physical:sleep"
  | "prevention:supplements"
  | "prevention:cycles"
  | "prevention:mind"
  | "medical:symptoms"
  | "medical:blood"
  | "medical:body";

export default function Logger() {
  // State to track which step we're on
  const [currentStep, setCurrentStep] = useState<StepType>(null);

  // Handler to go back to main screen
  const handleBack = () => setCurrentStep(null);

  // Render the current step component
  const renderStep = () => {
    switch (currentStep) {
      case "food:photo":
        return <PhotoStep onBack={handleBack} />;
      case "food:audio":
        return <AudioStep onBack={handleBack} />;
      case "food:text":
        return <TextStep onBack={handleBack} />;
      case "food:scan":
        return <ScanStep onBack={handleBack} />;
      case "food:search":
        return <SearchStep onBack={handleBack} />;
      case "physical:activities":
        return <ActivitiesStep onBack={handleBack} />;
      case "physical:energy":
        return <EnergyStep onBack={handleBack} />;
      case "physical:sleep":
        return <SleepStep onBack={handleBack} />;
      case "prevention:supplements":
        return <SupplementsStep onBack={handleBack} />;
      case "prevention:cycles":
        return <CyclesStep onBack={handleBack} />;
      case "prevention:mind":
        return <MindStep onBack={handleBack} />;
      case "medical:symptoms":
        return <SymptomsStep onBack={handleBack} />;
      case "medical:blood":
        return <BloodStep onBack={handleBack} />;
      case "medical:body":
        return <BodyStep onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1" edges={["bottom"]}>
      <ScrollView>
        <View className="flex w-full flex-col gap-6 p-6">
          <View className="border-sand-3 flex flex-col gap-4 border-b-2 pb-4">
            <Text type="title" className="-mb-2">
              Food and Drink
            </Text>
            <View className="flex w-full flex-row items-center justify-between gap-2">
              <LogButton
                icon={<Camera size={24} weight="bold" />}
                label="Photo"
                onPress={() => setCurrentStep("food:photo")}
              />
              <LogButton
                icon={<Microphone size={24} weight="bold" />}
                label="Audio"
                onPress={() => setCurrentStep("food:audio")}
              />
              <LogButton
                icon={<TextAa size={24} weight="bold" />}
                label="Text"
                onPress={() => setCurrentStep("food:text")}
              />
            </View>
            <View className="flex w-full flex-row items-center justify-between gap-2">
              <WideLogButton
                icon={<Barcode size={24} weight="bold" />}
                label="Scan"
                onPress={() => setCurrentStep("food:scan")}
              />
              <WideLogButton
                icon={<ArrowCounterClockwise size={24} weight="bold" />}
                label="Recent"
                onPress={() => setCurrentStep("food:search")}
              />
            </View>
          </View>
          <View className="border-sand-3 flex flex-col gap-6 border-b-2 pb-4">
            <Text type="title" className="-mb-4">
              Physical
            </Text>
            <View className="flex w-full flex-row items-center justify-between gap-2">
              <LogButton
                icon={<PersonSimpleRun size={24} weight="bold" />}
                label="Activities"
                onPress={() => setCurrentStep("physical:activities")}
              />
              <LogButton
                icon={<Lightning size={24} weight="bold" />}
                label="Energy"
                onPress={() => setCurrentStep("physical:energy")}
              />
              <LogButton
                icon={<Bed size={24} weight="bold" />}
                label="Sleep"
                onPress={() => setCurrentStep("physical:sleep")}
              />
            </View>
            <Text type="title" className="-mb-4">
              Prevention & Monitoring
            </Text>
            <View className="flex w-full flex-row items-center justify-between gap-2">
              <LogButton
                icon={<Pill size={24} weight="bold" />}
                label="Supplements"
                onPress={() => setCurrentStep("prevention:supplements")}
              />
              <LogButton
                icon={<ArrowsClockwise size={24} weight="bold" />}
                label="Cycles"
                onPress={() => setCurrentStep("prevention:cycles")}
              />
              <LogButton
                icon={<Brain size={24} weight="bold" />}
                label="Mind"
                onPress={() => setCurrentStep("prevention:mind")}
              />
            </View>
            <Text type="title" className="-mb-4">
              Medical
            </Text>
            <View className="flex w-full flex-row items-center justify-between gap-2">
              <LogButton
                icon={<Virus size={24} weight="bold" />}
                label="Symptoms"
                onPress={() => setCurrentStep("medical:symptoms")}
              />
              <LogButton
                icon={<Drop size={24} weight="bold" />}
                label="Blood"
                onPress={() => setCurrentStep("medical:blood")}
              />
              <LogButton
                icon={<PersonArmsSpread size={24} weight="bold" />}
                label="Body"
                onPress={() => setCurrentStep("medical:body")}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Render the current step as an overlay */}
      {renderStep()}
    </SafeAreaView>
  );
}
