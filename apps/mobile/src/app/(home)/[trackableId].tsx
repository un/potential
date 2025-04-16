import React, { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams } from "expo-router";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner-native";

import type { ConstsTypes } from "@1up/consts";

import type { ImagePickerUploaderRef } from "~/components/ui/image-picker-uploader";
import { Card } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { ImagePickerUploader } from "~/components/ui/image-picker-uploader";
import { Input } from "~/components/ui/input";
import { LongText } from "~/components/ui/long-text";
import { NumberInput } from "~/components/ui/number-input";
import { Rating } from "~/components/ui/rating";
import { Slider } from "~/components/ui/slider";
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

  // Helper to safely get measurement unit if available
  const getMeasurementUnit = () => {
    if (
      trackable?.customConfig &&
      "measureUnitDisplay" in trackable.customConfig
    ) {
      return trackable.customConfig.measureUnitDisplay;
    }
    return "";
  };

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
        trackableParentType: trackable.type!,
        trackableSubType: trackable.subType!,
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

  // Component to render trackable input based on its config type
  const renderTrackableInput = () => {
    const config = trackable.customConfig;
    if (!config) return null;

    switch (config.type) {
      case "measure": {
        const numberValue =
          typeof trackableValue === "number"
            ? trackableValue
            : logs && logs.length > 0 && logs[0]?.numericValue !== null
              ? logs[0].numericValue
              : 0;
        return (
          <NumberInput
            value={numberValue}
            onValueChange={(val) => setTrackableValue(val)}
            unit={
              "measureUnitDisplay" in config ? config.measureUnitDisplay : ""
            }
            increments={[0.1, 1, 5]}
            decrements={[0.1, 1, 5]}
            minValue={"measureMin" in config ? config.measureMin : undefined}
            maxValue={"measureMax" in config ? config.measureMax : undefined}
          />
        );
      }
      case "checkbox": {
        const boolValue =
          typeof trackableValue === "boolean" ? trackableValue : false;
        return (
          <View className="flex-row items-center">
            <Checkbox
              checked={boolValue}
              onCheckedChange={(val) => setTrackableValue(val || false)}
            />
            <Text className="ml-2">
              {"checkboxName" in config ? config.checkboxName : "Completed"}
            </Text>
          </View>
        );
      }
      case "range": {
        if (!("rangeMin" in config && "rangeMax" in config)) {
          return <Text>Invalid range configuration</Text>;
        }

        const numberValue =
          typeof trackableValue === "number"
            ? trackableValue
            : config.rangeMin || 0;
        return (
          <Slider
            value={numberValue}
            onValueChange={(val) => setTrackableValue(val)}
            rangeMin={config.rangeMin}
            rangeMax={config.rangeMax}
            rangeUnit={"rangeUnit" in config ? config.rangeUnit : undefined}
            rangeMinLabel={
              "rangeMinLabel" in config ? config.rangeMinLabel : undefined
            }
            rangeMaxLabel={
              "rangeMaxLabel" in config ? config.rangeMaxLabel : undefined
            }
          />
        );
      }
      case "rating": {
        if (!("ratingMax" in config)) {
          return <Text>Invalid rating configuration</Text>;
        }

        const numberValue =
          typeof trackableValue === "number" ? trackableValue : 0;
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
          <Rating
            value={numberValue}
            onValueChange={(val) => setTrackableValue(val)}
            ratingMax={safeRatingMax}
            ratingUnit={"ratingUnit" in config ? config.ratingUnit : undefined}
            ratingIcon={"ratingIcon" in config ? config.ratingIcon : undefined}
            ratingEmoji={
              "ratingEmoji" in config ? config.ratingEmoji : undefined
            }
          />
        );
      }
      case "shortText": {
        const stringValue =
          typeof trackableValue === "string" ? trackableValue : "";
        return (
          <Input
            value={stringValue}
            onChangeText={(text) => setTrackableValue(text)}
            placeholder="Enter text..."
          />
        );
      }
      case "longText": {
        const stringValue =
          typeof trackableValue === "string" ? trackableValue : "";
        return (
          <LongText
            value={stringValue}
            onChangeText={(text) => setTrackableValue(text)}
            placeholder="Enter long text..."
          />
        );
      }
      default:
        return (
          <View className="p-2">
            <Text>Unsupported trackable type</Text>
          </View>
        );
    }
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
              <View className="flex flex-row items-center justify-center gap-0">
                <Text type={"title"} className="text-5xl">
                  {logs?.[0]?.numericValue}
                </Text>
                <Text className="text-sand-11 text-xs">
                  {getMeasurementUnit()}
                </Text>
              </View>
              {logs?.[0]?.createdAt && (
                <Text className="text-sand-11 text-xs">
                  {new Date(logs[0]?.createdAt).toLocaleString()}
                </Text>
              )}
            </View>
          </Card>

          {/* Data Entry Section */}
          <View className="border-sand-6 bg-sand-2 flex flex-col gap-4 rounded-lg border p-4">
            <Text type="title" className="text-lg">
              New Log
            </Text>

            {/* Trackable Input */}
            <View className="flex flex-col gap-2">
              {renderTrackableInput()}
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
                              message:
                                field.state.meta.errors[0] ??
                                "Something is wrong, but we dont know what",
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
                  <View className="flex flex-row justify-between">
                    <View>
                      {/* Display log value based on type */}
                      {log.checked !== null && (
                        <Text className="font-medium">
                          Status: {log.checked ? "Completed" : "Not Completed"}
                        </Text>
                      )}

                      {log.numericValue !== null && (
                        <View className="flex flex-row items-end gap-0">
                          <Text className="font-medium">
                            {log.numericValue}
                          </Text>
                          <Text className="text-sand-11 text-xs">
                            {getMeasurementUnit()}
                          </Text>
                        </View>
                      )}

                      {log.textValue && (
                        <Text className="font-medium">{log.textValue}</Text>
                      )}
                    </View>

                    <Text className="text-sand-11">
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
