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

import { TrackableLogStep } from "~/components/app/trackableLogStep";
import { Text } from "~/components/ui/text";
import { cn, iconColor } from "~/utils/ui";

// Button component for consistent styling and behavior
function LogButton({
  icon,
  label,
  onPress,
  soon = false,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  soon?: boolean;
}) {
  return (
    <Pressable
      className={cn(
        soon && "bg-sand-2 opacity-50",
        "bg-sand-3 flex h-28 w-[31%] flex-col items-center justify-center gap-4 rounded-md",
      )}
      onPress={onPress}
      android_ripple={{ color: "rgba(0, 0, 0, 0.1)" }}
      disabled={soon}
    >
      {icon}
      <Text className="text-sm">{label}</Text>
      {soon && <Text className="-mt-4 text-xs">Coming Soon</Text>}
    </Pressable>
  );
}

// Variant for the wider buttons
// function WideLogButton({
//   icon,
//   label,
//   onPress,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   onPress: () => void;
// }) {
//   return (
//     <Pressable
//       className="bg-sand-3 flex h-14 w-[48%] flex-row items-center justify-center gap-2 rounded-md"
//       onPress={onPress}
//       android_ripple={{ color: "rgba(0, 0, 0, 0.1)" }}
//     >
//       {icon}
//       <Text className="text-sm">{label}</Text>
//     </Pressable>
//   );
// }

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
        return (
          <TrackableLogStep
            onBack={handleBack}
            trackableParentType="consumption"
            trackableSubType="consumption.parent.food"
          />
        );
      case "activities":
        return (
          <TrackableLogStep
            onBack={handleBack}
            trackableParentType="activity"
            trackableSubType="custom.generic"
          />
        );
      case "energy":
        return (
          <TrackableLogStep
            onBack={handleBack}
            trackableParentType="energy"
            trackableSubType="energy.calories.net"
          />
        );
      case "sleep":
        return (
          <TrackableLogStep
            onBack={handleBack}
            trackableParentType="sleep"
            trackableSubType="custom.generic"
          />
        );
      case "supplements":
        return (
          <TrackableLogStep
            onBack={handleBack}
            trackableParentType="supplement"
            trackableSubType="supplement.generic"
          />
        );
      case "cycles":
        return (
          <TrackableLogStep
            onBack={handleBack}
            trackableParentType="body"
            trackableSubType="body.generic"
          />
        );
      case "mind":
        return (
          <TrackableLogStep
            onBack={handleBack}
            trackableParentType="mind"
            trackableSubType="custom.generic"
          />
        );
      case "symptoms":
        return (
          <TrackableLogStep
            onBack={handleBack}
            trackableParentType="symptom"
            trackableSubType="symptom.generic"
          />
        );
      case "blood":
        return (
          <TrackableLogStep
            onBack={handleBack}
            trackableParentType="blood"
            trackableSubType="blood.generic"
          />
        );
      case "body":
        return (
          <TrackableLogStep
            onBack={handleBack}
            trackableParentType="body"
            trackableSubType="body.generic"
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1" edges={{ bottom: "maximum" }}>
      <ScrollView className="flex-1 p-6">
        <View className="mb-12 flex w-full flex-col items-center justify-center gap-6">
          <View className="border-sand-3 flex w-full flex-col gap-4 border-b-2 pb-4">
            <Text type="title" className="-mb-2">
              Daily
            </Text>
            <View className="flex flex-row flex-wrap items-center justify-start gap-3 p-0">
              <LogButton
                icon={<ForkKnife size={24} weight="bold" color={iconColor()} />}
                label="Food/Drink"
                soon={true}
                onPress={() => setCurrentStep("food")}
              />
              <LogButton
                icon={
                  <PersonSimpleRun
                    size={24}
                    weight="bold"
                    color={iconColor()}
                  />
                }
                label="Activities"
                soon={true}
                onPress={() => setCurrentStep("activities")}
              />
              <LogButton
                icon={<Bed size={24} weight="bold" color={iconColor()} />}
                label="Sleep"
                soon={true}
                onPress={() => setCurrentStep("sleep")}
              />
              <LogButton
                icon={<Pill size={24} weight="bold" color={iconColor()} />}
                label="Supplements"
                soon={true}
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
                icon={<Brain size={24} weight="bold" color={iconColor()} />}
                label="Mind"
                onPress={() => setCurrentStep("mind")}
              />
              <LogButton
                icon={<Lightning size={24} weight="bold" color={iconColor()} />}
                label="Energy"
                soon={true}
                onPress={() => setCurrentStep("energy")}
              />
              <LogButton
                icon={
                  <ArrowsClockwise
                    size={24}
                    weight="bold"
                    color={iconColor()}
                  />
                }
                label="Cycles"
                soon={true}
                onPress={() => setCurrentStep("cycles")}
              />
            </View>

            <Text type="title" className="-mb-4">
              Medical
            </Text>
            <View className="flex w-full flex-row items-center justify-between gap-2">
              <LogButton
                icon={
                  <PersonArmsSpread
                    size={24}
                    weight="bold"
                    color={iconColor()}
                  />
                }
                label="Body"
                onPress={() => setCurrentStep("body")}
              />
              <LogButton
                icon={<Virus size={24} weight="bold" color={iconColor()} />}
                label="Symptoms"
                soon={true}
                onPress={() => setCurrentStep("symptoms")}
              />
              <LogButton
                icon={<Drop size={24} weight="bold" color={iconColor()} />}
                label="Blood"
                soon={true}
                onPress={() => setCurrentStep("blood")}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      {renderStep()}
    </SafeAreaView>
  );
}
