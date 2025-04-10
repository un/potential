// apps/mobile/src/app/trackables/new.tsx
import React from "react";
import { Picker, View } from "react-native";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import type { TrackableCustomConfig } from "@1up/consts";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { api } from "~/utils/api";
import { ConfigInputs } from "./inputs/ConfigInputs";

// Define the trackable types based on the union type
const trackableTypes = [
  "measure",
  "checkbox",
  "range",
  "rating",
  "shortText",
  "longText",
] as const;

// Base form schema for the first section
const baseFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: z.enum(trackableTypes),
});

type BaseFormType = z.infer<typeof baseFormSchema>;

export default function NewTrackableScreen() {
  const createTrackable = api.trackables.createFromTemplate.useMutation();

  const form = useForm<BaseFormType>({
    defaultValues: {
      name: "",
      description: "",
      type: "measure",
    },
    validators: {
      onChange: baseFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createTrackable.mutateAsync({
          ...value,
          customConfig: getConfigForType(value.type),
        });
        // TODO: Show success toast and navigate back
      } catch (err) {
        // TODO: Show error toast
        console.error("Error creating trackable:", err);
      }
    },
  });

  // Helper function to get the initial config based on type
  const getConfigForType = (
    type: (typeof trackableTypes)[number],
  ): TrackableCustomConfig => {
    switch (type) {
      case "measure":
        return {
          type: "measure",
          measureUnitType: "mass",
          measureUnitSource: "kg",
          measureUnitDisplay: "kg",
          measureTarget: null,
          cumulative: false,
          limitOnePerDay: false,
        };
      case "checkbox":
        return {
          type: "checkbox",
          checkboxName: "",
        };
      case "range":
        return {
          type: "range",
          rangeMin: 0,
          rangeMax: 10,
          rangeStepLabels: [],
        };
      case "rating":
        return {
          type: "rating",
          ratingMax: 5,
        };
      case "shortText":
        return {
          type: "shortText",
          maxLength: 100,
        };
      case "longText":
        return {
          type: "longText",
          maxLength: 1000,
        };
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="mb-6 text-xl font-semibold">New Trackable</Text>

      {/* First Section - Fixed Fields */}
      <View className="mb-6 gap-4">
        <form.Field
          name="name"
          children={(field) => (
            <View>
              <Text className="mb-1 text-sm text-gray-600">Name</Text>
              <Input
                placeholder="Enter trackable name"
                onChangeText={field.handleChange}
                value={field.state.value}
              />
              {field.state.meta.errors.length > 0 && (
                <Text className="mt-1 text-sm text-red-500">
                  {field.state.meta.errors[0]}
                </Text>
              )}
            </View>
          )}
        />

        <form.Field
          name="description"
          children={(field) => (
            <View>
              <Text className="mb-1 text-sm text-gray-600">
                Description (Optional)
              </Text>
              <Input
                placeholder="Enter description"
                onChangeText={field.handleChange}
                value={field.state.value}
                multiline
              />
            </View>
          )}
        />

        <form.Field
          name="type"
          children={(field) => (
            <View>
              <Text className="mb-1 text-sm text-gray-600">Type</Text>
              <View className="border-sand-7 bg-sand-1 rounded-md border">
                <Picker
                  selectedValue={field.state.value}
                  onValueChange={field.handleChange}
                >
                  {trackableTypes.map((type) => (
                    <Picker.Item
                      key={type}
                      label={type.charAt(0).toUpperCase() + type.slice(1)}
                      value={type}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
        />
      </View>

      {/* Second Section - Dynamic Config Fields */}
      <View className="mb-6">
        <Text className="mb-4 text-lg font-semibold">Configuration</Text>
        <form.Subscribe
          selector={(state) => state.values.type}
          children={(type) => (
            <ConfigInputs
              config={getConfigForType(type)}
              onChange={(newConfig) => {
                // Handle config changes
                console.log("Config updated:", newConfig);
              }}
            />
          )}
        />
      </View>

      <View className="mt-auto flex-row gap-4">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              onPress={() => form.handleSubmit()}
              loading={createTrackable.isLoading || isSubmitting}
              disabled={!canSubmit}
              className="flex-1"
            >
              Create Trackable
            </Button>
          )}
        />
      </View>
    </View>
  );
}
