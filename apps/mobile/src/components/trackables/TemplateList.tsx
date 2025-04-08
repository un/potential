import { Pressable, ScrollView, View } from "react-native";

import type { ConstsTypes } from "@1up/consts";
import { filterTemplatesByType } from "@1up/templates";

import { Text } from "~/components/ui/text";

export function TemplateList({
  typeFilter,
}: {
  typeFilter: ConstsTypes["TRACKABLE"]["TYPES"]["KEY"];
}) {
  const typeTemplates = filterTemplatesByType(typeFilter);
  return (
    <View className="flex-1">
      <ScrollView className="flex-1 px-4">
        <View className="gap-4 pb-4">
          {typeTemplates.map((template) => (
            <Pressable
              key={template.id}
              className="rounded-lg border border-gray-200 bg-white p-4"
              //   onPress={() => onSelectTemplate(template)}
            >
              {template.icon && (
                <View className="mb-2">
                  <Text>{template.icon}</Text>
                </View>
              )}
              <Text className="text-base font-medium">{template.name}</Text>
              {template.description && (
                <Text className="mt-1 text-sm text-gray-600">
                  {template.description}
                </Text>
              )}
              {template.recommended && (
                <View className="mt-2 self-start rounded-full bg-primary/10 px-2 py-1">
                  <Text className="text-xs text-primary">Recommended</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
