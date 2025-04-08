import React, { useRef, useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner-native";

import type { ConstsTypes } from "@1up/consts";

import type { ImagePickerUploaderRef } from "~/components/ui/image-picker-uploader";
import { ImagePickerUploader } from "~/components/ui/image-picker-uploader";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { trpc } from "~/utils/api";
import { Button } from "../ui/button";
import { LogStepWrapper } from "./logStepWrapper";

// Use the proper type from consts
type TrackableParentType = ConstsTypes["TRACKABLE"]["TYPES"]["KEY"];
type TrackableSubType = ConstsTypes["TRACKABLE"]["SUB_TYPES"]["KEY"];

// Lookup data for different trackable types
interface TrackableOptions {
  textAreaPlaceholders: string[];
  generalName: string;
  textAreaLabel: string;
  tipText: string;
  title: string;
  new: {
    name: string;
    description: string;
    icon: string;
    subType: TrackableSubType;
  }[];
}

const trackableLookup: Record<TrackableParentType, TrackableOptions> = {
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
    new: [
      {
        name: "Nom npm",
        description: "Log your food and drink",
        icon: "🍽️",
        subType: "consumption.parent.other",
      },
      {
        name: "Lala",
        description: "Log your food and drink",
        icon: "🍽️",
        subType: "consumption.parent.other",
      },
      {
        name: "ooooo",
        description: "Log your food and drink",
        icon: "🍽️",
        subType: "consumption.parent.other",
      },
    ],
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
    new: [],
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
    new: [],
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
    new: [],
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
    new: [],
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
    new: [],
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
    new: [],
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
    new: [],
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
    new: [],
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
    new: [],
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
    new: [],
  },
};

// Helper function to get lookup values with defaults
const getLookupValues = (
  trackableParentType: TrackableParentType,
): TrackableOptions => {
  return (
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    trackableLookup[trackableParentType] || {
      textAreaPlaceholders: ["Enter details here..."],
      generalName: "item",
      textAreaLabel: "What would you like to log?",
      tipText: "Try to be as detailed as possible.",
      title: "Log Entry",
    }
  );
};

interface TrackableLogStepProps {
  onBack: () => void;
  trackableParentType: TrackableParentType;
  trackableSubType: TrackableSubType;
}

export const TrackableLogStep = ({
  onBack,
  trackableParentType,
  trackableSubType,
}: TrackableLogStepProps) => {
  const lookupValues = getLookupValues(trackableParentType);

  // get user profile
  const {
    data: parentTrackableTypes,
    // isLoading: parentTrackableTypesLoading,
    // error: parentTrackableTypesError,
  } = useQuery(
    trpc.log.getTrackableParentTypes.queryOptions({
      trackableParentType,
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

  const router = useRouter();

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
      trackableParentType,
      trackableSubType,
    });
    toast.success(`${lookupValues.generalName} logged successfully`);
    router.back();
    setIsFormSubmitting(false);
  }

  return (
    <LogStepWrapper title={lookupValues.title} onBack={onBack}>
      <View className="flex flex-col gap-4">
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
                label={lookupValues.textAreaLabel}
                placeholder={placeholder}
                editable={!form.state.isSubmitting}
              />
            );
          }}
        />

        <Text className="text-sand-11 text-sm">
          Tips: {lookupValues.tipText}
        </Text>

        <ImagePickerUploader
          ref={imagePickerRef}
          onImagesChanged={setImageState}
          onUploadStateChange={setIsUploading}
          onSubmit={handleSubmit}
          submitting={isFormSubmitting}
        />

        <Text className="text-sand-11 text-sm">
          Existing TRACKERS {parentTrackableTypes?.length}
        </Text>
        {parentTrackableTypes?.map((trackable) => (
          <Text key={trackable.id} className="text-sand-11 text-sm">
            {trackable.name}
          </Text>
        ))}

        {lookupValues.new.length > 0 && (
          <Text className="text-sand-11 text-sm">
            Track something new with a template
          </Text>
        )}
        {lookupValues.new.map((newTrackable) => (
          <Button
            variant={"outline"}
            size={"sm"}
            key={newTrackable.name}
            onPress={() => {
              console.log("pressed");
            }}
          >
            <Text>{newTrackable.name}</Text>
          </Button>
        ))}
      </View>
    </LogStepWrapper>
  );
};
