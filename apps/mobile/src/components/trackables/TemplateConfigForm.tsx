import { View } from "react-native";

import type { BaseTemplate, TrackableConfigWithMeta } from "@potential/templates";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";

interface TemplateConfigFormProps {
  template: BaseTemplate;
  onSubmit: (data: {
    name: string;
    description?: string;
    customConfig: TrackableConfigWithMeta;
  }) => void;
  onCancel: () => void;
}

export function TemplateConfigForm({
  template,
  onSubmit,
  onCancel,
}: TemplateConfigFormProps) {
  return (
    <View className="flex-1 p-4">
      <Text className="mb-4 text-xl font-semibold">
        Configure {template.name}
      </Text>

      <View className="gap-4">
        <View>
          <Text className="mb-1 text-sm text-gray-600">Name</Text>
          <Input
            placeholder="Enter name"
            defaultValue={template.name}
            className="rounded-lg border border-gray-200 p-2"
          />
        </View>

        <View>
          <Text className="mb-1 text-sm text-gray-600">Description</Text>
          <Input
            placeholder="Enter description"
            defaultValue={template.description}
            className="rounded-lg border border-gray-200 p-2"
            multiline
          />
        </View>

        {/* Render different config inputs based on template.defaultConfig.type */}
        <ConfigInputs
          config={template.defaultConfig}
          onChange={handleConfigChange}
        />

        <View className="mt-4 flex-row gap-4">
          <Button variant="secondary" onPress={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onPress={handleSubmit} className="flex-1">
            Create
          </Button>
        </View>
      </View>
    </View>
  );
}
