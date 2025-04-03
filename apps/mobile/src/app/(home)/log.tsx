import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowsClockwise,
  Bed,
  Brain,
  Drop,
  ForkKnife,
  Lightning,
  PersonArmsSpread,
  PersonSimpleRun,
  Pill,
  Virus,
} from "phosphor-react-native";

import { Text } from "~/components/ui/text";
import { FoodDrinkStep } from "./logSteps/fooddrink";
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
  | "food"
  | "activities"
  | "sleep"
  | "supplements"
  | "energy"
  | "mind"
  | "cycles"
  | "symptoms"
  | "blood"
  | "body";

export default function Logger() {
  // State to track which step we're on
  const [currentStep, setCurrentStep] = useState<StepType>(null);

  // Handler to go back to main screen
  const handleBack = () => setCurrentStep(null);

  // Render the current step component
  const renderStep = () => {
    switch (currentStep) {
      case "food":
        return <FoodDrinkStep onBack={handleBack} />;
      case "activities":
        return <ActivitiesStep onBack={handleBack} />;
      case "energy":
        return <EnergyStep onBack={handleBack} />;
      case "sleep":
        return <SleepStep onBack={handleBack} />;
      case "supplements":
        return <SupplementsStep onBack={handleBack} />;
      case "cycles":
        return <CyclesStep onBack={handleBack} />;
      case "mind":
        return <MindStep onBack={handleBack} />;
      case "symptoms":
        return <SymptomsStep onBack={handleBack} />;
      case "blood":
        return <BloodStep onBack={handleBack} />;
      case "body":
        return <BodyStep onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1" edges={["bottom"]}>
      <ScrollView>
        <View className="flex w-full flex-col items-center justify-center gap-6 p-6">
          <View className="border-sand-3 flex w-full flex-col gap-4 border-b-2 pb-4">
            <Text type="title" className="-mb-2">
              Daily
            </Text>
            <View className="flex flex-row flex-wrap items-center justify-start gap-3 p-0">
              <LogButton
                icon={<ForkKnife size={24} weight="bold" />}
                label="Food/Drink"
                onPress={() => setCurrentStep("food")}
              />
              <LogButton
                icon={<PersonSimpleRun size={24} weight="bold" />}
                label="Activities"
                onPress={() => setCurrentStep("activities")}
              />
              <LogButton
                icon={<Bed size={24} weight="bold" />}
                label="Sleep"
                onPress={() => setCurrentStep("sleep")}
              />
              <LogButton
                icon={<Pill size={24} weight="bold" />}
                label="Supplements"
                onPress={() => setCurrentStep("supplements")}
              />
            </View>
          </View>
          <View className="border-sand-3 flex flex-col gap-6 border-b-2 pb-4">
            <Text type="title" className="-mb-4">
              Journal
            </Text>
            <View className="flex w-full flex-row items-center justify-between gap-2">
              <LogButton
                icon={<Lightning size={24} weight="bold" />}
                label="Energy"
                onPress={() => setCurrentStep("energy")}
              />
              <LogButton
                icon={<Brain size={24} weight="bold" />}
                label="Mind"
                onPress={() => setCurrentStep("mind")}
              />
              <LogButton
                icon={<ArrowsClockwise size={24} weight="bold" />}
                label="Cycles"
                onPress={() => setCurrentStep("cycles")}
              />
            </View>

            <Text type="title" className="-mb-4">
              Medical
            </Text>
            <View className="flex w-full flex-row items-center justify-between gap-2">
              <LogButton
                icon={<Virus size={24} weight="bold" />}
                label="Symptoms"
                onPress={() => setCurrentStep("symptoms")}
              />
              <LogButton
                icon={<Drop size={24} weight="bold" />}
                label="Blood"
                onPress={() => setCurrentStep("blood")}
              />
              <LogButton
                icon={<PersonArmsSpread size={24} weight="bold" />}
                label="Body"
                onPress={() => setCurrentStep("body")}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      {renderStep()}
    </SafeAreaView>
  );
}
