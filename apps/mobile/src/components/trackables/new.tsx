// apps/mobile/src/app/trackables/new.tsx
import { useState } from "react";
import { View } from "react-native";

import type { BaseTemplate } from "@1up/templates";

import { TemplateConfigForm } from "~/components/trackables/TemplateConfigForm";
import { TemplateList } from "~/components/trackables/TemplateList";
import { api } from "~/utils/api";

export default function NewTrackableScreen() {
  const [selectedTemplate, setSelectedTemplate] = useState<BaseTemplate>();
  const createTrackable = api.trackables.createFromTemplate.useMutation();

  const handleSubmit = async (data: {
    name: string;
    description?: string;
    customConfig: TrackableConfigWithMeta;
  }) => {
    await createTrackable.mutateAsync({
      templateId: selectedTemplate!.id,
      ...data,
    });
    // Navigate back or show success
  };

  return (
    <View className="flex-1 bg-white">
      {!selectedTemplate ? (
        <TemplateList onSelectTemplate={setSelectedTemplate} />
      ) : (
        <TemplateConfigForm
          template={selectedTemplate}
          onSubmit={handleSubmit}
          onCancel={() => setSelectedTemplate(undefined)}
        />
      )}
    </View>
  );
}
