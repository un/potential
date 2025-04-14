import { useEffect, useState } from "react";
import { View } from "react-native";

import type { ConstsTypes } from "@1up/consts";
import type { BaseTemplate } from "@1up/templates";
import { filterTemplatesByType } from "@1up/templates";

import { Text } from "~/components/ui/text";
import { Button } from "../ui/button";

export function TemplateList({
  typeFilter,
}: {
  typeFilter: ConstsTypes["TRACKABLE"]["TYPES"]["KEY"];
}) {
  const [templates, setTemplates] = useState<BaseTemplate[]>([]);

  useEffect(() => {
    const typeTemplates = filterTemplatesByType(typeFilter);
    setTemplates(typeTemplates);
  }, [typeFilter]);

  return (
    <View className="flex flex-col gap-2">
      <Text type={"title"}>New Trackable</Text>
      <View className="flex flex-col gap-4">
        <Button
          variant={"outline"}
          className="flex w-full flex-col gap-2"

          //   onPress={() => onSelectTemplate(template)}
        >
          <View className="flex w-full flex-row items-center justify-between">
            <Text className="text-base font-medium" type={"title"}>
              Custom
            </Text>
            {/* 
            <View className="flex flex-row gap-2">
              <Gear size={16} />
            </View> */}
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
              //   onPress={() => onSelectTemplate(template)}
              className="flex w-full flex-row items-center justify-between"
            >
              <View className="flex w-full flex-row items-center justify-between">
                <Text className="text-base font-medium" type={"title"}>
                  {template.name}
                </Text>

                <View className="flex flex-row items-center justify-end gap-2">
                  {/* {template.featured && (
                    <View className="bg-tomato-9 flex flex-row gap-2 rounded-full px-1.5 py-1">
                      <Text className="text-tomato-1 text-xs">Featured</Text>
                    </View>
                  )} */}
                  {template.recommended && (
                    <View className="bg-amber-9 flex flex-row gap-2 rounded-full px-1.5 py-1">
                      <Text className="text-amber-1 text-xs">Recommended</Text>
                    </View>
                  )}
                  {/* {template.recommended && <ThumbsUp size={16} />} */}
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
