import React, { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner-native";

import type { ConstsTypes, TrackerCustomConfig } from "@potential/consts";
import type { BaseTemplate } from "@potential/templates";
import { filterTemplatesByType } from "@potential/templates";

import type { ImagePickerUploaderRef } from "~/components/ui/image-picker-uploader";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { ImagePickerUploader } from "~/components/ui/image-picker-uploader";
import { Input } from "~/components/ui/input";
import { LongText } from "~/components/ui/long-text";
import { NumberInput } from "~/components/ui/number-input";
import { Rating } from "~/components/ui/rating";
import { Slider } from "~/components/ui/slider";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { trpc } from "~/utils/api";
import { NewTracker } from "../trackers/new";
import { LogStepWrapper } from "./logStepWrapper";

// Use the proper type from consts
type TrackerParentType = ConstsTypes["TRACKER"]["TYPES"]["KEY"];
type TrackerSubType = ConstsTypes["TRACKER"]["SUB_TYPES"]["KEY"];
type TrackerConfigType = ConstsTypes["TRACKER"]["CONFIG"]["TYPES"]["KEY"];

// Define the Tracker interface to use instead of 'any'
interface Tracker {
  id: string;
  name: string;
  description: string | null;
  type: TrackerParentType;
  subType: TrackerSubType;
  configType: TrackerConfigType;
  customConfig: TrackerCustomConfig;
}

// Define types for the tracker values based on different input types
type TrackerValueType =
  | number // for measure, rating, range
  | boolean // for checkbox
  | string // for shortText, longText
  | null; // when no value is set yet

// Define NewTrackerFormData to match the one in new.tsx
interface NewTrackerFormData {
  name: string;
  description: string;
  type: ConstsTypes["TRACKER"]["TYPES"]["KEY"];
  subType: ConstsTypes["TRACKER"]["SUB_TYPES"]["KEY"];
  configType: ConstsTypes["TRACKER"]["CONFIG"]["TYPES"]["KEY"];
  config: TrackerCustomConfig;
}

// Lookup data for different tracker types
interface TrackerOptions {
  textAreaPlaceholders: string[];
  generalName: string;
  textAreaLabel: string;
  tipText: string;
  title: string;
}

const trackerLookup: Record<TrackerParentType, TrackerOptions> = {
  consumption: {
    textAreaPlaceholders: [
      "Ate a BrandName protein bar",
      "Tall frappeCaraMatcha coffee",
      "Large bowl of Katsu curry",
      "I'll just have the salad",
      "Drank a tall glass of water",
    ],
    generalName: "food/drink",
    textAreaLabel: "What did you eat or drink?",
    tipText:
      "Be as detailed as possible about the components and size of this meal/drink.",
    title: "Food & Drink",
  },
  activity: {
    textAreaPlaceholders: [
      "10 minute jog",
      "30 minute strength training session",
      "1 hour yoga class",
      "5km run with a pace of 5:30/km",
      "2 sets of 12 bicep curls with 10kg weights",
    ],
    generalName: "activity",
    textAreaLabel: "What activity did you do?",
    tipText:
      "Include details like duration, intensity, and any other relevant information.",
    title: "Physical Activity",
  },
  medication: {
    textAreaPlaceholders: [
      "Took 500mg paracetamol",
      "Started new medication for allergies",
      "Antibiotics 250mg twice daily",
      "Aspirin 325mg",
      "Multivitamin with breakfast",
    ],
    generalName: "medication",
    textAreaLabel: "What medication did you take?",
    tipText: "Include details like dosage, frequency, and any side effects.",
    title: "Medication",
  },
  supplement: {
    textAreaPlaceholders: [
      "Vitamin D3 2000IU",
      "Fish oil 1000mg",
      "Protein shake 25g",
      "Magnesium 400mg before bed",
      "Creatine 5g with water",
    ],
    generalName: "supplement",
    textAreaLabel: "What supplement did you take?",
    tipText:
      "Include details like dosage, brand if relevant, and when you took it.",
    title: "Supplement",
  },
  energy: {
    textAreaPlaceholders: [
      "Feeling energetic today",
      "Low energy after lunch",
      "Morning energy boost after cold shower",
      "Afternoon slump around 3pm",
      "Great energy throughout workout",
    ],
    generalName: "energy level",
    textAreaLabel: "How's your energy?",
    tipText:
      "Note any patterns or factors that might be affecting your energy levels.",
    title: "Energy",
  },
  blood: {
    textAreaPlaceholders: [
      "Blood pressure: 120/80",
      "Blood glucose: 5.5 mmol/L",
      "Cholesterol test results",
      "Hemoglobin A1c: 5.4%",
      "Blood test from doctor",
    ],
    generalName: "blood reading",
    textAreaLabel: "What blood metric are you logging?",
    tipText: "Include specific measurements, units, and context if available.",
    title: "Blood Reading",
  },
  body: {
    textAreaPlaceholders: [
      "Weight: 70kg",
      "Body fat percentage: 18%",
      "Waist measurement: 32 inches",
      "Noticed more definition in arms",
      "Muscle increase in legs",
    ],
    generalName: "body measurement",
    textAreaLabel: "What would you like to record about your body?",
    tipText: "Include specific measurements with units where applicable.",
    title: "Body",
  },
  sleep: {
    textAreaPlaceholders: [
      "Slept 8 hours, felt rested",
      "Woke up several times during the night",
      "Deep sleep for 6 hours",
      "Afternoon nap for 30 minutes",
      "Sleep quality: 8/10",
    ],
    generalName: "sleep",
    textAreaLabel: "How did you sleep?",
    tipText:
      "Include details about duration, quality, and any factors affecting your sleep.",
    title: "Sleep",
  },
  mind: {
    textAreaPlaceholders: [
      "Meditated for 20 minutes",
      "Feeling anxious about presentation",
      "Journaled for 15 minutes",
      "Mental clarity after morning walk",
      "Practiced deep breathing for 10 minutes",
    ],
    generalName: "mental state",
    textAreaLabel: "What's on your mind?",
    tipText:
      "Share details about your mental wellbeing, practices, or observations.",
    title: "Mind",
  },
  symptom: {
    textAreaPlaceholders: [
      "Mild headache since morning",
      "Sore throat, possibly coming down with something",
      "Joint pain in right knee",
      "Stomach discomfort after lunch",
      "Feeling congested",
    ],
    generalName: "symptom",
    textAreaLabel: "What symptom are you experiencing?",
    tipText:
      "Include details about severity, duration, and any potential triggers.",
    title: "Symptom",
  },
  custom: {
    textAreaPlaceholders: [
      "Custom health tracking note",
      "Personal observation",
      "Something I want to remember",
      "Health-related achievement",
      "Note for future reference",
    ],
    generalName: "custom entry",
    textAreaLabel: "What would you like to log?",
    tipText: "Add any relevant details that you want to track.",
    title: "Custom Log",
  },
};

// Helper function to get lookup values with defaults
const getLookupValues = (
  trackerParentType: TrackerParentType,
): TrackerOptions => {
  return (
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    trackerLookup[trackerParentType] || {
      textAreaPlaceholders: ["Enter details here..."],
      generalName: "item",
      textAreaLabel: "What would you like to log?",
      tipText: "Try to be as detailed as possible.",
      title: "Log Entry",
    }
  );
};

interface TrackerLogStepProps {
  onBack: () => void;
  trackerParentType: TrackerParentType;
  trackerSubType: TrackerSubType;
}

// Component to render tracker input based on its config type
function TrackerInputComponent({
  tracker,
  onValueChange,
  value,
}: {
  tracker: Tracker;
  onValueChange: (value: TrackerValueType) => void;
  value: TrackerValueType;
}) {
  const config = tracker.customConfig;

  switch (config.type) {
    case "measure": {
      const numberValue = typeof value === "number" ? value : 0;
      return (
        <View className="flex flex-col gap-2">
          {/* <Text type="title">{tracker.name}</Text> */}
          {tracker.description && (
            <Text className="text-sand-11 text-sm">{tracker.description}</Text>
          )}
          <NumberInput
            value={numberValue}
            onValueChange={(val) => onValueChange(val)}
            unit={config.measureUnitDisplay}
            increments={[0.1, 1, 5]}
            decrements={[0.1, 1, 5]}
            minValue={config.measureMin}
            maxValue={config.measureMax}
          />
        </View>
      );
    }
    case "checkbox": {
      const boolValue = typeof value === "boolean" ? value : false;
      return (
        <View className="flex flex-col gap-2">
          <Text type="title">{tracker.name}</Text>
          {tracker.description && (
            <Text className="text-sand-11 text-sm">{tracker.description}</Text>
          )}
          <View className="flex-row items-center">
            <Checkbox
              checked={boolValue}
              onCheckedChange={(val) => onValueChange(val || false)}
            />
            <Text className="ml-2">{config.checkboxName || "Completed"}</Text>
          </View>
        </View>
      );
    }
    case "range": {
      const numberValue =
        typeof value === "number" ? value : config.rangeMin || 0;
      return (
        <View className="flex flex-col gap-2">
          <Text type="title">{tracker.name}</Text>
          {tracker.description && (
            <Text className="text-sand-11 text-sm">{tracker.description}</Text>
          )}
          <Slider
            value={numberValue}
            onValueChange={(val) => onValueChange(val)}
            rangeMin={config.rangeMin}
            rangeMax={config.rangeMax}
            rangeUnit={config.rangeUnit}
            rangeMinLabel={config.rangeMinLabel}
            rangeMaxLabel={config.rangeMaxLabel}
          />
        </View>
      );
    }
    case "rating": {
      const numberValue = typeof value === "number" ? value : 0;
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
        <View className="flex flex-col gap-2">
          <Text type="title">{tracker.name}</Text>
          {tracker.description && (
            <Text className="text-sand-11 text-sm">{tracker.description}</Text>
          )}
          <Rating
            value={numberValue}
            onValueChange={(val) => onValueChange(val)}
            ratingMax={safeRatingMax}
            ratingUnit={config.ratingUnit}
            ratingIcon={config.ratingIcon}
            ratingEmoji={config.ratingEmoji}
          />
        </View>
      );
    }
    case "shortText": {
      const stringValue = typeof value === "string" ? value : "";
      return (
        <View className="flex flex-col gap-2">
          <Text type="title">{tracker.name}</Text>
          {tracker.description && (
            <Text className="text-sand-11 text-sm">{tracker.description}</Text>
          )}
          <Input
            value={stringValue}
            onChangeText={(text) => onValueChange(text)}
            placeholder="Enter text..."
          />
        </View>
      );
    }
    case "longText": {
      const stringValue = typeof value === "string" ? value : "";
      return (
        <View className="flex flex-col gap-2">
          <Text type="title">{tracker.name}</Text>
          {tracker.description && (
            <Text className="text-sand-11 text-sm">{tracker.description}</Text>
          )}
          <LongText
            value={stringValue}
            onChangeText={(text) => onValueChange(text)}
            placeholder="Enter long text..."
          />
        </View>
      );
    }
    default:
      return (
        <View className="p-2">
          <Text>Unsupported tracker type</Text>
        </View>
      );
  }
}

// Define the payload type for the log mutation
interface CreateLogPayload {
  text: string;
  imageIds: string[];
  trackerParentType: TrackerParentType;
  trackerSubType: TrackerSubType;
  trackerId?: string;
  trackerValue?: TrackerValueType;
}

export const TrackerLogStep = ({
  onBack,
  trackerParentType,
  trackerSubType,
}: TrackerLogStepProps) => {
  const lookupValues = getLookupValues(trackerParentType);
  const router = useRouter();

  // Template and NewTracker state
  const [selectedTemplate, setSelectedTemplate] = useState<BaseTemplate | null>(
    null,
  );
  const [templates, setTemplates] = useState<BaseTemplate[]>([]);

  // Add state for the selected tracker
  const [selectedTracker, setSelectedTracker] = useState<Tracker | null>(null);
  const [trackerValue, setTrackerValue] = useState<TrackerValueType>(null);

  // Fetch templates based on trackerParentType
  useEffect(() => {
    const typeTemplates = filterTemplatesByType(trackerParentType);
    setTemplates(typeTemplates);
  }, [trackerParentType]);

  // get user profile
  const {
    data: parentTrackerTypes,
    // isLoading: parentTrackerTypesLoading,
    // error: parentTrackerTypesError,
  } = useQuery(
    trpc.tracker.getTrackersForParentType.queryOptions({
      trackerParentType,
    }),
  );

  // Text related
  const [placeholder] = useState(
    lookupValues.textAreaPlaceholders[
      Math.floor(Math.random() * lookupValues.textAreaPlaceholders.length)
    ],
  );

  const [imageState, setImageState] = useState<{
    pendingUpload: boolean;
    imageIds: string[];
  }>({
    pendingUpload: false,
    imageIds: [],
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [_isUploading, setIsUploading] = useState(false);

  const { mutateAsync } = useMutation(
    trpc.log.createLog.mutationOptions({
      onError: (err) => {
        console.error("Mutation error:", err);
        toast.error(
          err.message || `Failed to save ${lookupValues.generalName} log`,
        );
        setIsFormSubmitting(false);
      },
    }),
  );

  const form = useForm({
    defaultValues: {
      text: "",
    },
  });

  // Image related
  const imagePickerRef = useRef<ImagePickerUploaderRef>(null);

  const handleUpload = async () => {
    if (imagePickerRef.current) {
      const result = await imagePickerRef.current.uploadPendingImages();
      if (result.success) {
        setImageState((prev) => ({
          ...prev,
          pendingUpload: false,
          imageIds: result.imageIds,
        }));
        return result.imageIds;
      } else {
        console.error("Upload failed:", result.error);
        toast.error("Failed to upload image. Please try again.");
        setIsFormSubmitting(false);
        return undefined;
      }
    }
    return undefined;
  };

  async function handleSubmit() {
    setIsFormSubmitting(true);

    const textValue = form.getFieldValue("text");

    // Check if we are submitting a tracker value
    if (selectedTracker) {
      if (trackerValue === null) {
        toast.error(`Please provide a value for ${selectedTracker.name}`);
        setIsFormSubmitting(false);
        return;
      }

      // Send tracker data to the backend
      try {
        const payload: CreateLogPayload = {
          text: textValue || "",
          imageIds: imageState.imageIds,
          trackerParentType,
          trackerSubType,
          trackerId: selectedTracker.id,
          trackerValue: trackerValue,
        };

        // Handle pending image uploads before submitting
        if (imageState.pendingUpload) {
          const uploadedImageIds = await handleUpload();
          if (uploadedImageIds) {
            payload.imageIds = [...payload.imageIds, ...uploadedImageIds];
          }
        }

        await mutateAsync(payload);

        toast.success(`${selectedTracker.name} logged successfully`);
        router.back();
        setIsFormSubmitting(false);
        return;
      } catch (error) {
        console.error("Error submitting tracker value:", error);
        setIsFormSubmitting(false);
        return;
      }
    }

    // Regular text/image submission
    if (
      !textValue &&
      imageState.imageIds.length === 0 &&
      !imageState.pendingUpload
    ) {
      toast.error(`Please add text or an image to continue`);
      setIsFormSubmitting(false);
      return;
    }

    const imageIds: string[] = [];
    imageIds.push(...imageState.imageIds);

    if (imageState.pendingUpload) {
      const uploadedImageIds = await handleUpload();
      if (uploadedImageIds) {
        imageIds.push(...uploadedImageIds);
      }
    }

    // Send both text and imageIds to match the API requirements
    await mutateAsync({
      text: textValue,
      imageIds,
      trackerParentType,
      trackerSubType,
    });
    toast.success(`${lookupValues.generalName} logged successfully`);
    router.back();
    setIsFormSubmitting(false);
  }

  // Handle tracker selection
  const handleTrackerSelect = (tracker: Record<string, unknown>) => {
    // Cast the API response to our Tracker interface by first converting to unknown
    const typedTracker = tracker as unknown as Tracker;
    setSelectedTracker(typedTracker);

    // Initialize value based on tracker type - no need to check if .type exists
    switch (typedTracker.customConfig.type) {
      case "measure":
        setTrackerValue(0);
        break;
      case "checkbox":
        setTrackerValue(false);
        break;
      case "range":
        setTrackerValue(typedTracker.customConfig.rangeMin || 0);
        break;
      case "rating":
        setTrackerValue(0);
        break;
      case "shortText":
      case "longText":
        setTrackerValue("");
        break;
      default:
        setTrackerValue(null);
    }
  };

  // Template selection handler
  const onSelectTemplate = (template?: BaseTemplate) => {
    setSelectedTemplate(template ?? null);
  };

  // Handler for saving a new tracker
  const handleSaveNewTracker = () => {
    toast.success("New tracker added successfully", {
      id: "new-tracker-saved",
    });
    setSelectedTemplate(null); // Return to main screen after saving
  };

  // Render the smart AI section
  const renderSmartAISection = () => {
    return (
      <View className="flex flex-col gap-4">
        <Text className="text-lg" type="title">
          Smart Ai
        </Text>
        <form.Field
          name="text"
          children={(field) => {
            return (
              <Textarea
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
                error={
                  field.state.meta.errors.length > 0
                    ? [
                        {
                          message:
                            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                            field.state.meta.errors[0] ??
                            "Something is wrong, but we dont know what",
                        },
                      ]
                    : ""
                }
                label={
                  selectedTracker
                    ? "Add a note to this log"
                    : lookupValues.textAreaLabel
                }
                placeholder={selectedTracker ? "" : placeholder}
                editable={!form.state.isSubmitting}
              />
            );
          }}
        />
        <Text className="text-sand-11 text-sm">
          Tips: {lookupValues.tipText}
        </Text>

        {/* If a tracker is selected, show it above the image picker */}
        {selectedTracker && (
          <View className="border-sand-6 bg-sand-1 flex flex-col items-center gap-4 rounded-lg border p-4">
            <Text className="text-base font-medium" type="title">
              {selectedTracker.name}
            </Text>

            <TrackerInputComponent
              tracker={selectedTracker}
              value={trackerValue}
              onValueChange={setTrackerValue}
            />
          </View>
        )}
        {selectedTracker && (
          <Text className="text-sand-11 text-xs">
            Tip: You can also attach a photo to this log
          </Text>
        )}

        <ImagePickerUploader
          ref={imagePickerRef}
          onImagesChanged={setImageState}
          onUploadStateChange={setIsUploading}
          onSubmit={handleSubmit}
          submitting={isFormSubmitting}
        />
      </View>
    );
  };

  // Render the manual section for selecting trackers
  const renderManualSection = () => {
    // Don't show manual section when Smart AI section already shows the selected tracker
    if (selectedTracker) return null;

    return (
      <View className="mt-4 flex flex-col gap-6">
        <Text className="text-lg" type="title">
          Existing Trackers
        </Text>
        {parentTrackerTypes?.length === 0 && (
          <Text className="text-sand-11 text-sm">
            No existing trackers found
          </Text>
        )}
        {/* Show existing trackers in a scrollview with max height */}
        <ScrollView
          className="flex flex-col gap-2"
          style={{
            maxHeight:
              parentTrackerTypes && parentTrackerTypes.length > 3
                ? 250
                : "auto",
          }}
        >
          {parentTrackerTypes?.map((tracker) => (
            <Button
              variant={"outline"}
              className="mb-2 flex w-full flex-col gap-2"
              onPress={() => handleTrackerSelect(tracker)}
              key={tracker.id}
            >
              <View className="flex w-full flex-row items-center justify-between">
                <Text className="text-base font-medium" type={"title"}>
                  {tracker.name}
                </Text>
                {tracker.description && (
                  <Text className="text-sand-11 text-sm">
                    {tracker.description}
                  </Text>
                )}
              </View>
            </Button>
          ))}
        </ScrollView>
        {/* Template Selection */}
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

            {/* Templates from filterTemplatesByType */}
            {templates.map((template) => (
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
                        <Text className="text-amber-1 text-xs">
                          Recommended
                        </Text>
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
            ))}
          </View>
        </View>
      </View>
    );
  };

  // Render the main tracker log content
  const renderMainContent = () => {
    return (
      <LogStepWrapper title={lookupValues.title} onBack={onBack}>
        <View className="mb-12 flex flex-col gap-4">
          {renderSmartAISection()}
          {trackerParentType !== "consumption" && renderManualSection()}
        </View>
      </LogStepWrapper>
    );
  };

  // Render the new tracker view if a template is selected
  const renderNewTracker = () => {
    if (!selectedTemplate) return null;

    return (
      <LogStepWrapper
        title={selectedTemplate.name || "New Tracker"}
        onBack={() => setSelectedTemplate(null)}
      >
        <NewTracker template={selectedTemplate} onSave={handleSaveNewTracker} />
      </LogStepWrapper>
    );
  };

  // In log.tsx, steps are conditionally rendered based on state
  // Following the same pattern:
  return (
    <>
      {renderMainContent()}
      {selectedTemplate && renderNewTracker()}
    </>
  );
};
