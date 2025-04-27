import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useLocales } from "expo-localization";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { Plus } from "phosphor-react-native";

import type { ConstsTypes, TrackableCustomConfig } from "@potential/consts";
import type { BaseTemplate } from "@potential/templates";
import { CONSTS } from "@potential/consts";

import type { PickerOption } from "~/components/ui/picker";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { LongText } from "~/components/ui/long-text";
import { NumberInput } from "~/components/ui/number-input";
import { Rating } from "~/components/ui/rating";
import { Slider } from "~/components/ui/slider";
import { Text } from "~/components/ui/text";
import { queryClient, trpc } from "~/utils/api";
import { Dropdown } from "../ui/dropdown";

type TrackableTypesKey = ConstsTypes["TRACKABLE"]["TYPES"]["KEY"];
type TrackableSubTypesKey = ConstsTypes["TRACKABLE"]["SUB_TYPES"]["KEY"];
type TrackableConfigTypesKey =
  ConstsTypes["TRACKABLE"]["CONFIG"]["TYPES"]["KEY"];

// Define the steps for the wizard
enum Step {
  TEMPLATE_CHOICE = -1,
  NAME = 0,
  CONFIG_TYPE = 1,
  CONFIG = 2,
  ORGANIZATION = 3,
}

// Define separate substeps for each config type
interface ConfigStepDef {
  title: string;
  field: string;
  component: React.ReactNode;
}

// Default templates for each trackable type
const DEFAULT_TEMPLATES = {
  measure: {
    name: "Measurement Tracker",
    description: "Track measurements with units",
    config: {
      type: "measure" as const,
      measureUnitType: "mass" as const,
      measureUnitSource: "g",
      measureUnitDisplay: "kg",
      measureTarget: null,
      measureMin: 0,
      measureMax: 100,
      cumulative: false,
      aggregationType: "latest" as const,
      limitOnePerDay: true,
    },
  },
  checkbox: {
    name: "Habit Tracker",
    description: "Track habits with a simple checkbox",
    config: {
      type: "checkbox" as const,
      checkboxName: "Completed",
      limitOnePerDay: true,
    },
  },
  range: {
    name: "Scale Tracker",
    description: "Track values on a scale",
    config: {
      type: "range" as const,
      rangeMin: 0,
      rangeMax: 10,
      rangeStepLabels: [],
      rangeUnit: "points",
      rangeMinLabel: "Low",
      rangeMaxLabel: "High",
      limitOnePerDay: true,
    },
  },
  rating: {
    name: "Rating Tracker",
    description: "Track ratings from 1-5",
    config: {
      type: "rating" as const,
      ratingMax: 5 as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
      ratingUnit: "stars",
      limitOnePerDay: true,
    },
  },
  shortText: {
    name: "Short Text Tracker",
    description: "Track short text entries",
    config: {
      type: "shortText" as const,
      limitOnePerDay: true,
    },
  },
  longText: {
    name: "Journal Entry",
    description: "Track longer text entries",
    config: {
      type: "longText" as const,
      limitOnePerDay: true,
    },
  },
};

interface NewTrackableFormData {
  name: string;
  description: string;
  type: TrackableTypesKey;
  subType: TrackableSubTypesKey;
  configType: TrackableConfigTypesKey;
  config: TrackableCustomConfig;
}

interface NewTrackableProps {
  template?: BaseTemplate;
  onSave?: (data: NewTrackableFormData) => void;
}

export function NewTrackable({ template, onSave }: NewTrackableProps) {
  const locales = useLocales();
  const userMeasurementSystem = locales[0]?.measurementSystem ?? "metric";
  const [step, setStep] = useState<Step>(
    template ? Step.TEMPLATE_CHOICE : Step.NAME,
  );
  const [configStep, setConfigStep] = useState(0);
  const [showDescription, setShowDescription] = useState(false);

  const [formData, setFormData] = useState<NewTrackableFormData>({
    name: template?.name ?? "",
    description: template?.description ?? "",
    type: template?.type ?? "custom",
    subType: template?.subType ?? "custom.generic",
    configType: "measure",
    config: template?.defaultConfig ?? createEmptyConfig("measure"),
  });

  // Setup the mutation at component level
  const mutation = useMutation(
    trpc.trackables.createTrackable.mutationOptions({
      onSuccess: async ({ id }) => {
        console.log("Trackable created successfully");

        // Invalidate the query for the parent type
        const queryKey = trpc.trackables.getTrackablesForParentType.queryKey({
          trackableParentType: formData.type,
        });
        await queryClient.invalidateQueries({ queryKey });

        router.replace(`/${id}`);
        if (onSave) {
          onSave(formData);
        }
      },
      onError: (error) => {
        console.error("Error creating trackable:", error);
      },
    }),
  );

  // Initialize form with template data if provided
  useEffect(() => {
    if (template) {
      const configType = template.defaultConfig.type;

      // Create a copy of the template's config
      const configCopy = { ...template.defaultConfig } as TrackableCustomConfig;

      // Update display unit based on user's locale if it's a measure config
      if (configType === "measure" && configCopy.type === "measure") {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const unitType = configCopy.measureUnitType ?? "mass";
        const { source, display } = getUnitDisplayFromType(
          unitType,
          userMeasurementSystem,
        );
        configCopy.measureUnitSource = source;
        configCopy.measureUnitDisplay = display;
      }

      setFormData({
        name: template.name,
        description: template.description ?? "",
        type: template.type,
        subType: template.subType,
        configType: configType,
        config: configCopy,
      });
    }
  }, [template, userMeasurementSystem]);

  // Reset config step when config type changes
  useEffect(() => {
    setConfigStep(0);
  }, [formData.configType]);

  // Extract main type from subtype (e.g., "mind.stress" -> "mind")
  const extractTypeFromSubType = (subType: string): TrackableTypesKey => {
    const parts = subType.split(".");
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return (parts[0] as TrackableTypesKey) ?? "custom";
  };

  // Map template ID to valid subType (e.g., "weight" -> "body.weight")
  const mapTemplateIdToSubType = (templateId: string): TrackableSubTypesKey => {
    // Check if this is already a valid subType format (contains dots)
    if (templateId.includes(".")) {
      return templateId as TrackableSubTypesKey;
    }

    // Special case mappings for template IDs
    const mappings: Record<string, TrackableSubTypesKey> = {
      weight: "body.weight",
      "body-fat-percentage": "body.fat",
      "body-muscle-percentage": "body.muscle",
      // Add more mappings as needed
    };

    return mappings[templateId] ?? "custom.generic";
  };

  // Handle form field changes
  const handleChange = (field: keyof NewTrackableFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle config type change
  const handleConfigTypeChange = (configType: TrackableConfigTypesKey) => {
    setFormData((prev) => ({
      ...prev,
      configType,
      config: createEmptyConfig(configType),
    }));
  };

  // Handle measure unit type change - auto update the display units
  const handleMeasureUnitTypeChange = (unitType: string) => {
    if (formData.config.type === "measure") {
      const { source, display } = getUnitDisplayFromType(
        unitType,
        userMeasurementSystem,
      );

      setFormData((prev) => ({
        ...prev,
        config: {
          ...prev.config,
          measureUnitType: unitType as
            | "length"
            | "time"
            | "volume"
            | "mass"
            | "temperature"
            | "percentage",
          measureUnitSource: source,
          measureUnitDisplay: display,
        },
      }));
    }
  };

  // Handle config field change
  const handleConfigChange = (field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        [field]: value,
      },
    }));
  };

  // Use template directly without customization
  const handleUseTemplateDirectly = () => {
    if (template) {
      const configType = template.defaultConfig.type;

      // Get the correct subType using our mapping function
      const subType = mapTemplateIdToSubType(template.id);
      // Extract the main type from the subType
      const type = extractTypeFromSubType(subType);

      console.log(
        `Template ID: ${template.id} -> Type: ${type}, SubType: ${subType}`,
      );

      const newFormData = {
        name: template.name,
        description: template.description ?? "",
        type: type,
        subType: subType,
        configType: configType,
        config: template.defaultConfig as TrackableCustomConfig,
      };

      console.log("Using template directly:", newFormData);

      // Create the trackable in the database
      mutation.mutate({
        name: newFormData.name,
        description: newFormData.description,
        type: newFormData.type,
        subType: newFormData.subType,
        configType: newFormData.configType,
        config: newFormData.config,
      });

      if (onSave) {
        onSave(newFormData);
      }
    }
  };

  // Use template but customize
  const handleCustomizeTemplate = () => {
    setStep(Step.NAME);
  };

  // Move to next step
  const handleNextStep = () => {
    if (step < Step.CONFIG) {
      // Skip CONFIG step for shortText and longText since they have no configuration
      if (
        step === Step.CONFIG_TYPE &&
        (formData.configType === "shortText" ||
          formData.configType === "longText")
      ) {
        setStep(Step.ORGANIZATION);
      } else {
        setStep(step + 1);
      }
    } else if (step === Step.CONFIG) {
      // In config step, handle config substeps
      const configSteps = getConfigStepsForType(
        formData.configType,
        formData.config,
        handleConfigChange,
        formData.configType === "measure"
          ? handleMeasureUnitTypeChange
          : undefined,
      );
      if (configSteps.length === 0) {
        // Skip to organization step if there are no config steps
        setStep(Step.ORGANIZATION);
      } else if (configStep < configSteps.length - 1) {
        setConfigStep(configStep + 1);
      } else {
        // Move to organization step after completing all config steps
        setStep(Step.ORGANIZATION);
      }
    }
  };

  // Move to previous step
  const handlePrevStep = () => {
    if (step > Step.NAME) {
      if (step === Step.CONFIG && configStep > 0) {
        setConfigStep(configStep - 1);
      } else if (step === Step.ORGANIZATION) {
        // For shortText and longText, skip CONFIG step when going backward
        if (
          formData.configType === "shortText" ||
          formData.configType === "longText"
        ) {
          setStep(Step.CONFIG_TYPE);
        } else {
          setStep(Step.CONFIG);
          // Set config step to the last step
          const configSteps = getConfigStepsForType(
            formData.configType,
            formData.config,
            handleConfigChange,
            formData.configType === "measure"
              ? handleMeasureUnitTypeChange
              : undefined,
          );
          setConfigStep(configSteps.length - 1);
        }
      } else {
        setStep(step - 1);
      }
    }
  };

  // Start tracking
  const handleStartTracking = () => {
    console.log("Starting to track with data:", formData);

    mutation.mutate({
      name: formData.name,
      description: formData.description,
      type: formData.type,
      subType: formData.subType,
      configType: formData.configType,
      config: formData.config,
    });
  };

  // Create type options for picker
  const typeOptions: PickerOption[] = Object.entries(
    CONSTS.TRACKABLE.TYPES,
  ).map(([key, label]) => ({
    value: key,
    label: label as string,
  }));

  // Create subtype options for picker based on selected type
  const subtypeOptions: PickerOption[] = Object.entries(
    CONSTS.TRACKABLE.SUB_TYPES,
  )
    .filter(([key]) => key.startsWith(formData.type))
    .map(([key, label]) => ({
      value: key,
      label: label as string,
    }));

  // Create config type options for picker
  const configTypeOptions: PickerOption[] = Object.entries(
    CONSTS.TRACKABLE.CONFIG.TYPES,
  ).map(([key, label]) => ({
    value: key,
    label: label as string,
  }));

  // Get config steps
  const configSteps = getConfigStepsForType(
    formData.configType,
    formData.config,
    handleConfigChange,
    formData.configType === "measure" ? handleMeasureUnitTypeChange : undefined,
  );

  // Calculate total steps
  const totalSteps =
    step === Step.TEMPLATE_CHOICE
      ? 1
      : formData.configType === "shortText" ||
          formData.configType === "longText"
        ? 3
        : 3 + configSteps.length;

  // Calculate current step for display
  const currentDisplayStep =
    step === Step.TEMPLATE_CHOICE
      ? 1
      : step === Step.NAME
        ? 1
        : step === Step.CONFIG_TYPE
          ? 2
          : step === Step.CONFIG
            ? 3 + configStep
            : formData.configType === "shortText" ||
                formData.configType === "longText"
              ? 3
              : 3 + configSteps.length;

  // Render step content
  const renderStepContent = () => {
    switch (step) {
      case Step.TEMPLATE_CHOICE:
        return (
          <View className="flex flex-col gap-6">
            {/* <View className="border-sand-6 bg-sand-2 flex flex-col gap-4 rounded-md border p-4">
              <Text type="title">{template?.name}</Text>
              {template?.description && (
                <Text className="text-sand-11">{template.description}</Text>
              )}
              <View className="flex flex-col gap-2">
                <Text>Configuration:</Text>
                {template && (
                  <ConfigTypePreview
                    type={template.defaultConfig.type}
                    config={template.defaultConfig as TrackableCustomConfig}
                    name={template.name}
                    description={template.description}
                  />
                )}
              </View>
            </View> */}

            <View className="flex flex-col gap-4">
              <Button onPress={handleUseTemplateDirectly} variant="default">
                <Text>Use This Template</Text>
              </Button>
              <Button onPress={handleCustomizeTemplate} variant="outline">
                <Text>Customize</Text>
              </Button>
            </View>
          </View>
        );
      case Step.NAME:
        return (
          <View className="gap-4">
            <View>
              <Text type="title" className="mb-1">
                Name
              </Text>
              <Input
                value={formData.name}
                onChangeText={(text) => handleChange("name", text)}
                placeholder="Enter trackable name"
              />
            </View>

            {!showDescription ? (
              <Button
                variant="ghost"
                size="sm"
                onPress={() => setShowDescription(true)}
                className="flex flex-row gap-4 self-start"
              >
                <Plus size={12} />
                <Text>Description</Text>
              </Button>
            ) : (
              <View>
                <Text type="title" className="mb-1">
                  Description
                </Text>
                <Input
                  value={formData.description}
                  onChangeText={(text) => handleChange("description", text)}
                  placeholder="Enter description"
                />
              </View>
            )}

            {template && (
              <Button onPress={handleCustomizeTemplate} className="mt-4">
                <Text>Customize</Text>
              </Button>
            )}
          </View>
        );
      case Step.CONFIG_TYPE:
        return (
          <View className="gap-4">
            <View>
              <Text type="title" className="mb-1">
                Tracking Type
              </Text>
              <Dropdown
                items={configTypeOptions}
                value={formData.configType}
                onChange={(value) =>
                  handleConfigTypeChange(value as TrackableConfigTypesKey)
                }
              />
            </View>
          </View>
        );
      case Step.CONFIG:
        if (configSteps.length > 0 && configStep < configSteps.length) {
          const currentConfigStep = configSteps[configStep];
          if (currentConfigStep) {
            // Check if the component is an input based on its type and props
            const componentEl =
              currentConfigStep.component as React.ReactElement;
            const isInputComponent =
              React.isValidElement(componentEl) &&
              (componentEl.type === Input ||
                componentEl.type === NumberInput ||
                componentEl.type === Dropdown);

            return (
              <View className="flex flex-col gap-0">
                {!isInputComponent && (
                  <Text type="title" className="mb-2">
                    {currentConfigStep.title}
                  </Text>
                )}

                {currentConfigStep.component}
              </View>
            );
          }
        }
        // Skip to organization step programmatically since this shouldn't be visible
        // This is a fallback for types that skip the config
        if (
          formData.configType === "shortText" ||
          formData.configType === "longText"
        ) {
          setTimeout(() => setStep(Step.ORGANIZATION), 0);
          return null;
        }
        return <Text>No configuration options available</Text>;
      case Step.ORGANIZATION:
        return (
          <View className="gap-4">
            <View>
              <Text type="title" className="mb-1">
                Group
              </Text>
              <Dropdown
                items={typeOptions}
                value={formData.type}
                onChange={(value) => handleChange("type", value)}
              />
            </View>

            <View>
              <Text type="title" className="mb-1">
                Sub Group
              </Text>
              <Dropdown
                items={subtypeOptions}
                value={formData.subType}
                onChange={(value) => handleChange("subType", value)}
              />
              <Text className="text-sand-11 mt-2 text-xs">
                Missing a group or sub group? Want something more specific?
                Report it as a bug and we'll add it within 24 hours
              </Text>
            </View>

            <View className="mt-4">
              <Text type="title" className="mb-1">
                Entry Limit
              </Text>
              <View className="mt-2 flex-row items-center">
                <Checkbox
                  checked={formData.config.limitOnePerDay}
                  onCheckedChange={(checked) =>
                    handleConfigChange("limitOnePerDay", checked)
                  }
                />
                <Text className="ml-2">Limit to one entry per day</Text>
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  // Render step buttons
  const renderStepButtons = () => {
    const isLastStep = step === Step.ORGANIZATION;
    const hasNextStep =
      step < Step.CONFIG ||
      (step === Step.CONFIG && configStep < configSteps.length - 1) ||
      (step === Step.CONFIG && configStep === configSteps.length - 1);

    return (
      <View className="flex-col gap-4">
        <View className="flex-row gap-4">
          {step > Step.NAME || configStep > 0 ? (
            <Button
              onPress={handlePrevStep}
              variant="outline"
              size={"sm"}
              className="grow"
            >
              <Text>Previous</Text>
            </Button>
          ) : null}

          {hasNextStep ? (
            <Button
              onPress={handleNextStep}
              variant="outline"
              size={"sm"}
              className="grow"
            >
              <Text>Next Step</Text>
            </Button>
          ) : null}
        </View>
        <Button
          onPress={handleStartTracking}
          variant={isLastStep ? "default" : "outline"}
          size={"sm"}
        >
          <Text>Start Tracking</Text>
        </Button>
      </View>
    );
  };

  return (
    <View className="h-full flex-1">
      <View className="flex flex-col gap-6">
        <View className="flex flex-row items-center justify-between">
          <Text type="title" className="text-xl">
            Create New Trackable
          </Text>
          <Text className="text-sand-11 text-xs">
            Step {currentDisplayStep} of {totalSteps}
          </Text>
        </View>

        {/* Fixed Preview Area */}
        <View className="border-sand-6 bg-sand-2 flex flex-col gap-4 border-b border-t pb-6 pt-6">
          <Text type="title" className="bg-sand-2">
            Preview
          </Text>
          <ConfigTypePreview
            type={formData.configType}
            config={formData.config}
            name={formData.name}
            description={formData.description}
          />
        </View>

        <ScrollView className="flex h-full grow" persistentScrollbar>
          <View className="flex flex-col gap-6">
            {/* Step Content */}
            {renderStepContent()}

            {/* Step Buttons */}
            {renderStepButtons()}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

// Function to get config steps for a given type
function getConfigStepsForType(
  type: TrackableConfigTypesKey,
  config: TrackableCustomConfig,
  onChange: (field: string, value: unknown) => void,
  onMeasureUnitTypeChange?: (unitType: string) => void,
): ConfigStepDef[] {
  // Remove common step for all types, as it's now in the ORGANIZATION step
  const commonSteps: ConfigStepDef[] = [];

  switch (type) {
    case "measure":
      if (config.type !== "measure") return commonSteps;
      return [
        {
          title: "Measurement Configuration",
          field: "measureConfig",
          component: (
            <View className="flex flex-col gap-6">
              <View className="flex flex-row gap-2">
                <View className="flex-1 flex-col gap-1">
                  <Text type="title" className="text-sm">
                    Unit Type
                  </Text>
                  <Dropdown
                    items={[
                      { value: "volume", label: "Volume" },
                      { value: "mass", label: "Mass" },
                      { value: "length", label: "Length" },
                      { value: "time", label: "Time" },
                      { value: "temperature", label: "Temperature" },
                      { value: "percentage", label: "Percentage" },
                    ]}
                    value={config.measureUnitType}
                    onChange={(value) => {
                      if (onMeasureUnitTypeChange) {
                        onMeasureUnitTypeChange(value as string);
                      } else {
                        onChange("measureUnitType", value);
                      }
                    }}
                  />
                </View>

                <View className="flex-1 flex-col gap-1">
                  <Text type="title" className="text-sm">
                    Unit Display
                  </Text>
                  <Input
                    value={config.measureUnitDisplay}
                    onChangeText={(text) =>
                      onChange("measureUnitDisplay", text)
                    }
                    placeholder="e.g., kg, pounds"
                  />
                </View>
              </View>

              <View className="flex flex-col gap-2">
                <Text type="title" className="text-sm">
                  Values
                </Text>
                <View className="flex flex-row gap-2">
                  <View className="flex-1">
                    <Text className="text-sand-11 mb-1 text-xs">Target</Text>
                    <Input
                      value={
                        config.measureTarget !== null
                          ? String(config.measureTarget)
                          : ""
                      }
                      onChangeText={(text) => {
                        const value =
                          text.trim() === "" ? null : parseFloat(text);
                        onChange(
                          "measureTarget",
                          value !== null && !isNaN(value) ? value : null,
                        );
                      }}
                      placeholder="Target"
                      keyboardType="numeric"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sand-11 mb-1 text-xs">Min</Text>
                    <Input
                      value={String(config.measureMin ?? 0)}
                      onChangeText={(text) => {
                        const value = parseFloat(text);
                        onChange("measureMin", !isNaN(value) ? value : 0);
                      }}
                      placeholder="Min"
                      keyboardType="numeric"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sand-11 mb-1 text-xs">Max</Text>
                    <Input
                      value={String(config.measureMax ?? 0)}
                      onChangeText={(text) => {
                        const value = parseFloat(text);
                        onChange("measureMax", !isNaN(value) ? value : 0);
                      }}
                      placeholder="Max"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
            </View>
          ),
        },
        {
          title: "Cumulative",
          field: "cumulative",
          component: (
            <View className="flex flex-col gap-4">
              <View className="flex-row items-center">
                <Checkbox
                  checked={config.cumulative}
                  onCheckedChange={(checked) => onChange("cumulative", checked)}
                />
                <Text className="ml-2">Add all entries together</Text>
              </View>

              {config.cumulative && (
                <View className="flex flex-col gap-1">
                  <Text>Reset every</Text>
                  <Dropdown
                    items={[
                      { value: "hourly", label: "Hourly" },
                      { value: "daily", label: "Daily" },
                      { value: "weekly", label: "Weekly" },
                      { value: "monthly", label: "Monthly" },
                      { value: "yearly", label: "Yearly" },
                    ]}
                    value={config.cumulation ?? "daily"}
                    onChange={(value) => onChange("cumulation", value)}
                  />
                </View>
              )}
            </View>
          ),
        },
        {
          title: "Aggregation Type",
          field: "aggregationType",
          component: (
            <Dropdown
              items={[
                { value: "sum", label: "Sum" },
                { value: "average", label: "Average" },
                { value: "latest", label: "Latest" },
              ]}
              value={config.aggregationType ?? "latest"}
              onChange={(value) => onChange("aggregationType", value)}
            />
          ),
        },
        ...commonSteps,
      ];

    case "checkbox":
      if (config.type !== "checkbox") return commonSteps;
      return [
        {
          title: "Checkbox Label",
          field: "checkboxName",
          component: (
            <Input
              value={config.checkboxName}
              onChangeText={(text) => onChange("checkboxName", text)}
              placeholder="e.g., Completed, Done"
              label="Checkbox Label"
            />
          ),
        },
        ...commonSteps,
      ];

    case "range":
      if (config.type !== "range") return commonSteps;
      return [
        {
          title: "Range Values",
          field: "rangeValues",
          component: (
            <View className="flex flex-col gap-4">
              <View className="flex flex-row gap-2">
                <View className="flex-1">
                  <Text className="text-sand-11 mb-1 text-xs">
                    Minimum Value
                  </Text>
                  <Input
                    value={String(config.rangeMin)}
                    onChangeText={(text) => {
                      const value = parseFloat(text);
                      onChange("rangeMin", !isNaN(value) ? value : 0);
                    }}
                    placeholder="Min"
                    keyboardType="numeric"
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-sand-11 mb-1 text-xs">
                    Maximum Value
                  </Text>
                  <Input
                    value={String(config.rangeMax)}
                    onChangeText={(text) => {
                      const value = parseFloat(text);
                      onChange("rangeMax", !isNaN(value) ? value : 0);
                    }}
                    placeholder="Max"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
          ),
        },
        {
          title: "Range Labels",
          field: "rangeLabels",
          component: (
            <View className="flex flex-col gap-4">
              <Input
                value={config.rangeUnit}
                onChangeText={(text) => onChange("rangeUnit", text)}
                placeholder="e.g., points, level"
                label="Unit (optional)"
              />

              <Input
                value={config.rangeMinLabel}
                onChangeText={(text) => onChange("rangeMinLabel", text)}
                placeholder="e.g., Low, Worst"
                label="Minimum Label (optional)"
              />

              <Input
                value={config.rangeMaxLabel}
                onChangeText={(text) => onChange("rangeMaxLabel", text)}
                placeholder="e.g., High, Best"
                label="Maximum Label (optional)"
              />
            </View>
          ),
        },
        ...commonSteps,
      ];

    case "rating":
      if (config.type !== "rating") return commonSteps;
      return [
        {
          title: "Rating Configuration",
          field: "ratingConfig",
          component: (
            <View className="flex flex-col gap-4">
              <View className="flex flex-row gap-2">
                <View className="flex-1">
                  <Text className="text-sand-11 mb-1 text-xs">
                    Maximum Rating
                  </Text>
                  <Dropdown
                    items={[
                      { value: "1", label: "1" },
                      { value: "2", label: "2" },
                      { value: "3", label: "3" },
                      { value: "4", label: "4" },
                      { value: "5", label: "5" },
                      { value: "6", label: "6" },
                      { value: "7", label: "7" },
                      { value: "8", label: "8" },
                      { value: "9", label: "9" },
                      { value: "10", label: "10" },
                    ]}
                    value={String(config.ratingMax)}
                    onChange={(value) =>
                      onChange(
                        "ratingMax",
                        Number(value) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
                      )
                    }
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-sand-11 mb-1 text-xs">
                    Unit (optional)
                  </Text>
                  <Input
                    value={config.ratingUnit}
                    onChangeText={(text) => onChange("ratingUnit", text)}
                    placeholder="e.g., stars"
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-sand-11 mb-1 text-xs">
                    Emoji (option.)
                  </Text>
                  <Input
                    value={config.ratingEmoji}
                    onChangeText={(text) => {
                      // Limit to 1 character
                      const singleChar = text.charAt(0);
                      onChange("ratingEmoji", singleChar);
                    }}
                    placeholder="⭐"
                    maxLength={1}
                  />
                </View>
              </View>
            </View>
          ),
        },
        ...commonSteps,
      ];

    case "shortText":
      if (config.type !== "shortText") return commonSteps;
      return [];

    case "longText":
      if (config.type !== "longText") return commonSteps;
      return [];

    default:
      return commonSteps;
  }
}

// Component to show preview of configuration
function ConfigTypePreview({
  type,
  config,
  name,
  description,
}: {
  type: TrackableConfigTypesKey;
  config: TrackableCustomConfig;
  name?: string;
  description?: string;
}) {
  // Use state hooks for each type of preview
  const [measureValue, setMeasureValue] = useState(0);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [rangeValue, setRangeValue] = useState(
    config.type === "range" ? config.rangeMin : 0,
  );
  const [ratingValue, setRatingValue] = useState(0);
  const [shortTextValue, setShortTextValue] = useState("");
  const [longTextValue, setLongTextValue] = useState("");

  // Update preview values when config type changes
  useEffect(() => {
    // Reset values when config type changes
    if (type === "measure") setMeasureValue(0);
    else if (type === "checkbox") setCheckboxValue(false);
    else if (type === "range" && config.type === "range")
      setRangeValue(config.rangeMin);
    else if (type === "rating") setRatingValue(0);
    else if (type === "shortText") setShortTextValue("");
    else if (type === "longText") setLongTextValue("");
  }, [type, config]);

  const PreviewNameDescription = () => {
    if (name)
      return (
        <View className="flex flex-col gap-1">
          <Text>{name}</Text>
          {description && (
            <Text className="text-sand-11 text-xs">{description}</Text>
          )}
        </View>
      );
    if (description) return <Text>{description}</Text>;
    return null;
  };

  switch (type) {
    case "measure":
      if (config.type !== "measure") return <Text>Invalid configuration</Text>;
      return (
        <View className="flex flex-col gap-4">
          <PreviewNameDescription />
          <NumberInput
            value={measureValue}
            onValueChange={setMeasureValue}
            unit={config.measureUnitDisplay}
            increments={[0.1, 1, 5]}
            decrements={[0.1, 1, 5]}
            minValue={config.measureMin}
            maxValue={config.measureMax}
          />
        </View>
      );
    case "checkbox":
      if (config.type !== "checkbox") return <Text>Invalid configuration</Text>;
      return (
        <View className="flex flex-col gap-4">
          <PreviewNameDescription />
          <View className="flex-row items-center">
            <Checkbox
              checked={checkboxValue}
              onCheckedChange={setCheckboxValue}
            />
            <Text className="ml-2">{config.checkboxName}</Text>
          </View>
        </View>
      );
    case "range":
      if (config.type !== "range") return <Text>Invalid configuration</Text>;
      return (
        <View className="flex flex-col gap-4">
          <PreviewNameDescription />
          <Slider
            value={rangeValue}
            onValueChange={setRangeValue}
            rangeMin={config.rangeMin}
            rangeMax={config.rangeMax}
            rangeUnit={config.rangeUnit}
            rangeMinLabel={config.rangeMinLabel}
            rangeMaxLabel={config.rangeMaxLabel}
          />
        </View>
      );
    case "rating": {
      if (config.type !== "rating") return <Text>Invalid configuration</Text>;
      // Ensure ratingMax is a valid value (2-10)
      const safeRatingMax = Math.max(2, Math.min(10, config.ratingMax)) as
        | 2
        | 3
        | 4
        | 5
        | 6
        | 7
        | 8
        | 9
        | 10;

      return (
        <View className="flex flex-col gap-4">
          <PreviewNameDescription />
          <Rating
            value={ratingValue}
            onValueChange={setRatingValue}
            ratingMax={safeRatingMax}
            ratingUnit={config.ratingUnit}
            ratingIcon={config.ratingIcon}
            ratingEmoji={config.ratingEmoji}
          />
        </View>
      );
    }
    case "shortText":
      if (config.type !== "shortText")
        return <Text>Invalid configuration</Text>;
      return (
        <View className="flex flex-col gap-4">
          <PreviewNameDescription />
          <Input
            value={shortTextValue}
            onChangeText={setShortTextValue}
            placeholder="Enter text..."
          />
        </View>
      );
    case "longText":
      if (config.type !== "longText") return <Text>Invalid configuration</Text>;
      return (
        <View className="flex flex-col gap-4">
          <PreviewNameDescription />
          <Text>Long Text</Text>
          <LongText
            value={longTextValue}
            onChangeText={setLongTextValue}
            placeholder="Enter long text..."
          />
        </View>
      );
    default:
      return <Text>Select a configuration type</Text>;
  }
}

// Helper function to create empty config based on type
function createEmptyConfig(
  type: TrackableConfigTypesKey,
): TrackableCustomConfig {
  switch (type) {
    case "measure": {
      const defaultConfig = { ...DEFAULT_TEMPLATES.measure.config };
      return defaultConfig;
    }
    case "checkbox":
      return DEFAULT_TEMPLATES.checkbox.config;
    case "range":
      return DEFAULT_TEMPLATES.range.config;
    case "rating":
      return DEFAULT_TEMPLATES.rating.config;
    case "shortText":
      return DEFAULT_TEMPLATES.shortText.config;
    case "longText":
      return DEFAULT_TEMPLATES.longText.config;
    default:
      return DEFAULT_TEMPLATES.measure.config;
  }
}

// Function to get unit display based on unit type and user's locale measurement system
function getUnitDisplayFromType(
  unitType: string,
  measurementSystem = "metric",
): {
  source: string;
  display: string;
} {
  const isImperial = measurementSystem === "us";

  switch (unitType) {
    case "mass":
      return isImperial
        ? { source: "g", display: "lb" }
        : { source: "g", display: "kg" };
    case "volume":
      return isImperial
        ? { source: "ml", display: "fl oz" }
        : { source: "ml", display: "ml" };
    case "length":
      return isImperial
        ? { source: "cm", display: "in" }
        : { source: "cm", display: "cm" };
    case "temperature":
      return isImperial
        ? { source: "C", display: "°F" }
        : { source: "C", display: "°C" };
    case "time":
      return { source: "min", display: "min" };
    case "percentage":
      return { source: "%", display: "%" };
    default:
      return { source: "", display: "" };
  }
}
