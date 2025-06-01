import React, { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
// Import our new input components
import { Plus } from "phosphor-react-native";
import { toast } from "sonner-native";

import type { ConstsTypes } from "@potential/consts";

import type { ImagePickerUploaderRef } from "~/components/ui/image-picker-uploader";
// Import TrackerType from our types
import type { Tracker, TrackerType } from "~/types/trackers";
// Import our new display components
import { getValueFromLog } from "~/components/trackers/displays";
import { getInputForTrackerType } from "~/components/trackers/inputs";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { ImagePickerUploader } from "~/components/ui/image-picker-uploader";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { queryClient, trpc } from "~/utils/api";
import { timeAgoText } from "~/utils/date";
import { cn, iconColor } from "~/utils/ui";

// Define types for the tracker values based on different input types
type TrackerValueType =
  | number // for measure, rating, range
  | boolean // for checkbox
  | string // for shortText, longText
  | null;

type TrackerParentType = ConstsTypes["TRACKER"]["TYPES"]["KEY"];
type TrackerSubType = ConstsTypes["TRACKER"]["SUB_TYPES"]["KEY"];
// Rename to _UnitType since it's not used directly in this file
type _UnitType = ConstsTypes["TRACKER"]["CONFIG"]["UNITS"]["MEASURE"]["KEY"];

// Payload for creating a log
interface CreateLogPayload {
  text: string;
  imageIds: string[];
  trackerParentType: TrackerParentType;
  trackerSubType: TrackerSubType;
  trackerId: string;
  trackerValue: TrackerValueType;
}

export default function TrackerDetailsPage() {
  const params = useLocalSearchParams();
  const trackerId = params.trackerId as string;
  const [trackerValue, setTrackerValue] = useState<TrackerValueType>(null);
  const [imageState, setImageState] = useState<{
    pendingUpload: boolean;
    imageIds: string[];
  }>({
    pendingUpload: false,
    imageIds: [],
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [_isUploading, setIsUploading] = useState(false);
  const [showNewLog, setShowNewLog] = useState(false);
  const [showNewLogNoteField, setShowNewLogNoteField] = useState(false);

  const router = useRouter();

  const { data: tracker, isLoading: isLoadingTracker } = useQuery(
    trpc.tracker.getTrackerById.queryOptions({
      id: trackerId,
    }),
  );

  const { data: logs, isLoading: isLoadingLogs } = useQuery(
    trpc.log.getLogsByTrackerId.queryOptions({
      trackerId: trackerId,
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
        const logsQueryKey = trpc.log.getLogsByTrackerId.queryKey({
          trackerId: trackerId,
        });

        await queryClient.invalidateQueries({ queryKey: logsQueryKey });

        toast.success(`${tracker?.name} logged successfully`);
        setIsFormSubmitting(false);
        setTrackerValue(null);
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
    if (!tracker || trackerValue === null) {
      toast.error(`Please provide a value for ${tracker?.name}`);
      return;
    }

    setIsFormSubmitting(true);
    const textValue = form.getFieldValue("text");

    try {
      // Since we have the early return for !tracker above, we know tracker is defined here
      const payload: CreateLogPayload = {
        text: textValue || "",
        imageIds: imageState.imageIds,
        // Use optional chaining instead of non-null assertion
        trackerParentType: tracker.type ?? "custom",
        trackerSubType: tracker.subType ?? "custom.generic",
        trackerId: trackerId,
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
    } catch (error) {
      console.error("Error submitting log:", error);
      setIsFormSubmitting(false);
    }
  }

  // Get the default value based on tracker type and latest log
  const getDefaultValue = (configType: string): TrackerValueType => {
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
        return logs?.[0]?.numericValue ?? 0;
      case "checkbox":
        return false;
      case "range":
        if (
          tracker?.customConfig &&
          "rangeMin" in tracker.customConfig &&
          typeof tracker.customConfig.rangeMin === "number"
        ) {
          return tracker.customConfig.rangeMin;
        }
        return logs?.[0]?.numericValue ?? 0;
      case "rating":
        return logs?.[0]?.numericValue ?? 0;
      case "shortText":
      case "longText":
        return "";
      default:
        return null;
    }
  };

  // Set default value based on tracker type when loaded
  useEffect(() => {
    if (tracker?.customConfig && trackerValue === null && !isLoadingLogs) {
      const config = tracker.customConfig;
      setTrackerValue(getDefaultValue(config.type));
    }
  }, [tracker, trackerValue, logs, isLoadingLogs]);

  // Early returns for loading and error states
  if (isLoadingTracker) {
    return (
      <SafeAreaView className="flex-1">
        <Stack.Screen options={{ title: "Loading..." }} />
        <View className="flex-1 items-center justify-center">
          <Text>Loading tracker...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!tracker) {
    return (
      <SafeAreaView className="flex-1">
        <Stack.Screen options={{ title: "Not Found" }} />
        <View className="flex-1 items-center justify-center">
          <Text>
            Tracker not found. Please try again or select a different tracker.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Get tracker type from config
  const getTrackerType = (): TrackerType => {
    if (!tracker.customConfig) return "measure";
    return tracker.customConfig.type as TrackerType;
  };

  const trackerType = getTrackerType();

  // Ensure tracker.customConfig is not null for the display/input components
  const safeCustomConfig = tracker.customConfig ?? {};

  // Create a wrapper for setTrackerValue with the right type signature
  const handleTrackerValueChange = (value: unknown) => {
    setTrackerValue(value as TrackerValueType);
  };

  return (
    <SafeAreaView className="flex-1" edges={{ bottom: "maximum" }}>
      <Stack.Screen options={{ title: tracker.name }} />
      <ScrollView className="flex-1 p-6">
        <View className="mb-6 flex flex-col gap-6">
          {tracker.description && !showNewLog && (
            <Text className="text-sand-11 text-xs">{tracker.description}</Text>
          )}
          {!showNewLog && (
            <Card>
              <View className="flex flex-col items-center justify-center gap-0">
                {logs && logs.length > 0 ? (
                  <View className="flex flex-col items-center justify-center gap-2">
                    {/* Use our display component for the latest log - large size */}
                    {logs[0]?.createdAt &&
                      (trackerType === "shortText" ||
                        trackerType === "longText") && (
                        <View className="mt-2 flex flex-col items-center gap-0">
                          <Text className="text-sand-11 text-xs">
                            {timeAgoText({ date: new Date(logs[0].createdAt) })}
                          </Text>
                          <Text className="text-sand-11 text-xs">
                            {new Date(logs[0].createdAt).toLocaleString()}
                          </Text>
                        </View>
                      )}

                    {getValueFromLog({
                      log: logs[0],
                      type: trackerType,
                      config: safeCustomConfig,
                      size: "lg",
                      tracker: tracker as Tracker,
                    })}

                    {logs[0]?.createdAt &&
                      trackerType !== "shortText" &&
                      trackerType !== "longText" && (
                        <View className="mt-2 flex flex-col items-center gap-0">
                          <Text className="text-sand-11 text-xs">
                            {timeAgoText({ date: new Date(logs[0].createdAt) })}
                          </Text>
                          <Text className="text-sand-11 text-xs">
                            {new Date(logs[0].createdAt).toLocaleString()}
                          </Text>
                        </View>
                      )}
                  </View>
                ) : (
                  <Text className="text-sand-11">No logs yet</Text>
                )}
              </View>
            </Card>
          )}

          {/* Data Entry Section */}
          {showNewLog || (logs && logs.length === 0) ? (
            <View className="border-sand-6 bg-sand-1 flex flex-col gap-4 rounded-lg border px-6 py-4">
              {/* Tracker Input - Use our new input components */}
              <View className="flex flex-col gap-2">
                {getInputForTrackerType(
                  trackerType,
                  trackerValue,
                  handleTrackerValueChange,
                  safeCustomConfig,
                )}
              </View>

              {/* Notes Section */}
              {showNewLogNoteField ? (
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
                        label="Add a note"
                        placeholder="Add any additional notes here..."
                        editable={!isFormSubmitting}
                      />
                    );
                  }}
                />
              ) : (
                <Button
                  variant={"link"}
                  size={"sm"}
                  onPress={() => setShowNewLogNoteField(true)}
                >
                  <View className="-ml-8 flex w-full flex-row items-start gap-2">
                    <Plus size={16} color={iconColor()} />
                    <Text className="text-sand-11 text-left text-xs">
                      Add a note
                    </Text>
                  </View>
                </Button>
              )}

              {/* Image Upload */}
              <ImagePickerUploader
                ref={imagePickerRef}
                onImagesChanged={setImageState}
                onUploadStateChange={setIsUploading}
                onSubmit={handleSubmit}
                submitting={isFormSubmitting}
              />
              {!(logs && logs.length === 0) && (
                <Button
                  variant={"outline"}
                  onPress={() => setShowNewLog(false)}
                  className="w-full"
                >
                  <Text>Cancel</Text>
                </Button>
              )}
            </View>
          ) : (
            <Button onPress={() => setShowNewLog(true)}>
              <Text>New Log</Text>
            </Button>
          )}

          <Text type="title" className="-mb-4">
            History
          </Text>

          {isLoadingLogs ? (
            <Text className="text-sand-11">Loading history...</Text>
          ) : logs && logs.length > 0 ? (
            <View className="flex flex-col gap-4">
              {logs.map((log) => (
                <Card key={log.id} className="border-sand-6 border">
                  <View
                    className={cn(
                      trackerType === "shortText" || trackerType === "longText"
                        ? "border-sand-6 flex-col-reverse border-b pb-2"
                        : "flex-row",
                      "flex items-center justify-between gap-2",
                    )}
                  >
                    <View>
                      {/* Use our display component for each log - small size */}
                      {getValueFromLog({
                        log,
                        type: trackerType,
                        config: safeCustomConfig,
                        size: "sm",
                        tracker: tracker as Tracker,
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

                  {/* {log.textValue &&
                    log.textValue !== log.numericValue?.toString() && (
                      <Text className="mt-2 text-sm">{log.textValue}</Text>
                    )} */}
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
