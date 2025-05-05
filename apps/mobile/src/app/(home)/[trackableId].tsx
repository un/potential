import React, { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner-native";

import type { ConstsTypes } from "@potential/consts";

import type { ImagePickerUploaderRef } from "~/components/ui/image-picker-uploader";
// Import TrackableType from our types
import type { Trackable, TrackableType } from "~/types/trackables";
// Import our new display components
import { getValueFromLog } from "~/components/trackables/displays";
// Import our new input components
import { getInputForTrackableType } from "~/components/trackables/inputs";
import { Card } from "~/components/ui/card";
import { ImagePickerUploader } from "~/components/ui/image-picker-uploader";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { queryClient, trpc } from "~/utils/api";

// Define types for the trackable values based on different input types
type TrackableValueType =
  | number // for measure, rating, range
  | boolean // for checkbox
  | string // for shortText, longText
  | null;

type TrackableParentType = ConstsTypes["TRACKABLE"]["TYPES"]["KEY"];
type TrackableSubType = ConstsTypes["TRACKABLE"]["SUB_TYPES"]["KEY"];
// Rename to _UnitType since it's not used directly in this file
type _UnitType = ConstsTypes["TRACKABLE"]["CONFIG"]["UNITS"]["MEASURE"]["KEY"];

// Payload for creating a log
interface CreateLogPayload {
  text: string;
  imageIds: string[];
  trackableParentType: TrackableParentType;
  trackableSubType: TrackableSubType;
  trackableId: string;
  trackableValue: TrackableValueType;
}

export default function TrackableDetailsPage() {
  const params = useLocalSearchParams();
  const trackableId = params.trackableId as string;
  const [trackableValue, setTrackableValue] =
    useState<TrackableValueType>(null);
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

  const { data: trackable, isLoading: isLoadingTrackable } = useQuery(
    trpc.trackables.getTrackableById.queryOptions({
      id: trackableId,
    }),
  );

  const { data: logs, isLoading: isLoadingLogs } = useQuery(
    trpc.log.getLogsByTrackableId.queryOptions({
      trackableId: trackableId,
    }),
  );

  const form = useForm({
    defaultValues: {
      text: "",
    },
  });

  // Setup the mutation for creating logs
  const { mutateAsync } = useMutation(
    trpc.log.createLog.mutationOptions({
      onSuccess: async () => {
        // Invalidate queries to update the UI
        const logsQueryKey = trpc.log.getLogsByTrackableId.queryKey({
          trackableId: trackableId,
        });

        await queryClient.invalidateQueries({ queryKey: logsQueryKey });

        toast.success(`${trackable?.name} logged successfully`);
        setIsFormSubmitting(false);
        setTrackableValue(null);
        form.reset();
        router.back();
      },
      onError: (err) => {
        console.error("Mutation error:", err);
        toast.error(err.message || "Failed to save log");
        setIsFormSubmitting(false);
      },
    }),
  );

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
    if (!trackable || trackableValue === null) {
      toast.error(`Please provide a value for ${trackable?.name}`);
      return;
    }

    setIsFormSubmitting(true);
    const textValue = form.getFieldValue("text");

    try {
      // Since we have the early return for !trackable above, we know trackable is defined here
      const payload: CreateLogPayload = {
        text: textValue || "",
        imageIds: imageState.imageIds,
        // Use optional chaining instead of non-null assertion
        trackableParentType: trackable.type ?? "custom",
        trackableSubType: trackable.subType ?? "custom.generic",
        trackableId: trackableId,
        trackableValue: trackableValue,
      };

      // Handle pending image uploads before submitting
      if (imageState.pendingUpload) {
        const uploadedImageIds = await handleUpload();
        if (uploadedImageIds) {
          payload.imageIds = [...payload.imageIds, ...uploadedImageIds];
        }
      }

      await mutateAsync(payload);
    } catch (error) {
      console.error("Error submitting log:", error);
      setIsFormSubmitting(false);
    }
  }

  // Get the default value based on trackable type and latest log
  const getDefaultValue = (configType: string): TrackableValueType => {
    // Use the latest log value if available for measure type
    if (
      configType === "measure" &&
      logs &&
      logs.length > 0 &&
      logs[0]?.numericValue !== null &&
      logs[0]?.numericValue !== undefined
    ) {
      return logs[0].numericValue;
    }

    // For other types or if no logs available, use defaults
    switch (configType) {
      case "measure":
        return 0;
      case "checkbox":
        return false;
      case "range":
        if (
          trackable?.customConfig &&
          "rangeMin" in trackable.customConfig &&
          typeof trackable.customConfig.rangeMin === "number"
        ) {
          return trackable.customConfig.rangeMin;
        }
        return 0;
      case "rating":
        return 0;
      case "shortText":
      case "longText":
        return "";
      default:
        return null;
    }
  };

  // Set default value based on trackable type when loaded
  useEffect(() => {
    if (trackable?.customConfig && trackableValue === null && !isLoadingLogs) {
      const config = trackable.customConfig;
      setTrackableValue(getDefaultValue(config.type));
    }
  }, [trackable, trackableValue, logs, isLoadingLogs]);

  // Early returns for loading and error states
  if (isLoadingTrackable) {
    return (
      <SafeAreaView className="flex-1">
        <Stack.Screen options={{ title: "Loading..." }} />
        <View className="flex-1 items-center justify-center">
          <Text>Loading trackable...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!trackable) {
    return (
      <SafeAreaView className="flex-1">
        <Stack.Screen options={{ title: "Not Found" }} />
        <View className="flex-1 items-center justify-center">
          <Text>
            Trackable not found. Please try again or select a different
            trackable.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Get trackable type from config
  const getTrackableType = (): TrackableType => {
    if (!trackable.customConfig) return "measure";
    return trackable.customConfig.type as TrackableType;
  };

  const trackableType = getTrackableType();

  // Ensure trackable.customConfig is not null for the display/input components
  const safeCustomConfig = trackable.customConfig ?? {};

  // Create a wrapper for setTrackableValue with the right type signature
  const handleTrackableValueChange = (value: unknown) => {
    setTrackableValue(value as TrackableValueType);
  };

  return (
    <SafeAreaView className="flex-1" edges={{ bottom: "maximum" }}>
      <Stack.Screen options={{ title: trackable.name }} />
      <ScrollView className="flex-1 p-6">
        <View className="mb-6 flex flex-col gap-6">
          {trackable.description && (
            <Text className="text-sand-11 text-xs">
              {trackable.description}
            </Text>
          )}
          <Card>
            <View className="flex flex-col items-center justify-center gap-0">
              {logs && logs.length > 0 ? (
                <View className="flex flex-col items-center justify-center gap-2">
                  {/* Use our display component for the latest log - large size */}
                  {logs[0]?.createdAt &&
                    (trackableType === "shortText" ||
                      trackableType === "longText") && (
                      <Text className="text-sand-11 mt-2 text-xs">
                        {new Date(logs[0].createdAt).toLocaleString()}
                      </Text>
                    )}

                  {getValueFromLog({
                    log: logs[0],
                    type: trackableType,
                    config: safeCustomConfig,
                    size: "lg",
                    trackable: trackable as Trackable,
                  })}

                  {logs[0]?.createdAt &&
                    trackableType !== "shortText" &&
                    trackableType !== "longText" && (
                      <Text className="text-sand-11 mt-2 text-xs">
                        {new Date(logs[0].createdAt).toLocaleString()}
                      </Text>
                    )}
                </View>
              ) : (
                <Text className="text-sand-11">No logs yet</Text>
              )}
            </View>
          </Card>

          {/* Data Entry Section */}
          <View className="border-sand-6 bg-sand-2 flex flex-col gap-4 rounded-lg border p-4">
            <Text type="title" className="text-lg">
              New Log
            </Text>

            {/* Trackable Input - Use our new input components */}
            <View className="flex flex-col gap-2">
              {getInputForTrackableType(
                trackableType,
                trackableValue,
                handleTrackableValueChange,
                safeCustomConfig,
              )}
            </View>

            {/* Notes Section */}
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
                              message: field.state.meta.errors[0],
                            },
                          ]
                        : ""
                    }
                    label="Add a note (optional)"
                    placeholder="Add any additional notes here..."
                    editable={!isFormSubmitting}
                  />
                );
              }}
            />

            {/* Image Upload */}
            <ImagePickerUploader
              ref={imagePickerRef}
              onImagesChanged={setImageState}
              onUploadStateChange={setIsUploading}
              onSubmit={handleSubmit}
              submitting={isFormSubmitting}
            />
          </View>

          <Text type="title" className="-mb-4">
            History
          </Text>

          {isLoadingLogs ? (
            <Text className="text-sand-11">Loading history...</Text>
          ) : logs && logs.length > 0 ? (
            <View className="flex flex-col gap-4">
              {logs.map((log) => (
                <Card key={log.id} className="border-sand-6 border">
                  <View className="flex flex-row items-center justify-between">
                    <View>
                      {/* Use our display component for each log - small size */}
                      {getValueFromLog({
                        log,
                        type: trackableType,
                        config: safeCustomConfig,
                        size: "sm",
                        trackable: trackable as Trackable,
                      })}
                    </View>

                    <Text className="text-sand-11 text-xs">
                      {new Date(log.createdAt).toLocaleString()}
                    </Text>
                  </View>

                  {log.jsonValue?.imageIds &&
                    log.jsonValue.imageIds.length > 0 && (
                      <View className="mt-2">
                        <Text className="text-sm">Images available</Text>
                      </View>
                    )}

                  {log.textValue &&
                    log.textValue !== log.numericValue?.toString() && (
                      <Text className="mt-2 text-sm">{log.textValue}</Text>
                    )}
                </Card>
              ))}
            </View>
          ) : (
            <Text className="text-sand-11 text-xs">No logs available</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
