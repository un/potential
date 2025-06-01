import { useEffect, useState } from "react";
import { View } from "react-native";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
import { ArrowLeft } from "phosphor-react-native";

import type { ConstsTypes, TrackerCustomConfig } from "@potential/consts";
import type { BaseTemplate } from "@potential/templates";
import { filterTemplatesByType } from "@potential/templates";

import { Text } from "~/components/ui/text";
import { iconColor } from "~/utils/ui";
import { Button } from "../ui/button";
import { NewTracker } from "./new";

// Define the NewTrackerFormData type to match the one in new.tsx
interface NewTrackerFormData {
  name: string;
  description: string;
  type: ConstsTypes["TRACKER"]["TYPES"]["KEY"];
  subType: ConstsTypes["TRACKER"]["SUB_TYPES"]["KEY"];
  configType: ConstsTypes["TRACKER"]["CONFIG"]["TYPES"]["KEY"];
  config: TrackerCustomConfig; // Using the proper type from imports
}

export function TemplateList({
  typeFilter,
  onBack: _onBack, // Rename to _onBack to indicate it's not used
}: {
  typeFilter: ConstsTypes["TRACKER"]["TYPES"]["KEY"];
  onBack?: () => void;
}) {
  const [templates, setTemplates] = useState<BaseTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<BaseTemplate | null>(
    null,
  );
  const [showNewTracker, setShowNewTracker] = useState(false);

  useEffect(() => {
    const typeTemplates = filterTemplatesByType(typeFilter);
    setTemplates(typeTemplates);
  }, [typeFilter]);

  const onSelectTemplate = (template?: BaseTemplate) => {
    if (template) {
      setSelectedTemplate(template);
    } else {
      setSelectedTemplate(null);
    }
    setShowNewTracker(true);
  };

  const handleBack = () => {
    setShowNewTracker(false);
    setSelectedTemplate(null);
  };

  const handleSave = (data: NewTrackerFormData) => {
    setShowNewTracker(false);
    setSelectedTemplate(null);
    // Here you would handle the saved data
    console.log("Tracker saved:", data);
  };

  if (showNewTracker) {
    return (
      <Animated.View
        entering={SlideInRight}
        exiting={SlideOutRight}
        className="flex-1"
      >
        <View className="p-4">
          <Button
            variant="ghost"
            onPress={handleBack}
            className="mb-4 self-start"
          >
            <View className="flex flex-row items-center gap-2">
              <ArrowLeft size={20} color={iconColor()} />
              <Text>Back</Text>
            </View>
          </Button>
        </View>
        <NewTracker
          template={selectedTemplate ?? undefined}
          onSave={handleSave}
        />
      </Animated.View>
    );
  }

  return (
    <View className="flex flex-col gap-2">
      <Text type={"title"}>New Tracker</Text>
      <View className="flex flex-col gap-4">
        <Button
          variant={"outline"}
          className="flex w-full flex-col gap-2"
          onPress={() => onSelectTemplate()}
        >
          <View className="flex w-full flex-row items-center justify-between">
            <Text className="text-base font-medium" type={"title"}>
              Custom
            </Text>
          </View>

          <Text className="text-sand-11 w-full text-sm" type={"paragraph"}>
            Track something new and configure how you want to track it
          </Text>
        </Button>
        {templates.map((template) => {
          return (
            <Button
              variant={"outline"}
              key={template.id}
              onPress={() => onSelectTemplate(template)}
              className="flex w-full flex-row items-center justify-between"
            >
              <View className="flex w-full flex-row items-center justify-between">
                <Text className="text-base font-medium" type={"title"}>
                  {template.name}
                </Text>

                <View className="flex flex-row items-center justify-end gap-2">
                  {template.recommended && (
                    <View className="bg-amber-9 flex flex-row gap-2 rounded-full px-1.5 py-1">
                      <Text className="text-amber-1 text-xs">Recommended</Text>
                    </View>
                  )}
                </View>
              </View>
              {template.description && (
                <Text className="text-sand-11 text-sm">
                  {template.description}
                </Text>
              )}
            </Button>
          );
        })}
      </View>
    </View>
  );
}
